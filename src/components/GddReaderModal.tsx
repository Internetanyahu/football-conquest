/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, X, Search, FileText, CheckCircle2 } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

interface GddReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GDD_SECTIONS = [
  { id: 'sec-1', title: '1. Project Overview & High Concept', tag: 'Core Premise', text: 'Football victories determine who controls the land. Players begin as coaches employed by Private Football Contractors (PFCs). They lead football teams representing counties and compete against neighboring territories.' },
  { id: 'sec-2', title: '2. Game Vision & Design Pillars', tag: 'Pillars', text: '1. Football First: Fast, responsive side-view arcade football inspired by Retro Bowl with 100% original pixel-art assets and rules.\n2. Territory Matters: Winning county matches annexes territory into the coach\'s sovereign state.\n3. A Living World: NPCs compete, develop careers, and administer political offices.\n4. Player Freedom: Casual, competitive, management, and political playstyles.' },
  { id: 'sec-3', title: '3. Target Audience & Accessibility', tag: 'Platforms', text: 'Primary: Fans of American football, arcade sports, territorial strategy, and alternate-history simulation. Designed to perform smoothly on ordinary Chromebooks and mobile browsers.' },
  { id: 'sec-4', title: '4. Game Modes (Solo Campaign & Online World)', tag: 'Game Modes', text: 'Solo Campaign: Curated alternate-history North American world with 12 sovereign nations. Completely playable offline with local saves.\nOnline World: Shared persistent territorial world with balkanized borders, ELO matchmaking, and seasonal resets.' },
  { id: 'sec-5', title: '5. Core Gameplay Loop', tag: 'Loop', text: 'Receive county assignment → Review adjacent challenges → Choose opponent → Set playbook & tactics → Play match → Annex territory on victory → Receive salary & win bonus → Relocate coach to active frontier.' },
  { id: 'sec-6', title: '6. World Setting & Alternate History', tag: 'World Lore', text: 'Alternate-history North America: Britain conquered much of the continent; France retained New France/Laurentia; Spain controlled parts of Mexico and California; Baja California belongs to California; Cuba, Haiti, and the Dominican Republic are annexed. Indigenous peoples were not subjected to genocide and hold ordinary political/athletic offices. No transatlantic slave trade (Black populations concentrated in southern Florida, Cuba, Haiti, and Dominican Republic).' },
  { id: 'sec-7', title: '7. Geography & Administrative Hierarchy', tag: 'Hierarchy', text: 'Hierarchy: Continent → Sovereign State → County → Municipality. Counties are the primary territorial units of gridiron competition. Municipalities remain intact when their parent county is annexed.' },
  { id: 'sec-8', title: '8. Territorial Ownership & Conquest Rules', tag: 'Core Rules', text: 'Rule 1: Winning a county match annexes the opposing county. Losing does not transfer territory.\nRule 2: Challenges restricted strictly to adjacent border counties.\nRule 3: Counties in the same state cannot challenge each other.\nRule 4: Annexed counties join the winning state.\nRule 5: Coaches move to the nearest county needing representation.' },
  { id: 'sec-9', title: '9. Football Gameplay & Side-View Field', tag: 'Football', text: 'Side-view pixel-art field with yard lines, hash marks, line of scrimmage, first-down marker, and animated players with individual uniform numbers. Direct runner control with WASD/touch, drag-to-aim passing trajectory, jukes, dives, and blocking.' },
  { id: 'sec-10', title: '10. Match Rules & Simulation', tag: 'Rules', text: '4 downs to gain 10 yards. 4 quarters with 2-minute regulation clocks. Touchdowns (6 pts), PAT (1 pt), 2-point conversion (2 pts), Field Goal (3 pts), Safety (2 pts). Overtime sudden death.' },
  { id: 'sec-11', title: '11. Offensive Gameplay & Playbook', tag: 'Offense', text: 'Formations: Power Run (The Flying Wedge - legal historical wedge formation with 3 lead blockers!), Off-Tackle Sweep, Quick Slant, Deep Post, and Linemen Screen.' },
  { id: 'sec-12', title: '12. Defensive Gameplay & Tackling', tag: 'Defense', text: 'Shoulder-first form tackling (no modern plastic helmets). Defensive line rushers, linebackers reading run vs pass, cornerbacks in coverage, and deep safety containment.' },
  { id: 'sec-13', title: '13. Special Teams & Kicking', tag: 'Special Teams', text: 'Kickoffs, punts, extra points, and field goals with interactive power and accuracy timing arc meter.' },
  { id: 'sec-15', title: '15. Athletes & Local Population Generation', tag: 'Rosters', text: 'Athletes generated from local county population pools with culturally authentic naming (Anglo, French-Canadien, Indigenous Cherokee/Creek/Lakota, Spanish/Californio, Afro-Caribbean, Dutch). Attributes: Speed, Strength, Tackling, Catching, Stamina, and Morale.' },
  { id: 'sec-16', title: '16. Player Lifecycle (Injuries & Rare Death)', tag: 'Lifecycle', text: 'Athletes age, develop through training, and suffer occasional injuries. Tragic fatalities are exceptionally rare (~12 per million matches) and honored permanently in the sovereign Memorial Hall of Fame.' },
  { id: 'sec-17', title: '17. Coaches & Career Progression', tag: 'Career', text: 'Coaches earn weekly salaries and win bonuses from PFC employers. Building reputation unlocks higher tiers, state team leadership, and the path to run for State Governor.' },
  { id: 'sec-18', title: '18. Private Football Contractors (PFCs)', tag: 'PFC', text: 'Private football organizations functioning like athletic contractors. Facility upgrade tree: Training Grounds, Medical Infirmary, and Scouting Bureau. Municipal and private sponsorships.' },
  { id: 'sec-21', title: '21. Sovereign Governors & Decrees', tag: 'Politics', text: 'Sovereign governors dictate state laws, appoint mayors, and grant athletic defense subsidies. Outstanding coaches receive appointments to lead state football teams.' },
  { id: 'sec-22', title: '22. State Football & Championship Bowls', tag: 'State Bowls', text: 'High-prestige non-annexation exhibition bowls between sovereign states awarding $50,000 prize purses and continental glory.' },
  { id: 'sec-24', title: '24. Online Multiplayer & Seasons', tag: 'Multiplayer', text: 'Competitive shared world with authoritative server-side match validation (`/api/matches/validate`), global leaderboards, and seasonal resets preserving player accounts and career statistics.' },
  { id: 'sec-35', title: '35. Save Systems & Persistence', tag: 'Persistence', text: 'Full localStorage autosave with JSON export and import for seamless cross-device campaign portability.' },
];

