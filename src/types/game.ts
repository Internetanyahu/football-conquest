/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Position = 'QB' | 'RB' | 'WR1' | 'WR2' | 'TE' | 'OL' | 'DL' | 'LB' | 'CB' | 'S' | 'K';

export type PlayerCondition = 'HEALTHY' | 'TIRED' | 'INJURED' | 'DECEASED';

export interface Athlete {
  id: string;
  name: string;
  position: Position;
  number: number;
  age: number;
  countyOriginId: string;
  countyOriginName: string;
  speed: number;        // 30 - 99
  passAcc: number;      // 30 - 99 (QB)
  passPow: number;      // 30 - 99 (QB)
  catching: number;     // 30 - 99 (WR/TE/RB)
  tackling: number;     // 30 - 99 (Defense)
  strength: number;     // 30 - 99 (OL/DL/RB)
  stamina: number;      // 30 - 99
  morale: number;       // 1 - 100
  condition: PlayerCondition;
  injuryWeeksLeft: number;
  injuryDescription?: string;
  isCaptain?: boolean;
  skinTone: string;     // Hex color for pixel sprite
  hairColor: string;    // Hex color for pixel sprite
  stats: {
    games: number;
    passingYards: number;
    passingTds: number;
    interceptionsThrown: number;
    completions: number;
    passAttempts: number;
    rushingYards: number;
    rushingTds: number;
    carries: number;
    receptions: number;
    receivingYards: number;
    receivingTds: number;
    tackles: number;
    sacks: number;
    interceptions: number;
    fieldGoalsMade: number;
    fieldGoalsAttempted: number;
  };
}

export interface County {
  id: string;
  name: string;
  stateId: string;
  stateName: string;
  region: string;
  population: number;
  wealthScore: number;     // 1 - 100
  footballTalent: number;  // 1 - 100
  dominantCulture: string;
  x: number;               // Map coordinate X (0 - 1000)
  y: number;               // Map coordinate Y (0 - 650)
  neighbors: string[];     // Adjacent county IDs
  assignedCoachId?: string;
  assignedPfcId?: string;
  homeColor: string;
  secondaryColor: string;
  stadiumName: string;
  capacity: number;
}

export interface StateJurisdiction {
  id: string;
  name: string;
  shortCode: string;
  region: string;
  color: string;
  textColor: string;
  governorName: string;
  governorTitle: string;
  governorBio: string;
  taxRatePercent: number;
  footballSubsidyWeekly: number;
  totalCountiesOwned: number;
  stateMotto: string;
}

export interface PFC {
  id: string;
  name: string;
  shortCode: string;
  isPlayerOwned: boolean;
  prestige: number;        // 1 - 100
  treasury: number;        // Dollars
  reputation: number;      // 1 - 100
  primaryColor: string;
  secondaryColor: string;
  facilities: {
    trainingLevel: number; // 1 - 5
    medicalLevel: number;  // 1 - 5 (faster injury recovery)
    scoutingLevel: number; // 1 - 5 (better talent generation)
  };
  coachIds: string[];
  headquartersCountyId: string;
  signedSponsorships?: string[];
}

export interface Coach {
  id: string;
  name: string;
  isPlayer: boolean;
  pfcId: string;
  currentCountyId: string;
  wins: number;
  losses: number;
  annexationsCount: number;
  careerSalaryEarned: number;
  currentSalaryWeekly: number;
  winBonus: number;
  reputation: number;
  offenseSpecialty: 'PRO_STYLE' | 'FLYING_WEDGE' | 'AIR_RAID' | 'GROUND_AND_POUND';
}

export interface PlayCall {
  id: string;
  name: string;
  type: 'RUN' | 'PASS' | 'KICK';
  description: string;
  isHistoricFlyingWedge?: boolean;
  iconName: string;
}

export interface MatchSettings {
  homeCountyId: string;
  awayCountyId: string;
  matchType: 'COUNTY_CHALLENGE' | 'STATE_BOWL' | 'SCRIMMAGE';
  quarterLengthSeconds: number; // e.g. 90 or 120 seconds for game pace
  weather: 'CLEAR' | 'MUDDY' | 'WINDY' | 'SNOW';
}

export interface DriveEvent {
  text: string;
  yardLine: number;
  quarter: number;
  gameClock: number;
  type: 'RUN' | 'PASS' | 'INCOMPLETE' | 'INTERCEPTION' | 'FUMBLE' | 'TOUCHDOWN' | 'FIELD_GOAL' | 'SAFETY' | 'FIRST_DOWN' | 'TURNOVER_DOWNS' | 'PUNT';
}

export interface GameState {
  version: number;
  mode: 'SOLO_CAMPAIGN' | 'ONLINE_LEAGUE';
  currentWeek: number;
  currentSeason: number;
  playerCoachId: string;
  playerPfcId: string;
  activeContestedCountyId: string;
  counties: Record<string, County>;
  states: Record<string, StateJurisdiction>;
  pfcs: Record<string, PFC>;
  coaches: Record<string, Coach>;
  rosters: Record<string, Athlete[]>; // key: countyId
  annexationHistory: {
    id: string;
    week: number;
    season: number;
    winnerCountyName: string;
    loserCountyName: string;
    winnerStateName: string;
    loserStateName: string;
    coachName: string;
    pfcName: string;
    score: string;
    date: string;
  }[];
  matchHistory: {
    id: string;
    week: number;
    season: number;
    winnerCountyName: string;
    loserCountyName: string;
    score: string;
    outcome: 'WIN' | 'LOSS';
    coachName: string;
    pfcName: string;
    date: string;
  }[];
  memorialHallOfFame: {
    athlete: Athlete;
    tribute: string;
    dateHonored: string;
  }[];
}
