# FOOTBALL CONQUEST
# GAME DESIGN DOCUMENT

**Document Version:** 1.0  
**Document Status:** Comprehensive Initial Design Specification  
**Project Name:** Football Conquest  
**Genre:** American Football / Territorial Strategy / Sports Management / Career Simulation / Alternate-History Simulation  
**Primary Platform:** Web Browser  
**Additional Platforms:** Desktop and Mobile Browsers  
**Target Experience:** Single-player campaign and persistent online multiplayer  
**Visual Style:** Original pixel-art sports presentation  
**Primary Reference:** Retro Bowl's accessibility and straightforward football presentation, without copying its intellectual property  
**Development Status:** Prototype stage

---

# DOCUMENT CONTROL

## Design Authority

This document establishes the intended design of Football Conquest.

It should guide:
- Game development.
- Gameplay implementation.
- World simulation.
- Interface design.
- Technical architecture.
- Content creation.
- Balancing.
- Quality assurance.
- Future design revisions.

Not every mechanic in this document has been implemented.

### Decision classifications

Mechanics are classified as follows:

- **CONFIRMED:** Explicitly established project requirements.
- **PROPOSED:** A recommended implementation that should be used provisionally.
- **UNRESOLVED:** A decision requiring additional design work or playtesting.
- **FUTURE:** A feature intended for a later development stage.

When a proposed mechanic conflicts with a confirmed requirement, the confirmed requirement takes precedence.

Developers should not silently change confirmed world rules or fundamental gameplay concepts.

---

# TABLE OF CONTENTS

1. Project Overview
2. Game Vision and Design Pillars
3. Target Audience and Accessibility
4. Game Modes and Overall Structure
5. Core Gameplay Loop
6. World Setting and Alternate History
7. Geography and Administrative Structure
8. Territorial Ownership and Conquest
9. Football Gameplay
10. Match Rules and Simulation
11. Offensive Gameplay
12. Defensive Gameplay
13. Special Teams
14. Football AI
15. Athletes and Player Generation
16. Player Development and Lifecycle
17. Coaches and Career Progression
18. Private Football Contractors
19. Economics and Financial Systems
20. Political Institutions
21. Governors and State Administration
22. State Football
23. Solo Campaign
24. Online Multiplayer
25. NPC and World Simulation
26. Seasons and Historical Records
27. User Interface and User Experience
28. Visual Direction and Art Requirements
29. Audio Direction
30. Progression and Rewards
31. Game Balancing
32. Data Architecture
33. Technical Architecture
34. Multiplayer Security
35. Save Systems and Persistence
36. Accessibility and Performance
37. Monetization Philosophy
38. Tutorial and Onboarding
39. Testing and Quality Assurance
40. Development Roadmap
41. Feature Acceptance Criteria
42. Risks and Design Questions
43. Post-Prototype Revision Plan
44. Glossary

---

# 1. PROJECT OVERVIEW

## 1.1 High Concept

Football Conquest is an alternate-history American football game in which football determines territorial control.

Players begin as coaches employed by Private Football Contractors (PFCs). They lead football teams representing counties and compete against neighboring territories.

Winning a county match results in the annexation of the opposing county, provided the challenge satisfies the territorial rules.

As coaches become successful, they gain money, reputation, and professional opportunities. They may eventually manage state football teams, establish their own PFCs, and enter political leadership.

The world is designed to evolve continuously.

Counties change ownership. Football rosters develop. Coaches move between territories. PFCs compete for contracts. Governors make political decisions. Historical records preserve the consequences of past events.

Football is the central mechanism connecting all of these systems.

## 1.2 Genre Definition

Football Conquest combines several genres:

| Genre | Function |
|---|---|
| Sports simulation | The primary playable football experience |
| Territorial strategy | Winning matches changes county ownership |
| Career simulation | Coaches develop professional careers |
| Sports management | Players can recruit and manage athletes |
| Business simulation | Players can establish and operate PFCs |
| Political simulation | Governors administer states and appoint officials |
| Alternate-history simulation | The world follows a different historical development |

The football component must remain enjoyable independently of the deeper simulation.

The management and political systems should enhance the football experience rather than replace it.

## 1.3 Player Fantasy

The player should experience the progression from an ordinary county football coach to an influential figure in the continent.

The intended fantasy includes:

- Leading an underdog county team.
- Defeating neighboring territories.
- Building a reputation.
- Recruiting talented local athletes.
- Working for increasingly influential PFCs.
- Establishing an independent organization.
- Becoming a successful state-team coach.
- Gaining political influence.
- Potentially becoming a governor.

Not every player must pursue every opportunity.

A player should be able to remain a football-focused coach indefinitely.

## 1.4 Core Premise

**Football victories determine who controls the land.**

This is the central premise and must remain recognizable throughout development.

The game should not gradually become an ordinary football management game with territorial mechanics added as an afterthought.

Every major system should connect to at least one of the following:
- Football.
- Territorial competition.
- Professional advancement.
- Political influence.
- The persistent history of the world.

---

# 2. GAME VISION AND DESIGN PILLARS

## 2.1 Football First

Football is the primary interactive activity.

A player should be able to launch a match without navigating complicated management systems.

Matches should be:
- Easy to understand.
- Responsive.
- Visually readable.
- Tactically meaningful.
- Short enough to support repeated play.
- Deep enough to reward experience.

The game should use accessible controls and a relatively simple presentation.

## 2.2 Territory Matters

A football match should have consequences beyond its final score.

A county victory can change:
- State ownership.
- Political geography.
- Available coaching positions.
- PFC influence.
- Local football competition.
- Historical records.

Territorial ownership should be visible and understandable.

## 2.3 A Living World

The world should not exist exclusively when the player is looking at it.

NPCs should compete, develop careers, manage organizations, recruit athletes, and occupy political offices.

In online mode, the world should continue developing through player activity and scheduled simulation.

## 2.4 Player Freedom

The game should support different play styles.

**Casual player:**
- Plays matches.
- Challenges counties.
- Earns money.
- Advances as a coach.

**Competitive player:**
- Optimizes tactics.
- Builds stronger rosters.
- Competes for territory.
- Pursues rankings.

**Management player:**
- Recruits athletes.
- Manages a PFC.
- Controls finances.
- Builds organizations.

**Political player:**
- Pursues appointments.
- Coaches state teams.
- Becomes a governor.
- Influences state policy.

These experiences should share the same underlying world.

## 2.5 Persistent History

The world should remember important events.

Historical records should include:
- County ownership changes.
- Football match results.
- Athlete careers.
- Coach careers.
- PFC histories.
- State-team achievements.
- Political appointments.
- Previous online seasons.

A county should have a recognizable history even after changing ownership multiple times.

## 2.6 Accessibility Without Oversimplification

The game should introduce advanced systems gradually.

The football interface should not require the player to understand company finances or political institutions.

Similarly, advanced management screens should provide sufficient depth for players who want it.

---

# 3. TARGET AUDIENCE AND ACCESSIBILITY

## 3.1 Primary Audience

Football Conquest is intended for:

- Fans of American football.
- Players who enjoy arcade sports games.
- Players interested in territorial strategy.
- Players who enjoy career progression.
- Players interested in political and economic simulations.
- Players who enjoy persistent online worlds.

## 3.2 Secondary Audience

The game may also appeal to:
- Alternate-history enthusiasts.
- Geography enthusiasts.
- Sports-management players.
- Competitive multiplayer communities.
- Players interested in procedural world generation.

## 3.3 Platform Requirements

The initial target is a browser-based game.

Required compatibility:
- Chrome.
- Chromium-based browsers.
- Firefox.
- Safari where technically practical.
- Desktop browsers.
- Mobile browsers.

The game must perform acceptably on ordinary Chromebook hardware.

## 3.4 Accessibility

Provide:
- Adjustable text sizes where practical.
- High-contrast UI options.
- Keyboard controls.
- Touch controls.
- Clear visual indicators.
- Optional sound.
- Pause functionality in appropriate modes.
- Adjustable game speed where appropriate.
- Tooltips for unfamiliar mechanics.

