# Football Conquest

A browser-based alternate-history American football and territorial strategy game. **Winning county football matches changes the map.**

## Current playable prototype

### County football
- Original side-view pixel-art football engine; it is the default match mode.
- Four short quarters, downs and distance, touchdowns, conversions, field goals, punts, turnovers, overtime, and a final result.
- Running, passing, catching, ball-carrier control, juking, defensive pursuit, and weather effects.
- Pause and resume.
- Retro Bowl is an optional external handoff. It is not embedded as an owned game engine, and its score cannot be read or verified automatically. Scores entered from the external game are player-reported.

### Territorial campaign
- 186 playable schematic territories across 12 sovereign states.
- Map cells are generated from territory centers; they are not surveyed county polygons or official geographic boundaries.
- Ownership colors, adjacency links, county selection, search, state filtering, pan, and zoom.
- Challenges require adjacent counties in different states.
- A valid win annexes the entire target county; a loss does not transfer territory.
- Coaches remain employed by their PFC and relocate to a contested border after a result.
- Match results and annexations are saved in local campaign history.

### Athletes and PFCs
- Procedurally generated county rosters and local recruitment prospects.
- Athlete attributes, roster inspection, training, and PFC facility upgrades.
- PFC finances, win bonuses, and one-time sponsorship offers.

### State administration
- State and governor profiles, county totals, population, tax rates, and football subsidies.
- Political appointments, enforceable state laws, and manager-focused state football are not implemented yet. The interface identifies these as future systems rather than offering fake actions.

### Persistence
- Automatic localStorage campaign saves.
- JSON save export and import.
- Existing saves are migrated to include new territory and match-history fields.

## Not yet implemented

- Persistent online multiplayer, accounts, shared database, authoritative server-side match validation, and ELO matchmaking.
- Accurate real-world county geometry and municipality-level administration.
- Full NPC world simulation, coach employment market, PFC contracts, athlete aging/injuries/death, and political appointment mechanics.
- Manager-focused state football.

GitHub Pages hosts the static frontend. It does not provide the persistent backend required for online multiplayer.

## Development

- Frontend: React, TypeScript, HTML5 Canvas, Tailwind CSS, Lucide React.
- Build: Vite.
- Local development: `npm run dev`.
- Production build: `npm run build`.
- TypeScript check: `npm run lint`.

The authoritative design specification is [GDD.md](./GDD.md). Its confirmed rules take precedence over prototype behavior.
