import React, { useState } from 'react';
import { HISTORY_FACTS } from '../data/quizData';
import { soundManager } from '../utils/audio';
import { BookOpen, X, Sparkles, Filter } from 'lucide-react';
import { YearLevel } from '../types';

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlossaryModal: React.FC<GlossaryModalProps> = ({ isOpen, onClose }) => {
  const [filterYear, setFilterYear] = useState<YearLevel | 'Semua'>('Semua');

  if (!isOpen) return null;

  const filtered = filterYear === 'Semua' 
    ? HISTORY_FACTS 
    : HISTORY_FACTS.filter(f => f.year === filterYear);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-800">
                Fakta Pantas Sejarah KSSR
              </h3>
              <p className="text-xs text-slate-500">
                EDUKUIZ SEJARAH • Rujukan & Ulang Kaji Cepat
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
          {(['Semua', 4, 5, 6] as (YearLevel | 'Semua')[]).map((tab) => {
            const active = filterYear === tab;
            return (
              <button
                key={tab}
                onClick={() => {
                  soundManager.playClick();
                  setFilterYear(tab);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab === 'Semua' ? 'Semua Tahun' : `Tahun ${tab}`}
              </button>
            );
          })}
        </div>

        {/* Facts List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {filtered.map((item) => (
            <div 
              key={item.id}
              className="p-4 rounded-2xl bg-amber-50/50 hover:bg-amber-50 border border-amber-200/80 transition"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">
                  Tahun {item.year} • {item.topic}
                </span>

                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  {item.category}
                </span>
              </div>

              <p className="text-xs md:text-sm text-slate-800 leading-relaxed font-medium">
                {item.fact}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-2">
          <span className="text-[11px] text-slate-400">
            Sumber: Buku Teks Sejarah KSSR Semakan Kementerian Pendidikan Malaysia
          </span>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-amber-700 text-white font-bold text-xs hover:bg-amber-800 transition cursor-pointer"
          >
            Faham & Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
