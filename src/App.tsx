import React, { useState, useEffect } from 'react';
import { ViewState, Language } from './types';
import { TOOLS } from './data/tools';
import { CATEGORIES } from './data/categories';
import { TRANSLATIONS } from './data/translations';
import {
  getFavorites,
  toggleFavorite,
  getHistory,
  addToHistory,
  clearHistory,
  getStoredTheme,
  setStoredTheme,
  getStoredLanguage,
  setStoredLanguage
} from './utils/storage';
import { searchTools } from './utils/smartSolver';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { SmartProblemSolver } from './components/SmartProblemSolver';
import { ToolCard } from './components/ToolCard';
import { ToolViewer } from './components/ToolViewer';
import { ToolSearchModal } from './components/ToolSearchModal';
import { StaticPages } from './components/StaticPages';
import { AdContainer } from './components/AdContainer';
import { ToolOfTheDay } from './components/ToolOfTheDay';
import { FeedbackSystem } from './components/FeedbackSystem';
import { GoogleDriveManager } from './components/GoogleDriveManager';
import { GoogleSheetsManager } from './components/GoogleSheetsManager';
import { GmailManager } from './components/GmailManager';

import {
  Sparkles,
  Zap,
  ShieldCheck,
  Smartphone,
  Star,
  History,
  Grid,
  Filter,
  CheckCircle2,
  Trash2,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';

export function App() {
  const [currentView, setCurrentView] = useState<ViewState>({ type: 'home' });
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [lang, setLang] = useState<Language>('en');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  const t = TRANSLATIONS[lang];

  // Initialize theme, language, favorites & history on mount
  useEffect(() => {
    const savedTheme = getStoredTheme();
    setTheme(savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const savedLang = getStoredLanguage();
    setLang(savedLang);

    setFavorites(getFavorites());
    setHistory(getHistory());

    // Check URL parameters for direct tool linking (e.g. ?tool=image-compressor)
    const urlParams = new URLSearchParams(window.location.search);
    const toolParam = urlParams.get('tool');
    if (toolParam) {
      const match = TOOLS.find(t => t.slug === toolParam || t.id === toolParam);
      if (match) {
        handleNavigate({ type: 'tool', toolId: match.id });
      }
    }
  }, []);

  const handleToggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    setStoredTheme(next);
  };

  const handleToggleLang = () => {
    const next = lang === 'en' ? 'hi' : 'en';
    setLang(next);
    setStoredLanguage(next);
  };

  const handleToggleFavorite = (toolId: string) => {
    const updated = toggleFavorite(toolId);
    setFavorites(updated);
  };

  const handleNavigate = (view: ViewState) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (view.type === 'tool') {
      const updatedHistory = addToHistory(view.toolId);
      setHistory(updatedHistory);
      // update URL search param cleanly without reloading
      const tool = TOOLS.find(t => t.id === view.toolId);
      if (tool) {
        window.history.pushState({}, '', `?tool=${tool.slug}`);
      }
    } else {
      window.history.pushState({}, '', '/');
    }
  };

  const handleClearHistory = () => {
    const cleared = clearHistory();
    setHistory(cleared);
  };

  // Tools filtering
  const filteredTools = searchTools(searchQuery);
  const popularTools = TOOLS.filter(t => t.isPopular).slice(0, 8);
  const newTools = TOOLS.filter(t => t.isNew).slice(0, 8);

  const activeTool = currentView.type === 'tool' ? TOOLS.find(t => t.id === currentView.toolId) : null;
  const activeCategory = currentView.type === 'category' ? CATEGORIES.find(c => c.id === currentView.categoryId) : null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-blue-500 selection:text-white transition-colors duration-200">
      {/* GLOBAL STICKY HEADER */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        lang={lang}
        onToggleLang={handleToggleLang}
        favoritesCount={favorites.length}
      />

      {/* SEARCH MODAL */}
      <ToolSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectTool={toolId => handleNavigate({ type: 'tool', toolId })}
        lang={lang}
      />

      {/* MAIN CONTENT ROUTING */}
      <main className="flex-1">
        {/* VIEW 1: TOOL VIEWER */}
        {currentView.type === 'tool' && activeTool ? (
          <ToolViewer
            tool={activeTool}
            isFavorite={favorites.includes(activeTool.id)}
            onToggleFavorite={handleToggleFavorite}
            onNavigate={handleNavigate}
            lang={lang}
          />
        ) : currentView.type === 'category' && activeCategory ? (
          /* VIEW 2: CATEGORY VIEW */
          <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6">
            <button
              onClick={() => handleNavigate({ type: 'home' })}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-6 hover:underline"
            >
              {t.backToHome}
            </button>

            <div className="mb-8">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs uppercase tracking-wider font-bold mb-1">
                <Grid className="w-4 h-4" /> Category Hub
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {lang === 'hi' ? activeCategory.nameHi : activeCategory.name}
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 max-w-3xl">
                {lang === 'hi' ? activeCategory.descriptionHi : activeCategory.description}
              </p>
            </div>

            <AdContainer slot="top-banner" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 my-8">
              {TOOLS.filter(t => t.categoryId === activeCategory.id).map(tool => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  isFavorite={favorites.includes(tool.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onSelect={toolId => handleNavigate({ type: 'tool', toolId })}
                  lang={lang}
                />
              ))}
            </div>

            <AdContainer slot="below-tool" />
          </div>
        ) : currentView.type === 'all-tools' ? (
          /* VIEW 3: ALL 100 TOOLS DIRECTORY */
          <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {t.allTools} (100 Working Tools)
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                  Browse our complete directory of high-speed, client-side productivity utilities.
                </p>
              </div>

              {/* CATEGORY FILTER CHIPS */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                <button
                  onClick={() => setSelectedCategoryFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${selectedCategoryFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                >
                  All (100)
                </button>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategoryFilter(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${selectedCategoryFilter === cat.id ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                  >
                    {lang === 'hi' ? cat.nameHi : cat.name} ({cat.count})
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {TOOLS.filter(t => selectedCategoryFilter === 'all' || t.categoryId === selectedCategoryFilter).map(tool => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  isFavorite={favorites.includes(tool.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onSelect={toolId => handleNavigate({ type: 'tool', toolId })}
                  lang={lang}
                />
              ))}
            </div>
          </div>
        ) : currentView.type === 'favorites' ? (
          /* VIEW 4: FAVORITES */
          <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Star className="w-7 h-7 fill-amber-400 text-amber-400" />
              {t.myFavorites} ({favorites.length})
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-8">
              Your favorite tools are stored locally on your device for one-click access.
            </p>

            {favorites.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {TOOLS.filter(t => favorites.includes(t.id)).map(tool => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    isFavorite={true}
                    onToggleFavorite={handleToggleFavorite}
                    onSelect={toolId => handleNavigate({ type: 'tool', toolId })}
                    lang={lang}
                  />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                <Star className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">{t.noFavoritesYet}</h3>
                <button
                  onClick={() => handleNavigate({ type: 'all-tools' })}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold"
                >
                  Explore All Tools
                </button>
              </div>
            )}
          </div>
        ) : currentView.type === 'history' ? (
          /* VIEW 5: HISTORY */
          <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <History className="w-7 h-7 text-blue-600" />
                  {t.recentlyUsed}
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                  Recently launched tools (managed locally without user accounts).
                </p>
              </div>
              {history.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-300 flex items-center gap-1.5 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  {t.clearHistory}
                </button>
              )}
            </div>

            {history.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {TOOLS.filter(t => history.includes(t.id)).map(tool => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    isFavorite={favorites.includes(tool.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onSelect={toolId => handleNavigate({ type: 'tool', toolId })}
                    lang={lang}
                  />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                <History className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">{t.noHistoryYet}</h3>
              </div>
            )}
          </div>
        ) : currentView.type === 'drive' ? (
          /* VIEW 6: GOOGLE DRIVE CLOUD MANAGER */
          <GoogleDriveManager onNavigate={handleNavigate} lang={lang} />
        ) : currentView.type === 'sheets' ? (
          /* VIEW 7: GOOGLE SHEETS CLOUD MANAGER */
          <GoogleSheetsManager onNavigate={handleNavigate} lang={lang} />
        ) : currentView.type === 'gmail' ? (
          /* VIEW 8: GMAIL CLOUD MANAGER */
          <GmailManager
            onNavigate={handleNavigate}
            lang={lang}
            initialComposeDraft={currentView.composeDraft}
          />
        ) : currentView.type === 'feedback' ? (
          /* VIEW 8: USER FEEDBACK SYSTEM */
          <FeedbackSystem onNavigate={handleNavigate} lang={lang} />
        ) : currentView.type !== 'home' ? (
          /* VIEW 9: STATIC PAGES (ABOUT, PRIVACY, TERMS, DISCLAIMER, CONTACT, BLOGGER) */
          <StaticPages view={currentView} onNavigate={handleNavigate} lang={lang} />
        ) : (
          /* VIEW 10: FULL HOMEPAGE */
          <div className="space-y-12">
            {/* HERO BANNER & SEARCH */}
            <Hero
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onCategorySelect={catId => handleNavigate({ type: 'category', categoryId: catId })}
              lang={lang}
            />

            {/* AD BANNER */}
            <AdContainer slot="top-banner" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-14">
              {/* IF SEARCH IS ACTIVE, SHOW LIVE SEARCH RESULTS */}
              {searchQuery.trim() ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      Search Results for "{searchQuery}" ({filteredTools.length})
                    </h2>
                    <button onClick={() => setSearchQuery('')} className="text-xs font-semibold text-blue-600 hover:underline">
                      Clear Search
                    </button>
                  </div>

                  {filteredTools.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {filteredTools.map(tool => (
                        <ToolCard
                          key={tool.id}
                          tool={tool}
                          isFavorite={favorites.includes(tool.id)}
                          onToggleFavorite={handleToggleFavorite}
                          onSelect={toolId => handleNavigate({ type: 'tool', toolId })}
                          lang={lang}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                      <p className="text-base font-bold text-slate-700 dark:text-slate-300">{t.noToolsFound}</p>
                      <p className="text-xs text-slate-500 mt-1">{t.tryDifferentSearch}</p>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* PROMINENT TOOL OF THE DAY SECTION */}
                  <ToolOfTheDay
                    onNavigate={handleNavigate}
                    isFavorite={toolId => favorites.includes(toolId)}
                    onToggleFavorite={handleToggleFavorite}
                    lang={lang}
                  />

                  {/* SMART NATURAL LANGUAGE PROBLEM SOLVER */}
                  <SmartProblemSolver
                    onSelectTool={toolId => handleNavigate({ type: 'tool', toolId })}
                    lang={lang}
                  />

                  {/* POPULAR TOOLS SECTION */}
                  <section>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                          <TrendingUp className="w-4 h-4" /> Top Productivity Hits
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                          {t.popularTools}
                        </h2>
                      </div>
                      <button
                        onClick={() => handleNavigate({ type: 'all-tools' })}
                        className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                      >
                        <span>{t.exploreAllTools}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {popularTools.map(tool => (
                        <ToolCard
                          key={tool.id}
                          tool={tool}
                          isFavorite={favorites.includes(tool.id)}
                          onToggleFavorite={handleToggleFavorite}
                          onSelect={toolId => handleNavigate({ type: 'tool', toolId })}
                          lang={lang}
                        />
                      ))}
                    </div>
                  </section>

                  {/* BROWSE BY CATEGORIES GRID */}
                  <section>
                    <div className="mb-6">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        <Grid className="w-4 h-4" /> Categorized Taxonomy
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        {t.allCategories}
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {CATEGORIES.map(cat => (
                        <div
                          key={cat.id}
                          onClick={() => handleNavigate({ type: 'category', categoryId: cat.id })}
                          className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-500 hover:shadow-md cursor-pointer transition group"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center justify-center">
                              {cat.count}
                            </span>
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition" />
                          </div>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                            {lang === 'hi' ? cat.nameHi : cat.name}
                          </h3>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                            {lang === 'hi' ? cat.descriptionHi : cat.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* AD BANNER BETWEEN SECTIONS */}
                  <AdContainer slot="between-sections" />

                  {/* NEW & USEFUL TOOLS */}
                  <section>
                    <div className="mb-6">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        <Award className="w-4 h-4" /> Freshly Added
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        {t.newTools}
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {newTools.map(tool => (
                        <ToolCard
                          key={tool.id}
                          tool={tool}
                          isFavorite={favorites.includes(tool.id)}
                          onToggleFavorite={handleToggleFavorite}
                          onSelect={toolId => handleNavigate({ type: 'tool', toolId })}
                          lang={lang}
                        />
                      ))}
                    </div>
                  </section>

                  {/* WHY AI SAATHI HUB VALUE PROPOSITION */}
                  <section className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white">
                    <div className="text-center max-w-2xl mx-auto mb-10">
                      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
                        {t.whyAiSaathi}
                      </h2>
                      <p className="text-slate-400 text-xs sm:text-sm">
                        Engineered from the ground up for instantaneous performance and total data privacy.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                        <h3 className="font-bold text-sm text-white mb-1">{t.whyFastTitle}</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">{t.whyFastDesc}</p>
                      </div>
                      <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                        <h3 className="font-bold text-sm text-white mb-1">{t.whyPrivacyTitle}</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">{t.whyPrivacyDesc}</p>
                      </div>
                      <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                        <h3 className="font-bold text-sm text-white mb-1">{t.whyEverywhereTitle}</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">{t.whyEverywhereDesc}</p>
                      </div>
                      <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                        <h3 className="font-bold text-sm text-white mb-1">{t.whyFreeTitle}</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">{t.whyFreeDesc}</p>
                      </div>
                    </div>
                  </section>
                </>
              )}
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <Footer onNavigate={handleNavigate} lang={lang} />
    </div>
  );
}

export default App;
