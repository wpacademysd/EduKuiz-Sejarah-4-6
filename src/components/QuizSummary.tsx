import React, { useEffect, useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { QuizSessionSummary, SavedScoreEntry } from '../types';
import { soundManager } from '../utils/audio';
import { 
  Trophy, 
  RotateCcw, 
  ListOrdered, 
  CheckCircle2, 
  XCircle, 
  Award, 
  Sparkles, 
  Share2, 
  Printer, 
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  UserCheck
} from 'lucide-react';

interface QuizSummaryProps {
  summary: QuizSessionSummary;
  onRetry: () => void;           // "Cuba Lagi"
  onSelectAnotherTopic: () => void;
  onGoHome: () => void;
}

export const QuizSummary: React.FC<QuizSummaryProps> = ({
  summary,
  onRetry,
  onSelectAnotherTopic,
  onGoHome,
}) => {
  const [showReview, setShowReview] = useState(false);
  const [studentName, setStudentName] = useState(() => {
    return localStorage.getItem('edukuiz_last_student_name') || 'Murid Sejarah';
  });
  const [isSaved, setIsSaved] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    soundManager.playFanfare();

    // Trigger confetti if score is at least 50%
    if (summary.accuracyPercentage >= 50) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#ec4899']
        });
      } catch {
        // Ignore if confetti not supported
      }
    }

    // Auto save score to local history
    try {
      const existing = localStorage.getItem('edukuiz_scores_history');
      const list: SavedScoreEntry[] = existing ? JSON.parse(existing) : [];
      const newEntry: SavedScoreEntry = {
        id: 'score_' + Date.now(),
        studentName: studentName || 'Murid Pintar',
        date: new Date().toLocaleDateString('ms-MY', { day: 'numeric', month: 'short', year: 'numeric' }),
        mode: summary.topicTitle || 'Kuiz Sejarah',
        score: summary.finalScore,
        totalQuestions: summary.totalQuestions,
        accuracy: summary.accuracyPercentage,
        yearTitle: summary.year ? `Tahun ${summary.year}` : 'KSSR Campuran'
      };
      list.unshift(newEntry);
      localStorage.setItem('edukuiz_scores_history', JSON.stringify(list.slice(0, 30)));
      setIsSaved(true);
    } catch {
      // Ignore storage errors
    }
  }, []);

  const handleSaveStudentName = (name: string) => {
    setStudentName(name);
    localStorage.setItem('edukuiz_last_student_name', name);
  };

  const handlePrintCertificate = () => {
    soundManager.playClick();
    window.print();
  };

  // Performance Evaluation & Badge
  const getPerformanceBadge = () => {
    const p = summary.accuracyPercentage;
    if (p >= 90) {
      return {
        title: 'Sejarawan Cilik Terbilang',
        desc: 'Penguasaan fakta sejarah yang amat cemerlang dan membanggakan!',
        color: 'from-amber-400 to-yellow-500 text-amber-950 border-amber-300',
        starCount: 5,
      };
    } else if (p >= 70) {
      return {
        title: 'Tokoh Ilmuwan Cemerlang',
        desc: 'Kefahaman sejarah yang sangat baik dan teliti!',
        color: 'from-blue-400 to-indigo-500 text-white border-blue-300',
        starCount: 4,
      };
    } else if (p >= 50) {
      return {
        title: 'Peneroka Sejarah Gigih',
        desc: 'Usaha yang baik! Tingkatkan lagi ulangkaji untuk skor tertinggi.',
        color: 'from-emerald-400 to-teal-500 text-white border-emerald-300',
        starCount: 3,
      };
    } else {
      return {
        title: 'Pahlawan Harapan',
        desc: 'Jangan berputus asa! Belajar semula fakta topik ini dan cuba lagi.',
        color: 'from-orange-400 to-rose-400 text-white border-orange-300',
        starCount: 2,
      };
    }
  };

  const badge = getPerformanceBadge();

  return (
    <div className="max-w-3xl mx-auto py-6">
      
      {/* Printable Certificate & Result Card */}
      <div 
        ref={certificateRef}
        className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border-4 border-amber-400/80 mb-6 text-center relative overflow-hidden"
      >
        {/* Subtle Decorative Background Frame */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500/10 rounded-br-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-amber-500/10 rounded-tl-full pointer-events-none" />

        {/* Brand & KSSR header on certificate */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="px-3 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold tracking-wide uppercase border border-amber-300">
            KSSR Semakan • Sekolah Rendah Malaysia
          </span>
        </div>

        {/* Required EXACT Term: "Kuiz tamat" */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-1">
          Kuiz tamat!
        </h2>
        <p className="text-xs md:text-sm text-slate-500 mb-6">
          EDUKUIZ SEJARAH • {summary.topicTitle || 'Cabaran Kuiz Sejarah'}
        </p>

        {/* Trophy / Badge Icon */}
        <div className="w-20 h-20 md:w-24 md:h-24 mx-auto rounded-3xl bg-gradient-to-br from-amber-400 to-yellow-500 p-1.5 shadow-lg shadow-amber-500/30 flex items-center justify-center mb-5 border-2 border-yellow-200 animate-pulse-subtle">
          <div className="w-full h-full rounded-2xl bg-amber-900 flex items-center justify-center text-yellow-300">
            <Trophy className="w-10 h-10 md:w-12 md:h-12" />
          </div>
        </div>

        {/* Student Name Display / Edit */}
        <div className="max-w-sm mx-auto mb-5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Nama Murid / Peserta
          </label>
          <div className="relative">
            <input
              type="text"
              value={studentName}
              onChange={(e) => handleSaveStudentName(e.target.value)}
              placeholder="Masukkan nama anda..."
              className="w-full text-center font-extrabold text-lg text-slate-800 py-1.5 px-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50/50"
            />
            <UserCheck className="w-4 h-4 text-amber-600 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Performance Badge Card */}
        <div className={`p-4 rounded-2xl bg-gradient-to-r ${badge.color} border shadow-xs mb-6 max-w-md mx-auto`}>
          <div className="flex items-center justify-center gap-1 mb-1">
            {Array.from({ length: badge.starCount }).map((_, i) => (
              <Sparkles key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>
          <h3 className="font-extrabold text-lg md:text-xl tracking-wide">
            {badge.title}
          </h3>
          <p className="text-xs opacity-90 mt-0.5 font-medium">
            {badge.desc}
          </p>
        </div>

        {/* Key Scores & Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-lg mx-auto mb-6">
          
          {/* Skor Akhir */}
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
            <span className="text-[10px] uppercase font-bold text-amber-800 block">
              Skor Terkumpul
            </span>
            <span className="text-xl md:text-2xl font-black text-amber-900">
              {summary.finalScore}
            </span>
            <span className="text-[10px] text-amber-700 block font-medium">Mata</span>
          </div>

          {/* Markah / Peratusan */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">
              Markah Tepat
            </span>
            <span className="text-xl md:text-2xl font-black text-slate-900">
              {summary.accuracyPercentage}%
            </span>
            <span className="text-[10px] text-slate-500 block font-medium">Ketepatan</span>
          </div>

          {/* Jawapan Betul */}
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
            <span className="text-[10px] uppercase font-bold text-emerald-800 block">
              Jawapan Betul
            </span>
            <span className="text-xl md:text-2xl font-black text-emerald-700">
              {summary.correctAnswersCount}/{summary.totalQuestions}
            </span>
            <span className="text-[10px] text-emerald-700 block font-medium">Soalan</span>
          </div>

          {/* Kombo Terbaik */}
          <div className="p-3 bg-orange-50 rounded-2xl border border-orange-200">
            <span className="text-[10px] uppercase font-bold text-orange-800 block">
              Kombo Terbaik
            </span>
            <span className="text-xl md:text-2xl font-black text-orange-700">
              {summary.maxStreak}x
            </span>
            <span className="text-[10px] text-orange-700 block font-medium">Berturut-turut</span>
          </div>

        </div>

        {/* Required EXACT Action Button: "Cuba Lagi" */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          
          <button
            onClick={() => {
              soundManager.playClick();
              onRetry();
            }}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-base shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Cuba Lagi</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onSelectAnotherTopic();
            }}
            className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm border border-slate-300 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition"
          >
            <span>Pilih Topik Lain</span>
          </button>

          <button
            onClick={handlePrintCertificate}
            className="w-full sm:w-auto px-4 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm border border-slate-300 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition shadow-xs"
            title="Cetak atau simpan sebagai PDF"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span className="hidden md:inline">Cetak Sijil</span>
          </button>

        </div>

      </div>

      {/* Review Answers Toggle Button */}
      <div className="mb-4">
        <button
          onClick={() => {
            soundManager.playClick();
            setShowReview(!showReview);
          }}
          className="w-full p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 shadow-xs flex items-center justify-between font-bold text-slate-800 text-sm cursor-pointer transition"
        >
          <div className="flex items-center gap-2">
            <ListOrdered className="w-5 h-5 text-amber-600" />
            <span>Semak Semula Jawapan & Penerangan Sejarah ({summary.answers.length} Soalan)</span>
          </div>
          {showReview ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>
      </div>

      {/* Detailed Review Section */}
      {showReview && (
        <div className="space-y-4 animate-fade-in mb-8">
          {summary.answers.map((ans, idx) => {
            const isCorrect = ans.isCorrect;
            return (
              <div 
                key={ans.questionId || idx}
                className={`p-5 rounded-2xl bg-white border-2 shadow-xs ${
                  isCorrect ? 'border-emerald-200' : 'border-rose-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      Masa Diambil: {ans.timeSpentSeconds}s
                    </span>
                  </div>

                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    {isCorrect ? 'Tepat (+100)' : 'Salah (0)'}
                  </span>
                </div>

                <p className="font-bold text-slate-900 text-sm md:text-base mb-3">
                  {ans.question}
                </p>

                {/* Option choices */}
                <div className="space-y-1.5 mb-3 text-xs md:text-sm">
                  {ans.options.map((opt, optIdx) => {
                    const isSelected = optIdx === ans.selectedIndex;
                    const isTheCorrectOne = optIdx === ans.correctAnswerIndex;

                    let bgClass = "bg-slate-50 text-slate-600 border-transparent";
                    if (isTheCorrectOne) {
                      bgClass = "bg-emerald-50 text-emerald-900 border-emerald-400 font-semibold";
                    } else if (isSelected && !isTheCorrectOne) {
                      bgClass = "bg-rose-50 text-rose-900 border-rose-400 font-medium";
                    }

                    return (
                      <div 
                        key={optIdx} 
                        className={`p-2.5 rounded-xl border flex items-center justify-between ${bgClass}`}
                      >
                        <span>{opt}</span>
                        {isTheCorrectOne && <span className="text-[11px] text-emerald-700 font-bold ml-2">✓ Jawapan Sebenar</span>}
                        {isSelected && !isTheCorrectOne && <span className="text-[11px] text-rose-700 font-bold ml-2">✗ Pilihan Anda</span>}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-950">
                  <span className="font-bold">Penerangan Buku Teks KSSR: </span>
                  {ans.explanation}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Return home link */}
      <div className="text-center pt-2">
        <button
          onClick={() => {
            soundManager.playClick();
            onGoHome();
          }}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Laman Utama EDUKUIZ</span>
        </button>
      </div>

    </div>
  );
};
