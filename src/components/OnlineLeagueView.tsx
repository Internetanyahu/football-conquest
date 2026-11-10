import React from 'react';
import { GameState } from '../types/game';
import { Globe, Trophy, ShieldAlert } from 'lucide-react';

interface OnlineLeagueViewProps {
  gameState: GameState;
  onChallengeOnlinePlayer: (targetCountyId: string) => void;
}

export const OnlineLeagueView: React.FC<OnlineLeagueViewProps> = ({ gameState }) => {
  const sortedStates = Object.values(gameState.states).sort(
    (a, b) => b.totalCountiesOwned - a.totalCountiesOwned
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-4 flex flex-col gap-5">
      <header className="bg-stone-900 border border-stone-800 rounded-lg p-5 flex items-center gap-3">
        <Globe className="w-8 h-8 text-stone-400" />
        <div>
          <div className="text-[10px] uppercase tracking-wider font-mono text-stone-500">Multiplayer development status</div>
          <h2 className="text-xl font-bold text-stone-100">Online League</h2>
          <p className="text-xs text-stone-400">Persistent shared-world play is not yet connected.</p>
        </div>
      </header>

      <section className="bg-amber-950/20 border border-amber-900/50 rounded-lg p-4 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed text-stone-300">
          <strong className="text-amber-300">Offline prototype.</strong> This GitHub Pages deployment has no player authentication, shared database, or authoritative multiplayer server. The standings below come only from this browser's local campaign save. No live competitors, ELO ratings, or online challenges are being reported.
        </div>
      </section>

      <section className="bg-stone-900 border border-stone-800 rounded-lg p-5 flex flex-col gap-3">
        <div className="flex items-center gap-2 border-b border-stone-800 pb-3">
          <Trophy className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-100">Local Sovereignty Standings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-800 text-stone-500">
                <th className="py-2 px-3">Rank</th>
                <th className="py-2 px-3">State</th>
                <th className="py-2 px-3">Region</th>
                <th className="py-2 px-3">Counties</th>
                <th className="py-2 px-3">Weekly subsidy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60">
              {sortedStates.map((state, index) => (
                <tr key={state.id} className="text-stone-300">
                  <td className="py-2.5 px-3 font-mono text-stone-500">{index + 1}</td>
                  <td className="py-2.5 px-3 font-semibold text-stone-100">
                    <span className="inline-block w-2.5 h-2.5 rounded-sm mr-2" style={{ backgroundColor: state.color }} />
                    {state.name}
                  </td>
                  <td className="py-2.5 px-3 text-stone-400">{state.region}</td>
                  <td className="py-2.5 px-3 font-mono text-amber-300">{state.totalCountiesOwned}</td>
                  <td className="py-2.5 px-3 font-mono text-stone-300">${state.footballSubsidyWeekly.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
