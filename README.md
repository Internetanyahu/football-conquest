# Football Conquest

A browser-first territorial strategy prototype for the Football Conquest game concept.

## Current demo

The first milestone is a playable map interaction loop:

1. Load current U.S. county geography.
2. Select a home county.
3. Highlight counties sharing a border with it.
4. Select an adjacent target county.
5. Simulate a win or loss.
6. On a win, transfer the entire target county to the home state's control.

Ownership changes currently exist only in browser memory and reset when the page reloads.

## Run it

Open the GitHub Pages site after deployment, or serve `index.html` as a static page. The app requires an internet connection to load its geographic dataset and JavaScript libraries.

No local installation, Linux environment, build step, or backend is required.

## Technology

- HTML, CSS, and vanilla JavaScript
- D3.js for geographic projection
- TopoJSON Client for county geometry and adjacency
- us-atlas county TopoJSON dataset
- GitHub Pages for hosting

The renderer uses a low-resolution canvas for a pixelated appearance while retaining original county geometry for adjacency calculations.

## Project decisions

- Browser-first development for Chromebook compatibility.
- Keep the first prototype dependency-light and easy to deploy.
- Keep geography, political ownership, and simulation rules separate as the project grows.
- Coaches are not participants in matches and cannot die.
- Football matches will eventually determine territorial challenge outcomes; Win/Lose controls are temporary development tools.
- A county remains a distinct geographic unit after annexation. Municipalities and local identity are not merged into the winning county.

## Current limitations

- Ownership is session-only.
- County names are not labeled on the map; use the county search field.
- No persistent save, accounts, state-management layer, PFC system, or football simulation yet.
- Population and municipality data have not been integrated.
- The current geography is the United States, not the full North American game world.

## Next milestones

1. Improve pixel rendering and map navigation.
2. Add county details, population, and state ownership information.
3. Persist territory changes locally.
4. Add territorial challenge history and rules.
5. Build the football match that resolves challenges.
6. Expand the world simulation beyond the United States.

## Data attribution

The prototype loads the `us-atlas` TopoJSON dataset through jsDelivr and uses D3.js and TopoJSON Client from jsDelivr. Review the respective project licenses and data provenance before commercial distribution.
