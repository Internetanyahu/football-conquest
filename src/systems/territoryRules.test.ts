import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { County } from '../types/game';
import { areCountiesAdjacent, normalizeCountyAdjacency } from './territoryRules';

function county(id: string, neighbors: string[] = []): County {
  return {
    id,
    name: id,
    stateId: 'STATE',
    stateName: 'State',
    region: 'Test',
    population: 1000,
    wealthScore: 50,
    footballTalent: 50,
    dominantCulture: 'Test',
    x: 0,
    y: 0,
    neighbors,
    homeColor: '#000000',
    secondaryColor: '#ffffff',
    stadiumName: 'Test Ground',
    capacity: 1000,
  };
}

test('county adjacency cleanup removes dangling, duplicate, and self references', () => {
  const counties = {
    A: county('A', ['A', 'B', 'B', 'MISSING']),
    B: county('B'),
  };

  assert.equal(normalizeCountyAdjacency(counties), true);
  assert.deepEqual(counties.A.neighbors, ['B']);
  assert.deepEqual(counties.B.neighbors, ['A']);
});

test('adjacency checks work in either direction and reject self or missing counties', () => {
  const counties = {
    A: county('A', ['B']),
    B: county('B'),
  };

  assert.equal(areCountiesAdjacent('A', 'B', counties), true);
  assert.equal(areCountiesAdjacent('B', 'A', counties), true);
  assert.equal(areCountiesAdjacent('A', 'A', counties), false);
  assert.equal(areCountiesAdjacent('A', 'MISSING', counties), false);
});
