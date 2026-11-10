/**
 * Deterministic alternate-history subdivision of the original 62 campaign
 * territories. Boundaries follow imagined watersheds, ridgelines and passes.
 * Every subdivision remains a separate, playable county.
 */
import { County } from '../types/game';

const REGIONAL_SPLITS: Record<string, [string, string]> = {
  Northeast: ['Granite Ridge', 'Merrimack Watershed'],
  'Mid-Atlantic': ['Hudson Highlands', 'Delaware Riverlands'],
  'New France': ['Laurentian Heights', 'St. Lawrence Lowlands'],
  Keystone: ['Allegheny Escarpment', 'Susquehanna Forks'],
  Appalachia: ['Allegheny Ridge', 'Monongahela Valley'],
  Chesapeake: ['Blue Ridge Marches', 'Potomac Tidewater'],
  'Southeast Mountains': ['Cumberland Highlands', 'Tennessee Riverlands'],
  'Gulf & Caribbean': ['Coastal Plain', 'Gulf Estuaries'],
  'Southwest / Gulf': ['Llano Uplands', 'Rio Grande Basin'],
  'Pacific Southwest': ['Sierra Foothills', 'Pacific Riverlands'],
  Pacific: ['Cascade Range', 'Pacific Riverlands'],
  Northwest: ['Cascade Highlands', 'Columbia Riverlands'],
  'Plains & Prairies': ['Prairie Divide', 'Great River Basin'],
};

const hash = (value: string): number => {
  let result = 0;
  for (let i = 0; i < value.length; i++) result = (result * 31 + value.charCodeAt(i)) >>> 0;
  return result;
};

const unique = (values: string[]) => [...new Set(values)];

export function expandCountyTerritories(
  source: Record<string, County>
): Record<string, County> {
  const counties: Record<string, County> = Object.fromEntries(
    Object.entries(source).map(([id, county]) => [id, { ...county, neighbors: [...county.neighbors] }])
  );
  const original = Object.values(counties);

  for (const parent of original) {
    const [ridgeName, riverName] = REGIONAL_SPLITS[parent.region] || ['Highland Marches', 'River Basin'];
    const angle = (hash(parent.id) % 360) * Math.PI / 180;
    const suffix = parent.name
      .replace(/\s*\([^)]*\)/g, '')
      .replace(/\s*&\s*/g, ' and ')
      .replace(/\s+/g, ' ')
      .trim();
    const childIds = [`C_${parent.id.slice(2)}_RIDGE`, `C_${parent.id.slice(2)}_RIVER`];
    const features = [
      { id: childIds[0], name: `${ridgeName} of ${suffix}`, angle },
      { id: childIds[1], name: `${riverName} of ${suffix}`, angle: angle + Math.PI },
    ];

    // Keep the parent and its two new districts' combined population unchanged.
    const originalPopulation = parent.population;
    parent.population = Math.round(originalPopulation * 0.45);
    features.forEach((feature, index) => {
      const distance = 28;
      const x = Math.max(18, Math.min(982, parent.x + Math.cos(feature.angle) * distance));
      const y = Math.max(18, Math.min(642, parent.y + Math.sin(feature.angle) * distance));
      const county: County = {
        ...parent,
        id: feature.id,
        name: feature.name,
        population: Math.round(originalPopulation * (index === 0 ? 0.275 : 0.275)),
        wealthScore: Math.max(25, Math.min(98, parent.wealthScore + (index === 0 ? 3 : -3))),
        footballTalent: Math.max(25, Math.min(99, parent.footballTalent + (index === 0 ? 2 : -2))),
        x,
        y,
        neighbors: unique([parent.id, ...childIds.filter((id) => id !== feature.id), ...parent.neighbors]),
        stadiumName: index === 0 ? `${suffix} Ridge Ground` : `${suffix} River Oval`,
        capacity: Math.max(6500, Math.round(parent.capacity * 0.55)),
      };
      counties[county.id] = county;
      parent.neighbors.push(county.id);
    });
  }

  // Make the new links reciprocal so every border can be traversed both ways.
  for (const county of Object.values(counties)) {
    county.neighbors = unique(county.neighbors.filter((id) => id !== county.id && !!counties[id]));
  }
  for (const county of Object.values(counties)) {
    for (const neighborId of county.neighbors) {
      const neighbor = counties[neighborId];
      if (neighbor && !neighbor.neighbors.includes(county.id)) neighbor.neighbors.push(county.id);
    }
  }
  return counties;
}
