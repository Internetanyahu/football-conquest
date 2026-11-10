/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Athlete, PlayCall, Position } from '../types/game';
import { soundEngine } from '../audio/soundEngine';

export interface FieldPlayer {
  id: string;
  name: string;
  position: Position;
  number: number;
  isOffense: boolean;
  x: number;          // Field yard line (0 - 100, where 0 and 100 are endzone goal lines)
  y: number;          // Field lateral position (0 - 53.3 yards standard width)
  vx: number;
  vy: number;
  speed: number;
  strength: number;
  tackling: number;
  catching: number;
  state: 'PRE_SNAP' | 'RUNNING_ROUTE' | 'BLOCKING' | 'RUSHING' | 'PURSUIT' | 'CARRYING' | 'TACKLED' | 'CELEBRATING';
  route?: { targetX: number; targetY: number; stage: number };
  engagedWith?: FieldPlayer | null;
  skinTone: string;
  hairColor: string;
  primaryColor: string;
  secondaryColor: string;
}

export interface FootballBall {
  x: number;
  y: number;
  z: number;          // Height above ground (yards)
  vx: number;
  vy: number;
  vz: number;
  isThrown: boolean;
  isLoose: boolean;   // Fumble
  carrier: FieldPlayer | null;
  targetX?: number;
  targetY?: number;
}

export interface DriveState {
  quarter: number;
  gameClock: number;        // Seconds remaining in quarter
  playClock: number;        // 25s play clock
  down: number;             // 1, 2, 3, 4
  distance: number;         // Yards needed for 1st down
  lineOfScrimmage: number;   // Yard line (e.g. 25)
  firstDownLine: number;     // e.g. 35
  offenseCountyId: string;
  homeScore: number;
  awayScore: number;
  quarterScores: { home: number[]; away: number[] };
  phase: 'PLAY_SELECT' | 'PRE_SNAP' | 'ACTIVE_PLAY' | 'TACKLE_RESOLVED' | 'TOUCHDOWN' | 'FIELD_GOAL_AIM' | 'HALFTIME' | 'GAME_OVER';
  possession: 'HOME' | 'AWAY';
  playResultText: string;
  currentPlay: PlayCall | null;
  kickMeterValue: number;
  kickMeterDirection: number;
}

export class FootballEngine {
  public ball: FootballBall;
  public players: FieldPlayer[] = [];
  public drive: DriveState;
  public homeRoster: Athlete[];
  public awayRoster: Athlete[];
  public homeColors: { primary: string; secondary: string };
  public awayColors: { primary: string; secondary: string };
  public homeCountyId: string;
  public awayCountyId: string;
  public weather: string;

  // Touch / mouse aiming state
  public isAimingPass: boolean = false;
  public aimTargetX: number = 0;
  public aimTargetY: number = 0;

  // Box score tracking
  public stats = {
    home: { passYards: 0, rushYards: 0, completions: 0, passAttempts: 0, tds: 0, turnovers: 0, sacks: 0 },
    away: { passYards: 0, rushYards: 0, completions: 0, passAttempts: 0, tds: 0, turnovers: 0, sacks: 0 },
  };

  private playElapsed: number = 0;
  private jukeCooldown: number = 0;

  constructor(
    homeCountyId: string,
    awayCountyId: string,
    homeRoster: Athlete[],
    awayRoster: Athlete[],
    homeColors: { primary: string; secondary: string },
    awayColors: { primary: string; secondary: string },
    weather: string = 'CLEAR'
  ) {
    this.homeCountyId = homeCountyId;
    this.awayCountyId = awayCountyId;
    this.homeRoster = homeRoster;
    this.awayRoster = awayRoster;
    this.homeColors = homeColors;
    this.awayColors = awayColors;
    this.weather = weather;

    this.drive = {
      quarter: 1,
      gameClock: 120, // 2-minute quarters for fast, punchy arcade pace
      playClock: 25,
      down: 1,
      distance: 10,
      lineOfScrimmage: 25,
      firstDownLine: 35,
      offenseCountyId: homeCountyId,
      homeScore: 0,
      awayScore: 0,
      quarterScores: { home: [0, 0, 0, 0], away: [0, 0, 0, 0] },
      phase: 'PLAY_SELECT',
      possession: 'HOME',
      playResultText: '1st & 10 at the 25. Select offensive play.',
      currentPlay: null,
      kickMeterValue: 50,
      kickMeterDirection: 1,
    };

    this.ball = {
      x: 25,
      y: 26.6,
      z: 0,
      vx: 0,
      vy: 0,
      vz: 0,
      isThrown: false,
      isLoose: false,
      carrier: null,
    };

    this.setupFormation();
  }

