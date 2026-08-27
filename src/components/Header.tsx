import React, { useState } from 'react';
import { ViewState, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { Sparkles, Sun, Moon, Search, Menu, X, Star, History, Grid, Layers, ShieldCheck, HardDrive, FileSpreadsheet, Mail } from 'lucide-react';

interface HeaderProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  onOpenSearch: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  lang: Language;
  onToggleLang: () => void;
  favoritesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenSearch,
  theme,
  onToggleTheme,
  lang,
  onToggleLang,
  favoritesCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = TRANSLATIONS[lang];

  const handleNav = (view: ViewState) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* LOGO & BRAND */}
        <div
          onClick={() => handleNav({ type: 'home' })}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            AI
          </div>
          <div>
            <div className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {t.brandName}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-none hidden sm:block">
              100+ Free Daily Tools
            </div>
          </div>
        </div>

        {/* DESKTOP NAV LINKS */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <button
            onClick={() => handleNav({ type: 'home' })}
            className={`px-3 py-1.5 rounded-lg hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition ${currentView.type === 'home' ? 'text-blue-600 dark:text-blue-400 font-bold' : ''}`}
          >
            {t.home}
          </button>
          <button
            onClick={() => handleNav({ type: 'all-tools' })}
            className={`px-3 py-1.5 rounded-lg hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition ${currentView.type === 'all-tools' ? 'text-blue-600 dark:text-blue-400 font-bold' : ''}`}
          >
            {t.allTools} (100)
          </button>
          <button
            onClick={() => handleNav({ type: 'favorites' })}
            className={`px-3 py-1.5 rounded-lg hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1 ${currentView.type === 'favorites' ? 'text-blue-600 dark:text-blue-400 font-bold' : ''}`}
          >
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>Favorites</span>
            {favoritesCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-800 text-[10px]">
                {favoritesCount}
              </span>
            )}
          </button>
          <button
            onClick={() => handleNav({ type: 'history' })}
            className={`px-3 py-1.5 rounded-lg hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1 ${currentView.type === 'history' ? 'text-blue-600 dark:text-blue-400 font-bold' : ''}`}
          >
            <History className="w-3.5 h-3.5 text-slate-400" />
            <span>History</span>
          </button>
          <button
            onClick={() => handleNav({ type: 'feedback' })}
            className={`px-3 py-1.5 rounded-lg hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition ${currentView.type === 'feedback' ? 'text-blue-600 dark:text-blue-400 font-bold' : ''}`}
          >
            {t.feedback}
          </button>
          <button
            onClick={() => handleNav({ type: 'drive' })}
            className={`px-3 py-1.5 rounded-lg hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5 ${currentView.type === 'drive' ? 'text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-950/50' : ''}`}
            title="Google Drive Cloud Manager"
          >
            <HardDrive className="w-3.5 h-3.5 text-blue-500" />
            <span>{t.googleDrive}</span>
          </button>
          <button
            onClick={() => handleNav({ type: 'sheets' })}
            className={`px-3 py-1.5 rounded-lg hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5 ${currentView.type === 'sheets' ? 'text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/50' : ''}`}
            title="Google Sheets Cloud Manager"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
            <span>{t.googleSheets}</span>
          </button>
          <button
            onClick={() => handleNav({ type: 'gmail' })}
            className={`px-3 py-1.5 rounded-lg hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5 ${currentView.type === 'gmail' ? 'text-red-600 dark:text-red-400 font-bold bg-red-50 dark:bg-red-950/50' : ''}`}
            title="Gmail Cloud Integration"
          >
            <Mail className="w-3.5 h-3.5 text-red-500" />
            <span>{t.gmail}</span>
          </button>
        </nav>

        {/* UTILITY ACTIONS: SEARCH, LANG, THEME */}
        <div className="flex items-center gap-2">
          {/* SEARCH BUTTON */}
          <button
            id="header-search-btn"
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium transition"
            title="Search 100+ Tools"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search...</span>
            <kbd className="hidden lg:inline text-[10px] font-mono bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-400">
              ⌘K
            </kbd>
          </button>

          {/* LANGUAGE TOGGLE */}
          <button
            onClick={onToggleLang}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            title="Switch Language / भाषा बदलें"
          >
            {lang === 'en' ? 'हिन्दी' : 'EN'}
          </button>

          {/* THEME TOGGLE */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            title="Toggle Dark Mode"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* MOBILE MENU TOGGLE */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-2 text-sm font-semibold">
          <button
            onClick={() => handleNav({ type: 'home' })}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {t.home}
          </button>
          <button
            onClick={() => handleNav({ type: 'all-tools' })}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {t.allTools} (100)
          </button>
          <button
            onClick={() => handleNav({ type: 'favorites' })}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
          >
            <span>Favorites</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-xs">
              {favoritesCount}
            </span>
          </button>
          <button
            onClick={() => handleNav({ type: 'history' })}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Recently Used
          </button>
          <button
            onClick={() => handleNav({ type: 'feedback' })}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {t.feedback}
          </button>
          <button
            onClick={() => handleNav({ type: 'drive' })}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold"
          >
            <HardDrive className="w-4 h-4 text-blue-500" />
            <span>{t.googleDrive}</span>
          </button>
          <button
            onClick={() => handleNav({ type: 'sheets' })}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
            <span>{t.googleSheets}</span>
          </button>
          <button
            onClick={() => handleNav({ type: 'gmail' })}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-red-600 dark:text-red-400 font-bold"
          >
            <Mail className="w-4 h-4 text-red-500" />
            <span>{t.gmail}</span>
          </button>
          <button
            onClick={() => handleNav({ type: 'about' })}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {t.about}
          </button>
          <button
            onClick={() => handleNav({ type: 'blogger-guide' })}
            className="w-full text-left px-3 py-2 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
          >
            {t.bloggerGuide}
          </button>
        </div>
      )}
    </header>
  );
};