export const GddReaderModal: React.FC<GddReaderModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSectionId, setActiveSectionId] = useState<string>(GDD_SECTIONS[0].id);

  if (!isOpen) return null;

  const filteredSections = GDD_SECTIONS.filter(
    (s) =>
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeSection = GDD_SECTIONS.find((s) => s.id === activeSectionId) || GDD_SECTIONS[0];

  return (
    <div className="fixed inset-0 bg-stone-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl h-[85vh] bg-stone-900 border border-stone-800 rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-stone-950 border-b border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-amber-500" />
            <div>
              <h2 className="text-lg font-bold font-display uppercase tracking-wider text-stone-100">
                Football Conquest — Game Design Document (GDD v1.0)
              </h2>
              <span className="text-[11px] text-stone-400">
                In-Repo Authoritative Design Specification · 44 Core Sections
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-500" />
              <input
                type="text"
                placeholder="Search GDD sections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1 bg-stone-900 border border-stone-800 text-xs text-stone-200 placeholder:text-stone-500 rounded focus:outline-none focus:border-amber-500 w-48"
              />
            </div>
            <button
              onClick={() => {
                soundEngine.playClick();
                onClose();
              }}
              className="p-1.5 text-stone-400 hover:text-stone-100 rounded hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Section Index Sidebar */}
          <div className="w-80 bg-stone-950/70 border-r border-stone-800 overflow-y-auto p-3 flex flex-col gap-1.5 shrink-0 text-xs">
            <span className="px-2 py-1 text-[10px] font-mono text-stone-500 uppercase tracking-wider">
              Sections Index ({filteredSections.length})
            </span>
            {filteredSections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => {
                  soundEngine.playClick();
                  setActiveSectionId(sec.id);
                }}
                className={`p-2.5 rounded text-left transition-colors flex flex-col gap-1 cursor-pointer ${
                  activeSectionId === sec.id
                    ? 'bg-amber-950/50 border border-amber-600/50 text-amber-200'
                    : 'hover:bg-stone-800/40 text-stone-300'
                }`}
              >
                <span className="font-bold font-sans text-xs line-clamp-1">{sec.title}</span>
                <span className="text-[10px] font-mono text-stone-500 uppercase">{sec.tag}</span>
              </button>
            ))}
          </div>

          {/* Section Reader Body */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 text-sm">
            <div className="border-b border-stone-800 pb-4">
              <span className="text-xs font-mono text-amber-500 uppercase tracking-wide">
                Specification Section · {activeSection.tag}
              </span>
              <h3 className="text-2xl font-bold font-display text-stone-100 tracking-wide mt-1">
                {activeSection.title}
              </h3>
            </div>

            <div className="prose prose-invert max-w-none text-xs text-stone-300 leading-relaxed whitespace-pre-line font-sans">
              {activeSection.text}
            </div>

            <div className="mt-8 p-4 rounded-lg bg-stone-950 border border-stone-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-stone-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Document Status: Authoritative Master Spec</span>
              </div>
              <span className="font-mono text-stone-500">File: /GDD.md (69 KB)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