  public selectPlay(play: PlayCall) {
    this.drive.currentPlay = play;
    this.drive.phase = 'PRE_SNAP';
    this.setupFormation();
    this.drive.playResultText = `${play.name} - Tap or Press SPACE / Snap to Hike!`;
    soundEngine.playClick();
  }

  public snapBall() {
    if (this.drive.phase !== 'PRE_SNAP') return;
    this.drive.phase = 'ACTIVE_PLAY';
    this.playElapsed = 0;

    const qb = this.players.find((p) => p.isOffense && p.position === 'QB');
    if (qb) {
      this.ball.carrier = qb;
      qb.state = 'CARRYING';
      this.ball.x = qb.x;
      this.ball.y = qb.y;
      this.ball.z = 0;
    }

    soundEngine.playWhistle();

    // If Flying Wedge or Power Run, hand off to RB immediately or wedge blockers forward
    if (this.drive.currentPlay?.type === 'RUN') {
      const rb = this.players.find((p) => p.isOffense && p.position === 'RB');
      if (rb && qb) {
        this.ball.carrier = rb;
        rb.state = 'CARRYING';
        qb.state = 'BLOCKING';
      }
    }
  }

  public setupFormation() {
    this.players = [];
    const los = this.drive.lineOfScrimmage;
    const isHomeOffense = this.drive.possession === 'HOME';
    const offRoster = isHomeOffense ? this.homeRoster : this.awayRoster;
    const defRoster = isHomeOffense ? this.awayRoster : this.homeRoster;
    const offColors = isHomeOffense ? this.homeColors : this.awayColors;
    const defColors = isHomeOffense ? this.awayColors : this.homeColors;

    // Offensive Line & Backfield (playing Left to Right, advancing toward X = 100)
    const isWedge = this.drive.currentPlay?.isHistoricFlyingWedge;

    // Center / Lineman
    this.addPlayer(offRoster, 'OL', los - 0.5, 26.6, true, offColors, 'PRE_SNAP');
    // Guard / Tackle
    this.addPlayer(offRoster, 'TE', los - 0.5, 22.0, true, offColors, 'PRE_SNAP');
    
    // Quarterback
    this.addPlayer(offRoster, 'QB', los - 4.0, 26.6, true, offColors, 'PRE_SNAP');
    
    // Running Back
    const rbX = isWedge ? los - 2.5 : los - 7.0;
    const rbY = 26.6;
    this.addPlayer(offRoster, 'RB', rbX, rbY, true, offColors, 'PRE_SNAP');

    // Wide Receivers
    if (isWedge) {
      // In the historic Flying Wedge, receivers pack tight into the wedge to block ahead of the runner!
      this.addPlayer(offRoster, 'WR1', los - 2.0, 24.5, true, offColors, 'PRE_SNAP');
      this.addPlayer(offRoster, 'WR2', los - 2.0, 28.7, true, offColors, 'PRE_SNAP');
    } else {
      this.addPlayer(offRoster, 'WR1', los - 1.0, 10.0, true, offColors, 'PRE_SNAP');
      this.addPlayer(offRoster, 'WR2', los - 1.0, 43.3, true, offColors, 'PRE_SNAP');
    }

    // Defensive Team (positioned across line of scrimmage, defending X = 100)
    // Defensive Lineman
    this.addPlayer(defRoster, 'DL', los + 1.2, 26.6, false, defColors, 'PRE_SNAP');
    // Linebacker
    this.addPlayer(defRoster, 'LB', los + 4.5, 26.6, false, defColors, 'PRE_SNAP');
    // Cornerbacks
    this.addPlayer(defRoster, 'CB', los + 5.0, 11.0, false, defColors, 'PRE_SNAP');
    this.addPlayer(defRoster, 'CB', los + 5.0, 42.0, false, defColors, 'PRE_SNAP');
    // Free Safety
    this.addPlayer(defRoster, 'S', los + 14.0, 26.6, false, defColors, 'PRE_SNAP');

    // Reset ball position
    this.ball.x = los;
    this.ball.y = 26.6;
    this.ball.z = 0;
    this.ball.vx = 0;
    this.ball.vy = 0;
    this.ball.vz = 0;
    this.ball.isThrown = false;
    this.ball.isLoose = false;
    this.ball.carrier = null;
  }

