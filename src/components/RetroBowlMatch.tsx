import React, { useState } from 'react';
import { County } from '../types/game';
import { ExternalLink, Trophy, ArrowLeft, ShieldAlert } from 'lucide-react';

interface RetroBowlMatchProps {
  homeCounty: County;
  awayCounty: County;
  onMatchComplete: (result: {
    homeScore: number;
    awayScore: number;
    winnerCountyId: string;
    loserCountyId: string;
    statsText: string;
  }) => void;
  onExitMatch?: () => void;
  onUseBuiltIn: () => void;
}

export const RetroBowlMatch: React.FC<RetroBowlMatchProps> = ({
  homeCounty,
  awayCounty,
  onMatchComplete,
  onExitMatch,
  onUseBuiltIn,
}) => {
  const [homeScore, setHomeScore] = useState('');
  const [awayScore, setAwayScore] = useState('');
  const [confirmation, setConfirmation] = useState(false);
  const [showEmbed, setShowEmbed] = useState(true);

  const parsedHome = homeScore.trim() === '' ? NaN : Number(homeScore);
  const parsedAway = awayScore.trim() === '' ? NaN : Number(awayScore);
  const validScores =
    Number.isInteger(parsedHome) &&
    Number.isInteger(parsedAway) &&
    parsedHome >= 0 &&
    parsedAway >= 0 &&
    parsedHome !== parsedAway;

  const finishMatch = () => {
    if (!validScores || !confirmation) return;
    const homeWon = parsedHome > parsedAway;
    onMatchComplete({
      homeScore: parsedHome,
      awayScore: parsedAway,
      winnerCountyId: homeWon ? homeCounty.id : awayCounty.id,
      loserCountyId: homeWon ? awayCounty.id : homeCounty.id,
      statsText: `Home ${homeCounty.name}: ${parsedHome} · Away ${awayCounty.name}: ${parsedAway}. Retro Bowl score manually reported; external result not independently verified.`,
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-4 text-stone-100">
      <div className="bg-stone-900 border border-stone-800 rounded-lg p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Trophy className="w-5 h-5 text-amber-400" />
          <div>
            <div className="text-xs uppercase tracking-widest text-amber-400 font-bold">Border contest · Retro Bowl</div>
            <div className="text-lg font-bold">{homeCounty.name} vs {awayCounty.name}</div>
            <div className="text-xs text-stone-400">{homeCounty.stateName} defending · {awayCounty.stateName} challenging</div>
          </div>
        </div>
        {onExitMatch && (
          <button onClick={onExitMatch} className="text-xs text-stone-400 hover:text-white underline">Abandon contest</button>
        )}
      </div>

      <div className="bg-black border border-stone-700 rounded-lg overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 bg-stone-900 px-3 py-2 border-b border-stone-800">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-300">External match window</span>
          <div className="flex gap-2">
            <button
              onClick={() => setShowEmbed((value) => !value)}
              className="px-3 py-1.5 rounded bg-stone-800 hover:bg-stone-700 text-xs"
            >
              {showEmbed ? 'Hide embedded game' : 'Show embedded game'}
            </button>
            <a
              href="https://poki.com/en/g/retro-bowl"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold inline-flex items-center gap-1.5"
            >
              Open Retro Bowl <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
        {showEmbed && (
          <div className="relative w-full aspect-video bg-stone-950">
            <iframe
              title="Retro Bowl on Poki"
              src="https://poki.com/en/g/retro-bowl"
              className="absolute inset-0 w-full h-full border-0"
              allow="autoplay; fullscreen; gamepad"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        )}
        <div className="px-4 py-3 bg-stone-900/80 text-xs text-stone-400 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p>
            Poki may block third-party embedding. If the game does not appear above, open it in a new tab.
            Football Conquest cannot read the external game's screen, save data, or final score.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <section className="bg-stone-900 border border-stone-800 rounded-lg p-4">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-1">Report final score</h3>
          <p className="text-xs text-stone-400 mb-4">Enter the final score after completing the Retro Bowl match. Ties are not accepted; continue into overtime first.</p>
          <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center">
            <label className="min-w-0">
              <span className="block text-xs text-stone-400 mb-1 truncate">{homeCounty.name}</span>
              <input type="number" min="0" step="1" inputMode="numeric" value={homeScore} onChange={(e) => { setHomeScore(e.target.value); setConfirmation(false); }} className="w-full bg-stone-950 border border-stone-700 rounded px-3 py-2 text-xl font-mono text-center text-white" placeholder="0" />
            </label>
            <span className="text-stone-500 font-bold pt-5">—</span>
            <label className="min-w-0">
              <span className="block text-xs text-stone-400 mb-1 truncate">{awayCounty.name}</span>
              <input type="number" min="0" step="1" inputMode="numeric" value={awayScore} onChange={(e) => { setAwayScore(e.target.value); setConfirmation(false); }} className="w-full bg-stone-950 border border-stone-700 rounded px-3 py-2 text-xl font-mono text-center text-white" placeholder="0" />
            </label>
          </div>
          <label className="flex items-start gap-2 mt-4 text-xs text-stone-300">
            <input type="checkbox" checked={confirmation} onChange={(e) => setConfirmation(e.target.checked)} className="mt-0.5 accent-amber-500" />
            I completed the match and confirm these are the final scores.
          </label>
          <button
            onClick={finishMatch}
            disabled={!validScores || !confirmation}
            className="mt-4 w-full py-3 rounded bg-emerald-700 hover:bg-emerald-600 disabled:bg-stone-800 disabled:text-stone-500 text-white font-bold text-xs uppercase tracking-wider"
          >
            Confirm result and resolve border
          </button>
          {!validScores && (homeScore !== '' || awayScore !== '') && (
            <p className="mt-2 text-xs text-amber-400">Enter two whole-number scores with no tie.</p>
          )}
        </section>

        <section className="bg-stone-900 border border-stone-800 rounded-lg p-4 flex flex-col">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-2">Result handling</h3>
          <p className="text-xs text-stone-400 leading-relaxed">
            A reported win by {homeCounty.name} transfers {awayCounty.name} to {homeCounty.stateName}. A win by {awayCounty.name} leaves the border unchanged and relocates your coach. The result is stored in your local Football Conquest save.
          </p>
          <div className="mt-auto pt-5 flex flex-col gap-2">
            <button onClick={onUseBuiltIn} className="w-full py-2.5 rounded border border-stone-700 hover:bg-stone-800 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Use Football Conquest match instead
            </button>
            <p className="text-[10px] text-stone-500">Manual score entry is not anti-cheat verified. Automatic score transfer would require cooperation or a supported API from the external game provider.</p>
          </div>
        </section>
      </div>
    </div>
  );
};
