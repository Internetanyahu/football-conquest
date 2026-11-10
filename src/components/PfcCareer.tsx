/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GameState, PFC } from '../types/game';
import { soundEngine } from '../audio/soundEngine';
import { Briefcase, Building, TrendingUp, Award, DollarSign, CheckCircle2 } from 'lucide-react';

interface PfcCareerProps {
  gameState: GameState;
  onUpdateState: (newState: GameState) => void;
}

export const PfcCareer: React.FC<PfcCareerProps> = ({ gameState, onUpdateState }) => {
  const playerCoach = gameState.coaches[gameState.playerCoachId];
  const playerPfc = gameState.pfcs[gameState.playerPfcId];
  const currentCounty = gameState.counties[playerCoach?.currentCountyId || 'C_BER'];

  const [companyNameInput, setCompanyNameInput] = useState('');
  const [isEditingPfcName, setIsEditingPfcName] = useState(false);

  // Upgrade PFC Facility (Training, Medical, Scouting)
  const handleUpgradeFacility = (facilityKey: 'trainingLevel' | 'medicalLevel' | 'scoutingLevel') => {
    if (!playerPfc) return;
    const currentLvl = playerPfc.facilities[facilityKey];
    if (currentLvl >= 5) return;

    const cost = currentLvl * 25000;
    if (playerPfc.treasury < cost) {
      soundEngine.playTurnover();
      return;
    }

    soundEngine.playTouchdown();
    const updatedState = { ...gameState };
    const pfc = updatedState.pfcs[gameState.playerPfcId];
    pfc.treasury -= cost;
    pfc.facilities[facilityKey] += 1;
    pfc.reputation = Math.min(100, pfc.reputation + 4);

    onUpdateState(updatedState);
  };

  // Sign a municipal sponsorship deal
  const handleSignSponsorship = (dealName: string, reward: number) => {
    if (!playerPfc) return;
    soundEngine.playFirstDown();
    const updatedState = { ...gameState };
    const pfc = updatedState.pfcs[gameState.playerPfcId];
    pfc.treasury += reward;
    pfc.reputation = Math.min(100, pfc.reputation + 2);
    onUpdateState(updatedState);
  };

  // Save new PFC name
  const handleSavePfcName = () => {
    if (!companyNameInput.trim() || !playerPfc) return;
    soundEngine.playClick();
    const updatedState = { ...gameState };
    const pfc = updatedState.pfcs[gameState.playerPfcId];
    pfc.name = companyNameInput.trim();
    setIsEditingPfcName(false);
    onUpdateState(updatedState);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 flex flex-col gap-6">
      {/* 1. Coach Career Dossier Header */}
      <div className="bg-stone-900 border border-stone-800 rounded-lg p-5 flex flex-wrap items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-lg bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-display font-extrabold text-2xl">
            {playerCoach?.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
                Licensed Field Commander & Football Contractor
              </span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-mono border border-emerald-800/60">
                ACTIVE
              </span>
            </div>
            <h2 className="text-2xl font-bold font-display text-stone-100 tracking-wide mt-0.5">
              {playerCoach?.name}
            </h2>
            <p className="text-xs text-stone-400">
              Contracted to <strong className="text-stone-200">{playerPfc?.name}</strong> · Stationed in {currentCounty?.name}
            </p>
          </div>
        </div>

        {/* Coach Metrics */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          <div className="bg-stone-950 px-3.5 py-2 rounded border border-stone-800">
            <span className="text-stone-500 block text-[10px] uppercase font-sans">Record</span>
            <span className="font-bold text-amber-400 text-sm">
              {playerCoach?.wins}W — {playerCoach?.losses}L
            </span>
          </div>

          <div className="bg-stone-950 px-3.5 py-2 rounded border border-stone-800">
            <span className="text-stone-500 block text-[10px] uppercase font-sans">Territory Annexed</span>
            <span className="font-bold text-emerald-400 text-sm">
              {playerCoach?.annexationsCount} Counties
            </span>
          </div>

          <div className="bg-stone-950 px-3.5 py-2 rounded border border-stone-800">
            <span className="text-stone-500 block text-[10px] uppercase font-sans">Weekly Wage</span>
            <span className="font-bold text-stone-200 text-sm">
              ${playerCoach?.currentSalaryWeekly.toLocaleString()}
            </span>
          </div>

          <div className="bg-stone-950 px-3.5 py-2 rounded border border-stone-800">
            <span className="text-stone-500 block text-[10px] uppercase font-sans">Win Bonus</span>
            <span className="font-bold text-cyan-400 text-sm">
              +${playerCoach?.winBonus.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* 2. PFC Operations & Financial Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: PFC Organization & Facilities */}
        <div className="lg:col-span-2 bg-stone-900 border border-stone-800 rounded-lg p-5 flex flex-col gap-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold font-display uppercase tracking-wider text-stone-100">
                PFC Corporate Headquarters & Facilities
              </h3>
            </div>
            {isEditingPfcName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={companyNameInput}
                  onChange={(e) => setCompanyNameInput(e.target.value)}
                  placeholder="New Syndicate Name"
                  className="px-2 py-1 bg-stone-950 border border-stone-800 text-xs text-white rounded"
                />
                <button
                  onClick={handleSavePfcName}
                  className="px-2.5 py-1 bg-amber-600 text-white rounded text-xs font-bold"
                >
                  Save
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setCompanyNameInput(playerPfc?.name || '');
                  setIsEditingPfcName(true);
                }}
                className="text-xs text-stone-400 hover:text-stone-200 underline"
              >
                Rename Contractor
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Training Grounds Facility */}
            <div className="bg-stone-950 border border-stone-800 p-4 rounded flex flex-col justify-between gap-3">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-stone-200">
                  <span>Training Facility</span>
                  <span className="text-amber-400 font-mono">Tier {playerPfc?.facilities.trainingLevel}/5</span>
                </div>
                <p className="text-[11px] text-stone-400 mt-1">
                  Enhances weekly athlete XP progression and drill attribute bonuses.
                </p>
              </div>
              <button
                onClick={() => handleUpgradeFacility('trainingLevel')}
                disabled={(playerPfc?.facilities.trainingLevel || 0) >= 5}
                className="w-full py-1.5 bg-stone-800 hover:bg-stone-700 disabled:opacity-50 text-white font-bold rounded text-[11px] transition-colors cursor-pointer"
              >
                {(playerPfc?.facilities.trainingLevel || 0) >= 5
                  ? 'Max Tier'
                  : `Upgrade ($${((playerPfc?.facilities.trainingLevel || 1) * 25000).toLocaleString()})`}
              </button>
            </div>

            {/* Medical Infirmary Facility */}
            <div className="bg-stone-950 border border-stone-800 p-4 rounded flex flex-col justify-between gap-3">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-stone-200">
                  <span>Medical Infirmary</span>
                  <span className="text-emerald-400 font-mono">Tier {playerPfc?.facilities.medicalLevel}/5</span>
                </div>
                <p className="text-[11px] text-stone-400 mt-1">
                  Reduces athlete injury recovery duration by 50% per upgrade tier.
                </p>
              </div>
              <button
                onClick={() => handleUpgradeFacility('medicalLevel')}
                disabled={(playerPfc?.facilities.medicalLevel || 0) >= 5}
                className="w-full py-1.5 bg-stone-800 hover:bg-stone-700 disabled:opacity-50 text-white font-bold rounded text-[11px] transition-colors cursor-pointer"
              >
                {(playerPfc?.facilities.medicalLevel || 0) >= 5
                  ? 'Max Tier'
                  : `Upgrade ($${((playerPfc?.facilities.medicalLevel || 1) * 25000).toLocaleString()})`}
              </button>
            </div>

            {/* Scouting Bureau Facility */}
            <div className="bg-stone-950 border border-stone-800 p-4 rounded flex flex-col justify-between gap-3">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-stone-200">
                  <span>Scouting Bureau</span>
                  <span className="text-cyan-400 font-mono">Tier {playerPfc?.facilities.scoutingLevel}/5</span>
                </div>
                <p className="text-[11px] text-stone-400 mt-1">
                  Discovers higher-tier athletic recruits from local county populations.
                </p>
              </div>
              <button
                onClick={() => handleUpgradeFacility('scoutingLevel')}
                disabled={(playerPfc?.facilities.scoutingLevel || 0) >= 5}
                className="w-full py-1.5 bg-stone-800 hover:bg-stone-700 disabled:opacity-50 text-white font-bold rounded text-[11px] transition-colors cursor-pointer"
              >
                {(playerPfc?.facilities.scoutingLevel || 0) >= 5
                  ? 'Max Tier'
                  : `Upgrade ($${((playerPfc?.facilities.scoutingLevel || 1) * 25000).toLocaleString()})`}
              </button>
            </div>
          </div>

          {/* Municipal Sponsorship Deals */}
          <div className="border-t border-stone-800 pt-3 flex flex-col gap-2.5">
            <span className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              Available Municipal & Private Sponsorship Contracts
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-stone-950 border border-stone-800/80 p-3 rounded flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-stone-200 block">Commonwealth Steamrail Charter</span>
                  <span className="text-[11px] text-stone-400">Exclusive gridiron transport sponsorship</span>
                </div>
                <button
                  onClick={() => handleSignSponsorship('Commonwealth Steamrail Charter', 18000)}
                  className="px-3 py-1 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded text-xs transition-colors cursor-pointer"
                >
                  Collect $18,000
                </button>
              </div>

              <div className="bg-stone-950 border border-stone-800/80 p-3 rounded flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-stone-200 block">Continental Woolen Mills</span>
                  <span className="text-[11px] text-stone-400">Official heavy-canvas match jersey endorsement</span>
                </div>
                <button
                  onClick={() => handleSignSponsorship('Continental Woolen Mills', 12500)}
                  className="px-3 py-1 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded text-xs transition-colors cursor-pointer"
                >
                  Collect $12,500
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Competitor PFC Leaderboard */}
        <div className="bg-stone-900 border border-stone-800 rounded-lg p-5 flex flex-col gap-4 shadow-xl">
          <div className="flex items-center gap-2 border-b border-stone-800 pb-3">
            <Award className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold font-display uppercase tracking-wider text-stone-100">
              Continental PFC Rankings
            </h3>
          </div>

          <div className="flex flex-col gap-2.5">
            {Object.values(gameState.pfcs)
              .sort((a, b) => b.prestige - a.prestige)
              .map((pfc, idx) => (
                <div
                  key={pfc.id}
                  className={`p-3 rounded border flex items-center justify-between text-xs ${
                    pfc.isPlayerOwned
                      ? 'bg-amber-950/30 border-amber-600/50'
                      : 'bg-stone-950 border-stone-800/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-stone-500 font-bold">{idx + 1}.</span>
                    <span
                      className="w-3 h-3 rounded-sm shrink-0"
                      style={{ backgroundColor: pfc.primaryColor }}
                    />
                    <div>
                      <span className="font-bold text-stone-200 block">
                        {pfc.name} {pfc.isPlayerOwned && '(YOU)'}
                      </span>
                      <span className="text-[10px] text-stone-400">
                        Prestige: {pfc.prestige} · Rep: {pfc.reputation}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-stone-300 font-semibold">
                    ${pfc.treasury.toLocaleString()}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