  private addPlayer(
    roster: Athlete[],
    pos: Position,
    x: number,
    y: number,
    isOffense: boolean,
    colors: { primary: string; secondary: string },
    state: FieldPlayer['state']
  ) {
    const ath = roster.find((a) => a.position === pos) || roster[0];
    this.players.push({
      id: ath?.id || `${pos}_${Math.random()}`,
      name: ath?.name || `${pos}`,
      position: pos,
      number: ath?.number || 99,
      isOffense,
      x,
      y,
      vx: 0,
      vy: 0,
      speed: ath?.speed || 70,
      strength: ath?.strength || 70,
      tackling: ath?.tackling || 70,
      catching: ath?.catching || 70,
      state,
      skinTone: ath?.skinTone || '#d49870',
      hairColor: ath?.hairColor || '#1c1917',
      primaryColor: colors.primary,
      secondaryColor: colors.secondary,
    });
  }

  // User input: Pass throw aimed at field coordinates (targetX, targetY)
  public throwPass(targetX: number, targetY: number) {
    const qb = this.players.find((p) => p.isOffense && p.position === 'QB');
    if (!qb || this.ball.carrier !== qb || this.ball.isThrown) return;

    // Disengage QB
    this.ball.carrier = null;
    this.ball.isThrown = true;
    this.ball.x = qb.x;
    this.ball.y = qb.y;
    this.ball.z = 1.8; // Release height
    this.ball.targetX = targetX;
    this.ball.targetY = targetY;

    // Physics vector towards target
    const dx = targetX - qb.x;
    const dy = targetY - qb.y;
    const dist = Math.hypot(dx, dy);
    const flightTime = Math.max(0.5, dist / 22); // ~22 yards/sec

    this.ball.vx = dx / flightTime;
    this.ball.vy = dy / flightTime;
    this.ball.vz = 0.5 * 9.8 * flightTime * 0.4; // parabolic arc

    qb.state = 'BLOCKING';

    const statTeam = this.drive.possession === 'HOME' ? this.stats.home : this.stats.away;
    statTeam.passAttempts++;

    soundEngine.playThrow();
  }

  // User input: Runner movement (WASD or Touch Virtual Pad)
  public steerCarrier(dirX: number, dirY: number) {
    if (!this.ball.carrier) return;
    const speedYds = (this.ball.carrier.speed / 100) * 8.5; // Max speed yards per sec
    this.ball.carrier.vx = dirX * speedYds;
    this.ball.carrier.vy = dirY * speedYds;
  }

  // User input: Juke / Dive forward
  public performJuke() {
    if (!this.ball.carrier || this.jukeCooldown > 0) return;
    this.jukeCooldown = 1.0; // 1 second cooldown
    this.ball.carrier.vx += 5.5; // Quick burst forward
    soundEngine.playCatch();
  }