Important game information must not rely exclusively on color.

---

# 4. GAME MODES AND OVERALL STRUCTURE

## 4.1 Solo Campaign

**CONFIRMED**

The solo campaign uses recognizable real-world North American geography with a curated alternate-history political landscape.

It should provide a structured progression experience.

The player competes against NPC coaches, PFCs, counties, and state institutions.

The solo world should not require a permanent internet connection for ordinary gameplay once its necessary assets and data are available.

Local save functionality is required.

## 4.2 Online World

**CONFIRMED**

Online mode uses a more fragmented and balkanized North American political landscape.

Players compete in a shared world.

The online environment supports:
- Player-controlled coaches.
- Player-owned PFCs.
- County challenges.
- Territorial ownership.
- Competitive rankings.
- Persistent histories.
- Seasonal progression.

## 4.3 Quick Match

**PROPOSED**

A quick-match option allows players to play football without entering a full career.

Possible options:
- Select teams.
- Select difficulty.
- Select match conditions.
- Start immediately.

Quick Match should be useful for learning controls and testing tactics.

## 4.4 Management Experience

Management is a layer of the career rather than a requirement for every player.

A player may choose to manage:
- Roster recruitment.
- Training.
- Scouting.
- PFC finances.
- Coach employment.
- Company expansion.

The game should provide reasonable automation for players who prefer to focus on football.

## 4.5 Mode Separation

Solo and online modes may share:
- Football engine.
- Athlete data structures.
- County systems.
- PFC systems.
- Political mechanics.
- UI components.

However, they should have distinct world data and persistence.

Solo campaign decisions must not affect online ownership.

Online player actions must not modify the curated solo world.

---

# 5. CORE GAMEPLAY LOOP

## 5.1 Primary Loop

The primary loop is:

1. Receive or select a county assignment.
2. Review available neighboring challenges.
3. Select an eligible opposing county.
4. Review roster and match conditions.
5. Select tactics and formations.
6. Play the match.
7. Receive the match result.
8. Apply territorial ownership changes if eligible.
9. Receive compensation and reputation.
10. Update career records.
11. Relocate to another county if necessary.
12. Repeat.

## 5.2 Secondary Loops

### Athlete Development

Recruit → Train → Play → Improve → Age → Retire or die.

### PFC Management

Employ coaches → Secure contracts → Generate revenue → Pay expenses → Expand organization.

### Political Advancement

Build reputation → Gain influence → Receive appointment → Administer political responsibilities.

### World Development

Generate events → Resolve NPC decisions → Update territorial ownership → Record history.

## 5.3 Session Length

**UNRESOLVED**

The game should support both short sessions and extended management sessions.

Proposed targets:
- Quick match: approximately 3–8 minutes.
- County match: approximately 4–10 minutes.
- Management session: flexible.
- Full campaign: long-term progression.

These targets are provisional and must be tested.

---

# 6. WORLD SETTING AND ALTERNATE HISTORY

## 6.1 Historical Foundation

Football Conquest takes place in an alternate-history North America.

The continent experienced a different sequence of colonial expansion, political development, demographic change, and territorial consolidation.

The setting is not intended to be a direct simulation of modern North American governments.

## 6.2 Colonial History

The historical framework includes:
- British conquest and settlement across much of North America.
- French control or influence over portions of Canada.
- Spanish control or influence over portions of Mexico and California.
- Baja California belonging to California.
- A different relationship between the Caribbean and the mainland.

The precise chronology of these events should be documented in a separate world-history reference.

Developers should not invent contradictory historical events without updating the world-history documentation.

## 6.3 Caribbean Geography

Cuba, Haiti, and the Dominican Republic have been annexed into the North American political setting.

They should be represented as meaningful parts of the world rather than omitted from the map.

Their local populations, municipalities, political institutions, and cultural identities remain distinct.

## 6.4 Indigenous Society

Indigenous peoples were not subjected to genocide in this timeline.

There are no legally designated Indigenous lands or reserved-land categories.

Indigenous communities may develop influence through ordinary freedom of association, demographic concentration, business activity, and participation in political institutions.

Indigenous individuals can hold ordinary political, economic, and professional positions.

The game should not introduce a separate Indigenous governance mechanic simply because a community is Indigenous.

## 6.5 Demographic History

The transatlantic slave trade did not occur in this timeline.

Black populations exist, particularly in:
- Southernmost Florida.
- Cuba.
- Haiti.
- The Dominican Republic.

The setting should reflect the consequences of its alternate demographic history without turning the absence of the historical slave trade into a central narrative theme.

## 6.6 Language

English is the universal game language.

This is a gameplay and accessibility decision.

Names should still reflect cultural and national origins.

## 6.7 Political Philosophy

The continent is organized around numerous sovereign states and limited central authority.

Governors have substantial independence.

State governments operate with a strong free-market orientation and limited oversight.

The political system should not be modeled as a modern federal government with only cosmetic changes.

---

# 7. GEOGRAPHY AND ADMINISTRATIVE STRUCTURE

## 7.1 Administrative Hierarchy

The primary hierarchy is:

**Continent → Sovereign State → County → Municipality**

Townships and boroughs may exist as smaller administrative units.

Counties are the primary units of football-based territorial competition.

Municipalities are administrative and population centers within counties.

## 7.2 Counties

Each county requires a unique identity.

Minimum county data:
- Unique ID.
- Name.
- Parent state ID.
- Population.
- Geographic boundaries.
- Center coordinates.
- Neighboring county IDs.
- Municipality IDs.
- Economic indicators.
- Current ownership.
- Football representation.
- Historical records.

## 7.3 Municipalities

Each municipality should have:
- Unique ID.
- Name.
- Parent county.
- Population.
- Local institutions.
- Mayor.
- Economic activity.
- Local history.

Municipalities remain intact when their county is annexed.

## 7.4 States

Each state should have:
- Unique ID.
- Name.
- Territory.
- Population.
- Governor.
- Political institutions.
- State laws.
- State football team.
- Economic profile.
- Historical records.

## 7.5 Geography Requirements

Solo mode should use recognizable geographic boundaries wherever practical.

Online mode may use a more fragmented configuration.

**UNRESOLVED:** Whether online mode should use actual county boundaries with different political ownership or generated county-like territories.

Recommended approach: use a consistent geographic base and vary political ownership and state fragmentation. This preserves geographic familiarity while allowing a different political landscape.

## 7.6 Map Rendering

The map must support:
- Zoom.
- Pan.
- County selection.
- State boundaries.
- Ownership coloring.
- Adjacent territory highlighting.
- Search.
- County details.
- Challenge initiation.
- Territorial history.

The map must remain usable on small screens.

---

# 8. TERRITORIAL OWNERSHIP AND CONQUEST

## 8.1 Fundamental Rule

Winning a county football match results in the annexation of the opposing county, provided the challenge is valid.

Losing does not transfer ownership.

## 8.2 Challenge Eligibility

A challenge is eligible only when:
- The opposing county is adjacent.
- The challenge does not violate the same-state restriction.
- The target county is not already part of the challenger's state.
- The coach is authorized to represent the challenging county.
- No conflicting challenge prevents the match from being initiated.

The server or authoritative game engine must validate these conditions.

## 8.3 Same-State Restrictions

Counties belonging to the same state cannot challenge each other.

The same-state rule is based on current state ownership, not merely historical association.

If territorial changes alter state membership, eligibility must be recalculated.

## 8.4 Annexation Procedure

When a valid challenge is won:

1. The match result is finalized.
2. Challenge eligibility is revalidated.
3. The target county's owner is changed.
4. The target county joins the winning county's state.
5. Municipalities remain intact.
6. Population remains unchanged.
7. Local institutions remain intact.
8. Territorial history is updated.
9. The map is refreshed.
10. The coach's next assignment is determined.

A county must never be partially annexed.

## 8.5 Territorial History

Each county should retain an ownership history.

