import React, { useState, useEffect } from 'react';
import { SavedScoreEntry } from '../types';
import { soundManager } from '../utils/audio';
import { Award, X, Trash2, Calendar, Trophy, Sparkles } from 'lucide-react';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose }) => {
  const [scores, setScores] = useState<SavedScoreEntry[]>([]);

  useEffect(() => {
    if (isOpen) {
      try {
        const raw = localStorage.getItem('edukuiz_scores_history');
        if (raw) {
          setScores(JSON.parse(raw));
        } else {
          // Pre-populate with high marks as motivation
          setScores([
            {
              id: 'init_1',
              studentName: 'Ahmad Daniel',
              date: 'Hari ini',
              mode: 'Pengasas Kesultanan Melaka',
              score: 950,
              totalQuestions: 10,
              accuracy: 100,
              yearTitle: 'Tahun 4'
            },
            {
              id: 'init_2',
              studentName: 'Siti Sarah',
              date: 'Semalam',
              mode: 'Cabaran Kuiz Sejarah',
              score: 880,
              totalQuestions: 10,
              accuracy: 90,
              yearTitle: 'KSSR Pantas'
            },
            {
              id: 'init_3',
              studentName: 'Kavitha Devi',
              date: '2 hari lalu',
              mode: 'Pembentukan Malaysia 1963',
              score: 820,
              totalQuestions: 10,
              accuracy: 90,
              yearTitle: 'Tahun 6'
            }
          ]);
        }
      } catch {
        setScores([]);
      }
    }
  }, [isOpen]);

  const handleClearHistory = () => {
    if (confirm('Padam semua rekod skor anda dari peranti ini?')) {
      soundManager.playClick();
      localStorage.removeItem('edukuiz_scores_history');
      setScores([]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-800">
                Rekod Skor & Papan Pencapaian
              </h3>
              <p className="text-xs text-slate-500">
                EDUKUIZ SEJARAH • Prestasi Murid
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

        {/* List Content */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {scores.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Award className="w-12 h-12 mx-auto mb-2 text-slate-300 stroke-1" />
              <p className="text-sm font-semibold text-slate-600">Belum Ada Rekod Skor</p>
              <p className="text-xs text-slate-400 mt-1">Jawab kuiz sekarang untuk melihat nama dan markah anda di sini!</p>
            </div>
          ) : (
            scores.map((entry, idx) => (
              <div 
                key={entry.id || idx}
                className="p-3.5 rounded-2xl bg-slate-50 hover:bg-amber-50/60 border border-slate-200/80 transition flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                    idx === 0 
                      ? 'bg-amber-400 text-amber-950 shadow-xs' 
                      : idx === 1 
                      ? 'bg-slate-300 text-slate-800' 
                      : idx === 2 
                      ? 'bg-amber-700 text-white' 
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    #{idx + 1}
                  </div>

                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 text-sm truncate">
                      {entry.studentName}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span className="font-semibold text-amber-800">{entry.yearTitle}</span>
                      <span>•</span>
                      <span className="truncate">{entry.mode}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-black text-amber-900 text-base">
                    {entry.score} <span className="text-[11px] font-bold text-amber-700">Mata</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">
                    {entry.accuracy}% Tepat • {entry.date}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-2">
          {scores.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 font-semibold cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Kosongkan Rekod</span>
            </button>
          )}

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="ml-auto px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition cursor-pointer"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
