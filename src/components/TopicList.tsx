import React, { useState } from 'react';
import { YearLevel, TopicInfo } from '../types';
import { TOPICS, QUESTIONS } from '../data/quizData';
import { soundManager } from '../utils/audio';
import { 
  ArrowLeft, 
  Search, 
  BookOpen, 
  Snowflake, 
  Pickaxe, 
  Anchor, 
  Crown, 
  Shield, 
  Swords, 
  Compass, 
  MessageSquare, 
  Flag, 
  Flame, 
  Sparkles, 
  Award, 
  Flower2, 
  Globe, 
  MapPin, 
  HeartHandshake, 
  Users, 
  Medal, 
  TrendingUp, 
  Trophy,
  CheckCircle2,
  ChevronRight,
  Filter
} from 'lucide-react';

interface TopicListProps {
  onSelectTopic: (topic: TopicInfo) => void;
  onSelectFullYear: (year: YearLevel) => void;
  onBackToModes: () => void;
}

export const TopicList: React.FC<TopicListProps> = ({
  onSelectTopic,
  onSelectFullYear,
  onBackToModes,
}) => {
  const [selectedYear, setSelectedYear] = useState<YearLevel>(4);
  const [searchQuery, setSearchQuery] = useState('');

  // Icon mapping helper
  const renderTopicIcon = (iconName: string) => {
    const props = { className: 'w-6 h-6' };
    switch (iconName) {
      case 'BookOpen': return <BookOpen {...props} />;
      case 'Snowflake': return <Snowflake {...props} />;
      case 'Pickaxe': return <Pickaxe {...props} />;
      case 'Anchor': return <Anchor {...props} />;
      case 'Crown': return <Crown {...props} />;
      case 'Shield': return <Shield {...props} />;
      case 'Swords': return <Swords {...props} />;
      case 'Compass': return <Compass {...props} />;
      case 'MessageSquare': return <MessageSquare {...props} />;
      case 'Flag': return <Flag {...props} />;
      case 'Flame': return <Flame {...props} />;
      case 'Sparkles': return <Sparkles {...props} />;
      case 'Award': return <Award {...props} />;
      case 'Flower2': return <Flower2 {...props} />;
      case 'Globe': return <Globe {...props} />;
      case 'MapPin': return <MapPin {...props} />;
      case 'HeartHandshake': return <HeartHandshake {...props} />;
      case 'Users': return <Users {...props} />;
      case 'Medal': return <Medal {...props} />;
      case 'TrendingUp': return <TrendingUp {...props} />;
      case 'Trophy': return <Trophy {...props} />;
      default: return <BookOpen {...props} />;
    }
  };

  const filteredTopics = TOPICS.filter((t) => {
    const matchesYear = t.year === selectedYear;
    const matchesSearch = 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesYear && matchesSearch;
  });

  const yearQuestionsCount = QUESTIONS.filter(q => q.year === selectedYear).length;

  return (
    <div className="py-4">
      {/* Navigation Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <button
          onClick={() => {
            soundManager.playClick();
            onBackToModes();
          }}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-sm font-semibold border border-slate-200 shadow-xs cursor-pointer active:scale-95 transition"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500" />
          <span>Kembali ke Mod Kuiz</span>
        </button>

        <div className="text-right sm:text-right w-full sm:w-auto">
          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            KSSR Semakan • Sejarah Sekolah Rendah
          </span>
        </div>
      </div>

      {/* Year Tabs Selection */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 mb-6">
        <div className="grid grid-cols-3 gap-2">
          {([4, 5, 6] as YearLevel[]).map((yr) => {
            const isSelected = selectedYear === yr;
            return (
              <button
                key={yr}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedYear(yr);
                }}
                className={`flex flex-col items-center justify-center py-3.5 px-3 rounded-xl font-bold transition cursor-pointer ${
                  isSelected
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30 scale-[1.02]'
                    : 'bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-800'
                }`}
              >
                <span className="text-lg md:text-xl font-extrabold tracking-tight">
                  Tahun {yr}
                </span>
                <span className={`text-[11px] font-medium ${isSelected ? 'text-amber-100' : 'text-slate-500'}`}>
                  Silubus KSSR Semakan
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action / Search Bar & Full Year Quiz */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-5 rounded-2xl border border-amber-200/80 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1 w-full relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Cari topik atau unit Sejarah Tahun ${selectedYear}...`}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-xs"
          />
        </div>

        <button
          onClick={() => {
            soundManager.playClick();
            onSelectFullYear(selectedYear);
          }}
          className="w-full md:w-auto shrink-0 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-sm shadow-md shadow-amber-900/20 active:scale-95 transition cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-yellow-300" />
          <span>Jawab Semua Topik Tahun {selectedYear} ({yearQuestionsCount} Soalan)</span>
        </button>
      </div>

      {/* Topic Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-bold text-slate-800 text-base md:text-lg flex items-center gap-2">
            <Filter className="w-4 h-4 text-amber-600" />
            <span>Senarai Topik & Unit Sejarah Tahun {selectedYear}</span>
          </h3>
          <span className="text-xs font-semibold text-slate-500">
            {filteredTopics.length} Unit Dijumpai
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTopics.map((topic) => {
            const count = QUESTIONS.filter(q => q.topicId === topic.id).length;
            return (
              <div
                key={topic.id}
                onClick={() => {
                  soundManager.playClick();
                  onSelectTopic(topic);
                }}
                className="group bg-white rounded-2xl p-5 border-2 border-slate-200/80 hover:border-amber-500 shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center gap-4 active:scale-[0.99]"
              >
                {/* Topic Icon Banner */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${topic.color} text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform`}>
                  {renderTopicIcon(topic.iconName)}
                </div>

                {/* Topic Meta */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      Unit {topic.unit}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {count > 0 ? `${count} Soalan Kuiz` : 'Ulang Kaji'}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 group-hover:text-amber-800 transition truncate text-base">
                    {topic.title}
                  </h4>

                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                    {topic.subtitle}
                  </p>
                </div>

                <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-amber-100 group-hover:text-amber-700 text-slate-400 flex items-center justify-center shrink-0 transition">
                  <ChevronRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
