# Football Conquest

An alternate-history American football and territorial conquest simulation game. In Football Conquest: **Winning football games wins territory.**

## Overview
Players assume the role of football field commanders employed by Private Football Contractors (PFCs). Operating across a balkanized, alternate-history North American continent, coaches train local county athletes, wage gridiron matches along contested borders, annex neighboring counties for their sovereign state, and rise into high political leadership.

## Key Features & Master Systems

### 1. Retro Side-View Football Engine
- **Original Pixel Art Presentation**: Crisp side-view canvas rendering of the 100-yard field plus endzones, dynamic yard markers, hash marks, line of scrimmage (electric blue), and first down line (bright gold).
- **Alternate-History Rules**:
  - No helmets worn; shoulder-first tackling emphasis.
  - The historic **Flying Wedge** formation is legal and implemented as a heavy mass-momentum power run play.
- **Playbook**: Power Run (Flying Wedge), Off-Tackle Sweep, Quick Slant, Deep Post, Screen Pass, Field Goal, and Punt.
- **Interactive Mechanics**: Direct quarterback dropback, drag-to-aim parabolic pass trajectory with real-time target reticle, receiver route-running, instant runner control upon catch or handoff, juking/diving bursts, defensive pursuit, broken tackles, loose-ball scramble on fumbles, interceptions, and interactive field goal accuracy meter.
- **Full Rules & Timing**: 4 downs to gain 10 yards, 4 quarters with 2-minute quarter clocks, overtime sudden death, and complete drive event commentary.

### 2. North American Territorial Theatre
- **Interactive SVG Map**: 48+ interconnected counties forming 12 sovereign/confederated nations:
  - *New England Commonwealth*, *Hudson Federation*, *Dominion of Laurentia (New France)*, *Pennsylvanian League*, *Virginia Dominion*, *Cherokee & Creek Highlands*, *Floridas & Antilles (including Cuba, Haiti, and Santo Domingo)*, *Great Lakes Union*, *Great Plains Confederacy*, *Lone Star Republic*, *California & Baja*, and *Pacific Columbia*.
- **Conquest Rules**:
  - Challenges are strictly limited to adjacent border counties.
  - Counties within the same state cannot challenge each other.
  - Victorious county matches annex the opposing county into the winning coach's state.
  - Losing does not surrender territory; coaches are relocated to the nearest active contested border.

### 3. Population & Athlete Generation
- Athletes are procedurally generated from local county population pools with cultural naming conventions (Anglo, French-Canadien, Indigenous, Spanish/Californio, Afro-Caribbean, Dutch).
- Attributes: Speed, Strength, Tackling, Catching, Stamina, and Morale.
- Training Camp: Drills to boost speed, strength, and skills using PFC funds.
- Local County Recruitment Pool: Scout and sign free agent prospects residing in the county.

### 4. Private Football Contractors (PFCs)
- Contract management: Salaries, win bonuses, reputation, and treasury.
- Corporate facilities: Upgrades for Training Grounds, Medical Infirmary (faster injury recovery), and Scouting Bureau.
- Municipal sponsorships: Endorsements providing capital injections.
- Continental PFC leaderboard.

### 5. Sovereign Politics & State Bowls
- Sovereign governors with unique historical profiles, tax rates, and weekly football subsidies.
- Gubernatorial Decrees: Petition for Border Defense Athletic Grants and statutory protection.
- State Championship Bowl: Prestigious non-annexation bowl games against rival nations for $50,000 purses.
- Campaign for Governorship: Coaches with $\ge 6$ wins can run for state governor.

### 6. Online World & Standings
- Seasonal standings and continental sovereignty rankings.
- Online rival challenges and ELO matchmaking.
- Server-authoritative match validation (`/api/matches/validate`).
- Seasonal reset architecture (territory resets, career stats and accounts preserved).

### 7. Synthesized Web Audio Engine
- 100% client-synthesized retro audio via Web Audio API: Dual-frequency referee whistle, tackle impact thuds, passing throw whooshes, catch snaps, kicking booms, and celebratory organ fanfares. Zero external audio downloads required.

### 8. Persistence & Data Export
- Automatic saving via localStorage.
- JSON save export and import support for cross-device play.

---

## Technical Stack
- **Frontend**: React 19, TypeScript, HTML5 Canvas, Tailwind CSS v4, Lucide React.
- **Backend**: Express on Node.js / `tsx` with `/api/*` REST routes.
- **Build**: Vite 8.