History records should include:
- Previous owner.
- New owner.
- Match ID.
- Match date.
- Winning coach.
- Losing coach.
- PFCs involved.
- Final score.
- Challenge type.

The history should remain available after subsequent territorial changes.

## 8.6 Coach Assignment

Coaches are only necessary along contested borders.

When a county no longer requires a coach, the coach moves to the nearest county requiring one.

After either a win or loss, the coach remains employed by the same PFC.

## 8.7 Distance Calculation

**PROPOSED**

Use geographic distance between county centers or boundary-adjacent points.

The nearest available county should be selected.

Tie-breaking should be deterministic, using a consistent county ID or another documented rule.

## 8.8 Multiple Challenges

**UNRESOLVED**

Recommended initial design:
- One active territorial challenge per target county at a time.
- A challenge lock prevents simultaneous ownership transfers.
- A challenge expires after a configurable deadline.
- Abandoned challenges follow a documented resolution rule.

The final rule must avoid giving players an unfair advantage through challenge timing.

## 8.9 Disconnected Territory

**UNRESOLVED**

A state may potentially own counties that are not geographically connected.

Recommended initial approach: allow disconnected holdings unless a specific gameplay or political rule prevents them.

This reflects the game's fragmented political structure and avoids artificial restrictions.

## 8.10 Territorial Recovery

Municipal coaches may challenge neighboring counties to reclaim territory.

The exact assignment rules for municipal coaches need to be formalized.

The recovery system must follow the same adjacency, state, and annexation validation rules.

---

# 9. FOOTBALL GAMEPLAY

## 9.1 Core Design

Football matches should provide an accessible, arcade-style experience with meaningful tactical decisions.

The game should not require a full simulation of every real-world football detail.

However, important football rules must be implemented consistently.

## 9.2 Visual Presentation

Use a side-view pixel-art field.

Required elements:
- Field boundaries.
- Yard lines.
- Hash marks.
- End zones.
- Line of scrimmage.
- First-down marker.
- Ball position.
- Player sprites.
- Team uniforms.
- Player numbers.
- Scoreboard.
- Game clock.
- Down and distance.

## 9.3 Team Identity

Teams should have:
- Name.
- Uniform colors.
- Logo or emblem.
- Player roster.
- Home and away designation.

Uniforms should remain visually distinguishable during gameplay.

## 9.4 Player Control

**PROPOSED**

The player directly controls the ball carrier during running plays.

Passing plays involve selecting a receiver and initiating a throw.

The game should prioritize intuitive controls.

Potential desktop controls:
- WASD or arrow keys: movement.
- Shift: sprint.
- P: pass.
- Mouse: receiver selection.
- Additional keys: optional tactical commands.

Mobile controls should provide equivalent functionality.

## 9.5 Match Flow

A standard county match should follow:

1. Pre-game presentation.
2. Kickoff.
3. Offensive possession.
4. Play selection.
5. Snap.
6. Live play.
7. Play resolution.
8. Down and distance update.
9. Possession change or continued drive.
10. Scoring.
11. Halftime where applicable.
12. Final whistle.
13. Match statistics.
14. Territorial resolution.

## 9.6 Match Length

**UNRESOLVED**

A full-length real-world football game may be too slow for frequent territorial challenges.

Recommended starting point:
- Four short quarters.
- Adjustable clock speed.
- A total match time of approximately 4–10 minutes.

The clock should be configurable for solo and online environments.

The actual timing must be validated through playtesting.

---

# 10. MATCH RULES AND SIMULATION

## 10.1 Downs

The offense receives four downs to gain ten yards.

If it gains the required distance, it receives a new set of downs.

If it fails, possession changes.

## 10.2 Scoring

| Event | Points |
|---|---:|
| Touchdown | 6 |
| Successful extra point | 1 |
| Successful two-point conversion | 2 |
| Field goal | 3 |
| Safety | 2 |

These are proposed standard scoring values and should be used unless the alternate ruleset is later changed.

## 10.3 Turnovers

Possession changes after:
- Interception.
- Fumble recovery by the defense.
- Failed fourth-down conversion.
- Punt.
- Other valid turnover conditions.

## 10.4 Field Position

The match engine must track:
- Current ball position.
- Direction of attack.
- Line of scrimmage.
- First-down line.
- End zones.
- Field boundaries.

Yardage must be calculated consistently.

## 10.5 Clock

The clock should:
- Run during appropriate live-play periods.
- Stop under defined conditions.
- Reset between quarters.
- Reflect timeouts if implemented.
- Support overtime.

Clock logic must be deterministic and tested.

## 10.6 Overtime

**PROPOSED**

Overtime should use a simplified ruleset appropriate for short matches.

The game should avoid indefinite ties.

The exact possession and scoring rules require playtesting.

## 10.7 Penalties

**FUTURE**

Penalties may include:
- Offside.
- False start.
- Holding.
- Pass interference.
- Personal fouls.
- Illegal formations.

Penalty implementation should be prioritized after the basic match engine is stable.

---

# 11. OFFENSIVE GAMEPLAY

## 11.1 Play Selection

The offense chooses from a playbook.

Play categories:
- Power runs.
- Outside runs.
- Draws.
- Quick passes.
- Intermediate passes.
- Deep passes.
- Play-action.
- Quarterback runs.

## 11.2 Formations

**PROPOSED**

Initial formations:
- Standard balanced formation.
- I-formation.
- Shotgun.
- Single-back.
- Goal-line formation.

Formation choices should influence player positioning and tactical effectiveness.

## 11.3 Running Plays

During running plays:
- The quarterback receives or transfers the ball.
- The designated runner becomes controllable.
- Offensive blockers engage defenders.
- Defenders pursue the carrier.
- The play ends when the carrier is tackled, exits the field, scores, or another rule applies.

## 11.4 Passing Plays

Passing plays should feature:
- Receiver routes.
- Quarterback positioning.
- Pass timing.
- Receiver selection.
- Ball flight.
- Catching.
- Incomplete passes.
- Interceptions.
- Yards after catch.

## 11.5 Receiver Routes

Initial route types:
- Go.
- Slant.
- Out.
- In.
- Curl.
- Post.
- Screen.

Routes should be readable and distinct.

## 11.6 Passing Accuracy

Passing success should depend on:
- Quarterback attributes.
- Receiver attributes.
- Defender coverage.
- Distance.
- Throw timing.
- Pressure.
- Random variation.

Randomness should create uncertainty without making outcomes feel arbitrary.

## 11.7 Ball Carrier

The ball carrier should have:
- Movement speed.
- Acceleration.
- Stamina.
- Agility.
- Strength.
- Fumble resistance.

Sprint should consume stamina.

## 11.8 Blocking

Blockers should:
- Identify nearby defenders.
- Attempt to engage them.
- Create running lanes.
- Protect the quarterback.
- Lose engagements under unfavorable conditions.

Blocking should be understandable rather than requiring a full physics simulation.

---

# 12. DEFENSIVE GAMEPLAY

## 12.1 Defensive Philosophy

Defense should be strategically meaningful while remaining accessible.

The defense should not simply move every player toward the ball carrier in a uniform group.

## 12.2 Defensive Formations

Initial formations:
- 4-3.
- 3-4.
- Nickel.
- Goal-line.

Formations influence coverage and run defense.

## 12.3 Defensive Behavior

Defenders should:
- Pursue ball carriers.
- Cover receivers.
- React to passes.
- Attempt tackles.
- Protect the end zone.
- Apply quarterback pressure.
- Contest catches.
- Recover fumbles.

## 12.4 Tackling

Tackling should use shoulder-first contact.

The game should consider:
- Defender strength.
- Defender positioning.
- Ball-carrier agility.
- Speed.
- Momentum.
- Number of defenders involved.

## 12.5 Coverage

Coverage should account for:
- Receiver route.
- Defender position.
- Defender awareness.
- Receiver speed.
- Pass timing.

## 12.6 Defensive Control

**UNRESOLVED**

Possible models:
1. AI-controlled defense with formation selection.
2. Direct control of one defender.
3. Hybrid control with AI positioning and manual actions.

