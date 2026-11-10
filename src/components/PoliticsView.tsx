/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GameState, StateJurisdiction } from '../types/game';
import { soundEngine } from '../audio/soundEngine';
import { Landmark, Vote, Trophy, Crown, ScrollText } from 'lucide-react';

interface PoliticsViewProps {
  gameState: GameState;
  onUpdateState: (newState: GameState) => void;
  onLaunchStateBowl: (opponentStateId: string) => void;
}

export const PoliticsView: React.FC<PoliticsViewProps> = ({
  gameState,
  onUpdateState,
  onLaunchStateBowl,
}) => {
  const playerCoach = gameState.coaches[gameState.playerCoachId];
  const currentCounty = gameState.counties[playerCoach?.currentCountyId || 'C_BER'];
  const playerState = gameState.states[currentCounty?.stateId || 'ST_NE'];

  const [selectedStateId, setSelectedStateId] = useState<string>(playerState?.id || 'ST_NE');
  const selectedState = gameState.states[selectedStateId] || playerState;

  // Petition Governor for Policy Decree
  const handlePetitionPolicy = (policyName: string, grantReward: number) => {
    soundEngine.playTouchdown();
    const updatedState = { ...gameState };
    const pfc = updatedState.pfcs[gameState.playerPfcId];
    pfc.treasury += grantReward;
    if (playerCoach) {
      playerCoach.reputation = Math.min(100, playerCoach.reputation + 3);
    }
    onUpdateState(updatedState);
  };

  const isEligibleForStateBowl = (playerCoach?.annexationsCount || 0) >= 1;
  const isEligibleForGovernor = (playerCoach?.wins || 0) >= 6 && (playerCoach?.reputation || 0) >= 75;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 flex flex-col gap-6">
      {/* 1. Political System Header */}
      <div className="bg-stone-900 border border-stone-800 rounded-lg p-5 flex flex-wrap items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-3">
          <Landmark className="w-8 h-8 text-amber-500" />
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
              Decentralized Political Sovereignty & Statecraft
            </span>
            <h2 className="text-2xl font-bold font-display text-stone-100 tracking-wide mt-0.5">
              High Council of North American Governors
            </h2>
            <p className="text-xs text-stone-400">
              Autonomous sovereign states, gubernatorial decrees, and non-annexation State Championship Bowls.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedStateId}
            onChange={(e) => setSelectedStateId(e.target.value)}
            className="bg-stone-950 border border-stone-800 text-xs text-stone-200 py-1.5 px-3 rounded focus:outline-none focus:border-amber-600 font-medium"
          >
            {Object.values(gameState.states).map((st) => (
              <option key={st.id} value={st.id}>
                {st.name} ({st.totalCountiesOwned} Counties)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Governor Dossier & State Powers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Governor Profile & Decrees */}
        <div className="lg:col-span-2 bg-stone-900 border border-stone-800 rounded-lg p-5 flex flex-col gap-5 shadow-xl">
          <div className="border-b border-stone-800 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span
                className="w-4 h-4 rounded-sm border border-white/20"
                style={{ backgroundColor: selectedState.color }}
              />
              <div>
                <h3 className="text-lg font-bold font-display text-stone-100">
                  {selectedState.governorTitle} {selectedState.governorName}
                </h3>
                <span className="text-xs text-stone-400">
                  Ruler of {selectedState.name} · &quot;{selectedState.stateMotto}&quot;
                </span>
              </div>
            </div>
            <span className="font-mono text-xs text-amber-400 bg-stone-950 px-2.5 py-1 rounded border border-stone-800">
              Weekly Subsidy: ${selectedState.footballSubsidyWeekly.toLocaleString()}
            </span>
          </div>

          <p className="text-xs text-stone-300 leading-relaxed bg-stone-950 p-3 rounded border border-stone-800/80">
            {selectedState.governorBio}
          </p>

          {/* Legislative Petitions */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wide flex items-center gap-2">
              <ScrollText className="w-3.5 h-3.5 text-amber-400" />
              Gubernatorial Decrees & Grants (Coach Petitions)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-stone-950 border border-stone-800 p-3.5 rounded flex flex-col justify-between gap-2.5">
                <div>
                  <span className="font-bold text-stone-200 block">State Border Defense Athletic Grant</span>
                  <span className="text-[11px] text-stone-400">
                    Governor appropriates municipal tax revenue directly into your PFC treasury.
                  </span>
                </div>
                <button
                  onClick={() => handlePetitionPolicy('Border Defense Grant', 25000)}
                  className="py-1.5 bg-amber-700 hover:bg-amber-600 text-white font-bold rounded text-xs transition-colors cursor-pointer"
                >
                  Petition Grant ($25,000)
                </button>
              </div>

              <div className="bg-stone-950 border border-stone-800 p-3.5 rounded flex flex-col justify-between gap-2.5">
                <div>
                  <span className="font-bold text-stone-200 block">Flying Wedge Legal Immunity Act</span>
                  <span className="text-[11px] text-stone-400">
                    Codifies the historic wedge formation into sovereign statutory law without penalty.
                  </span>
                </div>
                <button
                  onClick={() => handlePetitionPolicy('Flying Wedge Act', 15000)}
                  className="py-1.5 bg-stone-800 hover:bg-stone-700 text-white font-bold rounded text-xs transition-colors cursor-pointer"
                >
                  Ratify Doctrine (+$15,000)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: State Championship Bowl & Governorship Path */}
        <div className="bg-stone-900 border border-stone-800 rounded-lg p-5 flex flex-col justify-between gap-5 shadow-xl">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-stone-800 pb-3">
              <Trophy className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold font-display uppercase tracking-wider text-stone-100">
                State Championship Bowl
              </h3>
            </div>
            <p className="text-xs text-stone-400 leading-normal">
              High-prestige exhibition matches between sovereign nations. State games do not annex territory, but award vast national glory and $50,000 prize purses.
            </p>

            {isEligibleForStateBowl ? (
              <div className="bg-stone-950 border border-amber-600/40 p-3 rounded flex flex-col gap-3">
                <div className="text-xs text-amber-300 font-medium">
                  ★ Invitation Received! The Governor has appointed your squad to represent {playerState.name} in the Continental Sovereign Bowl!
                </div>
                <button
                  onClick={() => onLaunchStateBowl('C_NYK')}
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded text-xs transition-colors cursor-pointer"
                >
                  Enter State Bowl vs Hudson Federation
                </button>
              </div>
            ) : (
              <div className="bg-stone-950 border border-stone-800 p-3 rounded text-xs text-stone-500">
                Locked. Annex at least 1 enemy county to prove coaching prowess to the Governor.
              </div>
            )}
          </div>

          {/* Rise into Politics */}
          <div className="border-t border-stone-800 pt-4 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-bold text-stone-200 uppercase tracking-wide">
                Campaign for Governorship
              </h4>
            </div>
            <p className="text-[11px] text-stone-400">
              Coaches with at least 6 wins and 75 reputation may run for Lord Governor in the next Sovereign Assembly election.
            </p>
            {isEligibleForGovernor ? (
              <button
                onClick={() => {
                  soundEngine.playTouchdown();
                  alert(`Victory! ${playerCoach?.name} has been unanimously elected Governor of ${playerState.name}!`);
                }}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded text-xs transition-colors cursor-pointer"
              >
                Launch Gubernatorial Campaign
              </button>
            ) : (
              <div className="text-[10px] text-stone-500">
                Progress: {playerCoach?.wins}/6 Wins · {playerCoach?.reputation}/75 Reputation
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
