import React from 'react';
import { BookMarked, GraduationCap, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-auto py-8">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand statement */}
        <div className="text-center md:text-left space-y-1">
          <div className="flex items-center justify-center md:justify-start gap-2 text-amber-400 font-bold text-base tracking-wide">
            <GraduationCap className="w-5 h-5 text-amber-400" />
            <span>EDUKUIZ SEJARAH TAHUN 4–6</span>
          </div>
          <p className="text-xs text-slate-400">
            Platform kuiz pendidikan Sejarah interaktif berteraskan Kurikulum Standard Sekolah Rendah (KSSR Semakan).
          </p>
          <div className="flex items-center justify-center md:justify-start gap-3 text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1">
              <BookMarked className="w-3.5 h-3.5 text-amber-500/80" /> Silibus Sekolah Rendah Malaysia
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-rose-500" /> Cinta Akan Sejarah Tanah Air
            </span>
          </div>
        </div>

        {/* Required Attribution */}
        <div className="flex flex-col items-center md:items-end">
          <div className="px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700/60 shadow-inner">
            <p className="text-sm font-extrabold tracking-widest text-amber-300 uppercase">
              WPACADEMY • SYAZWANDANIIAL
            </p>
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5">
            Hak Cipta Terpelihara &copy; {new Date().getFullYear()}
          </p>
        </div>

      </div>
    </footer>
  );
};
