/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Athlete, GameState, Position } from '../types/game';
import { generateAthlete } from '../data/rosterGenerator';
import { soundEngine } from '../audio/soundEngine';
import { Dumbbell, PlusCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

interface RosterViewProps {
  gameState: GameState;
  onUpdateState: (newState: GameState) => void;
}

export const RosterView: React.FC<RosterViewProps> = ({ gameState, onUpdateState }) => {
  const playerCoach = gameState.coaches[gameState.playerCoachId];
  const currentCounty = gameState.counties[playerCoach?.currentCountyId || 'C_BER'];
  const activeRoster = gameState.rosters[currentCounty.id] || [];
  const playerPfc = gameState.pfcs[gameState.playerPfcId];

  const [selectedAthleteId, setSelectedAthleteId] = useState<string>(activeRoster[0]?.id || '');
  const [scoutedProspects, setScoutedProspects] = useState<Athlete[]>(() => [
    generateAthlete(currentCounty, 'RB'),
    generateAthlete(currentCounty, 'WR1'),
    generateAthlete(currentCounty, 'DL'),
  ]);

  const selectedAthlete = activeRoster.find((a) => a.id === selectedAthleteId) || activeRoster[0];

  // Train an athlete (costs $3,000 from PFC treasury)
  const handleTrain = (attr: 'speed' | 'strength' | 'tackling' | 'catching' | 'stamina') => {
    if (!selectedAthlete || !playerPfc) return;
    const cost = 3000;
    if (playerPfc.treasury < cost) {
      soundEngine.playTurnover();
      return;
    }

    soundEngine.playCatch();
    const updatedState = { ...gameState };
    const pfc = updatedState.pfcs[gameState.playerPfcId];
    pfc.treasury -= cost;

    const roster = updatedState.rosters[currentCounty.id];
    const ath = roster.find((a) => a.id === selectedAthlete.id);
    if (ath) {
      ath[attr] = Math.min(99, ath[attr] + 2);
      ath.morale = Math.min(100, ath.morale + 5);
    }

    onUpdateState(updatedState);
  };

  // Recruit a scouted local prospect into the active roster
  const handleSignProspect = (prospect: Athlete) => {
    if (!playerPfc) return;
    const signBonus = 5000;
    if (playerPfc.treasury < signBonus) {
      soundEngine.playTurnover();
      return;
    }

    soundEngine.playFirstDown();
    const updatedState = { ...gameState };
    const pfc = updatedState.pfcs[gameState.playerPfcId];
    pfc.treasury -= signBonus;

    const roster = updatedState.rosters[currentCounty.id];
    // Replace current athlete at that position or add
    const existingIdx = roster.findIndex((a) => a.position === prospect.position);
    if (existingIdx !== -1) {
      roster[existingIdx] = prospect;
    } else {
      roster.push(prospect);
    }

    // Refresh scout list
    setScoutedProspects(scoutedProspects.filter((p) => p.id !== prospect.id));
    onUpdateState(updatedState);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 flex flex-col gap-6">
      {/* Header bar */}
      <div className="bg-stone-900 border border-stone-800 rounded-lg p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
            Active County Squad & Recruitment Pool
          </span>
          <h2 className="text-xl font-bold font-display text-stone-100 tracking-wide mt-0.5">
            {currentCounty.name} Football Roster
          </h2>
          <p className="text-xs text-stone-400">
            Home population talent base: <span className="text-stone-200">{currentCounty.population.toLocaleString()}</span> residents · {currentCounty.dominantCulture}
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="bg-stone-950 px-3 py-1.5 rounded border border-stone-800">
            <span className="text-stone-500 block text-[10px] uppercase font-sans">PFC Treasury</span>
            <span className="font-bold text-amber-400">${playerPfc?.treasury.toLocaleString()}</span>
          </div>
          <div className="bg-stone-950 px-3 py-1.5 rounded border border-stone-800">
            <span className="text-stone-500 block text-[10px] uppercase font-sans">Squad Size</span>
            <span className="font-bold text-stone-200">{activeRoster.length} Athletes</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Roster List & Athlete Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. Squad Table */}
        <div className="lg:col-span-2 bg-stone-900 border border-stone-800 rounded-lg p-4 flex flex-col gap-3 shadow-xl">
          <h3 className="text-xs font-bold text-stone-300 uppercase tracking-wide border-b border-stone-800 pb-2">
            First-String Lineup (No Helmets · Shoulder-First Tradition)
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-800 text-[11px] text-stone-500 font-medium">
                  <th className="py-2 px-3">#</th>
                  <th className="py-2 px-3">Name</th>
                  <th className="py-2 px-3">Pos</th>
                  <th className="py-2 px-3">Age</th>
                  <th className="py-2 px-3">Speed</th>
                  <th className="py-2 px-3">Strength</th>
                  <th className="py-2 px-3">Skill</th>
                  <th className="py-2 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60 font-mono">
                {activeRoster.map((ath) => {
                  const isSelected = ath.id === selectedAthlete?.id;
                  const skillRating =
                    ath.position === 'QB'
                      ? ath.passAcc
                      : ath.position === 'RB' || ath.position === 'WR1' || ath.position === 'WR2' || ath.position === 'TE'
                      ? ath.catching
                      : ath.tackling;

                  return (
                    <tr
                      key={ath.id}
                      onClick={() => {
                        soundEngine.playClick();
                        setSelectedAthleteId(ath.id);
                      }}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-amber-950/40 text-amber-200'
                          : 'hover:bg-stone-800/40 text-stone-300'
                      }`}
                    >
                      <td className="py-2 px-3 font-bold">{ath.number}</td>
                      <td className="py-2 px-3 font-sans font-semibold text-stone-100 flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: ath.skinTone }}
                        />
                        <span>{ath.name}</span>
                        {ath.isCaptain && <span className="text-[10px] text-amber-400 font-mono font-bold">★ (C)</span>}
                      </td>
                      <td className="py-2 px-3">
                        <span className="px-1.5 py-0.5 rounded bg-stone-950 text-stone-300 text-[10px]">
                          {ath.position}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-stone-400">{ath.age}</td>
                      <td className="py-2 px-3 text-amber-400">{ath.speed}</td>
                      <td className="py-2 px-3 text-stone-300">{ath.strength}</td>
                      <td className="py-2 px-3 text-cyan-400">{skillRating}</td>
                      <td className="py-2 px-3">
                        {ath.condition === 'HEALTHY' ? (
                          <span className="text-emerald-400 flex items-center gap-1 text-[11px] font-sans">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Fit
                          </span>
                        ) : (
                          <span className="text-red-400 flex items-center gap-1 text-[11px] font-sans">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            {ath.condition}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. Athlete Detail & Training Camp */}
        <div className="bg-stone-900 border border-stone-800 rounded-lg p-5 flex flex-col justify-between gap-5 shadow-xl">
          {selectedAthlete ? (
            <div className="flex flex-col gap-4">
              <div className="border-b border-stone-800 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-stone-500 uppercase">
                    Athlete Scouting Card
                  </span>
                  <h4 className="text-lg font-bold font-display text-stone-100 tracking-wide mt-0.5">
                    #{selectedAthlete.number} {selectedAthlete.name}
                  </h4>
                  <p className="text-xs text-stone-400">
                    {selectedAthlete.position} · {selectedAthlete.age} years old · {selectedAthlete.countyOriginName}
                  </p>
                </div>
                <div
                  className="w-9 h-9 rounded-md border border-stone-700 flex items-center justify-center font-display font-extrabold text-sm"
                  style={{ backgroundColor: currentCounty.homeColor, color: '#fff' }}
                >
                  {selectedAthlete.number}
                </div>
              </div>

              {/* Attributes Radar Bars */}
              <div className="flex flex-col gap-2.5 text-xs font-mono">
                <div>
                  <div className="flex justify-between text-stone-400 mb-1">
                    <span className="font-sans">Speed & Burst</span>
                    <span className="text-amber-400">{selectedAthlete.speed} / 99</span>
                  </div>
                  <div className="w-full bg-stone-950 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${selectedAthlete.speed}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-stone-400 mb-1">
                    <span className="font-sans">Strength & Blocking</span>
                    <span className="text-cyan-400">{selectedAthlete.strength} / 99</span>
                  </div>
                  <div className="w-full bg-stone-950 h-2 rounded-full overflow-hidden">
                    <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${selectedAthlete.strength}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-stone-400 mb-1">
                    <span className="font-sans">Tackling Impact</span>
                    <span className="text-stone-200">{selectedAthlete.tackling} / 99</span>
                  </div>
                  <div className="w-full bg-stone-950 h-2 rounded-full overflow-hidden">
                    <div className="bg-stone-300 h-full rounded-full" style={{ width: `${selectedAthlete.tackling}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-stone-400 mb-1">
                    <span className="font-sans">Catching / Hands</span>
                    <span className="text-emerald-400">{selectedAthlete.catching} / 99</span>
                  </div>
                  <div className="w-full bg-stone-950 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${selectedAthlete.catching}%` }} />
                  </div>
                </div>
              </div>

              {/* Training Camp Drills */}
              <div className="border-t border-stone-800 pt-3 flex flex-col gap-2">
                <span className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
                  <Dumbbell className="w-3.5 h-3.5 text-amber-500" />
                  PFC Athletic Drills ($3,000 per session)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleTrain('speed')}
                    className="py-1.5 px-2 bg-stone-950 border border-stone-800 hover:border-amber-600 rounded text-[11px] font-semibold text-stone-300 hover:text-white transition-colors cursor-pointer"
                  >
                    +2 Speed Drill
                  </button>
                  <button
                    onClick={() => handleTrain('strength')}
                    className="py-1.5 px-2 bg-stone-950 border border-stone-800 hover:border-cyan-600 rounded text-[11px] font-semibold text-stone-300 hover:text-white transition-colors cursor-pointer"
                  >
                    +2 Sled Push
                  </button>
                  <button
                    onClick={() => handleTrain('tackling')}
                    className="py-1.5 px-2 bg-stone-950 border border-stone-800 hover:border-stone-500 rounded text-[11px] font-semibold text-stone-300 hover:text-white transition-colors cursor-pointer"
                  >
                    +2 Form Tackle
                  </button>
                  <button
                    onClick={() => handleTrain('catching')}
                    className="py-1.5 px-2 bg-stone-950 border border-stone-800 hover:border-emerald-600 rounded text-[11px] font-semibold text-stone-300 hover:text-white transition-colors cursor-pointer"
                  >
                    +2 Catch Drill
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-xs text-stone-500 text-center py-12">
              Select an athlete to inspect attributes and assign training.
            </div>
          )}
        </div>
      </div>

      {/* 3. Local Demographic Recruitment Pool */}
      <div className="bg-stone-900 border border-stone-800 rounded-lg p-5 flex flex-col gap-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div>
            <h3 className="text-sm font-bold font-display uppercase tracking-wider text-stone-100 flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              County Free Agency & Municipal Recruitment Pool
            </h3>
            <p className="text-xs text-stone-400">
              Scouted athletes residing in {currentCounty.name}. Signing fee: $5,000 from PFC Treasury.
            </p>
          </div>
          <button
            onClick={() => {
              soundEngine.playClick();
              setScoutedProspects([
                generateAthlete(currentCounty, 'RB'),
                generateAthlete(currentCounty, 'WR1'),
                generateAthlete(currentCounty, 'DL'),
              ]);
            }}
            className="text-xs text-amber-400 hover:text-amber-300 underline font-medium cursor-pointer"
          >
            Re-Scout County Pool
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {scoutedProspects.map((prospect) => (
            <div
              key={prospect.id}
              className="bg-stone-950 border border-stone-800 p-3.5 rounded flex flex-col justify-between gap-3"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-sans text-stone-100">{prospect.name}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-900 text-stone-300">
                    {prospect.position}
                  </span>
                </div>
                <div className="text-[11px] text-stone-500 mt-0.5">
                  Age {prospect.age} · Native of {prospect.countyOriginName}
                </div>
                <div className="grid grid-cols-3 gap-1 mt-2 font-mono text-[11px]">
                  <span className="text-stone-400">SPD: <strong className="text-amber-400">{prospect.speed}</strong></span>
                  <span className="text-stone-400">STR: <strong className="text-cyan-400">{prospect.strength}</strong></span>
                  <span className="text-stone-400">STA: <strong className="text-stone-300">{prospect.stamina}</strong></span>
                </div>
              </div>

              <button
                onClick={() => handleSignProspect(prospect)}
                className="w-full py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded text-xs transition-colors cursor-pointer"
              >
                Sign Prospect ($5,000)
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