  // Main simulation tick (dt: seconds, e.g. 1/60)
  public update(dt: number) {
    if (this.drive.phase !== 'ACTIVE_PLAY') {
      if (this.drive.phase === 'FIELD_GOAL_AIM') {
        this.updateKickMeter(dt);
      }
      return;
    }

    this.playElapsed += dt;
    if (this.jukeCooldown > 0) this.jukeCooldown -= dt;

    // Update game clock
    this.drive.gameClock = Math.max(0, this.drive.gameClock - dt * 0.8);
    if (this.drive.gameClock === 0) {
      this.advanceQuarter();
      return;
    }

    // 1. Update ball in flight
    if (this.ball.isThrown) {
      this.ball.x += this.ball.vx * dt;
      this.ball.y += this.ball.vy * dt;
      this.ball.z += this.ball.vz * dt;
      this.ball.vz -= 9.8 * dt * 0.8; // gravity

      // Check for catch by offensive receivers or defensive interception
      if (this.ball.z <= 2.2) {
        for (const p of this.players) {
          const d = Math.hypot(p.x - this.ball.x, p.y - this.ball.y);
          if (d < 1.8) {
            if (p.isOffense && (p.position === 'WR1' || p.position === 'WR2' || p.position === 'TE' || p.position === 'RB')) {
              // Pass Complete!
              this.completePass(p);
              return;
            } else if (!p.isOffense && (p.position === 'CB' || p.position === 'S' || p.position === 'LB')) {
              // Interception!
              this.interceptPass(p);
              return;
            }
          }
        }
      }

      // Ball hits the turf incomplete
      if (this.ball.z <= 0) {
        this.resolveIncomplete();
        return;
      }
    }

    // 2. Update players
    for (const p of this.players) {
      this.updatePlayerAI(p, dt);

      // Boundary check
      p.x = Math.max(-10, Math.min(110, p.x));
      p.y = Math.max(1, Math.min(52.3, p.y));

      // Ball carrier coordinates sync with player
      if (this.ball.carrier === p) {
        this.ball.x = p.x;
        this.ball.y = p.y;
        this.ball.z = 1.0;

        // Check for Touchdown! (Reaching endzone at X >= 100)
        if (p.x >= 100) {
          this.scoreTouchdown();
          return;
        }

        // Check out of bounds
        if (p.y <= 1.2 || p.y >= 52.0) {
          this.resolveTackle(p, 'Stepped Out of Bounds');
          return;
        }
      }
    }

    // 3. Check for Tackles on Ball Carrier
    if (this.ball.carrier) {
      const carrier = this.ball.carrier;
      for (const def of this.players) {
        if (!def.isOffense) {
          const dist = Math.hypot(def.x - carrier.x, def.y - carrier.y);
          if (dist < 1.4) {
            // Tackle attempt check
            const tacklePower = def.tackling + Math.random() * 20;
            const breakTacklePower = carrier.strength + Math.random() * 15;

            if (tacklePower > breakTacklePower) {
              // Rare fumble chance (~3% on massive collision)
              if (Math.random() < 0.035 && !this.ball.isLoose) {
                this.causeFumble(carrier);
                return;
              }
              this.resolveTackle(carrier, `Tackled by #${def.number} ${def.name}`);
              return;
            } else {
              // Broken tackle! Defender staggered
              def.vx = -1.5;
              soundEngine.playTackle();
            }
          }
        }
      }
    }

    // 4. Loose ball scramble (Fumble physics)
    if (this.ball.isLoose) {
      this.ball.x += this.ball.vx * dt;
      this.ball.y += this.ball.vy * dt;
      this.ball.vx *= 0.95;
      this.ball.vy *= 0.95;

      for (const p of this.players) {
        if (Math.hypot(p.x - this.ball.x, p.y - this.ball.y) < 1.5) {
          this.recoverFumble(p);
          return;
        }
      }
    }
  }

