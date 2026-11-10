/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GameState } from '../types/game';
import { soundEngine } from '../audio/soundEngine';
import { Globe, Trophy, Swords, Shield, Radio } from 'lucide-react';

interface OnlineLeagueViewProps {
  gameState: GameState;
  onChallengeOnlinePlayer: (targetCountyId: string) => void;
}

interface OnlineCompetitor {
  id: string;
  coachName: string;
  pfcName: string;
  countyName: string;
  countyId: string;
  stateName: string;
  wins: number;
  losses: number;
  rating: number;
  status: 'ONLINE' | 'IN_MATCH' | 'CHALLENGE_READY';
}

const MOCK_ONLINE_LEADERS: OnlineCompetitor[] = [
  {
    id: 'COMP_1',
    coachName: 'Coach Henrik Van Bramer',
    pfcName: 'Hudson Tactics Corp',
    countyName: 'New Amsterdam (Manhattan)',
    countyId: 'C_NYK',
    stateName: 'Hudson Federation',
    wins: 14,
    losses: 2,
    rating: 1840,
    status: 'CHALLENGE_READY',
  },
  {
    id: 'COMP_2',
    coachName: 'Coach Tenzin Tallchief',
    pfcName: 'Frontier Athletic Guild',
    countyName: 'Appalachian Highlands',
    countyId: 'C_APP',
    stateName: 'Cherokee & Creek Highlands',
    wins: 12,
    losses: 3,
    rating: 1780,
    status: 'CHALLENGE_READY',
  },
  {
    id: 'COMP_3',
    coachName: 'Coach Jacques Toussaint Jr.',
    pfcName: 'Antilles Maritime Sports',
    countyName: 'Havana Port',
    countyId: 'C_HAV',
    stateName: 'Floridas & Antilles',
    wins: 11,
    losses: 4,
    rating: 1720,
    status: 'IN_MATCH',
  },
  {
    id: 'COMP_4',
    coachName: 'Coach Sterling MacLeod',
    pfcName: 'Lone Star Football Co.',
    countyName: 'Trinity Fork (Dallas)',
    countyId: 'C_TRN',
    stateName: 'Lone Star Republic',
    wins: 10,
    losses: 5,
    rating: 1650,
    status: 'CHALLENGE_READY',
  },
];

