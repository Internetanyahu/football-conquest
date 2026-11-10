# Implementation Status

This file tracks implementation against `GDD.md`. A visible screen is not proof that its underlying system is complete. Mark a feature complete only after its acceptance criteria have been exercised.

## Current prototype status

| GDD phase | Status | Implemented | Still required |
|---|---|---|---|
| 1. Football engine | Partial | Native side-view match, running, passing, catching, defensive pursuit, scoring, kicking, clock, halftime transition, sudden-death overtime periods, pause/resume, match statistics, automated period-transition tests | Explicit opening kickoff sequence, robust defensive formations and AI, penalties, full control and balance playtesting |
| 2. Territorial engine | Partial | 186 schematic territories, state ownership, normalized reciprocal adjacency graph, dangling/self-link cleanup for migrated saves, selectable map cells, pan/zoom, search/filter, challenge launch, adjacency and same-state guards, annexation, coach relocation, match and annexation history, adjacency unit tests | Accurate North American county geography and boundary-derived adjacency, municipality records, multi-challenge locks |
| 3. Population and athletes | Partial | Procedural rosters, local prospects, attributes, recruitment, training | Attribute-driven match balance, aging, injuries, retirement, rare permanent death, lifecycle history |
| 4. Coach and PFC career | Partial | Coach record, PFC employment, win compensation, facilities, treasury, one-time sponsorship offers, coach/PFC career display | NPC PFC operations, real contracts, expenses, hiring market, career opportunities, PFC creation and ownership progression |
| 5. Solo campaign | Partial | Local campaign, county competition, local save migration, export/import, historical records | Full NPC competition, offline world simulation, tutorial, campaign progression and completion |
| 6. Politics and state football | Not implemented | NPC governor and state profiles are displayed | Mayoral appointments, political succession, enforceable state laws, player appointments, manager-focused state teams and bowls |
| 7. Online multiplayer | Not implemented | Interface clearly identifies offline status | Authentication, persistent shared database, authoritative match validation, challenge locks, rankings, seasons and anti-cheat |

## Recent implementation

- Replaced the marker-only territorial presentation with ownership-colored Voronoi territory cells generated from the current campaign territory centers.
- Added map pan, zoom, reset, label decluttering, and search/filter focus.
- Made the original football engine the default county match. Retro Bowl remains an optional external handoff; it cannot provide automatic score verification.
- Added pause/resume to native county matches.
- Rejected tied, malformed, or score/winner-inconsistent match results before territorial resolution.
- Enforced adjacency, different-state ownership, and player-coach assignment in local annexation/defeat functions.
- Added persistent win/loss match history with score and statistics, including migration for existing saves.
- Made PFC sponsorship offers one-time rather than repeatable free cash actions.
- Replaced fake online competitors and fake political actions with accurate implementation-status messaging.
- Removed the in-game GitHub token push panel and insecure placeholder server endpoints.
- Changed the GDD reader to load the complete authoritative `GDD.md`, not a partial hardcoded summary.
- Updated the README to distinguish working features from unfinished systems.

## Latest engineering pass

- Added an opening-kickoff screen with a simulated kickoff and first possession at the 25-yard line.
- Added a distinct halftime state after the second quarter, with an explicit second-half continuation action and simulated second-half kickoff/possession switch.
- Corrected quarter transitions so the clock cannot repeatedly advance periods after reaching zero.
- Added safe per-period scoring allocation, including additional overtime periods.
- Overtime now alternates possession between scoreless 90-second periods and ends immediately on a sudden-death touchdown or field goal.
- Added automated tests for halftime, regulation completion, overtime entry/extension, overtime touchdown resolution, and county adjacency normalization.
- Added shared county-adjacency validation and repair for saved campaigns. This removes dangling/self/duplicate links and repairs one-way links; it does not prove that the underlying schematic neighbor data matches real geography.
- Added the automated test suite to the Pages workflow before the production build.

## Remaining qualification

Both opening and second-half kickoffs are currently simulated transitions; there is no playable kick trajectory or return team yet. Defensive formations, penalties, balance, and real-world geography remain unfinished. Do not mark either Phase 1 or Phase 2 complete until their GDD acceptance criteria are exercised.

## Deployment

The frontend is deployed through GitHub Actions to GitHub Pages. A successful Vite build confirms compilation and deployment only; it does not replace gameplay testing or prove that every GDD acceptance criterion is complete.

Deployment verification is recorded in the GitHub Actions history for `main`. Update this status only after the corresponding build-and-deploy run completes.
