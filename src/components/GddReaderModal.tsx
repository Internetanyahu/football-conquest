import React, { useEffect, useState } from 'react';
import { BookOpen, X, ExternalLink } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

interface GddReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GDD_RAW_URL = 'https://raw.githubusercontent.com/Internetanyahu/football-conquest/main/GDD.md';
const GDD_REPO_URL = 'https://github.com/Internetanyahu/football-conquest/blob/main/GDD.md';

export const GddReaderModal: React.FC<GddReaderModalProps> = ({ isOpen, onClose }) => {
  const [documentText, setDocumentText] = useState('');
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    if (!isOpen || documentText) return;
    const controller = new AbortController();
    fetch(GDD_RAW_URL, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('The repository returned HTTP ' + response.status);
        return response.text();
      })
      .then(setDocumentText)
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === 'AbortError') return;
        setLoadError(error instanceof Error ? error.message : 'Could not load the GDD.');
      });
    return () => controller.abort();
  }, [isOpen, documentText]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-stone-950/90 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5">
      <div className="w-full max-w-5xl h-[90vh] bg-stone-900 border border-stone-800 rounded-xl shadow-2xl flex flex-col overflow-hidden">
        <header className="px-4 sm:px-6 py-3 bg-stone-950 border-b border-stone-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <BookOpen className="w-5 h-5 text-amber-500 shrink-0" />
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-stone-100">Football Conquest — Master GDD</h2>
              <p className="text-[10px] text-stone-500">The complete repository document, loaded directly from main</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a href={GDD_REPO_URL} target="_blank" rel="noreferrer" className="text-xs text-amber-400 hover:text-amber-300 inline-flex items-center gap-1">
              GitHub <ExternalLink className="w-3 h-3" />
            </a>
            <button onClick={() => { soundEngine.playClick(); onClose(); }} className="p-2 rounded text-stone-400 hover:text-white hover:bg-stone-800" aria-label="Close GDD">
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {documentText ? (
            <pre className="whitespace-pre-wrap break-words text-xs sm:text-sm leading-relaxed text-stone-300 font-sans">{documentText}</pre>
          ) : loadError ? (
            <div className="max-w-xl mx-auto mt-12 text-center">
              <p className="text-sm text-red-300">Could not load the GDD: {loadError}</p>
              <a href={GDD_REPO_URL} target="_blank" rel="noreferrer" className="inline-flex mt-4 text-sm text-amber-400 underline">Open the complete GDD on GitHub</a>
            </div>
          ) : (
            <div className="py-16 text-center text-sm text-stone-400">Loading the complete GDD…</div>
          )}
        </main>
      </div>
    </div>
  );
};
