/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Volume2, VolumeX, Swords } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

export type ActiveTab = 'MATCH' | 'MAP' | 'ROSTER' | 'PFC' | 'POLITICS' | 'ONLINE' | 'HISTORY';

interface TopNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onQuickChallenge: () => void;
  isMatchActive: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  onSelectTab,
  isMuted,
  onToggleMute,
  onQuickChallenge,
  isMatchActive,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 bg-stone-950 border-b border-stone-800 shrink-0 select-none">
      {/* Zone 1: Brand Wordmark (Single text element in display face) */}
      <button
        onClick={() => {
          soundEngine.playClick();
          onSelectTab('MAP');
        }}
        className="text-xl font-bold font-display tracking-tight text-stone-100 hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer"
      >
        <span>Football Conquest</span>
      </button>

      {/* Zone 2: 4–5 clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-400">
        <button
          onClick={() => {
            soundEngine.playClick();
            onSelectTab('MATCH');
          }}
          className={`hover:text-stone-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'MATCH' ? 'text-amber-400 font-semibold' : ''
          }`}
        >
          {isMatchActive ? 'Active Match' : 'Match Day'}
        </button>

        <button
          onClick={() => {
            soundEngine.playClick();
            onSelectTab('MAP');
          }}
          className={`hover:text-stone-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'MAP' ? 'text-amber-400 font-semibold' : ''
          }`}
        >
          World Map
        </button>

        <button
          onClick={() => {
            soundEngine.playClick();
            onSelectTab('ROSTER');
          }}
          className={`hover:text-stone-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'ROSTER' ? 'text-amber-400 font-semibold' : ''
          }`}
        >
          Roster
        </button>

        <button
          onClick={() => {
            soundEngine.playClick();
            onSelectTab('PFC');
          }}
          className={`hover:text-stone-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'PFC' ? 'text-amber-400 font-semibold' : ''
          }`}
        >
          PFC & Career
        </button>

        <button
          onClick={() => {
            soundEngine.playClick();
            onSelectTab('POLITICS');
          }}
          className={`hover:text-stone-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'POLITICS' ? 'text-amber-400 font-semibold' : ''
          }`}
        >
          Politics & Bowls
        </button>

        <button
          onClick={() => {
            soundEngine.playClick();
            onSelectTab('ONLINE');
          }}
          className={`hover:text-stone-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'ONLINE' ? 'text-amber-400 font-semibold' : ''
          }`}
        >
          Online League
        </button>

        <button
          onClick={() => {
            soundEngine.playClick();
            onSelectTab('HISTORY');
          }}
          className={`hover:text-stone-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'HISTORY' ? 'text-amber-400 font-semibold' : ''
          }`}
        >
          Annals
        </button>
      </nav>

      {/* Zone 3: 1 Primary Action & Audio Control */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onToggleMute}
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          className="p-1.5 text-stone-400 hover:text-stone-200 transition-colors cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <button
          onClick={() => {
            soundEngine.playWhistle();
            onQuickChallenge();
          }}
          className="px-4 py-2 text-xs font-bold text-white bg-red-700 hover:bg-red-600 rounded-md transition-colors whitespace-nowrap shrink-0 shadow flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
        >
          <Swords className="w-3.5 h-3.5" />
          <span>{isMatchActive ? 'Resume Match' : 'Challenge Border'}</span>
        </button>
      </div>
    </header>
  );
};
