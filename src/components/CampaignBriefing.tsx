import React, { useMemo } from 'react';
import { GameState } from '../types/game';
import { getEligibleNeighborTargets } from '../systems/conquestSystem';
import { ArrowUpRight, Banknote, Flag, MapPinned, Shield, Swords, Trophy } from 'lucide-react';

interface CampaignBriefingProps {
  gameState: GameState;
  onChallenge: (countyId: string) => void;
}

export const CampaignBriefing: React.FC<CampaignBriefingProps> = ({ gameState, onChallenge }) => {
  const coach = gameState.coaches[gameState.playerCoachId];
  const currentCounty = gameState.counties[coach?.currentCountyId || ''];
  const pfc = gameState.pfcs[gameState.playerPfcId];
  const ownedCounties = useMemo(
    () => Object.values(gameState.counties).filter((county) => county.stateId === currentCounty?.stateId),
    [gameState.counties, currentCounty?.stateId]
  );
  const targets = useMemo(
    () => currentCounty ? getEligibleNeighborTargets(currentCounty.id, gameState)
      .sort((a, b) => b.footballTalent - a.footballTalent) : [],
    [currentCounty, gameState]
  );
  const recentMatch = gameState.matchHistory?.[0];

  if (!coach || !currentCounty || !pfc) return null;

  const stats = [
    { label: 'State territory', value: ownedCounties.length.toString(), detail: currentCounty.stateName, icon: Flag },
    { label: 'Coach record', value: `${coach.wins}–${coach.losses}`, detail: `${coach.annexationsCount} annexations`, icon: Trophy },
    { label: 'PFC treasury', value: `$${pfc.treasury.toLocaleString()}`, detail: pfc.name, icon: Banknote },
    { label: 'Frontier targets', value: targets.length.toString(), detail: 'Eligible neighboring counties', icon: Swords },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 pt-4 pb-1" aria-label="Campaign briefing">
      <div className="rounded-lg border border-stone-800 bg-stone-900 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-stone-800">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4 text-amber-400" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-[0.18em] text-stone-500 font-mono">Campaign headquarters · Season {gameState.currentSeason} · Week {gameState.currentWeek}</div>
              <h1 className="text-base sm:text-lg font-bold text-stone-100 truncate">{currentCounty.name} <span className="text-stone-500 font-normal">/ {currentCounty.stateName}</span></h1>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider text-stone-500">Head coach</div>
            <div className="text-xs font-semibold text-stone-200">{coach.name}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x-0 lg:divide-x divide-y lg:divide-y-0 divide-stone-800">
          {stats.map(({ label, value, detail, icon: Icon }) => (
            <div key={label} className="px-4 py-3 flex items-center gap-3 min-w-0">
              <Icon className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-wider text-stone-500">{label}</div>
                <div className="text-lg leading-tight font-bold font-mono text-stone-100">{value}</div>
                <div className="text-[10px] text-stone-500 truncate">{detail}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-stone-800 px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <MapPinned className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-stone-200">Next border challenges</span>
          </div>
          {targets.length ? (
            <div className="flex flex-wrap gap-2 flex-1">
              {targets.slice(0, 4).map((target) => (
                <button
                  key={target.id}
                  onClick={() => onChallenge(target.id)}
                  className="group inline-flex items-center gap-2 rounded border border-stone-700 bg-stone-950 px-3 py-2 text-left hover:border-emerald-600 hover:bg-emerald-950/30 transition-colors"
                >
                  <span className="min-w-0">
                    <span className="block text-[11px] font-semibold text-stone-200 group-hover:text-white">{target.name}</span>
                    <span className="block text-[10px] text-stone-500">{target.stateName} · Talent {target.footballTalent}</span>
                  </span>
                  <ArrowUpRight className="w-3 h-3 text-stone-500 group-hover:text-emerald-400 shrink-0" />
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-stone-500 flex-1">No eligible neighboring counties from this station. The map shows your current territory and its borders.</p>
          )}
          {recentMatch && (
            <div className="sm:ml-auto text-[10px] text-stone-500 sm:text-right">
              Last result: <span className="text-stone-300">{recentMatch.score}</span> · {recentMatch.winnerCountyName}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
