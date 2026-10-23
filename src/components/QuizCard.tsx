import React, { useState, useEffect, useRef } from 'react';
import { Question, UserAnswerRecord, QuizMode } from '../types';
import { soundManager } from '../utils/audio';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  HelpCircle, 
  Lightbulb, 
  Zap, 
  Flame, 
  ArrowRight,
  BookOpen,
  Award,
  AlertTriangle
} from 'lucide-react';

interface QuizCardProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  mode: QuizMode;
  currentScore: number;
  currentStreak: number;
  onAnswerSelected: (record: UserAnswerRecord, pointsAwarded: number) => void;
  onExitQuiz: () => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  currentIndex,
  totalQuestions,
  mode,
  currentScore,
  currentStreak,
  onAnswerSelected,
  onExitQuiz,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [removedOptions, setRemovedOptions] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [lifeline5050Used, setLifeline5050Used] = useState(false);
  const [lifelineHintUsed, setLifelineHintUsed] = useState(false);
  const [lifelineTimeUsed, setLifelineTimeUsed] = useState(false);

  // Timer: 20 seconds for speed challenge, 30 seconds for standard modes
  const initialTime = mode === 'speed_challenge' ? 20 : 35;
  const [timeLeft, setTimeLeft] = useState<number>(initialTime);
  const startTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset state on question change
  useEffect(() => {
    setSelectedIndex(null);
    setIsAnswered(false);
    setRemovedOptions([]);
    setShowHint(false);
    const timeForThisQuestion = mode === 'speed_challenge' ? 20 : 35;
    setTimeLeft(timeForThisQuestion);
    startTimeRef.current = Date.now();
  }, [question, mode]);

  // Countdown timer effect
  useEffect(() => {
    if (isAnswered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleTimeOut();
          return 0;
        }
        if (prev <= 5 && prev > 1) {
          soundManager.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAnswered, question]);

  const handleTimeOut = () => {
    if (isAnswered) return;
    setIsAnswered(true);
    setSelectedIndex(null);
    soundManager.playIncorrect();

    const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
    const record: UserAnswerRecord = {
      questionId: question.id,
      question: question.question,
      options: question.options,
      selectedIndex: null,
      correctAnswerIndex: question.correctAnswerIndex,
      isCorrect: false,
      timeSpentSeconds: timeSpent,
      explanation: question.explanation,
    };

    onAnswerSelected(record, 0);
  };

  const handleOptionClick = (idx: number) => {
    if (isAnswered || removedOptions.includes(idx)) return;

    if (timerRef.current) clearInterval(timerRef.current);

    setSelectedIndex(idx);
    setIsAnswered(true);

    const isCorrect = idx === question.correctAnswerIndex;
    const timeSpent = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));

    // Calculate score
    let points = 0;
    if (isCorrect) {
      soundManager.playCorrect();
      const basePoints = 100;
      const speedBonus = Math.max(0, timeLeft * 2);
      const streakBonus = currentStreak * 15;
      points = basePoints + speedBonus + streakBonus;
    } else {
      soundManager.playIncorrect();
    }

    const record: UserAnswerRecord = {
      questionId: question.id,
      question: question.question,
      options: question.options,
      selectedIndex: idx,
      correctAnswerIndex: question.correctAnswerIndex,
      isCorrect,
      timeSpentSeconds: timeSpent,
      explanation: question.explanation,
    };

    onAnswerSelected(record, points);
  };

  // Lifelines
  const use5050 = () => {
    if (lifeline5050Used || isAnswered) return;
    soundManager.playClick();
    setLifeline5050Used(true);

    const incorrectIndices = question.options
      .map((_, i) => i)
      .filter((i) => i !== question.correctAnswerIndex);

    // Shuffle and pick 2
    const shuffled = [...incorrectIndices].sort(() => 0.5 - Math.random());
    setRemovedOptions(shuffled.slice(0, 2));
  };

  const useHint = () => {
    if (lifelineHintUsed || isAnswered) return;
    soundManager.playClick();
    setLifelineHintUsed(true);
    setShowHint(true);
  };

  const useAddTime = () => {
    if (lifelineTimeUsed || isAnswered) return;
    soundManager.playClick();
    setLifelineTimeUsed(true);
    setTimeLeft((prev) => prev + 15);
  };

  const progressPercent = ((currentIndex + 1) / totalQuestions) * 100;
  const isTimeCritical = timeLeft <= 5;
  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="max-w-3xl mx-auto py-4">
      {/* Quiz Top Status Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 mb-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          
          {/* Question Counter */}
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 font-extrabold flex items-center justify-center text-sm border border-amber-300">
              {currentIndex + 1}
            </span>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                Kemajuan Kuiz
              </p>
              <p className="text-xs font-semibold text-slate-700">
                Soalan {currentIndex + 1} daripada {totalQuestions}
              </p>
            </div>
          </div>

          {/* Combo / Streak Indicator */}
          {currentStreak > 1 && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-full border border-amber-300 text-amber-800 text-xs font-bold animate-bounce">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span>Kombo {currentStreak}x Berturut-turut!</span>
            </div>
          )}

          {/* Current Score */}
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <Award className="w-4 h-4 text-yellow-500" />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Skor Semasa</span>
              <span className="text-sm font-extrabold text-slate-800">{currentScore} Mata</span>
            </div>
          </div>

          {/* Timer Countdown */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-sm border transition ${
            isTimeCritical 
              ? 'bg-red-50 text-red-600 border-red-300 animate-pulse'
              : 'bg-slate-50 text-slate-700 border-slate-200'
          }`}>
            <Clock className={`w-4 h-4 ${isTimeCritical ? 'text-red-500' : 'text-slate-500'}`} />
            <span>{timeLeft}s</span>
          </div>

        </div>

        {/* Progress Bar Line */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full mt-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-amber-500 to-amber-600 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Lifeline Tools */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Talian Bantuan:</span>
          
          {/* 50:50 */}
          <button
            onClick={use5050}
            disabled={lifeline5050Used || isAnswered}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 border transition cursor-pointer ${
              lifeline5050Used || isAnswered
                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                : 'bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50 active:scale-95 shadow-xs'
            }`}
            title="Keluarkan 2 jawapan salah"
          >
            <span>50:50</span>
          </button>

          {/* Petunjuk Sejarah */}
          <button
            onClick={useHint}
            disabled={lifelineHintUsed || isAnswered}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 border transition cursor-pointer ${
              lifelineHintUsed || isAnswered
                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                : 'bg-white text-amber-700 border-amber-200 hover:bg-amber-50 active:scale-95 shadow-xs'
            }`}
            title="Dapatkan petunjuk fakta sejarah"
          >
            <Lightbulb className="w-3 h-3 text-amber-500" />
            <span>Petunjuk</span>
          </button>

          {/* Tambah Masa */}
          <button
            onClick={useAddTime}
            disabled={lifelineTimeUsed || isAnswered}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 border transition cursor-pointer ${
              lifelineTimeUsed || isAnswered
                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                : 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50 active:scale-95 shadow-xs'
            }`}
            title="Tambah masa 15 saat"
          >
            <Zap className="w-3 h-3 text-emerald-500" />
            <span>+15s Masa</span>
          </button>
        </div>

        <button
          onClick={() => {
            soundManager.playClick();
            if (confirm('Adakah anda pasti mahu menamatkan kuiz ini sekarang?')) {
              onExitQuiz();
            }
          }}
          className="text-xs text-slate-500 hover:text-red-600 transition font-medium cursor-pointer"
        >
          Keluar Kuiz
        </button>
      </div>

      {/* Hint Alert Box if triggered */}
      {showHint && (
        <div className="mb-4 p-3.5 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-2.5 text-amber-900 text-xs md:text-sm animate-fade-in shadow-xs">
          <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Petunjuk Sejarah KSSR:</span>
            <span>{question.hint}</span>
          </div>
        </div>
      )}

      {/* Main Question Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-md border-2 border-slate-200/90 mb-5 relative overflow-hidden">
        
        {/* Topic Tag */}
        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs border border-amber-200 flex items-center gap-1.5">
            <BookOpen className="w-3 h-3 text-amber-700" />
            <span>Tahun {question.year} • {question.topicTitle}</span>
          </span>
          <span className="text-[11px] text-slate-400 capitalize font-medium">
            Tahap: {question.difficulty || 'Sederhana'}
          </span>
        </div>

        {/* Question Text */}
        <h3 className="text-xl md:text-2xl font-bold text-slate-900 leading-snug tracking-tight mb-6">
          {question.question}
        </h3>

        {/* Answer Options Grid */}
        <div className="space-y-3">
          {question.options.map((option, idx) => {
            const isRemoved = removedOptions.includes(idx);
            if (isRemoved) {
              return (
                <div 
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 opacity-40 text-slate-400 text-sm flex items-center gap-3"
                >
                  <span className="w-7 h-7 rounded-lg bg-slate-200 text-slate-400 flex items-center justify-center font-bold text-xs">
                    {optionLetters[idx]}
                  </span>
                  <span className="italic">Pilihan jawapan telah disingkirkan (50:50)</span>
                </div>
              );
            }

            // Styling states
            let cardStyle = "bg-white border-slate-200 hover:border-amber-400 hover:bg-amber-50/40 text-slate-800";
            let letterStyle = "bg-slate-100 text-slate-700 group-hover:bg-amber-500 group-hover:text-white";
            let indicator = null;

            if (isAnswered) {
              if (idx === question.correctAnswerIndex) {
                // Correct answer
                cardStyle = "bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold shadow-xs ring-2 ring-emerald-400/50";
                letterStyle = "bg-emerald-600 text-white";
                indicator = <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
              } else if (idx === selectedIndex) {
                // Wrong answer selected by student
                cardStyle = "bg-rose-50 border-rose-500 text-rose-950 shadow-xs ring-2 ring-rose-400/50";
                letterStyle = "bg-rose-600 text-white";
                indicator = <XCircle className="w-5 h-5 text-rose-600 shrink-0" />;
              } else {
                cardStyle = "bg-slate-50 border-slate-200 text-slate-400 opacity-60";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                disabled={isAnswered}
                className={`w-full text-left p-4 md:p-4.5 rounded-2xl border-2 transition duration-200 flex items-center justify-between gap-3 group cursor-pointer ${cardStyle} ${
                  !isAnswered ? 'active:scale-[0.99]' : ''
                }`}
              >
                <div className="flex items-center gap-3.5 flex-1">
                  <span className={`w-8 h-8 rounded-xl font-extrabold text-sm flex items-center justify-center shrink-0 transition ${letterStyle}`}>
                    {optionLetters[idx]}
                  </span>
                  <span className="text-sm md:text-base leading-snug">
                    {option}
                  </span>
                </div>
                {indicator}
              </button>
            );
          })}
        </div>

        {/* Explanation Box shown after answering */}
        {isAnswered && (
          <div className="mt-6 pt-5 border-t border-slate-200 animate-fade-in">
            <div className={`p-4 rounded-2xl border ${
              selectedIndex === question.correctAnswerIndex
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                : selectedIndex === null
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-rose-50/80 border-rose-200 text-rose-950'
            }`}>
              <div className="flex items-center gap-2 mb-1.5 font-bold text-sm">
                {selectedIndex === question.correctAnswerIndex ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Jawapan Tepat! Tahniah!</span>
                  </>
                ) : selectedIndex === null ? (
                  <>
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Masa Telah Tamat!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span>Jawapan Kurang Tepat</span>
                  </>
                )}
              </div>

              <p className="text-xs md:text-sm leading-relaxed text-slate-700">
                <span className="font-semibold text-slate-900">Penerangan Sejarah: </span>
                {question.explanation}
              </p>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
