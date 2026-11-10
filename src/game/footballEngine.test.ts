import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { FootballEngine } from './footballEngine';
import { soundEngine } from '../audio/soundEngine';
import { PlayCall } from '../types/game';

soundEngine.toggleMute();

const runPlay: PlayCall = {
  id: 'TEST_RUN',
  name: 'Test Run',
  type: 'RUN',
  description: 'Deterministic test play',
  iconName: 'Play',
};

function makeEngine() {
  return new FootballEngine(
    'HOME_COUNTY',
    'AWAY_COUNTY',
    [],
    [],
    { primary: '#123456', secondary: '#ffffff' },
    { primary: '#654321', secondary: '#ffffff' }
  );
}

test('opening kickoff is explicitly simulated before the first offensive drive', () => {
  const engine = makeEngine();
  assert.equal(engine.drive.phase, 'KICKOFF');
  engine.startOpeningDrive();
  assert.equal(engine.drive.phase, 'PLAY_SELECT');
  assert.match(engine.drive.playResultText, /Opening kickoff simulated/);
  assert.equal(engine.drive.possession, 'HOME');
  assert.equal(engine.drive.lineOfScrimmage, 75);
  assert.equal(engine.drive.firstDownLine, 85);
});

test('second quarter ends at halftime and the second half changes possession', () => {
  const engine = makeEngine();
  engine.drive.quarter = 2;
  engine.drive.phase = 'ACTIVE_PLAY';
  engine.drive.gameClock = 0.01;
  engine.drive.possession = 'HOME';

  engine.update(0.02);

  assert.equal(engine.drive.phase, 'HALFTIME');
  assert.equal(engine.drive.quarter, 3);
  assert.equal(engine.drive.gameClock, 120);
  assert.equal(engine.drive.possession, 'HOME');

  engine.startSecondHalf();
  assert.equal(engine.drive.phase, 'PLAY_SELECT');
  assert.equal(engine.drive.possession, 'AWAY');
  assert.equal(engine.drive.lineOfScrimmage, 25);
  assert.equal(engine.drive.down, 1);
});

test('a tied regulation game enters overtime with a score slot and alternating possession', () => {
  const engine = makeEngine();
  engine.drive.quarter = 4;
  engine.drive.phase = 'ACTIVE_PLAY';
  engine.drive.gameClock = 0.01;
  engine.drive.homeScore = 14;
  engine.drive.awayScore = 14;
  engine.drive.possession = 'HOME';

  engine.update(0.02);

  assert.equal(engine.drive.phase, 'PLAY_SELECT');
  assert.equal(engine.drive.quarter, 5);
  assert.equal(engine.drive.gameClock, 90);
  assert.equal(engine.drive.possession, 'AWAY');
  assert.equal(engine.drive.quarterScores.home.length, 5);
  assert.equal(engine.drive.quarterScores.away.length, 5);
});

test('a scoreless overtime period extends cleanly and alternates possession', () => {
  const engine = makeEngine();
  engine.drive.quarter = 5;
  engine.drive.phase = 'ACTIVE_PLAY';
  engine.drive.gameClock = 0.01;
  engine.drive.homeScore = 14;
  engine.drive.awayScore = 14;
  engine.drive.possession = 'AWAY';

  engine.update(0.02);

  assert.equal(engine.drive.quarter, 6);
  assert.equal(engine.drive.phase, 'PLAY_SELECT');
  assert.equal(engine.drive.possession, 'HOME');
  assert.equal(engine.drive.quarterScores.home.length, 6);
  assert.equal(engine.drive.quarterScores.away.length, 6);
});

test('a sudden-death overtime touchdown ends the match and records the period score', () => {
  const engine = makeEngine();
  engine.drive.quarter = 5;
  engine.drive.phase = 'PLAY_SELECT';
  engine.selectPlay(runPlay);
  engine.snapBall();
  assert.ok(engine.ball.carrier);
  engine.ball.carrier.x = 99.9;

  engine.update(0.1);

  assert.equal(engine.drive.phase, 'GAME_OVER');
  assert.equal(engine.drive.homeScore, 6);
  assert.equal(engine.drive.quarterScores.home[4], 6);
});

