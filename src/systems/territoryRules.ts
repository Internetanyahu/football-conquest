import { County } from '../types/game';

/**
 * Repair the persisted county graph without inventing geographic borders:
 * discard dangling/self references and make every declared border reciprocal.
 * Returns true when the input needed repair.
 */
export function normalizeCountyAdjacency(counties: Record<string, County>): boolean {
  let changed = false;

  for (const county of Object.values(counties)) {
    const valid = [...new Set(county.neighbors)].filter((id) => id !== county.id && !!counties[id]);
    if (valid.length !== county.neighbors.length || valid.some((id, index) => id !== county.neighbors[index])) {
      county.neighbors = valid;
      changed = true;
    }
  }

  for (const county of Object.values(counties)) {
    for (const neighborId of county.neighbors) {
      const neighbor = counties[neighborId];
      if (neighbor && !neighbor.neighbors.includes(county.id)) {
        neighbor.neighbors.push(county.id);
        changed = true;
      }
    }
  }

  return changed;
}

export function areCountiesAdjacent(
  firstCountyId: string,
  secondCountyId: string,
  counties: Record<string, County>
): boolean {
  if (firstCountyId === secondCountyId) return false;
  const first = counties[firstCountyId];
  const second = counties[secondCountyId];
  return !!first && !!second &&
    (first.neighbors.includes(secondCountyId) || second.neighbors.includes(firstCountyId));
}
