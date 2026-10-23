export type YearLevel = 4 | 5 | 6;

export type QuizMode = 
  | 'topic'              // Mod Kuiz Mengikut Topik
  | 'speed_challenge'    // Cabaran Kuiz Sejarah (Ujian Pantas)
  | 'mixed_kssr'         // Kuiz Campuran KSSR (Tahun 4, 5, 6)
  | 'daily_quiz';        // Kuiz Harian Sejarah

export interface Question {
  id: string;
  year: YearLevel;
  topicId: string;
  topicTitle: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  hint: string;
  difficulty?: 'mudah' | 'sederhana' | 'mencabar';
}

export interface TopicInfo {
  id: string;
  unit: number;
  year: YearLevel;
  title: string;
  subtitle: string;
  iconName: string;
  color: string;
  questionCount?: number;
}

export interface UserAnswerRecord {
  questionId: string;
  question: string;
  options: string[];
  selectedIndex: number | null;
  correctAnswerIndex: number;
  isCorrect: boolean;
  timeSpentSeconds: number;
  explanation: string;
}

export interface QuizSessionSummary {
  mode: QuizMode;
  year?: YearLevel | 'Semua';
  topicTitle?: string;
  totalQuestions: number;
  correctAnswersCount: number;
  finalScore: number;
  accuracyPercentage: number;
  maxStreak: number;
  timeTakenSeconds: number;
  dateCompleted: string;
  answers: UserAnswerRecord[];
  badgeEarned: {
    title: string;
    description: string;
    tier: 'Emas' | 'Perak' | 'Gangsa' | 'Cemerlang';
  };
}

export interface SavedScoreEntry {
  id: string;
  studentName: string;
  date: string;
  mode: string;
  score: number;
  totalQuestions: number;
  accuracy: number;
  yearTitle: string;
}