test('away offense lines up behind the ball and advances toward the left end zone', () => {
  const engine = makeEngine();
  engine.drive.possession = 'AWAY';
  engine.drive.lineOfScrimmage = 25;
  engine.drive.firstDownLine = 15;
  engine.drive.phase = 'PLAY_SELECT';
  engine.selectPlay(runPlay);
  engine.snapBall();

  const carrier = engine.ball.carrier;
  assert.ok(carrier);
  const startX = carrier.x;
  engine.update(0.1);

  assert.ok(carrier.x < startX, `expected away carrier to move left from ${startX}, got ${carrier.x}`);
});

test('away touchdown is scored at the left end zone', () => {
  const engine = makeEngine();
  engine.drive.possession = 'AWAY';
  engine.drive.lineOfScrimmage = 5;
  engine.drive.firstDownLine = 0;
  engine.drive.phase = 'PLAY_SELECT';
  engine.selectPlay(runPlay);
  engine.snapBall();
  assert.ok(engine.ball.carrier);
  engine.ball.carrier.x = 0.1;

  engine.update(0.1);

  assert.equal(engine.drive.phase, 'TOUCHDOWN');
  assert.equal(engine.drive.awayScore, 6);
  assert.equal(engine.drive.quarterScores.away[0], 6);
});

test('a carrier taken into its own end zone concedes a safety', () => {
  const engine = makeEngine();
  engine.drive.possession = 'HOME';
  engine.drive.lineOfScrimmage = 5;
  engine.drive.firstDownLine = 15;
  engine.drive.phase = 'PLAY_SELECT';
  engine.selectPlay(runPlay);
  engine.snapBall();
  assert.ok(engine.ball.carrier);
  engine.ball.carrier.x = 0.1;
  engine.ball.carrier.vx = -10;

  engine.update(0.1);

  assert.equal(engine.drive.awayScore, 2);
  assert.equal(engine.stats.away.safeties, 1);
  assert.equal(engine.drive.possession, 'AWAY');
  assert.equal(engine.drive.lineOfScrimmage, 25);
});

test('a turnover preserves the physical field position and reverses attacking direction', () => {
  const engine = makeEngine();
  engine.drive.possession = 'HOME';
  const internals = engine as unknown as { resolveTurnover: (spot: number) => void };

  internals.resolveTurnover(62);

  assert.equal(engine.drive.possession, 'AWAY');
  assert.equal(engine.drive.lineOfScrimmage, 62);
  assert.equal(engine.drive.firstDownLine, 52);
});

test('away first downs advance toward lower field coordinates', () => {
  const engine = makeEngine();
  engine.drive.possession = 'AWAY';
  engine.drive.lineOfScrimmage = 25;
  engine.drive.firstDownLine = 15;
  const internals = engine as unknown as { advanceDown: (yards: number) => void };

  internals.advanceDown(10);

  assert.equal(engine.drive.lineOfScrimmage, 15);
  assert.equal(engine.drive.down, 1);
  assert.equal(engine.drive.firstDownLine, 5);
  assert.equal(engine.drive.distance, 10);
});

test('field goals and punts are restricted to fourth down', () => {
  const engine = makeEngine();
  engine.drive.phase = 'PLAY_SELECT';
  engine.drive.down = 3;

  engine.attemptFieldGoal();
  engine.puntBall();

  assert.equal(engine.drive.phase, 'PLAY_SELECT');
});

test('a successful away field goal uses away-side distance and kicks off to home', () => {
  const engine = makeEngine();
  engine.drive.possession = 'AWAY';
  engine.drive.lineOfScrimmage = 40;
  engine.drive.down = 4;
  engine.drive.phase = 'PLAY_SELECT';

  engine.attemptFieldGoal();
  engine.drive.kickMeterValue = 50;
  engine.resolveKick();

  assert.equal(engine.drive.awayScore, 3);
  assert.equal(engine.drive.possession, 'HOME');
  assert.equal(engine.drive.lineOfScrimmage, 75);
});

test('a non-tied regulation result ends at the fourth-quarter horn', () => {
  const engine = makeEngine();
  engine.drive.quarter = 4;
  engine.drive.phase = 'ACTIVE_PLAY';
  engine.drive.gameClock = 0.01;
  engine.drive.homeScore = 10;
  engine.drive.awayScore = 7;

  engine.update(0.02);

  assert.equal(engine.drive.phase, 'GAME_OVER');
  assert.equal(engine.drive.gameClock, 0);
});
