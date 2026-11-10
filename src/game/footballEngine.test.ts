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
  assert.equal(engine.drive.lineOfScrimmage, 25);
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
