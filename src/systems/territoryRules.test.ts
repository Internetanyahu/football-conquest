import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { County } from '../types/game';
import { areCountiesAdjacent, normalizeCountyAdjacency } from './territoryRules';
import { INITIAL_COUNTIES } from '../data/worldMapData';
import { expandCountyTerritories } from '../data/countyExpansion';

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

test('expanded campaign territory graph has 186 valid reciprocal nodes', () => {
  const counties = expandCountyTerritories(INITIAL_COUNTIES);
  assert.equal(Object.keys(counties).length, 186);

  for (const county of Object.values(counties)) {
    assert.ok(county.neighbors.length > 0, `${county.id} has no neighbors`);
    assert.equal(new Set(county.neighbors).size, county.neighbors.length, `${county.id} has duplicate neighbors`);
    assert.ok(!county.neighbors.includes(county.id), `${county.id} lists itself as a neighbor`);
    for (const neighborId of county.neighbors) {
      assert.ok(counties[neighborId], `${county.id} references missing ${neighborId}`);
      assert.ok(counties[neighborId].neighbors.includes(county.id), `${county.id} ↔ ${neighborId} is not reciprocal`);
    }
  }
});
