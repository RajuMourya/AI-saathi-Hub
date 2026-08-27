import React from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { CATEGORIES } from '../data/categories';
import { Search, Sparkles, Shield, Zap, CheckCircle2, ChevronRight } from 'lucide-react';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onCategorySelect: (catId: string) => void;
  lang: Language;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  onSearchChange,
  onCategorySelect,
  lang
}) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="relative pt-8 pb-10 sm:pt-12 sm:pb-14 px-4 sm:px-6 max-w-6xl mx-auto text-center">
      {/* BADGE */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-6 shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        <span>100+ Free Browser-Side Tools — No Server Uploads</span>
      </div>

      {/* HEADLINE */}
      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight sm:leading-none mb-4">
        {lang === 'hi' ? '100+ फ्री ऑनलाइन टूल्स' : '100+ Free Daily Tools'}
        <span className="block text-blue-600 dark:text-blue-400 mt-1">
          {lang === 'hi' ? 'एक वेबसाइट, हर काम आसान' : 'One Platform, Everyday Solved'}
        </span>
      </h1>

      <p className="max-w-2xl mx-auto text-slate-600 dark:text-slate-300 text-sm sm:text-base sm:leading-relaxed mb-8 font-normal">
        {t.subheading}
      </p>

      {/* SEARCH BAR */}
      <div className="max-w-2xl mx-auto relative mb-6">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
          <input
            type="text"
            id="main-hero-search-input"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-12 pr-10 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-sm sm:text-base shadow-lg shadow-slate-200/50 dark:shadow-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-4 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* CATEGORY CHIPS */}
      <div className="flex items-center justify-center flex-wrap gap-2 max-w-4xl mx-auto text-xs">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => onCategorySelect(cat.id)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 dark:bg-slate-800/80 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition border border-slate-200/60 dark:border-slate-700/60"
          >
            {lang === 'hi' ? cat.nameHi : cat.name} ({cat.count})
          </button>
        ))}
      </div>
    </div>
  );
};