  private updatePlayerAI(p: FieldPlayer, dt: number) {
    const isWedge = this.drive.currentPlay?.isHistoricFlyingWedge;

    if (p.isOffense) {
      if (p === this.ball.carrier) {
        // AI or default forward push if no user steering
        if (p.vx === 0 && p.vy === 0) {
          p.x += (p.speed / 100) * 6.5 * dt;
        } else {
          p.x += p.vx * dt;
          p.y += p.vy * dt;
        }
      } else if (p.position === 'WR1') {
        // Deep streak or post route
        p.x += (p.speed / 100) * 7.5 * dt;
        if (p.x > this.drive.lineOfScrimmage + 10) {
          p.y += 1.8 * dt; // cut inward
        }
      } else if (p.position === 'WR2') {
        // Quick slant or corner route
        p.x += (p.speed / 100) * 7.0 * dt;
        if (p.x > this.drive.lineOfScrimmage + 6) {
          p.y -= 2.2 * dt;
        }
      } else if (p.position === 'TE' || p.position === 'OL') {
        // Blockers pushing forward and engaging rushers
        if (isWedge) {
          // Flying Wedge blockers advance as a tight wall ahead of runner!
          p.x += 4.5 * dt;
          const targetY = 26.6 + (p.position === 'TE' ? -1.5 : 1.5);
          p.y += (targetY - p.y) * 2 * dt;
        } else {
          p.x += 1.0 * dt;
        }
      } else if (p.position === 'QB' && this.ball.carrier !== p) {
        // Dropback or handoff follow-through
        p.x -= 0.5 * dt;
      }
    } else {
      // DEFENSE BEHAVIOR
      const target = this.ball.carrier || { x: this.ball.x, y: this.ball.y };
      const dx = target.x - p.x;
      const dy = target.y - p.y;
      const dist = Math.hypot(dx, dy);

      if (p.position === 'DL') {
        // Rusher charges quarterback / backfield
        const rushSpeed = (p.speed / 100) * 6.0;
        p.x += (dx / Math.max(1, dist)) * rushSpeed * dt;
        p.y += (dy / Math.max(1, dist)) * rushSpeed * dt;
      } else if (p.position === 'LB') {
        // Linebacker reads carrier
        const lbSpeed = (p.speed / 100) * 6.8;
        p.x += (dx / Math.max(1, dist)) * lbSpeed * dt;
        p.y += (dy / Math.max(1, dist)) * lbSpeed * dt;
      } else if (p.position === 'CB') {
        // Cornerbacks shadow receivers or pursue carrier if ball is past LOS
        if (target.x > this.drive.lineOfScrimmage + 2) {
          const cbSpeed = (p.speed / 100) * 7.2;
          p.x += (dx / Math.max(1, dist)) * cbSpeed * dt;
          p.y += (dy / Math.max(1, dist)) * cbSpeed * dt;
        } else {
          p.x += 2.0 * dt; // backpedal
        }
      } else if (p.position === 'S') {
        // Deep safety pursuit
        const sSpeed = (p.speed / 100) * 7.5;
        p.x += (dx / Math.max(1, dist)) * sSpeed * dt;
        p.y += (dy / Math.max(1, dist)) * sSpeed * dt;
      }
    }
  }

  private completePass(receiver: FieldPlayer) {
    this.ball.isThrown = false;
    this.ball.carrier = receiver;
    receiver.state = 'CARRYING';
    soundEngine.playCatch();

    const yardsGained = Math.round(receiver.x - this.drive.lineOfScrimmage);
    const statTeam = this.drive.possession === 'HOME' ? this.stats.home : this.stats.away;
    statTeam.completions++;
    statTeam.passYards += Math.max(0, yardsGained);

    this.drive.playResultText = `Pass Caught by #${receiver.number} ${receiver.name}! Keep running!`;
  }

  private interceptPass(defender: FieldPlayer) {
    this.ball.isThrown = false;
    this.ball.carrier = defender;
    defender.state = 'CARRYING';
    soundEngine.playTurnover();

    const statTeam = this.drive.possession === 'HOME' ? this.stats.home : this.stats.away;
    statTeam.turnovers++;

    this.drive.playResultText = `INTERCEPTED by #${defender.number} ${defender.name}! Turnover!`;
    this.resolveTurnover(defender.x);
  }

  private resolveIncomplete() {
    this.ball.isThrown = false;
    this.ball.carrier = null;
    soundEngine.playWhistle();

    this.drive.playResultText = 'Incomplete pass.';
    this.advanceDown(0);
  }

  private causeFumble(carrier: FieldPlayer) {
    this.ball.carrier = null;
    this.ball.isLoose = true;
    this.ball.vx = (Math.random() - 0.5) * 8;
    this.ball.vy = (Math.random() - 0.5) * 8;
    carrier.state = 'TACKLED';
    soundEngine.playTurnover();
    this.drive.playResultText = 'FUMBLE ON THE PLAY! Loose ball!';
  }

  private recoverFumble(player: FieldPlayer) {
    this.ball.isLoose = false;
    this.ball.carrier = player;
    soundEngine.playCatch();

    if (player.isOffense) {
      this.drive.playResultText = `Fumble recovered by offense #${player.number}!`;
      this.resolveTackle(player, 'Recovered');
    } else {
      this.drive.playResultText = `FUMBLE RECOVERED by defense #${player.number}! Turnover!`;
      const statTeam = this.drive.possession === 'HOME' ? this.stats.home : this.stats.away;
      statTeam.turnovers++;
      this.resolveTurnover(player.x);
    }
  }

