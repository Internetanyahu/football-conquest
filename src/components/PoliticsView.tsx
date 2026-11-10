import React, { useState } from 'react';
import { GameState } from '../types/game';
import { Landmark, ShieldAlert, Trophy } from 'lucide-react';

interface PoliticsViewProps {
  gameState: GameState;
  onUpdateState: (newState: GameState) => void;
  onLaunchStateBowl: (opponentStateId: string) => void;
}

export const PoliticsView: React.FC<PoliticsViewProps> = ({ gameState }) => {
  const playerCoach = gameState.coaches[gameState.playerCoachId];
  const currentCounty = gameState.counties[playerCoach?.currentCountyId || 'C_BER'];
  const playerState = gameState.states[currentCounty?.stateId || 'ST_NE'];
  const [selectedStateId, setSelectedStateId] = useState<string>(playerState?.id || 'ST_NE');
  const selectedState = gameState.states[selectedStateId] || playerState;

  return (
    <div className="w-full max-w-6xl mx-auto p-4 flex flex-col gap-5">
      <header className="bg-stone-900 border border-stone-800 rounded-lg p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Landmark className="w-8 h-8 text-amber-400" />
          <div>
            <div className="text-[10px] uppercase tracking-wider font-mono text-stone-500">Sovereign state administration</div>
            <h2 className="text-xl font-bold text-stone-100">States & Governors</h2>
            <p className="text-xs text-stone-400">NPC-led governments and state institutions.</p>
          </div>
        </div>
        <select
          value={selectedState.id}
          onChange={(event) => setSelectedStateId(event.target.value)}
          className="bg-stone-950 border border-stone-700 text-xs text-stone-200 rounded px-3 py-2 max-w-full"
        >
          {Object.values(gameState.states).map((state) => (
            <option key={state.id} value={state.id}>{state.name}</option>
          ))}
        </select>
      </header>

      <section className="bg-stone-900 border border-stone-800 rounded-lg p-5 flex flex-col gap-4">
        <div className="flex items-center gap-3 border-b border-stone-800 pb-4">
          <span className="w-4 h-10 rounded-sm" style={{ backgroundColor: selectedState.color }} />
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-wider font-mono text-stone-500">{selectedState.name}</div>
            <h3 className="text-lg font-bold text-stone-100">{selectedState.governorTitle} {selectedState.governorName}</h3>
            <p className="text-xs text-stone-400 italic">“{selectedState.stateMotto}”</p>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-stone-300">{selectedState.governorBio}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-stone-950 rounded p-3">
            <div className="text-[10px] text-stone-500 uppercase">Counties</div>
            <div className="text-lg font-mono font-bold text-stone-100">{selectedState.totalCountiesOwned}</div>
          </div>
          <div className="bg-stone-950 rounded p-3">
            <div className="text-[10px] text-stone-500 uppercase">Population</div>
            <div className="text-lg font-mono font-bold text-stone-100">{Object.values(gameState.counties).filter((county) => county.stateId === selectedState.id).reduce((total, county) => total + county.population, 0).toLocaleString()}</div>
          </div>
          <div className="bg-stone-950 rounded p-3">
            <div className="text-[10px] text-stone-500 uppercase">Tax rate</div>
            <div className="text-lg font-mono font-bold text-stone-100">{selectedState.taxRatePercent}%</div>
          </div>
          <div className="bg-stone-950 rounded p-3">
            <div className="text-[10px] text-stone-500 uppercase">Weekly football subsidy</div>
            <div className="text-lg font-mono font-bold text-amber-300">${selectedState.footballSubsidyWeekly.toLocaleString()}</div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-stone-900 border border-stone-800 rounded-lg p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-stone-100">Political authority</h3>
          </div>
          <ul className="list-disc pl-5 space-y-2 text-xs text-stone-400">
            <li>The governor directs state laws and administration.</li>
            <li>The governor appoints municipal mayors.</li>
            <li>The governor selects successful coaches for state teams.</li>
            <li>Most governors remain NPCs. Player governorship is an advanced appointment, not an automatic reward for reaching a win threshold.</li>
          </ul>
          <p className="text-[10px] text-stone-500 border-t border-stone-800 pt-3">Political appointments and enforceable state laws are not implemented yet. No fake election or policy action is presented as functional.</p>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-lg p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-stone-100">State football</h3>
          </div>
          <p className="text-xs leading-relaxed text-stone-400">State games are a separate, manager-focused competition with roster selection and customization. They do not annex counties. This is distinct from the short, playable county border matches.</p>
          <div className="mt-auto rounded border border-stone-800 bg-stone-950 p-3 text-xs text-stone-400">
            State-team management and championship fixtures are planned for the GDD's Politics & State Football milestone. They are not yet playable.
          </div>
        </div>
      </section>
    </div>
  );
};