Recommended initial model: AI-controlled positioning with optional control of the nearest relevant defender.

This offers tactical depth without making the controls unnecessarily complicated.

---

# 13. SPECIAL TEAMS

Special teams should eventually include:

- Kickoffs.
- Kick returns.
- Punts.
- Punt returns.
- Field goals.
- Extra points.
- Two-point conversions.

Kicking mechanics should be simple and consistent with the game's arcade presentation.

The first implementation should prioritize:
1. Kickoffs.
2. Field goals.
3. Extra points.
4. Punts.
5. Returns.

---

# 14. FOOTBALL AI

## 14.1 AI Requirements

NPC football players must behave differently based on position and situation.

A running back should not behave like a linebacker.

A receiver should not behave like an offensive lineman.

## 14.2 Offensive AI

The offensive AI should:
- Execute assigned routes.
- Maintain blocking assignments.
- Protect the quarterback.
- Support ball carriers.
- React to defensive pressure.

## 14.3 Defensive AI

The defensive AI should:
- Pursue the ball.
- Maintain coverage.
- Protect open space.
- React to passes.
- Avoid unnecessary collisions.
- Attempt tackles.

## 14.4 Opponent Strategy

The opponent coach should select plays based on:
- Down.
- Distance.
- Field position.
- Score.
- Remaining time.
- Team strengths.
- Defensive formation.
- Match situation.

## 14.5 Difficulty

Difficulty should influence:
- Reaction time.
- Tactical selection.
- Defensive coordination.
- Mistake frequency.
- Opponent decision quality.

Difficulty should not simply increase every opponent's attributes.

---

# 15. ATHLETES AND PLAYER GENERATION

## 15.1 Local Population

Each county has a population.

The local population generates potential football athletes.

A larger population generally provides a larger recruitment pool.

However, population alone should not determine team quality.

## 15.2 Player Generation

Athletes should be generated with:
- Unique IDs.
- Names.
- Ages.
- Positions.
- Attributes.
- Potential.
- Physical characteristics.
- County of origin.
- Career records.

Names should reflect the demographic and cultural background of the world.

## 15.3 Positions

Initial positions:

**Offense**
- Quarterback.
- Running back.
- Wide receiver.
- Tight end.
- Offensive line.

**Defense**
- Defensive line.
- Linebacker.
- Cornerback.
- Safety.

**Special teams**
- Kicker.
- Punter.

## 15.4 Attributes

Potential attributes:

| Attribute | Function |
|---|---|
| Speed | Maximum movement speed |
| Acceleration | Rate of reaching maximum speed |
| Strength | Blocking and physical contests |
| Agility | Direction changes and evasion |
| Stamina | Ability to maintain effort |
| Awareness | Situational decision-making |
| Passing | Throw accuracy and quality |
| Catching | Ability to secure passes |
| Blocking | Effectiveness of blocks |
| Tackling | Defensive tackle success |
| Durability | Injury resistance |
| Potential | Long-term development capacity |

Attributes should be position-sensitive.

## 15.5 Recruitment

Recruitment uses:
- Local population.
- Scouting.
- Available talent.
- PFC resources.
- Coach reputation.
- Contract terms.

Recruitment should not guarantee the best athlete simply because a team has more money.

## 15.6 Roster Size

**UNRESOLVED**

The final roster size should balance realism with usability.

A reduced active roster is recommended for the initial arcade implementation.

The game should distinguish:
- Active roster.
- Reserve roster.
- Available recruits.
- Injured players.

---

# 16. PLAYER DEVELOPMENT AND LIFECYCLE

## 16.1 Development

Athletes may improve through:
- Training.
- Match experience.
- Coaching.
- Natural development.

## 16.2 Aging

Athletes should age over the course of their careers.

Age may influence:
- Physical attributes.
- Injury risk.
- Development.
- Retirement decisions.

## 16.3 Injuries

Injuries should have:
- Severity.
- Duration.
- Recovery probability.
- Potential long-term consequences.

Injured athletes may be unavailable for matches.

## 16.4 Permanent Death

Athletes can die permanently.

The approximate death rate is 12 per million as an initial design target.

This rate must be interpreted carefully in relation to the number of athletes, match count, and simulation time.

The game should not create frequent or arbitrary deaths.

When an athlete dies:
- They are removed from active rosters.
- Their statistics are preserved.
- Their career history remains accessible.
- Their former teams retain historical records.

Coaches do not die.

## 16.5 Retirement

Athletes may retire due to age, declining performance, or personal circumstances.

Retirement is distinct from death.

Retired athletes remain in historical records.

---

# 17. COACHES AND CAREER PROGRESSION

## 17.1 Coach Identity

Each coach has:
- Unique ID.
- Name.
- Background.
- Employment.
- Reputation.
- Career record.
- Earnings.
- Achievements.
- Coaching attributes.

## 17.2 Employment

Coaches work for PFCs.

They may be assigned to counties that require representation.

Their employment remains with the same PFC regardless of match outcome.

## 17.3 Compensation

Coaches are paid for winning games.

**PROPOSED**

A compensation system may include:
- Base contractual compensation.
- Win bonuses.
- Performance bonuses.
- Special contracts.
- State-team compensation.

The exact amounts should be balanced after the economic simulation exists.

## 17.4 Reputation

Reputation should be influenced by:
- Match victories.
- Territorial achievements.
- State-team success.
- Career consistency.
- Important historical victories.

Reputation should not be determined solely by total wins.

## 17.5 Career Advancement

Possible opportunities:
- Better PFC employment.
- More prestigious county assignments.
- Higher compensation.
- State-team appointments.
- PFC ownership.
- Political appointments.

## 17.6 Coach Mobility

Coaches may move between counties according to territorial requirements.

They may also change employment through career opportunities.

A coach's professional history should record all assignments and employers.

## 17.7 Governorship

A player may eventually become governor through appointment.

This is an advanced feature.

Governorship is not a standard career promotion automatically granted after reaching a numerical level.

It should depend on the political circumstances of the world.

---

# 18. PRIVATE FOOTBALL CONTRACTORS

## 18.1 Concept

Private Football Contractors are private organizations that provide football services and employ coaches.

They are structurally similar to military contractors, but their competition takes place through football.

## 18.2 Organization

Each PFC should have:
- Unique ID.
- Name.
- Owner.
- Headquarters.
- Brand identity.
- Financial accounts.
- Employees.
- Reputation.
- Contracts.
- Historical records.

## 18.3 NPC PFCs

NPC-owned organizations should initially dominate the world.

They should:
- Employ coaches.
- Compete for contracts.
- Recruit personnel.
- Maintain finances.
- Expand operations.
- Respond to territorial changes.

## 18.4 Player Ownership

Players may eventually establish their own PFC.

The creation process should include:
- Organization name.
- Brand.
- Initial capital.
- Ownership structure.
- Initial operating location.

## 18.5 Contracts

Potential contracts:
- County coaching contracts.
- Municipal football contracts.
- State-team contracts.
- Development contracts.
- Sponsorship arrangements.

## 18.6 Company Growth

PFC growth may involve:
- Hiring coaches.
- Acquiring contracts.
- Expanding into additional jurisdictions.
- Improving reputation.
- Securing financing.
- Building recruitment networks.

## 18.7 Competition

PFCs should compete through performance, contracts, reputation, and talent acquisition.

They do not directly annex territory.

Territorial ownership changes through football matches and the associated political rules.

---

# 19. ECONOMICS AND FINANCIAL SYSTEMS

## 19.1 Economic Objectives

The economy exists to support meaningful professional and organizational decisions.

It should not overwhelm football.

## 19.2 Financial Entities

The game may track finances for:
- Individual coaches.
- PFCs.
- Municipalities.
- States.
- Other relevant institutions.

## 19.3 Coach Income

Coach income comes primarily from winning games.

Additional compensation may be provided through contracts and special appointments.

## 19.4 PFC Revenue

Potential sources:
- Municipal contracts.
- State contracts.
- Sponsorships.
- Investments.
- Performance bonuses.
- Football-related services.

