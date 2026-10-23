import React, { useState, useEffect } from 'react';
import { 
  QuizMode, 
  Question, 
  TopicInfo, 
  YearLevel, 
  UserAnswerRecord, 
  QuizSessionSummary 
} from './types';
import { QUESTIONS, TOPICS } from './data/quizData';
import { soundManager } from './utils/audio';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ModeSelector } from './components/ModeSelector';
import { TopicList } from './components/TopicList';
import { QuizCard } from './components/QuizCard';
import { QuizSummary } from './components/QuizSummary';
import { LeaderboardModal } from './components/LeaderboardModal';
import { GlossaryModal } from './components/GlossaryModal';
import { 
  Sparkles, 
  Compass, 
  BookOpen, 
  Trophy, 
  Clock, 
  ShieldCheck, 
  Award,
  Zap,
  ArrowRight,
  Flame
} from 'lucide-react';

type ScreenState = 'home' | 'topic_selection' | 'quiz_active' | 'quiz_summary';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('home');
  const [activeMode, setActiveMode] = useState<QuizMode>('topic');
  const [selectedTopic, setSelectedTopic] = useState<TopicInfo | null>(null);
  const [selectedYear, setSelectedYear] = useState<YearLevel | 'Semua'>('Semua');

  // Quiz execution state
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [collectedAnswers, setCollectedAnswers] = useState<UserAnswerRecord[]>([]);
  const [quizStartTime, setQuizStartTime] = useState<number>(0);
  const [completedSummary, setCompletedSummary] = useState<QuizSessionSummary | null>(null);

  // Audio mute state
  const [isMuted, setIsMuted] = useState<boolean>(() => soundManager.getMuted());

  // Modal dialog states
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState<boolean>(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState<boolean>(false);

  const handleToggleMute = () => {
    const updated = soundManager.toggleMute();
    setIsMuted(updated);
  };

  // Start Quiz with specific questions set
  const startQuizWithQuestions = (
    questionsList: Question[], 
    mode: QuizMode, 
    topicTitle?: string,
    year?: YearLevel | 'Semua'
  ) => {
    if (questionsList.length === 0) {
      alert('Tiada soalan dijumpai untuk pilihan ini.');
      return;
    }

    // Shuffle questions
    const shuffled = [...questionsList].sort(() => 0.5 - Math.random());
    setActiveQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setCurrentScore(0);
    setCurrentStreak(0);
    setMaxStreak(0);
    setCollectedAnswers([]);
    setActiveMode(mode);
    setQuizStartTime(Date.now());
    setCurrentScreen('quiz_active');
  };

  // Mode Selection Handler
  const handleSelectMode = (mode: QuizMode) => {
    setActiveMode(mode);

    if (mode === 'topic') {
      // Go to topic selection screen
      setCurrentScreen('topic_selection');
    } else if (mode === 'speed_challenge') {
      // Cabaran Kuiz Sejarah: 10 quick random questions
      const pool = [...QUESTIONS].sort(() => 0.5 - Math.random()).slice(0, 10);
      setSelectedTopic(null);
      setSelectedYear('Semua');
      startQuizWithQuestions(pool, 'speed_challenge', 'Cabaran Kuiz Sejarah', 'Semua');
    } else if (mode === 'mixed_kssr') {
      // Kuiz Campuran KSSR: 15 questions across Year 4, 5, 6
      const q4 = QUESTIONS.filter(q => q.year === 4).sort(() => 0.5 - Math.random()).slice(0, 5);
      const q5 = QUESTIONS.filter(q => q.year === 5).sort(() => 0.5 - Math.random()).slice(0, 5);
      const q6 = QUESTIONS.filter(q => q.year === 6).sort(() => 0.5 - Math.random()).slice(0, 5);
      const mixed = [...q4, ...q5, ...q6].sort(() => 0.5 - Math.random());
      setSelectedTopic(null);
      setSelectedYear('Semua');
      startQuizWithQuestions(mixed, 'mixed_kssr', 'Kuiz Campuran KSSR', 'Semua');
    } else if (mode === 'daily_quiz') {
      // Daily 5 questions
      const daily = [...QUESTIONS].sort(() => 0.5 - Math.random()).slice(0, 5);
      setSelectedTopic(null);
      setSelectedYear('Semua');
      startQuizWithQuestions(daily, 'daily_quiz', 'Kuiz Harian Sejarah', 'Semua');
    }
  };

  // Topic selected from list
  const handleSelectSpecificTopic = (topic: TopicInfo) => {
    setSelectedTopic(topic);
    setSelectedYear(topic.year);
    const topicQuestions = QUESTIONS.filter(q => q.topicId === topic.id);
    
    // If fewer than 5, supplement with other questions from that same year
    let finalQuestions = [...topicQuestions];
    if (finalQuestions.length < 5) {
      const extra = QUESTIONS.filter(q => q.year === topic.year && q.topicId !== topic.id);
      finalQuestions = [...finalQuestions, ...extra].slice(0, 6);
    }
    
    startQuizWithQuestions(finalQuestions, 'topic', `Unit ${topic.unit}: ${topic.title}`, topic.year);
  };

  // Full Year selected from list
  const handleSelectFullYear = (year: YearLevel) => {
    setSelectedTopic(null);
    setSelectedYear(year);
    const yearQuestions = QUESTIONS.filter(q => q.year === year);
    startQuizWithQuestions(yearQuestions, 'topic', `Semua Topik Sejarah Tahun ${year}`, year);
  };

  // Answer Selected in QuizCard
  const handleAnswerSelected = (record: UserAnswerRecord, pointsAwarded: number) => {
    const updatedAnswers = [...collectedAnswers, record];
    setCollectedAnswers(updatedAnswers);

    let newStreak = currentStreak;
    if (record.isCorrect) {
      newStreak = currentStreak + 1;
      setCurrentStreak(newStreak);
      if (newStreak > maxStreak) {
        setMaxStreak(newStreak);
      }
    } else {
      setCurrentStreak(0);
    }

    const updatedScore = currentScore + pointsAwarded;
    setCurrentScore(updatedScore);

    // After brief delay, proceed to next question or complete quiz
    setTimeout(() => {
      if (currentQuestionIndex + 1 < activeQuestions.length) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        finishQuizSession(updatedAnswers, updatedScore, Math.max(maxStreak, newStreak));
      }
    }, 1500);
  };

  // Complete Quiz Session
  const finishQuizSession = (answers: UserAnswerRecord[], finalPoints: number, peakStreak: number) => {
    const totalQ = answers.length;
    const correctCount = answers.filter(a => a.isCorrect).length;
    const accuracy = totalQ > 0 ? Math.round((correctCount / totalQ) * 100) : 0;
    const timeSpent = Math.max(1, Math.round((Date.now() - quizStartTime) / 1000));

    let tier: 'Emas' | 'Perak' | 'Gangsa' | 'Cemerlang' = 'Cemerlang';
    if (accuracy >= 90) tier = 'Emas';
    else if (accuracy >= 70) tier = 'Perak';
    else if (accuracy >= 50) tier = 'Gangsa';

    const summary: QuizSessionSummary = {
      mode: activeMode,
      year: selectedYear,
      topicTitle: selectedTopic ? `Unit ${selectedTopic.unit}: ${selectedTopic.title}` : (activeMode === 'speed_challenge' ? 'Cabaran Kuiz Sejarah' : 'Kuiz Sejarah KSSR'),
      totalQuestions: totalQ,
      correctAnswersCount: correctCount,
      finalScore: finalPoints,
      accuracyPercentage: accuracy,
      maxStreak: peakStreak,
      timeTakenSeconds: timeSpent,
      dateCompleted: new Date().toLocaleDateString('ms-MY'),
      answers,
      badgeEarned: {
        title: accuracy >= 80 ? 'Pakar Sejarah KSSR' : 'Peneroka Sejarah',
        description: `Menjawab ${correctCount} daripada ${totalQ} soalan dengan tepat.`,
        tier,
      }
    };

    setCompletedSummary(summary);
    setCurrentScreen('quiz_summary');
  };

  // Retry same quiz ("Cuba Lagi")
  const handleRetry = () => {
    if (activeQuestions.length > 0) {
      startQuizWithQuestions(
        activeQuestions, 
        activeMode, 
        completedSummary?.topicTitle,
        selectedYear
      );
    } else {
      setCurrentScreen('home');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
      
      {/* Top Header */}
      <Header
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onOpenGlossary={() => setIsGlossaryOpen(true)}
        onGoHome={() => {
          soundManager.playClick();
          setCurrentScreen('home');
        }}
        currentMode={activeMode}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        
        {/* SCREEN 1: HOME */}
        {currentScreen === 'home' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Hero Welcome Banner */}
            <div className="relative rounded-3xl bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 text-white p-6 md:p-10 shadow-xl overflow-hidden border-2 border-amber-400">
              {/* Background Glow */}
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-yellow-400/20 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/30 border border-amber-300/40 text-amber-200 text-xs font-bold uppercase tracking-wider mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  KSSR Semakan • Sekolah Rendah Malaysia
                </div>

                <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-2">
                  Belajar Sejarah Sambil Menjawab Kuiz!
                </h2>

                <p className="text-sm md:text-base text-amber-100 font-medium leading-relaxed mb-6">
                  Selamat datang ke platform kuiz interaktif khas untuk murid Tahun 4, 5, dan 6. Terokai kehebatan tamadun Melaka, zaman prasejarah, kedaulatan raja-raja, pejuang kemerdekaan, hingga pembentukan Malaysia!
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setCurrentScreen('topic_selection');
                    }}
                    className="px-6 py-3.5 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-amber-950 font-extrabold text-sm md:text-base shadow-lg shadow-yellow-500/20 flex items-center gap-2 cursor-pointer active:scale-95 transition"
                  >
                    <span>Mula Jawab Kuiz Sekarang</span>
                    <ArrowRight className="w-4 h-4 text-amber-950" />
                  </button>

                  <button
                    onClick={() => {
                      soundManager.playClick();
                      handleSelectMode('speed_challenge');
                    }}
                    className="px-5 py-3.5 rounded-2xl bg-amber-950/60 hover:bg-amber-950/80 border border-amber-400/50 text-white font-bold text-sm flex items-center gap-2 cursor-pointer active:scale-95 transition"
                  >
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span>Cabaran Kuiz Sejarah Pantas</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Curriculum Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase text-slate-400 block">Silibus Lengkap</span>
                  <span className="text-sm md:text-base font-extrabold text-slate-800">Tahun 4, 5 & 6</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Award className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase text-slate-400 block">Koleksi Soalan</span>
                  <span className="text-sm md:text-base font-extrabold text-slate-800">{QUESTIONS.length}+ Soalan KSSR</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase text-slate-400 block">Penerangan Sejarah</span>
                  <span className="text-sm md:text-base font-extrabold text-slate-800">Rujukan Buku Teks</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase text-slate-400 block">Ganjaran Markah</span>
                  <span className="text-sm md:text-base font-extrabold text-slate-800">Sijil & Skor Terbaik</span>
                </div>
              </div>
            </div>

            {/* Mod Kuiz Selection Component */}
            <ModeSelector onSelectMode={handleSelectMode} />

          </div>
        )}

        {/* SCREEN 2: TOPIC SELECTION */}
        {currentScreen === 'topic_selection' && (
          <TopicList
            onSelectTopic={handleSelectSpecificTopic}
            onSelectFullYear={handleSelectFullYear}
            onBackToModes={() => {
              soundManager.playClick();
              setCurrentScreen('home');
            }}
          />
        )}

        {/* SCREEN 3: QUIZ ACTIVE (MENJAWAB KUIZ) */}
        {currentScreen === 'quiz_active' && activeQuestions.length > 0 && (
          <QuizCard
            question={activeQuestions[currentQuestionIndex]}
            currentIndex={currentQuestionIndex}
            totalQuestions={activeQuestions.length}
            mode={activeMode}
            currentScore={currentScore}
            currentStreak={currentStreak}
            onAnswerSelected={handleAnswerSelected}
            onExitQuiz={() => {
              soundManager.playClick();
              setCurrentScreen('home');
            }}
          />
        )}

        {/* SCREEN 4: QUIZ SUMMARY ("Kuiz tamat") */}
        {currentScreen === 'quiz_summary' && completedSummary && (
          <QuizSummary
            summary={completedSummary}
            onRetry={handleRetry}
            onSelectAnotherTopic={() => {
              soundManager.playClick();
              setCurrentScreen('topic_selection');
            }}
            onGoHome={() => {
              soundManager.playClick();
              setCurrentScreen('home');
            }}
          />
        )}

      </main>

      {/* Footer */}
      <Footer />

      {/* Leaderboard Modal */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
      />

      {/* History Facts Modal */}
      <GlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
      />

    </div>
  );
}
