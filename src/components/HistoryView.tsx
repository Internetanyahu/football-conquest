/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GameState } from '../types/game';
import { History, Download, Upload, RotateCcw, HeartHandshake, CloudUpload, ExternalLink, Check, Copy, BookOpen } from 'lucide-react';
import { createInitialGameState, saveGameState } from '../systems/conquestSystem';
import { soundEngine } from '../audio/soundEngine';

interface HistoryViewProps {
  gameState: GameState;
  onUpdateState: (newState: GameState) => void;
  onOpenGdd?: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ gameState, onUpdateState, onOpenGdd }) => {
  const [ghToken, setGhToken] = useState('');
  const [isPushing, setIsPushing] = useState(false);
  const [pushStatus, setPushStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  });
  const [copiedCmd, setCopiedCmd] = useState(false);

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

  const handlePushToPages = async () => {
    if (!ghToken.trim()) {
      setPushStatus({
        type: 'error',
        message: 'Please paste your GitHub Personal Access Token with repo write permissions.',
      });
      return;
    }

    setIsPushing(true);
    setPushStatus({ type: 'idle', message: 'Authenticating with GitHub and pushing branch...' });

    try {
      const res = await fetch('/api/git/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: ghToken.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        soundEngine.playTouchdown();
        setPushStatus({
          type: 'success',
          message: data.message || 'Pushed successfully to Internetanyahu/football-conquest!',
        });
      } else {
        soundEngine.playTurnover();
        setPushStatus({
          type: 'error',
          message: data.error || 'Failed to push to GitHub. Verify token permissions.',
        });
      }
    } catch (err: unknown) {
      soundEngine.playTurnover();
      const msg = err instanceof Error ? err.message : 'Network error connecting to git push service';
      setPushStatus({
        type: 'error',
        message: msg,
      });
    } finally {
      setIsPushing(false);
    }
  };

  const copyGitCommand = () => {
    soundEngine.playClick();
    navigator.clipboard.writeText('git push -u origin main --force');
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
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
            Territorial Annals & Deployment Console
          </h2>
          <p className="text-xs text-stone-400">
            Official historical records, campaign backups, and GitHub Pages continuous deployment.
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

      {/* 2. GitHub Pages Push & Deployment Panel */}
      <div className="bg-stone-900 border border-amber-600/40 rounded-lg p-5 shadow-xl flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <CloudUpload className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold font-display uppercase tracking-wider text-stone-100">
              Push to GitHub Pages Deployment
            </h3>
          </div>
          <a
            href="https://internetanyahu.github.io/football-conquest/"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 underline font-medium"
          >
            <span>Live Site: internetanyahu.github.io/football-conquest</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 text-xs">
          {/* Method A: Direct Push via Personal Access Token */}
          <div className="bg-stone-950 border border-stone-800 p-4 rounded-md flex flex-col justify-between gap-3">
            <div>
              <span className="font-bold text-stone-200 block text-sm">
                1-Click Push via GitHub Token
              </span>
              <p className="text-[11px] text-stone-400 mt-1 leading-relaxed">
                Provide your GitHub Personal Access Token (classic `repo` or fine-grained `Contents` & `Workflows` write) to push all commits and the pre-built `./docs` & `.github/workflows/pages.yml` files directly to `origin/main`.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <input
                type="password"
                placeholder="ghp_... (GitHub Personal Access Token)"
                value={ghToken}
                onChange={(e) => setGhToken(e.target.value)}
                className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded text-xs text-stone-100 placeholder:text-stone-500 font-mono focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={handlePushToPages}
                disabled={isPushing}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <CloudUpload className="w-4 h-4" />
                <span>{isPushing ? 'Pushing to GitHub...' : 'Push to GitHub Pages Now'}</span>
              </button>
            </div>

            {pushStatus.type !== 'idle' && (
              <div
                className={`p-2.5 rounded text-[11px] ${
                  pushStatus.type === 'success'
                    ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/80'
                    : 'bg-red-950/70 text-red-300 border border-red-800/80'
                }`}
              >
                {pushStatus.message}
              </div>
            )}
          </div>

          {/* Method B: Terminal / Bundle Downloads */}
          <div className="bg-stone-950 border border-stone-800 p-4 rounded-md flex flex-col justify-between gap-3">
            <div>
              <span className="font-bold text-stone-200 block text-sm">
                Terminal Push & Offline Bundle
              </span>
              <p className="text-[11px] text-stone-400 mt-1 leading-relaxed">
                Repository commits and static builds are fully prepared. If working from local terminal or Chromebook bash:
              </p>
              <div className="mt-2 p-2.5 bg-stone-900 rounded font-mono text-[11px] text-stone-300 flex items-center justify-between border border-stone-800">
                <code>git push -u origin main --force</code>
                <button
                  onClick={copyGitCommand}
                  className="text-stone-400 hover:text-stone-200 p-1 cursor-pointer"
                  title="Copy command"
                >
                  {copiedCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-stone-800">
              <a
                href="/api/download/bundle"
                download="football-conquest.bundle"
                className="flex-1 py-1.5 px-2 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 rounded text-[11px] font-semibold text-center flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3 h-3 text-amber-400" />
                <span>Git Bundle (.bundle)</span>
              </a>
              <a
                href="/api/download/archive"
                download="football-conquest.tar.gz"
                className="flex-1 py-1.5 px-2 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 rounded text-[11px] font-semibold text-center flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3 h-3 text-cyan-400" />
                <span>Source Archive (.tar.gz)</span>
              </a>
            </div>
          </div>
        </div>
      </div>

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