  private resolveTackle(carrier: FieldPlayer, reason: string) {
    soundEngine.playTackle();
    soundEngine.playWhistle();

    const endYard = Math.round(carrier.x);
    const gained = endYard - this.drive.lineOfScrimmage;

    const statTeam = this.drive.possession === 'HOME' ? this.stats.home : this.stats.away;
    if (this.drive.currentPlay?.type === 'RUN') {
      statTeam.rushYards += Math.max(0, gained);
    }

    this.drive.playResultText = `${reason} for a gain of ${gained} yards.`;
    this.advanceDown(gained);
  }

  private advanceDown(gained: number) {
    this.drive.phase = 'PLAY_SELECT';
    const newLOS = Math.max(1, Math.min(99, this.drive.lineOfScrimmage + gained));
    this.drive.lineOfScrimmage = newLOS;

    if (newLOS >= this.drive.firstDownLine) {
      // First Down!
      soundEngine.playFirstDown();
      this.drive.down = 1;
      this.drive.distance = 10;
      this.drive.firstDownLine = Math.min(100, newLOS + 10);
      this.drive.playResultText = `FIRST DOWN! Ball on the ${newLOS} yard line.`;
    } else {
      this.drive.down++;
      this.drive.distance -= gained;
      if (this.drive.down > 4) {
        // Turnover on Downs
        soundEngine.playTurnover();
        this.drive.playResultText = `Turnover on Downs at the ${newLOS}!`;
        this.resolveTurnover(newLOS);
        return;
      }
      this.drive.playResultText = `${this.drive.down} and ${Math.max(1, this.drive.distance)} at the ${newLOS}.`;
    }

    this.setupFormation();
  }

  private addPeriodPoints(team: 'HOME' | 'AWAY', points: number) {
    const periodIndex = Math.max(0, this.drive.quarter - 1);
    while (this.drive.quarterScores.home.length <= periodIndex) this.drive.quarterScores.home.push(0);
    while (this.drive.quarterScores.away.length <= periodIndex) this.drive.quarterScores.away.push(0);
    if (team === 'HOME') {
      this.drive.homeScore += points;
      this.drive.quarterScores.home[periodIndex] += points;
    } else {
      this.drive.awayScore += points;
      this.drive.quarterScores.away[periodIndex] += points;
    }
  }

  private finishGame() {
    this.drive.phase = 'GAME_OVER';
    this.drive.gameClock = 0;
    soundEngine.playTouchdown();
    this.drive.playResultText = `FINAL WHISTLE! ${this.drive.homeScore > this.drive.awayScore ? 'HOME WINS' : 'AWAY WINS'}!`;
  }

  private scoreTouchdown() {
    soundEngine.playTouchdown();
    this.drive.phase = 'TOUCHDOWN';
    this.addPeriodPoints(this.drive.possession, 6);
    if (this.drive.possession === 'HOME') this.stats.home.tds++;
    else this.stats.away.tds++;
    this.drive.playResultText = `TOUCHDOWN ${this.drive.possession}! 6 Points!`;

    // Sudden-death overtime ends on the touchdown; no extra point is required.
    if (this.drive.quarter >= 5) this.finishGame();
  }

  public kickExtraPoint() {
    if (this.drive.phase !== 'TOUCHDOWN') return;
    const success = Math.random() < 0.94;
    soundEngine.playKick();

    if (success) {
      this.addPeriodPoints(this.drive.possession, 1);
      this.drive.playResultText = 'Extra point kick is GOOD! 7 Points total.';
    } else {
      this.drive.playResultText = 'Extra point kick is NO GOOD wide right!';
    }

    this.switchPossession(25);
  }

  public attemptFieldGoal() {
    this.drive.phase = 'FIELD_GOAL_AIM';
    this.drive.kickMeterValue = 50;
    this.drive.playResultText = 'Tap KICK to lock power and accuracy!';
  }