export const OnlineLeagueView: React.FC<OnlineLeagueViewProps> = ({
  gameState,
  onChallengeOnlinePlayer,
}) => {
  const [onlineTab, setOnlineTab] = useState<'STANDINGS' | 'CHALLENGES' | 'SEASON_RULES'>('STANDINGS');

  const playerCoach = gameState.coaches[gameState.playerCoachId];
  const playerPfc = gameState.pfcs[gameState.playerPfcId];

  // Sovereign state power ranking sorted by total counties owned
  const sortedStates = Object.values(gameState.states).sort(
    (a, b) => b.totalCountiesOwned - a.totalCountiesOwned
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-4 flex flex-col gap-6">
      {/* 1. Online World Banner */}
      <div className="bg-stone-900 border border-stone-800 rounded-lg p-5 flex flex-wrap items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-3">
          <Globe className="w-8 h-8 text-cyan-400" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
                Persistent Territorial Network
              </span>
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-mono border border-emerald-800/60">
                <Radio className="w-3 h-3 animate-pulse" />
                ONLINE WORLD · SEASON 1
              </span>
            </div>
            <h2 className="text-2xl font-bold font-display text-stone-100 tracking-wide mt-0.5">
              Continental League & Global Standings
            </h2>
            <p className="text-xs text-stone-400">
              Fragmented border frontiers, player-driven conquests, and authoritative match validation.
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 bg-stone-950 p-1 rounded-md border border-stone-800 text-xs">
          <button
            onClick={() => {
              soundEngine.playClick();
              setOnlineTab('STANDINGS');
            }}
            className={`px-3 py-1.5 rounded font-medium transition-colors cursor-pointer ${
              onlineTab === 'STANDINGS' ? 'bg-stone-800 text-white' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Sovereign Standings
          </button>
          <button
            onClick={() => {
              soundEngine.playClick();
              setOnlineTab('CHALLENGES');
            }}
            className={`px-3 py-1.5 rounded font-medium transition-colors cursor-pointer ${
              onlineTab === 'CHALLENGES' ? 'bg-stone-800 text-white' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Multiplayer Matchmaking
          </button>
          <button
            onClick={() => {
              soundEngine.playClick();
              setOnlineTab('SEASON_RULES');
            }}
            className={`px-3 py-1.5 rounded font-medium transition-colors cursor-pointer ${
              onlineTab === 'SEASON_RULES' ? 'bg-stone-800 text-white' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Seasonal Architecture
          </button>
        </div>
      </div>

      {/* 2. Tab Contents */}
      {onlineTab === 'STANDINGS' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sovereign States Standings (Left 2 Cols) */}
          <div className="lg:col-span-2 bg-stone-900 border border-stone-800 rounded-lg p-5 flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold font-display uppercase tracking-wider text-stone-100">
                  Continental Sovereignty Table
                </h3>
              </div>
              <span className="text-[11px] text-stone-500 font-mono">Ranked by Territorial Control</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-800 text-[11px] text-stone-500">
                    <th className="py-2 px-3">Rank</th>
                    <th className="py-2 px-3">Sovereign State</th>
                    <th className="py-2 px-3">Region</th>
                    <th className="py-2 px-3">Counties Owned</th>
                    <th className="py-2 px-3">Weekly Subsidy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60 font-mono">
                  {sortedStates.map((st, idx) => (
                    <tr key={st.id} className="hover:bg-stone-800/40 text-stone-300">
                      <td className="py-2.5 px-3 font-bold text-stone-500">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-sans font-semibold text-stone-100 flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-sm shrink-0 border border-white/20"
                          style={{ backgroundColor: st.color }}
                        />
                        <span>{st.name}</span>
                      </td>
                      <td className="py-2.5 px-3 text-stone-400 font-sans">{st.region}</td>
                      <td className="py-2.5 px-3 text-amber-400 font-bold">{st.totalCountiesOwned}</td>
                      <td className="py-2.5 px-3 text-emerald-400">${st.footballSubsidyWeekly.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Player Online Profile (Right Col) */}
          <div className="bg-stone-900 border border-stone-800 rounded-lg p-5 flex flex-col gap-4 shadow-xl">
            <div className="flex items-center gap-2 border-b border-stone-800 pb-3">
              <Shield className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold font-display uppercase tracking-wider text-stone-100">
                Your Online Identity
              </h3>
            </div>

            <div className="bg-stone-950 border border-stone-800 p-4 rounded flex flex-col gap-3 text-xs">
              <div>
                <span className="text-[10px] text-stone-500 font-mono uppercase">Coach License</span>
                <span className="font-bold text-stone-100 text-sm block">{playerCoach?.name}</span>
                <span className="text-[11px] text-stone-400">{playerPfc?.name}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono pt-2 border-t border-stone-800">
                <div>
                  <span className="text-[10px] text-stone-500 font-sans">Online Rating</span>
                  <span className="text-amber-400 font-bold block text-sm">1,500 ELO</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 font-sans">Territorial Annexations</span>
                  <span className="text-emerald-400 font-bold block text-sm">
                    {playerCoach?.annexationsCount}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-stone-950/70 border border-stone-800/80 p-3.5 rounded text-[11px] text-stone-400 leading-relaxed">
              Every match result in the Online World is cryptographically validated. Winning county challenges claims immediate territorial dominion over the contested grid.
            </div>
          </div>
        </div>
      )}

      {onlineTab === 'CHALLENGES' && (
        <div className="bg-stone-900 border border-stone-800 rounded-lg p-5 flex flex-col gap-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div className="flex items-center gap-2">
              <Swords className="w-4 h-4 text-red-500" />
              <h3 className="text-sm font-bold font-display uppercase tracking-wider text-stone-100">
                Live Online Rivals & Frontier Challenges
              </h3>
            </div>
            <span className="text-xs text-emerald-400 font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              3 Competitors Ready
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_ONLINE_LEADERS.map((rival) => (
              <div
                key={rival.id}
                className="bg-stone-950 border border-stone-800 p-4 rounded flex flex-col justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-100 text-sm">{rival.coachName}</span>
                    <span className="font-mono text-amber-400 text-xs font-bold">{rival.rating} ELO</span>
                  </div>
                  <span className="text-[11px] text-stone-400 block mt-0.5">
                    {rival.pfcName} · Defending {rival.countyName} ({rival.stateName})
                  </span>
                  <div className="text-[11px] font-mono text-stone-500 mt-2">
                    Record: {rival.wins}W — {rival.losses}L
                  </div>
                </div>

                <button
                  onClick={() => {
                    soundEngine.playWhistle();
                    onChallengeOnlinePlayer(rival.countyId);
                  }}
                  disabled={rival.status !== 'CHALLENGE_READY'}
                  className="w-full py-2 bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white font-bold rounded text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Swords className="w-3.5 h-3.5" />
                  <span>{rival.status === 'CHALLENGE_READY' ? 'Challenge to Match' : 'In Match...'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {onlineTab === 'SEASON_RULES' && (
        <div className="bg-stone-900 border border-stone-800 rounded-lg p-5 flex flex-col gap-4 shadow-xl text-xs text-stone-300">
          <h3 className="text-sm font-bold font-display uppercase tracking-wider text-stone-100 border-b border-stone-800 pb-3">
            Online World Reset & Permanence Specification
          </h3>
          <p className="leading-relaxed">
            As outlined in Master Specification Section 10: The Online World resets periodically to allow dynamic territorial competition and shifting alliances:
          </p>
          <ul className="list-disc pl-5 flex flex-col gap-2 text-stone-400">
            <li>
              <strong className="text-stone-200">Reset on Season Conclusion:</strong> Territorial county ownership and temporary gubernatorial offices reset to baseline balkanized borders.
            </li>
            <li>
              <strong className="text-stone-200">Preserved Across Seasons:</strong> Player account, coach career win/loss records, PFC ownership, accumulated funds, cosmetics, and trophy cabinets.
            </li>
            <li>
              <strong className="text-stone-200">Authoritative Server Validation:</strong> All game match results, adjacency paths, and score validations are verified to prevent client tampering.
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
