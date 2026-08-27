import React, { useState } from 'react';
import { Language, ToolDefinition } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { solveProblemIntent } from '../utils/smartSolver';
import { Sparkles, ArrowRight, HelpCircle, Lightbulb, Zap, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SmartProblemSolverProps {
  onSelectTool: (toolId: string) => void;
  lang: Language;
}

export const SmartProblemSolver: React.FC<SmartProblemSolverProps> = ({ onSelectTool, lang }) => {
  const t = TRANSLATIONS[lang];
  const [problemQuery, setProblemQuery] = useState('');
  const [recommendation, setRecommendation] = useState<{
    tool: ToolDefinition;
    confidence: number;
    reason: string;
    reasonHi: string;
  } | null>(null);

  const handleSolve = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!problemQuery.trim()) return;
    const rec = solveProblemIntent(problemQuery);
    if (rec) {
      setRecommendation(rec);
      try {
        confetti({ particleCount: 30, spread: 45, origin: { y: 0.6 } });
      } catch {
        // ignore
      }
    }
  };

  const samplePrompts = [
    { en: 'I want to reduce image size for job application', hi: 'फोटो का साइज कम करना है' },
    { en: 'Combine 3 PDF files into one', hi: 'PDF फाइलों को एक साथ जोड़ना है' },
    { en: 'Calculate my in-hand take home salary', hi: 'सैलरी पर कितना टैक्स कटेगा' },
    { en: 'Make ATS friendly resume for interview', hi: 'नौकरी के लिए नया रिज्यूम बनाना है' }
  ];

  return (
    <div
      id="smart-problem-solver"
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 text-white p-6 sm:p-10 shadow-xl my-8"
    >
      <div className="relative z-10 max-w-3xl">
        <div className="flex items-center gap-2 text-blue-200 text-xs uppercase tracking-wider font-bold mb-2">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Smart AI Saathi Problem Matcher</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
          {t.whatDoYouWantToDo}
        </h2>
        <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed mb-6">
          {t.problemSolverDesc}
        </p>

        {/* INPUT FORM */}
        <form onSubmit={handleSolve} className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              value={problemQuery}
              onChange={e => setProblemQuery(e.target.value)}
              placeholder={t.problemPlaceholder}
              className="w-full px-5 py-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-blue-200/60 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-amber-300 transition"
            />
          </div>
          <button
            type="submit"
            className="px-7 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition duration-200 shrink-0"
          >
            <Zap className="w-4 h-4" />
            {lang === 'hi' ? 'टूल खोजें' : 'Find Best Tool'}
          </button>
        </form>

        {/* QUICK SAMPLES */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-blue-200 font-medium flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-300" /> {lang === 'hi' ? 'उदा.' : 'Try:'}
          </span>
          {samplePrompts.map((p, idx) => {
            const label = lang === 'hi' ? p.hi : p.en;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setProblemQuery(label);
                  const rec = solveProblemIntent(label);
                  setRecommendation(rec);
                }}
                className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white text-[11px] transition"
              >
                "{label}"
              </button>
            );
          })}
        </div>

        {/* RECOMMENDATION RESULT CARD */}
        {recommendation && (
          <div className="mt-6 p-5 rounded-2xl bg-white text-slate-900 shadow-2xl border border-blue-100 transition-all duration-300">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                {t.recommendationTitle} ({recommendation.confidence}% Match)
              </span>
              <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% Client-side
              </span>
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 mb-1">
              {lang === 'hi' ? recommendation.tool.nameHi : recommendation.tool.name}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
              {lang === 'hi' ? recommendation.reasonHi : recommendation.reason}
            </p>

            <button
              onClick={() => onSelectTool(recommendation.tool.id)}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition shadow-md"
            >
              <span>{t.openTool}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
