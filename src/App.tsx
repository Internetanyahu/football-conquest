/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GameState, County } from './types/game';
import { loadGameState, executeAnnexation, executeDefeat, getEligibleNeighborTargets } from './systems/conquestSystem';
import { FootballMatchCanvas } from './components/FootballMatchCanvas';
import { RetroBowlMatch } from './components/RetroBowlMatch';
import { WorldMap } from './components/WorldMap';
import { CampaignBriefing } from './components/CampaignBriefing';
import { RosterView } from './components/RosterView';
import { PfcCareer } from './components/PfcCareer';
import { PoliticsView } from './components/PoliticsView';
import { OnlineLeagueView } from './components/OnlineLeagueView';
import { HistoryView } from './components/HistoryView';
import { GddReaderModal } from './components/GddReaderModal';
import { TopNav, ActiveTab } from './components/TopNav';
import { soundEngine } from './audio/soundEngine';
import { Trophy, Swords, Map, Users, Briefcase, Landmark } from 'lucide-react';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(() => loadGameState());
  const [activeTab, setActiveTab] = useState<ActiveTab>('MAP');
  const [isMuted, setIsMuted] = useState(soundEngine.getMuted());
  const [isGddOpen, setIsGddOpen] = useState(false);

  const [activeMatch, setActiveMatch] = useState<{ homeCounty: County; awayCounty: County } | null>(null);
  const [matchProvider, setMatchProvider] = useState<'RETRO_BOWL' | 'BUILT_IN'>('BUILT_IN');
  const [lastMatchNotice, setLastMatchNotice] = useState<string | null>(null);

  const playerCoach = gameState.coaches[gameState.playerCoachId];
  const playerCurrentCounty = gameState.counties[playerCoach?.currentCountyId || 'C_BER'];

  const handleQuickChallenge = () => {
    if (activeMatch) {
      setActiveTab('MATCH');
      return;
    }
    if (!playerCurrentCounty) return;
    const eligible = getEligibleNeighborTargets(playerCurrentCounty.id, gameState);
    if (eligible.length > 0) startMatch(eligible[0].id);
    else setActiveTab('MAP');
  };

  const startMatch = (targetCountyId: string) => {
    const target = gameState.counties[targetCountyId];
    if (!target || !playerCurrentCounty) return;
    setActiveMatch({ homeCounty: playerCurrentCounty, awayCounty: target });
    setMatchProvider('BUILT_IN');
    setActiveTab('MATCH');
    setLastMatchNotice(null);
  };

  const handleMatchComplete = (result: {
    homeScore: number;
    awayScore: number;
    winnerCountyId: string;
    loserCountyId: string;
    statsText: string;
  }) => {
    if (!activeMatch) return;
    const scoresValid = Number.isInteger(result.homeScore) && Number.isInteger(result.awayScore) && result.homeScore >= 0 && result.awayScore >= 0;
    if (!scoresValid || result.homeScore === result.awayScore) {
      setLastMatchNotice('A tied or invalid score cannot resolve a county challenge. Complete a valid overtime result.');
      return;
    }
    const expectedWinnerId = result.homeScore > result.awayScore ? activeMatch.homeCounty.id : activeMatch.awayCounty.id;
    if (result.winnerCountyId !== expectedWinnerId) {
      setLastMatchNotice('The reported winner does not match the final score. No territorial change was made.');
      return;
    }

    const isHomeWinner = result.winnerCountyId === activeMatch.homeCounty.id;
    const updated = isHomeWinner
      ? executeAnnexation(activeMatch.homeCounty.id, activeMatch.awayCounty.id, gameState, `${result.homeScore} - ${result.awayScore}`, result.statsText)
      : executeDefeat(activeMatch.homeCounty.id, activeMatch.awayCounty.id, gameState, `${result.homeScore} - ${result.awayScore}`, result.statsText);

    setLastMatchNotice(isHomeWinner
      ? `VICTORY! ${activeMatch.awayCounty.name} was successfully annexed into ${activeMatch.homeCounty.stateName}!`
      : `DEFEAT. Score ${result.homeScore} - ${result.awayScore}. Coach relocated to nearest frontier border.`);
    setGameState(updated);
    setActiveMatch(null);
    setActiveTab('MAP');
  };

  const handleToggleMute = () => setIsMuted(soundEngine.toggleMute());

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
      <TopNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onQuickChallenge={handleQuickChallenge}
        isMatchActive={!!activeMatch}
        onOpenGdd={() => setIsGddOpen(true)}
      />

      {lastMatchNotice && (
        <div className="bg-amber-950/70 border-b border-amber-600/50 px-6 py-2.5 text-xs text-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-medium">{lastMatchNotice}</span>
          </div>
          <button onClick={() => setLastMatchNotice(null)} className="text-stone-400 hover:text-stone-100 font-bold ml-4 cursor-pointer">✕</button>
        </div>
      )}

      <main className="flex-1 w-full pb-16 md:pb-6">
        {activeTab === 'MATCH' && (
          <div className="p-4 flex flex-col items-center">
            {activeMatch ? (
              matchProvider === 'RETRO_BOWL' ? (
                <RetroBowlMatch
                  homeCounty={activeMatch.homeCounty}
                  awayCounty={activeMatch.awayCounty}
                  onMatchComplete={handleMatchComplete}
                  onExitMatch={() => { setActiveMatch(null); setActiveTab('MAP'); }}
                  onUseBuiltIn={() => setMatchProvider('BUILT_IN')}
                />
              ) : (
                <FootballMatchCanvas
                  homeCounty={activeMatch.homeCounty}
                  awayCounty={activeMatch.awayCounty}
                  homeRoster={gameState.rosters[activeMatch.homeCounty.id] || []}
                  awayRoster={gameState.rosters[activeMatch.awayCounty.id] || []}
                  onMatchComplete={handleMatchComplete}
                  onUseRetroBowl={() => setMatchProvider('RETRO_BOWL')}
                  onExitMatch={() => { setActiveMatch(null); setActiveTab('MAP'); }}
                />
              )
            ) : (
              <div className="w-full max-w-xl bg-stone-900 border border-stone-800 p-8 rounded-lg text-center flex flex-col items-center gap-4 my-12 shadow-2xl">
                <Swords className="w-12 h-12 text-amber-500" />
                <h3 className="text-xl font-bold font-display text-white">No Match Currently Active</h3>
                <p className="text-xs text-stone-400 max-w-md">Station your coach on the territorial frontier and challenge an adjacent enemy county on the World Map to annex their land.</p>
                <button onClick={() => setActiveTab('MAP')} className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded text-xs uppercase tracking-wider transition-colors cursor-pointer">Go to World Map</button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'MAP' && (
          <>
            <CampaignBriefing gameState={gameState} onChallenge={startMatch} />
            <WorldMap gameState={gameState} onInitiateMatch={startMatch} selectedCountyId={playerCoach?.currentCountyId} />
          </>
        )}

        {activeTab === 'ROSTER' && <RosterView gameState={gameState} onUpdateState={setGameState} />}
        {activeTab === 'PFC' && <PfcCareer gameState={gameState} onUpdateState={setGameState} />}
        {activeTab === 'POLITICS' && <PoliticsView gameState={gameState} />}
        {activeTab === 'ONLINE' && <OnlineLeagueView gameState={gameState} />}
        {activeTab === 'HISTORY' && <HistoryView gameState={gameState} onUpdateState={setGameState} onOpenGdd={() => setIsGddOpen(true)} />}
      </main>

      <GddReaderModal isOpen={isGddOpen} onClose={() => setIsGddOpen(false)} />

      <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-stone-950/95 backdrop-blur border-t border-stone-800 flex items-center justify-around py-2 px-1 z-40 text-[10px]">
        <button onClick={() => { soundEngine.playClick(); setActiveTab('MAP'); }} className={`flex flex-col items-center gap-1 ${activeTab === 'MAP' ? 'text-amber-400 font-bold' : 'text-stone-400'}`}>
          <Map className="w-4 h-4" /><span>Map</span>
        </button>
        <button onClick={() => { soundEngine.playClick(); activeMatch ? setActiveTab('MATCH') : handleQuickChallenge(); }} className={`flex flex-col items-center gap-1 ${activeTab === 'MATCH' ? 'text-amber-400 font-bold' : 'text-stone-400'}`}>
          <Swords className="w-4 h-4" /><span>Match</span>
        </button>
        <button onClick={() => { soundEngine.playClick(); setActiveTab('ROSTER'); }} className={`flex flex-col items-center gap-1 ${activeTab === 'ROSTER' ? 'text-amber-400 font-bold' : 'text-stone-400'}`}>
          <Users className="w-4 h-4" /><span>Roster</span>
        </button>
        <button onClick={() => { soundEngine.playClick(); setActiveTab('PFC'); }} className={`flex flex-col items-center gap-1 ${activeTab === 'PFC' ? 'text-amber-400 font-bold' : 'text-stone-400'}`}>
          <Briefcase className="w-4 h-4" /><span>PFC</span>
        </button>
        <button onClick={() => { soundEngine.playClick(); setActiveTab('POLITICS'); }} className={`flex flex-col items-center gap-1 ${activeTab === 'POLITICS' ? 'text-amber-400 font-bold' : 'text-stone-400'}`}>
          <Landmark className="w-4 h-4" /><span>Politics</span>
        </button>
      </footer>
    </div>
  );
}
