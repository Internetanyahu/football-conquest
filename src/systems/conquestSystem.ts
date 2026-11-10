/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { County, GameState } from '../types/game';
import { INITIAL_COUNTIES, INITIAL_PFCS, INITIAL_PLAYER_COACH, INITIAL_STATES } from '../data/worldMapData';
import { generateAllCountyRosters } from '../data/rosterGenerator';

const STORAGE_KEY = 'FOOTBALL_CONQUEST_SAVE_V1';

export function createInitialGameState(): GameState {
  const counties = { ...INITIAL_COUNTIES };
  const states = { ...INITIAL_STATES };
  const pfcs = { ...INITIAL_PFCS };
  const coach = { ...INITIAL_PLAYER_COACH };
  const rosters = generateAllCountyRosters(counties);

  return {
    version: 1,
    mode: 'SOLO_CAMPAIGN',
    currentWeek: 1,
    currentSeason: 1898, // Historic turn-of-the-century alternate football era
    playerCoachId: coach.id,
    playerPfcId: coach.pfcId,
    activeContestedCountyId: coach.currentCountyId,
    counties,
    states,
    pfcs,
    coaches: { [coach.id]: coach },
    rosters,
    annexationHistory: [
      {
        id: 'INIT_LOG_1',
        week: 0,
        season: 1897,
        winnerCountyName: 'Suffolk & Boston Harbor',
        loserCountyName: 'Merrimack Valley',
        winnerStateName: 'New England Commonwealth',
        loserStateName: 'New England Commonwealth',
        coachName: 'Coach Vance Sterling',
        pfcName: 'Continental Football Contractors',
        score: '21 - 14',
        date: 'Autumn 1897',
      },
    ],
    memorialHallOfFame: [],
  };
}

export function saveGameState(state: GameState): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (err) {
    console.error('Failed to save game state to localStorage', err);
    return false;
  }
}

export function loadGameState(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.version === 1) {
        return parsed as GameState;
      }
    }
  } catch (err) {
    console.warn('Could not load saved game state, starting fresh', err);
  }
  const fresh = createInitialGameState();
  saveGameState(fresh);
  return fresh;
}

// Rule: Coaches challenge eligible neighboring counties.
// - Must be adjacent in the map graph
// - Cannot challenge counties already in your own state
export function getEligibleNeighborTargets(countyId: string, state: GameState): County[] {
  const current = state.counties[countyId];
  if (!current) return [];

  const targets: County[] = [];
  for (const nId of current.neighbors) {
    const neighbor = state.counties[nId];
    if (neighbor && neighbor.stateId !== current.stateId) {
      targets.push(neighbor);
    }
  }
  return targets;
}

// Rule: Finds the nearest county belonging to player's state that borders an enemy state
export function findNearestContestedBorderCounty(
  fromCountyId: string,
  stateId: string,
  gameState: GameState
): County {
  const queue: string[] = [fromCountyId];
  const visited = new Set<string>([fromCountyId]);

  while (queue.length > 0) {
    const currId = queue.shift()!;
    const curr = gameState.counties[currId];
    if (!curr) continue;

    // Check if this county is owned by our state and has any enemy neighbor
    if (curr.stateId === stateId) {
      const hasEnemyNeighbor = curr.neighbors.some((nId) => {
        const neighbor = gameState.counties[nId];
        return neighbor && neighbor.stateId !== stateId;
      });
      if (hasEnemyNeighbor) {
        return curr;
      }
    }

    for (const nId of curr.neighbors) {
      if (!visited.has(nId)) {
        visited.add(nId);
        queue.push(nId);
      }
    }
  }

  // Fallback to current if none found
  return gameState.counties[fromCountyId] || Object.values(gameState.counties)[0];
}

// Rule: Annexation and coach relocation
export function executeAnnexation(
  winnerCountyId: string,
  loserCountyId: string,
  gameState: GameState,
  scoreText: string
): GameState {
  const newState = JSON.parse(JSON.stringify(gameState)) as GameState;
  const winnerCounty = newState.counties[winnerCountyId];
  const loserCounty = newState.counties[loserCountyId];
  const playerCoach = newState.coaches[newState.playerCoachId];
  const playerPfc = newState.pfcs[newState.playerPfcId];

  if (!winnerCounty || !loserCounty) return gameState;

  const previousLoserStateId = loserCounty.stateId;
  const previousLoserStateName = loserCounty.stateName;

  // 1. Transfer County ownership to winner's state
  loserCounty.stateId = winnerCounty.stateId;
  loserCounty.stateName = winnerCounty.stateName;

  // 2. Update state county counts
  if (newState.states[winnerCounty.stateId]) {
    newState.states[winnerCounty.stateId].totalCountiesOwned++;
  }
  if (newState.states[previousLoserStateId]) {
    newState.states[previousLoserStateId].totalCountiesOwned = Math.max(
      0,
      newState.states[previousLoserStateId].totalCountiesOwned - 1
    );
  }

  // 3. Update Coach and PFC rewards
  if (playerCoach) {
    playerCoach.wins++;
    playerCoach.annexationsCount++;
    playerCoach.careerSalaryEarned += playerCoach.winBonus;
    playerCoach.reputation = Math.min(100, playerCoach.reputation + 4);
  }

  if (playerPfc) {
    playerPfc.treasury += playerCoach?.winBonus ? playerCoach.winBonus * 2 : 10000;
    playerPfc.reputation = Math.min(100, playerPfc.reputation + 3);
  }

  // 4. Log historic annexation record
  const logEntry = {
    id: `ANNEX_${Date.now()}`,
    week: newState.currentWeek,
    season: newState.currentSeason,
    winnerCountyName: winnerCounty.name,
    loserCountyName: loserCounty.name,
    winnerStateName: winnerCounty.stateName,
    loserStateName: previousLoserStateName,
    coachName: playerCoach?.name || 'Head Coach',
    pfcName: playerPfc?.name || 'Private Football Syndicate',
    score: scoreText,
    date: `Week ${newState.currentWeek}, ${newState.currentSeason}`,
  };
  newState.annexationHistory.unshift(logEntry);

  // 5. Relocate Coach to the nearest active contested border
  const nextBorder = findNearestContestedBorderCounty(
    loserCounty.id,
    winnerCounty.stateId,
    newState
  );
  if (playerCoach) {
    playerCoach.currentCountyId = nextBorder.id;
  }
  newState.activeContestedCountyId = nextBorder.id;
  newState.currentWeek++;

  saveGameState(newState);
  return newState;
}

// Rule: When losing, territory does not change, but coach relocates to nearest contested border
export function executeDefeat(
  homeCountyId: string,
  awayCountyId: string,
  gameState: GameState,
  scoreText: string
): GameState {
  const newState = JSON.parse(JSON.stringify(gameState)) as GameState;
  const playerCoach = newState.coaches[newState.playerCoachId];

  if (playerCoach) {
    playerCoach.losses++;
    playerCoach.reputation = Math.max(20, playerCoach.reputation - 2);
  }

  const nextBorder = findNearestContestedBorderCounty(
    homeCountyId,
    newState.counties[homeCountyId]?.stateId || 'ST_NE',
    newState
  );

  if (playerCoach) {
    playerCoach.currentCountyId = nextBorder.id;
  }
  newState.activeContestedCountyId = nextBorder.id;
  newState.currentWeek++;

  saveGameState(newState);
  return newState;
}
