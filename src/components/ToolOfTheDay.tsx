import React, { useState } from 'react';
import { ToolDefinition, Language, ViewState } from '../types';
import { TOOLS } from '../data/tools';
import { CATEGORIES } from '../data/categories';
import {
  Sparkles,
  Calendar,
  Shuffle,
  Star,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ToolOfTheDayProps {
  onNavigate: (view: ViewState) => void;
  isFavorite: (toolId: string) => boolean;
  onToggleFavorite: (toolId: string) => void;
  lang: Language;
}

export const ToolOfTheDay: React.FC<ToolOfTheDayProps> = ({
  onNavigate,
  isFavorite,
  onToggleFavorite,
  lang
}) => {
  // Deterministic tool based on day of year
  const getTodayToolIndex = (): number => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    return dayOfYear % TOOLS.length;
  };

  const [overrideIndex, setOverrideIndex] = useState<number | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);

  const activeIndex = overrideIndex !== null ? overrideIndex : getTodayToolIndex();
  const tool: ToolDefinition = TOOLS[activeIndex] || TOOLS[0];
  const category = CATEGORIES.find(c => c.id === tool.categoryId);

  const todayDateString = new Date().toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const handleShuffle = () => {
    setIsShuffling(true);
    let count = 0;
    const interval = setInterval(() => {
      const rand = Math.floor(Math.random() * TOOLS.length);
      setOverrideIndex(rand);
      count++;
      if (count > 6) {
        clearInterval(interval);
        setIsShuffling(false);
        try {
          confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
        } catch {
          // ignore
        }
      }
    }, 80);
  };

  const handleResetToToday = () => {
    setOverrideIndex(null);
  };

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white shadow-xl shadow-blue-950/20 border border-blue-700/40 p-6 sm:p-8 lg:p-10">
      {/* Background Decorative Gradients & Accents */}
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        {/* LEFT COLUMN: BADGE & INFO */}
        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              {overrideIndex === null
                ? (lang === 'hi' ? 'आज का खास टूल' : 'Tool of the Day')
                : (lang === 'hi' ? 'रैंडम खास टूल' : 'Surprise Featured Tool')}
            </span>

            <span className="inline-flex items-center gap-1 text-xs text-blue-200/80 font-medium">
              <Calendar className="w-3.5 h-3.5" />
              {todayDateString}
            </span>

            {category && (
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/90 text-xs font-semibold backdrop-blur-sm">
                {lang === 'hi' ? category.nameHi : category.name}
              </span>
            )}
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span>{lang === 'hi' ? tool.nameHi : tool.name}</span>
            </h2>
            <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed mt-2 max-w-2xl">
              {lang === 'hi' ? tool.descriptionHi : tool.description}
            </p>
          </div>

          {/* QUICK FEATURES PREVIEW */}
          {tool.features && tool.features.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 max-w-2xl">
              {tool.features.slice(0, 4).map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-blue-200/90">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">{feat}</span>
                </div>
              ))}
            </div>
          )}

          {/* BENEFIT PILLS */}
          <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] text-blue-200/80">
            <span className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
              <Zap className="w-3 h-3 text-amber-300" /> Instant Client-Side
            </span>
            <span className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
              <ShieldCheck className="w-3 h-3 text-emerald-300" /> 100% Private & Free
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: ACTION CONTROLS */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0">
          <button
            id="btn-use-tool-of-the-day"
            onClick={() => onNavigate({ type: 'tool', toolId: tool.id })}
            className="px-6 py-3.5 rounded-2xl bg-white hover:bg-blue-50 text-blue-900 font-bold text-sm shadow-lg shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
          >
            <span>{lang === 'hi' ? `${tool.nameHi} इस्तेमाल करें` : `Use ${tool.name} Now`}</span>
            <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => onToggleFavorite(tool.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition ${
                isFavorite(tool.id)
                  ? 'bg-amber-400/20 border-amber-400/40 text-amber-300'
                  : 'bg-white/10 hover:bg-white/15 border-white/10 text-white/80'
              }`}
              title="Save to favorites"
            >
              <Star className={`w-3.5 h-3.5 ${isFavorite(tool.id) ? 'fill-amber-400 text-amber-400' : ''}`} />
              <span>{isFavorite(tool.id) ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={handleShuffle}
              disabled={isShuffling}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 border border-white/10 text-white/90 flex items-center gap-1.5 transition disabled:opacity-50"
              title="Discover another random tool"
            >
              <Shuffle className={`w-3.5 h-3.5 ${isShuffling ? 'animate-spin' : ''}`} />
              <span>{lang === 'hi' ? 'दूसरा टूल देखें' : 'Shuffle Pick'}</span>
            </button>

            {overrideIndex !== null && (
              <button
                onClick={handleResetToToday}
                className="px-2.5 py-2 rounded-xl text-xs font-semibold text-blue-300 hover:text-white transition underline"
              >
                {lang === 'hi' ? 'आज का टूल' : "Today's Pick"}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
