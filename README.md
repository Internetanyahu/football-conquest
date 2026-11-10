# Football Conquest

A browser-first prototype for a county-based football and territorial strategy game.

## Play the prototypes

- **Match Day:** the current home page is a playable, single-player football match prototype.
- **County Territory Map:** [counties.html](counties.html) preserves the earlier U.S. county selection and annexation demo.

## Match Day prototype

- Choose an inside run or outside run.
- Start a play and control the ball carrier with WASD or arrow keys.
- Hold Shift to sprint; stamina drains while sprinting and recovers between sprints.
- Avoid defenders and run toward the opponent's end zone.
- Four downs are available to gain 10 yards; a touchdown is worth 7 points.
- Includes keyboard and on-screen touch controls.

The football prototype is an early playable foundation, not a complete football ruleset. Passing, kicking, defensive play-calling, full opponent drives, player rosters, injuries, and season/career systems are not implemented yet. The rival's response to a turnover is currently represented by a quick simulated score.

## County territory prototype

The county map remains available at [counties.html](counties.html). It loads U.S. county geography, lets you choose a home county, highlights eligible adjacent counties, and simulates annexation wins or losses. Ownership and the last 30 results are saved in that browser's local storage.

## Run it

Open the GitHub Pages site after deployment. Both pages are static HTML and require an internet connection for the county map's public geographic data and JavaScript libraries. No local installation, Linux environment, build step, or backend is required.

## Technology

- HTML, CSS, and vanilla JavaScript
- Canvas rendering for the match field
- D3.js and TopoJSON Client for the county map
- us-atlas county TopoJSON dataset
- GitHub Pages hosting

## Project decisions

- Browser-first development for Chromebook compatibility.
- Coaches are not participants in matches and cannot die.
- Football matches will eventually determine territorial challenge outcomes; the map's Win/Lose controls remain temporary development tools.
- A county remains a distinct geographic unit after annexation. Municipalities and local identity are not merged into the winning county.
- The football game uses original placeholder field art and UI rather than copying another game's assets.

## Current limitations

- No accounts, cloud saves, multiplayer, or cross-device synchronization.
- The football match is a basic running prototype; most football systems remain unimplemented.
- County-map saves are local to one browser/device.
- The county map currently covers the United States, not the full North American game world.
- Population, municipalities, state management, and PFC systems have not been integrated.

## Next milestones

1. Improve the football match: add passing, defensive formations, possession changes, and more complete game timing.
2. Create player rosters generated from county populations, with attributes and development.
3. Connect match results to territorial challenges on the county map.
4. Add state teams, governors, and PFC career systems.
5. Expand geography beyond the United States.

## Data attribution

The county map loads the us-atlas TopoJSON dataset through jsDelivr and uses D3.js and TopoJSON Client from jsDelivr. Review the respective project licenses and data provenance before commercial distribution.