## 19.5 PFC Expenses

Potential expenses:
- Coach compensation.
- Recruitment.
- Scouting.
- Training.
- Operations.
- Facilities.
- Administration.

## 19.6 Economic Balance

The economy should avoid:
- Unlimited money generation.
- Runaway advantages for wealthy organizations.
- Permanent inability to compete for small organizations.
- Excessive administrative complexity.

Economic balancing should be based on observed gameplay.

## 19.7 Financial Records

Important transactions should be recorded.

Records should include:
- Date.
- Amount.
- Source.
- Destination.
- Description.
- Associated contract or match.

---

# 20. POLITICAL INSTITUTIONS

## 20.1 Political Structure

The continent consists of sovereign states with limited central oversight.

Governors have extensive authority within their jurisdictions.

The political system is decentralized.

## 20.2 Governors

Governors:
- Dictate state laws.
- Appoint mayors.
- Select successful coaches for state teams.
- Exercise substantial state authority.
- Operate with limited external oversight.

Most governors are NPCs.

## 20.3 Mayors

Mayors are appointed by governors.

Municipalities retain their own local identities and institutions.

Mayors may manage local administrative matters.

Their powers are subordinate to state laws and gubernatorial authority.

## 20.4 State Laws

Governors may establish laws that affect:
- Business operations.
- Municipal administration.
- Economic regulation.
- Football administration.
- Public institutions.

Laws should have tangible gameplay effects.

Avoid creating large numbers of cosmetic laws that do not influence gameplay.

## 20.5 Political Influence

Influence may come from:
- Wealth.
- Reputation.
- Professional achievements.
- Relationships.
- PFC ownership.
- State-team performance.

## 20.6 Player Political Participation

Players may gain political opportunities through appointments.

A player who becomes governor should receive meaningful responsibilities and decisions.

Political gameplay must not eliminate the underlying football systems.

---

# 21. GOVERNORS AND STATE ADMINISTRATION

## 21.1 Appointment System

Governors appoint mayors.

The player may eventually be appointed governor.

The exact appointing authority and political succession rules require additional worldbuilding.

## 21.2 Governor Responsibilities

Potential responsibilities:
- State laws.
- Municipal appointments.
- State-team selection.
- State football administration.
- Economic policy.
- Political appointments.

## 21.3 NPC Governors

NPC governors should have:
- Political preferences.
- Economic preferences.
- Leadership characteristics.
- Relationships.
- Career histories.
- Appointment behavior.

They should make decisions based on their own interests and the state's circumstances.

## 21.4 Governor Replacement

**UNRESOLVED**

The game must define:
- How governors leave office.
- Whether governors can be dismissed.
- Who appoints replacements.
- Whether offices can remain vacant.
- How player governors can lose their positions.

---

# 22. STATE FOOTBALL

## 22.1 Purpose

State football is a separate competitive layer above county football.

It should provide more advanced management and customization.

## 22.2 Coach Selection

Governors select successful coaches to manage state teams.

## 22.3 Team Structure

State teams may recruit or select athletes from their constituent counties.

The precise eligibility and roster selection system remains to be designed.

## 22.4 Match Rules

State matches:
- Use customizable and managerial gameplay.
- Do not transfer territorial ownership.
- Provide prestige and political recognition.
- Contribute to coach reputation.

## 22.5 State Competition

**PROPOSED**

State competitions may include:
- Scheduled fixtures.
- Regional competitions.
- Championships.
- Historical rankings.

These competitions should be developed after county football is stable.

---

# 23. SOLO CAMPAIGN

## 23.1 Purpose

The solo campaign introduces the world and core systems through a structured career.

## 23.2 Starting Conditions

The player begins as a new coach employed by an NPC PFC.

The player receives an initial county assignment.

The starting county should provide:
- A manageable roster.
- At least one eligible neighboring challenge.
- A clear introductory objective.
- A reasonable path to career advancement.

## 23.3 Tutorial

The tutorial introduces:
1. Football controls.
2. Play selection.
3. Match rules.
4. County ownership.
5. Challenges.
6. Territorial annexation.
7. Coach relocation.
8. Compensation.
9. Roster recruitment.
10. Career progression.

Advanced management should be introduced later.

## 23.4 Campaign Progression

The campaign should provide increasing complexity.

Early game:
- Basic matches.
- Simple territorial challenges.
- Basic recruitment.

Middle game:
- More challenging opponents.
- Better PFC opportunities.
- Larger rosters.
- Regional competition.

Late game:
- State-team coaching.
- PFC ownership.
- Political influence.
- Governorship opportunities.

## 23.5 NPC Competition

NPCs should continue competing for territory.

The world should not wait for the player to initiate every event.

## 23.6 Campaign Completion

**UNRESOLVED**

The solo campaign may be open-ended or have a defined major objective.

Recommended approach: open-ended career progression with optional major achievements and campaign milestones.

---

# 24. ONLINE MULTIPLAYER

## 24.1 World Structure

Online players share a persistent territorial world.

Each player controls a coach and may eventually own a PFC.

## 24.2 Accounts

Required account data:
- Account ID.
- Authentication identity.
- Player profile.
- Coach profile.
- PFC ownership.
- Career records.
- Achievements.
- Preferences.

## 24.3 Multiplayer Challenges

Players challenge eligible neighboring counties.

The match result must be validated before territory changes.

## 24.4 Asynchronous Matches

**PROPOSED**

The online system should support asynchronous challenges so players do not have to be online simultaneously.

Potential structure:
1. Challenger initiates match.
2. Opponent receives challenge.
3. Match becomes available.
4. Both sides receive a defined opportunity to participate.
5. The match resolves under a documented rule.
6. Server validates the result.
7. Territorial ownership updates.

The precise interaction model must be finalized before implementation.

## 24.5 Concurrency

The system must prevent two simultaneous challenges from transferring the same county incorrectly.

A county should have a clearly defined active challenge state.

## 24.6 Match Abandonment

**UNRESOLVED**

Define:
- Challenge expiration.
- Player disconnection.
- Incomplete match.
- No-show.
- Repeated abandonment.
- Server interruption.

These rules must be fair and resistant to exploitation.

## 24.7 Rankings

Potential rankings:
- Coach victories.
- Career earnings.
- Territorial achievements.
- PFC performance.
- State-team achievements.
- Seasonal performance.

Rankings should distinguish career totals from current-season results.

---

# 25. NPC AND WORLD SIMULATION

## 25.1 NPC Categories

NPCs include:
- Athletes.
- Coaches.
- PFC owners.
- PFC employees.
- Governors.
- Mayors.
- Other relevant individuals.

## 25.2 NPC Goals

NPCs should have goals appropriate to their roles.

Examples:
- Coaches seek successful careers.
- PFCs seek profitable contracts.
- Governors seek stable and influential states.
- Athletes seek opportunities and development.

## 25.3 Simulation Frequency

Not every NPC needs to be simulated continuously.

Use different update frequencies for:
- Active matches.
- Nearby counties.
- Major organizations.
- Distant world events.
- Historical background systems.

## 25.4 Offline Simulation

Solo NPCs should progress when the player is not actively interacting with them, using a controlled time-advance system.

Online simulation should use server-controlled updates.

## 25.5 Event Generation

Potential events:
- Coach appointments.
- PFC contract changes.
- Athlete recruitment.
- Injuries.
- Retirement.
- Territorial challenges.
- Political appointments.
- State-team results.

Events should be recorded and should have meaningful consequences.

---

# 26. SEASONS AND HISTORICAL RECORDS

## 26.1 Online Seasons

Online worlds reset periodically.

The season length is not finalized.

## 26.2 Proposed Reset Structure

Reset:
- Seasonal territorial ownership.
- Seasonal rankings.
- Seasonal political positions, if configured.

Preserve:
- Accounts.
- Historical achievements.
- Career statistics.
- Cosmetics.
- Archived PFC records.
- Previous season history.

## 26.3 Reset Safety

