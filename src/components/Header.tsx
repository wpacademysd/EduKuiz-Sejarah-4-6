import React from 'react';
import { Volume2, VolumeX, Award, BookOpen, Sparkles, Compass } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface HeaderProps {
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenLeaderboard: () => void;
  onOpenGlossary: () => void;
  onGoHome: () => void;
  currentMode?: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  isMuted,
  onToggleMute,
  onOpenLeaderboard,
  onOpenGlossary,
  onGoHome,
}) => {
  return (
    <header className="relative bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 text-white shadow-xl border-b-4 border-amber-500 overflow-hidden">
      {/* Decorative Traditional Motif Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fde047_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="max-w-6xl mx-auto px-4 py-4 md:py-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Brand & Main Title */}
          <div 
            onClick={onGoHome}
            className="flex items-center gap-3 md:gap-4 cursor-pointer group text-center md:text-left transition-transform active:scale-95"
            title="Kembali ke Halaman Utama EDUKUIZ"
          >
            {/* Logo Emblem */}
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-1 shadow-lg shadow-amber-950/40 flex items-center justify-center shrink-0 border-2 border-yellow-200">
              <div className="w-full h-full rounded-xl bg-amber-900 flex flex-col items-center justify-center text-amber-300">
                <Compass className="w-7 h-7 md:w-8 md:h-8 text-yellow-400 animate-spin-slow" />
              </div>
            </div>

            <div>
              {/* Badge KSSR Semakan • Sekolah Rendah Malaysia */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-600/60 border border-amber-400/40 text-[11px] md:text-xs font-semibold text-amber-200 tracking-wide uppercase mb-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>KSSR Semakan • Sekolah Rendah Malaysia</span>
              </div>

              {/* Main Title Requirement */}
              <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white drop-shadow-md flex flex-wrap items-center justify-center md:justify-start gap-x-2">
                <span>EDUKUIZ SEJARAH</span>
                <span className="text-yellow-300 bg-amber-950/50 px-2.5 py-0.5 rounded-lg border border-yellow-500/30 text-lg md:text-2xl font-bold tracking-normal">
                  TAHUN 4–6
                </span>
              </h1>

              {/* Tagline Requirement */}
              <p className="text-sm md:text-base font-medium text-amber-100 flex items-center justify-center md:justify-start gap-1.5 mt-0.5">
                Belajar Sejarah Sambil Menjawab Kuiz!
              </p>
            </div>
          </div>

          {/* Action Tools: Sound, Revision, Leaderboard */}
          <div className="flex items-center gap-2 md:gap-3 bg-amber-950/40 p-1.5 rounded-2xl border border-amber-600/30 backdrop-blur-xs">
            {/* Button Nota & Fakta Ringkas */}
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenGlossary();
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-800/80 hover:bg-amber-700 text-amber-100 hover:text-white text-xs md:text-sm font-semibold transition border border-amber-600/40 shadow-xs cursor-pointer active:scale-95"
              title="Ulang Kaji Fakta Sejarah"
            >
              <BookOpen className="w-4 h-4 text-amber-300" />
              <span className="hidden sm:inline">Fakta Sejarah</span>
            </button>

            {/* Button Rekod Markah / Skor */}
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenLeaderboard();
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-800/80 hover:bg-amber-700 text-amber-100 hover:text-white text-xs md:text-sm font-semibold transition border border-amber-600/40 shadow-xs cursor-pointer active:scale-95"
              title="Papan Markah & Rekod Skor"
            >
              <Award className="w-4 h-4 text-yellow-400" />
              <span className="hidden sm:inline">Rekod Skor</span>
            </button>

            {/* Audio Mute/Unmute */}
            <button
              onClick={onToggleMute}
              className={`p-2.5 rounded-xl border transition shadow-xs cursor-pointer active:scale-95 ${
                isMuted
                  ? 'bg-rose-950/60 border-rose-500/40 text-rose-300 hover:bg-rose-900/60'
                  : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60'
              }`}
              title={isMuted ? 'Bunyi dimatikan (Klik untuk hidupkan)' : 'Bunyi aktif (Klik untuk matikan)'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