  public resolveKick() {
    if (this.drive.phase !== 'FIELD_GOAL_AIM') return;
    soundEngine.playKick();

    // Distance difficulty: 50 is center, line of scrimmage distance
    const dist = 100 - this.drive.lineOfScrimmage + 17; // +17 for endzone and snap
    const accuracy = Math.abs(this.drive.kickMeterValue - 50);

    const isGood = accuracy < 22 && dist < 58;

    if (isGood) {
      soundEngine.playTouchdown();
      this.addPeriodPoints(this.drive.possession, 3);
      this.drive.playResultText = `Field Goal from ${dist} yards is GOOD!`;
      if (this.drive.quarter >= 5) {
        this.finishGame();
        return;
      }
    } else {
      soundEngine.playTurnover();
      this.drive.playResultText = `Field Goal from ${dist} yards is NO GOOD!`;
    }

    this.switchPossession(25);
  }

  public puntBall() {
    soundEngine.playKick();
    const puntDist = Math.round(38 + Math.random() * 15);
    const newLOS = Math.max(20, 100 - (this.drive.lineOfScrimmage + puntDist));
    this.drive.playResultText = `Punt traveled ${puntDist} yards downfield!`;
    this.switchPossession(newLOS);
  }

  private resolveTurnover(turnoverYard: number) {
    const oppLOS = Math.max(10, Math.min(90, 100 - turnoverYard));
    this.switchPossession(oppLOS);
  }

  private switchPossession(newLOS: number) {
    this.drive.possession = this.drive.possession === 'HOME' ? 'AWAY' : 'HOME';
    this.drive.lineOfScrimmage = newLOS;
    this.drive.firstDownLine = Math.min(100, newLOS + 10);
    this.drive.down = 1;
    this.drive.distance = 10;
    this.drive.phase = 'PLAY_SELECT';
    this.setupFormation();
  }

  private updateKickMeter(dt: number) {
    this.drive.kickMeterValue += this.drive.kickMeterDirection * 120 * dt;
    if (this.drive.kickMeterValue >= 100) {
      this.drive.kickMeterValue = 100;
      this.drive.kickMeterDirection = -1;
    } else if (this.drive.kickMeterValue <= 0) {
      this.drive.kickMeterValue = 0;
      this.drive.kickMeterDirection = 1;
    }
  }

  public startSecondHalf() {
    if (this.drive.phase !== 'HALFTIME') return;
    this.drive.possession = this.drive.possession === 'HOME' ? 'AWAY' : 'HOME';
    this.drive.lineOfScrimmage = 25;
    this.drive.firstDownLine = 35;
    this.drive.down = 1;
    this.drive.distance = 10;
    this.drive.phase = 'PLAY_SELECT';
    this.drive.playResultText = `Second-half kickoff. ${this.drive.possession} takes possession at its 25.`;
    this.setupFormation();
  }

  private advanceQuarter() {
    soundEngine.playWhistle();

    if (this.drive.quarter === 2) {
      this.drive.quarter = 3;
      this.drive.gameClock = 120;
      this.drive.phase = 'HALFTIME';
      this.drive.playResultText = 'HALFTIME. Teams change ends; possession switches for the second half.';
      return;
    }

    if (this.drive.quarter === 1 || this.drive.quarter === 3) {
      this.drive.quarter++;
      this.drive.gameClock = 120;
      this.drive.phase = 'PLAY_SELECT';
      this.drive.playResultText = `End of Quarter ${this.drive.quarter - 1}. Beginning Quarter ${this.drive.quarter}.`;
      return;
    }

    if (this.drive.homeScore !== this.drive.awayScore) {
      this.finishGame();
      return;
    }

    // A tied regulation game enters sudden-death overtime. If an overtime
    // period expires scoreless, begin another period and alternate possession.
    this.drive.quarter = Math.max(5, this.drive.quarter + 1);
    this.drive.gameClock = 90;
    this.drive.quarterScores.home.push(0);
    this.drive.quarterScores.away.push(0);
    this.drive.possession = this.drive.possession === 'HOME' ? 'AWAY' : 'HOME';
    this.drive.lineOfScrimmage = 25;
    this.drive.firstDownLine = 35;
    this.drive.down = 1;
    this.drive.distance = 10;
    this.drive.phase = 'PLAY_SELECT';
    this.drive.playResultText = this.drive.quarter === 5
      ? 'OVERTIME! Sudden-death rules apply. Possession alternates from the fourth quarter.'
      : `OVERTIME ${this.drive.quarter - 4}. No score in the previous period; possession alternates.`;
    this.setupFormation();
  }
}