Season resets must be:
- Scheduled.
- Documented.
- Backed up.
- Tested.
- Recoverable.

A season reset must never accidentally erase permanent account history.

## 26.4 Historical Records

The game should maintain:
- County histories.
- Match histories.
- Coach careers.
- Athlete careers.
- PFC histories.
- State-team histories.
- Political office histories.
- Seasonal archives.

Historical information should be searchable and readable.

---

# 27. USER INTERFACE AND USER EXPERIENCE

## 27.1 Primary Navigation

Recommended main sections:

1. Home.
2. Match Day.
3. World Map.
4. My Coach.
5. Roster.
6. My PFC.
7. Standings.
8. State.
9. Career.
10. History.
11. Settings.

Sections should only be visible when relevant to the player's progression or mode.

## 27.2 Home Screen

The home screen should prioritize immediate actions.

Suggested content:
- Current county.
- Upcoming challenge.
- Coach status.
- Recent match result.
- Current PFC.
- Career progress.
- Important notifications.

## 27.3 World Map Screen

The map should show:
- County ownership.
- State borders.
- Available challenges.
- Coach assignments.
- Territorial history.

Selecting a county should open its information panel.

## 27.4 County Screen

Display:
- County name.
- State.
- Population.
- Municipalities.
- Owner.
- Coach.
- PFC.
- Roster.
- Adjacent counties.
- Eligible challenges.
- History.

## 27.5 Match Screen

Display:
- Score.
- Clock.
- Quarter.
- Down.
- Distance.
- Ball position.
- Play selection.
- Player control.
- Game log.

## 27.6 Coach Screen

Display:
- Name.
- Reputation.
- Employer.
- Current assignment.
- Career statistics.
- Earnings.
- Achievements.
- Employment history.

## 27.7 Roster Screen

Display:
- Player name.
- Position.
- Age.
- Attributes.
- Condition.
- Injury status.
- Development potential.
- Career statistics.

## 27.8 PFC Screen

Display:
- Company name.
- Owner.
- Finances.
- Contracts.
- Employees.
- Reputation.
- Operations.
- Historical performance.

## 27.9 Political Screen

Display:
- State governor.
- Mayors.
- State laws.
- Political appointments.
- State-team status.
- Political history.

## 27.10 Notifications

Notifications should communicate:
- New challenges.
- Match results.
- Territorial changes.
- Contract offers.
- Injuries.
- Appointments.
- Important world events.

Avoid overwhelming the player with low-value notifications.

---

# 28. VISUAL DIRECTION AND ART REQUIREMENTS

## 28.1 Overall Style

Use original pixel-art sports visuals.

The target is a readable, appealing, compact presentation.

The game should have a recognizable visual identity independent of its references.

## 28.2 Player Sprites

Create original player sprites with:
- Distinct body proportions.
- Uniforms.
- Helmets excluded.
- Individual numbers.
- Team-specific colors.
- Directional movement.
- Animations.

Do not copy Retro Bowl sprites.

## 28.3 Animation Requirements

Required animations:
- Standing.
- Running.
- Sprinting.
- Passing.
- Catching.
- Blocking.
- Tackling.
- Falling.
- Getting up.
- Celebrating.
- Injury reaction where appropriate.

## 28.4 Field Art

The field should include:
- Grass or turf.
- Yard lines.
- Hash marks.
- End zones.
- Team colors.
- Goalposts.
- Sideline details.

## 28.5 Interface Art

Create original:
- Logos.
- Icons.
- Buttons.
- Menus.
- Badges.
- Scoreboards.
- Team crests.
- County ownership indicators.

## 28.6 Map Style

The map should be readable at multiple zoom levels.

Ownership should be visually clear without obscuring county boundaries.

## 28.7 Animation Priorities

Prioritize animation work based on gameplay importance.

Highest priority:
1. Running.
2. Passing.
3. Catching.
4. Tackling.
5. Blocking.
6. Scoring.
7. Celebrations.

---

# 29. AUDIO DIRECTION

## 29.1 Sound Effects

Potential sound effects:
- Whistle.
- Snap.
- Footsteps.
- Tackle.
- Catch.
- Crowd reaction.
- Touchdown.
- Field goal.
- Turnover.
- Final whistle.

## 29.2 Music

Music should be original or appropriately licensed.

The game should not depend on copyrighted sports-game music.

## 29.3 Audio Settings

Provide:
- Master volume.
- Music volume.
- Effects volume.
- Mute option.

Audio should be optional.

---

# 30. PROGRESSION AND REWARDS

## 30.1 Progression Philosophy

Progression should reward skill and long-term involvement.

It should not make new players permanently uncompetitive.

## 30.2 Coach Progression

Possible rewards:
- Higher reputation.
- Better contracts.
- New assignments.
- State-team appointments.
- PFC ownership.
- Political opportunities.

## 30.3 Athlete Progression

Athletes improve through experience and training.

## 30.4 PFC Progression

Organizations gain:
- Reputation.
- Contracts.
- Employees.
- Financial capacity.
- Expansion opportunities.

## 30.5 Achievements

Potential achievements:
- First victory.
- First annexation.
- Regional dominance.
- Long winning streak.
- State championship.
- Successful PFC creation.
- Governorship.
- Historic territorial achievement.

Achievements should be recorded permanently.

## 30.6 Competitive Balance

Long-term progression should provide opportunities without making older accounts unbeatable.

Online balance may use:
- Matchmaking.
- Geographic separation.
- Competitive divisions.
- Seasonal rankings.
- Roster constraints.

The final system requires testing.

---

# 31. GAME BALANCING

## 31.1 Core Balance Objective

Football performance should remain the most important determinant of match outcomes.

Roster quality matters, but should not guarantee victory.

## 31.2 Population Balance

Large counties should generally have larger talent pools.

However, smaller counties should have viable competitive opportunities.

## 31.3 Economic Balance

Wealth should create strategic options, not absolute dominance.

## 31.4 Territorial Balance

Territorial expansion should be rewarding but should not create an unstoppable advantage.

## 31.5 Match Randomness

Randomness should:
- Reflect uncertainty.
- Produce occasional surprises.
- Avoid arbitrary outcomes.
- Remain subordinate to skill and attributes.

## 31.6 Injury and Death Balance

Injuries should matter without making roster management intolerable.

Permanent athlete death must remain extremely rare.

## 31.7 Balance Metrics

Track:
- Win rates by roster strength.
- Win rates by population.
- Average match duration.
- Average points per match.
- Turnover frequency.
- Injury frequency.
- Territorial expansion rates.
- PFC income distribution.
- New-player competitiveness.

---

# 32. DATA ARCHITECTURE

## 32.1 Core Entities

The game should use unique IDs and explicit relationships.

Core entities:
- World.
- Season.
- State.
- County.
- Municipality.
- Player account.
- Coach.
- Athlete.
- Team.
- Match.
- Challenge.
- PFC.
- Contract.
- Governor.
- Mayor.
- Political appointment.
- Historical event.

## 32.2 County Record

A county record should include:

- County ID.
- Name.
- State ID.
- Population.
- Geography.
- Adjacent county IDs.
- Municipality IDs.
- Owner.
- Coach assignment.
- PFC representation.
- Roster reference.
- History reference.

## 32.3 Athlete Record

An athlete record should include:

- Athlete ID.
- Name.
- Birth date or age.
- Position.
- Attributes.
- Potential.
- Current condition.
- Injury status.
- Origin county.
- Current team.
- Career statistics.
- Lifecycle status.

## 32.4 Coach Record

A coach record should include:
- Coach ID.
- Account ID if player-controlled.
- Name.
- Employer.
- Current assignment.
- Reputation.
- Career record.
- Compensation.
- Employment history.
- Appointments.

## 32.5 Match Record

A match record should include:
- Match ID.
- Home county.
- Away county.
- Coaches.
- Teams.
- Score.
- Start time.
- Completion time.
- Statistics.
- Match status.
- Challenge reference.
- Validation status.

## 32.6 Challenge Record

