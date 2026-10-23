import React from 'react';
import { QuizMode } from '../types';
import { soundManager } from '../utils/audio';
import { BookOpen, Zap, Layers, CalendarCheck, ArrowRight, Sparkles } from 'lucide-react';

interface ModeSelectorProps {
  onSelectMode: (mode: QuizMode) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ onSelectMode }) => {
  const handleSelect = (mode: QuizMode) => {
    soundManager.playClick();
    onSelectMode(mode);
  };

  return (
    <div className="py-6">
      {/* Title Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold tracking-wider uppercase mb-2 border border-amber-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          Pilihan Pembelajaran Interaktif
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
          Pilih Mod Kuiz
        </h2>
        <p className="text-slate-600 text-sm md:text-base max-w-xl mx-auto mt-1">
          Pilih mod kuiz pilihan anda untuk menguji pengetahuan sejarah tanah air berpandukan sukatan KSSR Semakan.
        </p>
      </div>

      {/* Grid of 4 Quiz Modes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
        
        {/* Mod 1: Kuiz Mengikut Topik */}
        <div
          onClick={() => handleSelect('topic')}
          className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-slate-200 hover:border-amber-400 cursor-pointer overflow-hidden flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-bl-full pointer-events-none transition-transform group-hover:scale-125" />
          
          <div>
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4 group-hover:bg-amber-600 group-hover:text-white transition shadow-xs">
              <BookOpen className="w-6 h-6" />
            </div>
            
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                Latihan Silibus
              </span>
              <span className="text-xs text-slate-400">Tahun 4 • 5 • 6</span>
            </div>

            <h3 className="text-xl font-bold text-slate-800 group-hover:text-amber-800 transition">
              Kuiz Mengikut Topik
            </h3>

            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Pilih Tahun dan unit pembelajaran tertentu. Sesuai untuk mengulang kaji topik yang baru diajar oleh guru di dalam kelas.
            </p>
          </div>

          <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between text-amber-700 font-bold text-sm">
            <span>Pilih Topik Sekarang</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition" />
          </div>
        </div>

        {/* Mod 2: Cabaran Kuiz Sejarah (Strict requirement name: Cabaran Kuiz Sejarah) */}
        <div
          onClick={() => handleSelect('speed_challenge')}
          className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-slate-200 hover:border-red-400 cursor-pointer overflow-hidden flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-bl-full pointer-events-none transition-transform group-hover:scale-125" />

          <div>
            <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-4 group-hover:bg-red-600 group-hover:text-white transition shadow-xs">
              <Zap className="w-6 h-6" />
            </div>

            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-red-700 bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
                Ujian Masa Pantas
              </span>
              <span className="text-xs text-slate-400">20 Saat / Soalan</span>
            </div>

            <h3 className="text-xl font-bold text-slate-800 group-hover:text-red-700 transition">
              Cabaran Kuiz Sejarah
            </h3>

            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Jawab 10 soalan pantas di bawah tekanan masa! Uji ketangkasan minda dan ketepatan ingatan fakta sejarah anda.
            </p>
          </div>

          <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between text-red-600 font-bold text-sm">
            <span>Mulakan Cabaran Kuiz Sejarah</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition" />
          </div>
        </div>

        {/* Mod 3: Kuiz Campuran KSSR */}
        <div
          onClick={() => handleSelect('mixed_kssr')}
          className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-slate-200 hover:border-indigo-400 cursor-pointer overflow-hidden flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-bl-full pointer-events-none transition-transform group-hover:scale-125" />

          <div>
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition shadow-xs">
              <Layers className="w-6 h-6" />
            </div>

            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                Ujian Komprehensif
              </span>
              <span className="text-xs text-slate-400">15 Soalan Menyeluruh</span>
            </div>

            <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-800 transition">
              Kuiz Campuran KSSR
            </h3>

            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Gabungan soalan terpilih daripada Tahun 4, 5, dan 6. Sesuai untuk persediaan ujian pengesanan & penilaian bilik darjah.
            </p>
          </div>

          <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between text-indigo-700 font-bold text-sm">
            <span>Mulakan Kuiz Campuran</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition" />
          </div>
        </div>

        {/* Mod 4: Kuiz Harian Sejarah */}
        <div
          onClick={() => handleSelect('daily_quiz')}
          className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-slate-200 hover:border-emerald-400 cursor-pointer overflow-hidden flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-bl-full pointer-events-none transition-transform group-hover:scale-125" />

          <div>
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition shadow-xs">
              <CalendarCheck className="w-6 h-6" />
            </div>

            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Latihan Harian
              </span>
              <span className="text-xs text-slate-400">5 Soalan Pantas</span>
            </div>

            <h3 className="text-xl font-bold text-slate-800 group-hover:text-emerald-800 transition">
              Kuiz Harian Sejarah
            </h3>

            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Lengkapkan 5 soalan pendek hari ini untuk mengekalkan rentak pembelajaran konsisten dan kumpul markah bonus harian!
            </p>
          </div>

          <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between text-emerald-700 font-bold text-sm">
            <span>Jawab Kuiz Harian</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition" />
          </div>
        </div>

      </div>
    </div>
  );
};
