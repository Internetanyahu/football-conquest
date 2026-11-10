/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GameState } from '../types/game';
import { History, Download, Upload, RotateCcw, HeartHandshake, BookOpen, Trophy } from 'lucide-react';
import { createInitialGameState, saveGameState } from '../systems/conquestSystem';
import { soundEngine } from '../audio/soundEngine';

interface HistoryViewProps {
  gameState: GameState;
  onUpdateState: (newState: GameState) => void;
  onOpenGdd?: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ gameState, onUpdateState, onOpenGdd }) => {
  const handleExportSave = () => {
    soundEngine.playClick();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(gameState, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `football_conquest_save_week_${gameState.currentWeek}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportSave = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && parsed.version === 1) {
          soundEngine.playFirstDown();
          parsed.matchHistory = Array.isArray(parsed.matchHistory) ? parsed.matchHistory : [];
          saveGameState(parsed);
          onUpdateState(parsed);
        } else {
          alert('Invalid save file format.');
        }
      } catch (err) {
        alert('Could not read save file.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetCampaign = () => {
    if (window.confirm('Reset the entire campaign to Week 1, 1898? All progress will restart.')) {
      soundEngine.playTurnover();
      const fresh = createInitialGameState();
      saveGameState(fresh);
      onUpdateState(fresh);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 flex flex-col gap-6">
      {/* 1. Header Bar */}
      <div className="bg-stone-900 border border-stone-800 rounded-lg p-5 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
            Chronicle of Conquest & Preservation
          </span>
          <h2 className="text-2xl font-bold font-display text-stone-100 tracking-wide mt-0.5">
            World History & Records
          </h2>
          <p className="text-xs text-stone-400">
            Match results, territorial changes, and campaign backups.
          </p>
        </div>

        {/* Data Persistence Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {onOpenGdd && (
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenGdd();
              }}
              className="px-3 py-1.5 bg-stone-950 border border-amber-600/70 hover:border-amber-500 text-amber-300 hover:text-amber-200 rounded text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow"
              title="Open the complete 44-section Game Design Document"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Read Master GDD (v1.0)</span>
            </button>
          )}

          <button
            onClick={handleExportSave}
            className="px-3 py-1.5 bg-stone-950 border border-stone-800 hover:border-stone-700 text-stone-300 hover:text-white rounded text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-amber-500" />
            <span>Export Save</span>
          </button>

          <label className="px-3 py-1.5 bg-stone-950 border border-stone-800 hover:border-stone-700 text-stone-300 hover:text-white rounded text-xs flex items-center gap-1.5 transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-cyan-500" />
            <span>Import Save</span>
            <input type="file" accept=".json" onChange={handleImportSave} className="hidden" />
          </label>

          <button
            onClick={handleResetCampaign}
            className="px-3 py-1.5 bg-stone-950 border border-stone-800 hover:border-red-800/80 text-red-400 hover:text-red-300 rounded text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Campaign</span>
          </button>
        </div>
      </div>

      {/* Complete county match record */}
      <section className="bg-stone-900 border border-stone-800 rounded-lg p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-100">County Match Results</h3>
          </div>
          <span className="text-[10px] font-mono text-stone-500">{gameState.matchHistory?.length || 0} recorded</span>
        </div>
        {gameState.matchHistory?.length ? (
          <div className="divide-y divide-stone-800">
            {gameState.matchHistory.map((match) => (
              <div key={match.id} className="py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="min-w-0">
                  <div className="font-semibold text-stone-100">{match.winnerCountyName} <span className="text-stone-500 font-normal">def.</span> {match.loserCountyName}</div>
                  <div className="mt-1 text-[10px] text-stone-500">{match.coachName} · {match.pfcName} · {match.date}</div>
                  {match.statsText && <div className="mt-1 text-[10px] text-stone-400">{match.statsText}</div>}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-stone-200">{match.score}</span>
                  <span className={match.outcome === 'WIN' ? 'text-emerald-400' : 'text-red-400'}>{match.outcome}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-5 text-center text-xs text-stone-500">Completed county matches will appear here.</p>
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3. Annexation History Timeline (Left 2 Cols) */}
        <div className="lg:col-span-2 bg-stone-900 border border-stone-800 rounded-lg p-5 flex flex-col gap-4 shadow-xl">
          <div className="flex items-center gap-2 border-b border-stone-800 pb-3">
            <History className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold font-display uppercase tracking-wider text-stone-100">
              Chronicle of Territorial Annexations
            </h3>
          </div>

          {gameState.annexationHistory.length > 0 ? (
            <div className="flex flex-col gap-3">
              {gameState.annexationHistory.map((log) => (
                <div
                  key={log.id}
                  className="bg-stone-950 border border-stone-800 p-3.5 rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-100 text-sm">{log.winnerCountyName}</span>
                      <span className="text-stone-500 font-mono">annexed</span>
                      <span className="font-bold text-red-400 text-sm">{log.loserCountyName}</span>
                    </div>
                    <span className="text-[11px] text-stone-400">
                      Transferred into {log.winnerStateName} · Commanded by {log.coachName} ({log.pfcName})
                    </span>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto text-right font-mono">
                    <span className="px-2 py-0.5 rounded bg-stone-900 text-amber-400 font-bold border border-stone-800 text-[11px]">
                      {log.score}
                    </span>
                    <span className="text-[10px] text-stone-500 mt-1">{log.date}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-stone-500 py-8 text-center">
              No annexations recorded yet this season. Enter the World Map to challenge neighboring borders!
            </div>
          )}
        </div>

        {/* 4. Memorial Hall of Fame & Lore (Right Col) */}
        <div className="bg-stone-900 border border-stone-800 rounded-lg p-5 flex flex-col gap-4 shadow-xl">
          <div className="flex items-center gap-2 border-b border-stone-800 pb-3">
            <HeartHandshake className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold font-display uppercase tracking-wider text-stone-100">
              Memorial Hall & Gridiron Lore
            </h3>
          </div>

          <div className="bg-stone-950 border border-stone-800 p-3 rounded text-xs text-stone-400 leading-relaxed flex flex-col gap-2">
            <h4 className="font-bold text-stone-200">The Shoulder-First Era</h4>
            <p>
              In this alternate North American timeline, athletes play without modern plastic helmets. Tackling is strictly shoulder-first and form-based, emphasizing mass momentum and technique rather than head impacts.
            </p>
            <p>
              The Flying Wedge is completely legal under sovereign statutory laws, making line battles intense and physical. Athletes who fall in service to their county are permanently enshrined in the sovereign annals.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-mono text-stone-400 uppercase">
              Permanent Memorial Roster (0 Fatalities Recorded)
            </span>
            <div className="bg-stone-950 border border-stone-800 p-4 rounded text-center text-xs text-stone-500 italic">
              All active athletes across the 12 sovereign nations remain in good health.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