A challenge record should include:
- Challenge ID.
- Challenging county.
- Target county.
- Challenger coach.
- Opposing coach.
- Status.
- Creation time.
- Expiration time.
- Match ID.
- Final outcome.

## 32.7 Historical Events

Important changes should generate immutable or append-only historical records.

Examples:
- County annexation.
- Coach appointment.
- Athlete retirement.
- Athlete death.
- PFC creation.
- Contract signing.
- Governor appointment.

---

# 33. TECHNICAL ARCHITECTURE

## 33.1 General Requirements

The game should use a modular architecture.

Separate:
- Frontend presentation.
- Football simulation.
- AI.
- Territorial rules.
- World simulation.
- Career systems.
- Economics.
- Politics.
- Persistence.
- Multiplayer services.

Avoid a monolithic single-file implementation as the game grows.

## 33.2 Frontend

The frontend should:
- Render matches.
- Display maps.
- Handle player input.
- Display management screens.
- Request authoritative game actions.
- Present results.

It should not be trusted to independently validate online territorial transfers.

## 33.3 Backend

The backend is responsible for:
- Authentication.
- Player profiles.
- Match validation.
- Challenge state.
- Territorial ownership.
- PFC ownership.
- Financial transactions.
- Political appointments.
- Online history.

## 33.4 Hosting

GitHub Pages may continue hosting the frontend.

It cannot provide authoritative multiplayer persistence by itself.

A separate backend and database are required for online functionality.

## 33.5 Infrastructure

Prefer low-cost services.

Before adopting a paid service, document:
- Expected monthly cost.
- Free-tier limitations.
- Data limits.
- Authentication support.
- Backup options.
- Migration options.

## 33.6 Performance

Avoid unnecessarily simulating every entity continuously.

Use event-based updates and simulation tiers.

The game should remain performant with large numbers of counties and athletes.

---

# 34. MULTIPLAYER SECURITY

## 34.1 Authoritative State

The server is the source of truth for online ownership and match results.

## 34.2 Validation

The server must validate:
- Player authorization.
- Coach assignment.
- County adjacency.
- Same-state restrictions.
- Challenge availability.
- Match completion.
- Match outcome.
- Territorial transfer.

## 34.3 Duplicate Requests

Use unique transaction or match identifiers to prevent duplicate actions.

## 34.4 Concurrent Challenges

Prevent multiple transactions from producing contradictory ownership.

## 34.5 Financial Security

All online financial transactions must be validated server-side.

Never trust a client-submitted account balance.

## 34.6 Anti-Cheating

Potential protections:
- Server-authoritative simulation.
- Match event validation.
- Request rate limits.
- Duplicate submission detection.
- Audit logs.
- Account enforcement.

---

# 35. SAVE SYSTEMS AND PERSISTENCE

## 35.1 Solo Saves

Solo progress should be saved locally or through an optional account-backed service.

## 35.2 Online Saves

Online progress must be stored server-side.

## 35.3 Save Contents

Save:
- Coach career.
- Athlete rosters.
- PFCs.
- Finances.
- Territory.
- Match histories.
- Political appointments.
- Achievements.

## 35.4 Migration

Data schemas should be versioned.

When the game updates, existing saves should be migrated rather than silently discarded.

## 35.5 Recovery

Provide backups and recovery procedures for important persistent data.

---

# 36. ACCESSIBILITY AND PERFORMANCE

## 36.1 Hardware

The game must run on ordinary Chromebook hardware.

## 36.2 Rendering

Use efficient rendering.

Avoid excessive DOM updates during active matches.

## 36.3 Mobile

Support touch input and responsive layout.

## 36.4 Loading

Load essential gameplay resources first.

Management data and historical records can be loaded when needed.

## 36.5 Offline Behavior

Solo mode should support local progress.

Online mode should communicate clearly when connectivity is unavailable.

---

# 37. MONETIZATION PHILOSOPHY

**UNRESOLVED**

The initial game should prioritize gameplay and technical stability.

Potential future models:
- One-time purchase.
- Optional cosmetic purchases.
- Premium account features.
- Expansion content.

Avoid pay-to-win mechanics.

Purchases should not directly determine territorial outcomes.

The game should not require paid services for basic solo gameplay.

No monetization model should be implemented without an explicit product decision.

---

# 38. TUTORIAL AND ONBOARDING

## 38.1 First Session

The first session should introduce the player to:
- The world.
- Their coach.
- Their PFC.
- Their starting county.
- The football controls.
- The territorial system.

## 38.2 Guided Match

The player should play a short introductory match.

The tutorial should explain:
- Selecting a play.
- Controlling the ball carrier.
- Passing.
- First downs.
- Scoring.

## 38.3 First Annexation

After the first win, explain:
- Ownership transfer.
- State membership.
- County history.
- Coach relocation.

## 38.4 Gradual Complexity

Introduce recruitment, PFC management, and politics only after the player understands the basic gameplay.

Provide optional tutorials for advanced systems.

---

# 39. TESTING AND QUALITY ASSURANCE

## 39.1 Football Testing

Verify:
- Play selection.
- Player movement.
- Passing.
- Catching.
- Tackling.
- Blocking.
- First downs.
- Touchdowns.
- Field goals.
- Turnovers.
- Clock.
- Quarters.
- Overtime.
- Final results.

## 39.2 Territorial Testing

Verify:
- Adjacency.
- State membership.
- Same-state restrictions.
- Annexation.
- Failed challenges.
- Coach relocation.
- Ownership history.
- Concurrent challenges.

## 39.3 Athlete Testing

Verify:
- Generation.
- Recruitment.
- Attribute calculations.
- Training.
- Aging.
- Injuries.
- Recovery.
- Retirement.
- Permanent death.
- Historical records.

## 39.4 Economic Testing

Verify:
- Income.
- Expenses.
- Contracts.
- Compensation.
- Company balances.
- Duplicate payments.
- Bankruptcy or insolvency behavior if implemented.

## 39.5 Political Testing

Verify:
- Governor appointments.
- Mayor appointments.
- State laws.
- State-team selections.
- Player governorship.
- Office replacement.

## 39.6 Multiplayer Testing

Verify:
- Authentication.
- Authorization.
- Match validation.
- Persistence.
- Duplicate requests.
- Concurrent challenges.
- Disconnections.
- Recovery.
- Season transitions.

## 39.7 Playtesting

Collect:
- Match duration.
- Match completion rate.
- Average scoring.
- Player retention.
- Challenge frequency.
- Territorial turnover.
- Career progression speed.
- Management engagement.

Use actual playtest results to revise balance.

---

# 40. DEVELOPMENT ROADMAP

## Phase 1 — Football Engine

Implement:
- Complete match flow.
- Movement.
- Passing.
- Catching.
- Blocking.
- Tackling.
- Defensive AI.
- Kicking.
- Possession.
- Clock.
- Scoring.
- Statistics.

**Acceptance:** A complete, playable match from kickoff to final whistle.

## Phase 2 — Territorial Engine

Implement:
- County map.
- County adjacency.
- Ownership.
- State membership.
- Challenges.
- Annexation.
- Coach relocation.
- Historical records.

**Acceptance:** A valid football result changes county ownership according to the rules.

## Phase 3 — Population and Athlete Systems

Implement:
- Population data.
- Athlete generation.
- Rosters.
- Recruitment.
- Attributes.
- Development.
- Injuries.
- Aging.
- Historical records.

**Acceptance:** Counties have distinct local football populations and functioning rosters.

## Phase 4 — Coach and PFC Career

Implement:
- Coach identities.
- Employment.
- Compensation.
- Reputation.
- NPC PFCs.
- Contracts.
- Finances.
- Player-owned PFCs.

**Acceptance:** A player can maintain a career and establish a PFC.

## Phase 5 — Solo Campaign

Implement:
- Alternate-history geography.
- NPC behavior.
- Campaign progression.
- County competition.
- Historical records.
- State institutions.

**Acceptance:** A complete single-player career can be played without placeholder systems.

## Phase 6 — Politics and State Football

Implement:
- Governors.
- Mayors.
- State laws.
- Political appointments.
- State-team selection.
- State football.

**Acceptance:** Political decisions and state football have meaningful consequences.

## Phase 7 — Online Multiplayer

Implement:
- Authentication.
- Player profiles.
- Persistent data.
- Challenges.
- Match validation.
- Territorial updates.
- PFC ownership.
- Rankings.
- Seasons.

**Acceptance:** Multiple players can safely compete in a persistent shared world.

---

# 41. FEATURE ACCEPTANCE CRITERIA

A feature is not complete merely because a screen exists.

## Football

Complete when:
- Matches can begin and end.
- All basic rules resolve correctly.
- Players respond to controls.
- AI behaves according to position.
- Results are recorded.
- No critical match-state bugs remain.

## Territorial Conquest

Complete when:
- County adjacency is accurate.
- Challenges are validated.
- Same-state restrictions work.
- Winning transfers ownership.
- Losing does not.
- History is preserved.
- Coach relocation works.

## Athlete System

Complete when:
- Athletes are generated.
- Rosters are maintained.
- Recruitment works.
- Attributes affect gameplay.
- Injuries affect availability.
- Historical records persist.

## PFC System

Complete when:
- Organizations employ coaches.
- Contracts work.
- Financial transactions are recorded.
- Company ownership works.
- NPC organizations operate.

## Political System

Complete when:
- Governors exist.
- Mayors are appointed.
- State laws have effects.
- State teams function.
- Political appointments are recorded.

## Online Multiplayer

Complete when:
- Accounts work.
- Persistent data works.
- Challenges are authoritative.
- Matches cannot be falsified through client-side submissions.
- Territorial updates are secure.
- Concurrent actions are handled correctly.

---

# 42. RISKS AND DESIGN QUESTIONS

The following issues require particular attention.

## 42.1 Football Complexity

**Risk:** Adding too many football mechanics could undermine the accessible match experience.

**Recommendation:** Keep county matches streamlined. Add tactical depth through meaningful choices rather than excessive controls.

## 42.2 Match Duration

**Risk:** Players may need to play many matches to progress.

**Recommendation:** Keep matches short enough that territorial competition remains enjoyable.

## 42.3 Territorial Snowballing

**Risk:** A successful state may accumulate territory and become increasingly difficult to challenge.

**Recommendation:** Investigate balancing through geography, roster availability, PFC competition, and challenge rules.

Do not artificially weaken successful players without a gameplay justification.

## 42.4 Coach Relocation

**Risk:** Automatic relocation may make the player feel disconnected from their chosen county.

**Recommendation:** Test whether relocation should be immediate or whether the player should receive an assignment offer.

The confirmed rule that coaches move to counties needing coaches must remain intact.

## 42.5 Population Imbalance

**Risk:** Large counties may have overwhelming talent advantages.

**Recommendation:** Allow smaller counties to compete through recruitment, tactical quality, coaching, and roster efficiency.

## 42.6 Athlete Death

**Risk:** Permanent death may discourage investment in athletes.

**Recommendation:** Keep the rate exceptionally low, preserve history, and ensure the event is not used as an arbitrary punishment.

## 42.7 PFC Economics

**Risk:** Company management may become a separate complex game.

**Recommendation:** Keep it optional and automate routine administration.

## 42.8 Political Complexity

**Risk:** The political system may consume more development time than the football game.

**Recommendation:** Initially implement only the political powers that directly influence the core world.

## 42.9 Multiplayer Cheating

**Risk:** Client-side football simulation can be manipulated.

**Recommendation:** Develop a server-authoritative match-result system before releasing competitive online territorial play.

## 42.10 World Scale

**Risk:** Simulating all athletes, counties, organizations, and political actors continuously may be expensive.

**Recommendation:** Use event-driven updates and simulation tiers.

---

# 43. POST-PROTOTYPE REVISION PLAN

The GDD is a living document.

It should be revised after actual gameplay tests.

The following questions are especially important.

## 43.1 Football Experience

Evaluate:
- Does the game feel like football?
- Are controls intuitive?
- Are passing and running equally viable?
- Does defense feel fair?
- Are matches too long?
- Is the AI predictable?
- Are roster differences meaningful?

Potential revisions:
- Change control schemes.
- Shorten matches.
- Adjust play selection.
- Change defensive automation.
- Simplify special teams.
- Adjust attribute influence.

## 43.2 Territorial Experience

Evaluate:
- Is annexing an entire county satisfying?
- Can players understand why a challenge is eligible?
- Does automatic coach relocation make sense?
- Are counties changing ownership too frequently?
- Are some territories impossible to defend?

Potential revisions:
- Challenge cooldowns.
- Matchmaking rules.
- Coach assignment adjustments.
- Challenge scheduling.
- Territorial balancing.

Do not change the fundamental annexation mechanic without strong playtest evidence.

## 43.3 Career Experience

Evaluate:
- Is coach progression meaningful?
- Does employment matter?
- Is compensation sufficient?
- Are state-team appointments desirable?
- Does PFC ownership feel rewarding?

Potential revisions:
- Career milestones.
- Contract structure.
- Reputation calculation.
- Compensation.
- PFC management depth.

## 43.4 World Simulation

Evaluate:
- Do NPCs behave believably?
- Are state borders understandable?
- Are county populations plausible?
- Does the world change at a satisfying rate?
- Are political institutions meaningful?

Potential revisions:
- Simulation frequency.
- NPC decision-making.
- Population generation.
- Political event frequency.
- World geography.

## 43.5 Multiplayer

Evaluate:
- Can players compete fairly?
- Are asynchronous challenges engaging?
- Are season resets too disruptive?
- Is territorial progression meaningful?
- Is cheating sufficiently prevented?

Potential revisions:
- Season length.
- Challenge deadlines.
- Competitive divisions.
- Match validation.
- Reset rules.

## 43.6 Design Review Procedure

After each major prototype milestone:

1. Collect playtest data.
2. Identify mechanics that are confusing or unfun.
3. Separate implementation bugs from design problems.
4. Identify which confirmed rules are affected.
5. Propose changes.
6. Record the reasoning.
7. Update this GDD.
8. Implement the approved revision.
9. Retest the affected systems.

Do not rewrite the entire GDD after every small adjustment.

Maintain a revision history.

---

# 44. GLOSSARY

**Annexation:** The transfer of an entire county into another state's ownership following a valid football victory.

**Athlete:** A football player participating in matches. Athletes can be injured, age, retire, and die permanently.

**Coach:** The player-controlled or NPC professional responsible for directing a county or state football team. Coaches do not participate as athletes and do not die.

**County:** The primary territorial unit in the game.

**County Challenge:** A football match between eligible neighboring counties.

**Governor:** The head of a sovereign state's government, with extensive authority over state administration.

**Municipality:** A local administrative unit inside a county.

**PFC:** Private Football Contractor, a private organization employing coaches and providing football services.

**Reputation:** A measure of professional recognition and influence.

**State:** A sovereign political jurisdiction within the alternate-history North American setting.

**State Game:** A managerial football competition that does not transfer territory.

**Territorial Ownership:** The state affiliation and control associated with a county.

**World Season:** A competitive period in online mode, after which designated seasonal data may reset.

---

# FINAL DESIGN DIRECTIVE

Football Conquest must be developed as one integrated game.

Football determines territorial outcomes. Territorial outcomes influence state politics. State politics influence appointments and institutions. PFCs employ coaches and compete for business. Athletes are generated from local populations and develop through their careers. Every important event contributes to the world's history.

The football game must remain the center of the experience.

The larger simulation exists to give football victories meaning, provide long-term progression, and make the world feel alive.

Build the game incrementally, but preserve the larger vision.

Do not confuse a prototype with a finished feature. Do not implement placeholder menus and describe them as completed systems. Do not discard established world rules without documenting the reason.

When a design decision remains unresolved, choose a practical provisional implementation, document it, and revisit it after playtesting.

**The ultimate objective is a complete, browser-accessible football and territorial simulation in which every match can matter to the history of North America.**