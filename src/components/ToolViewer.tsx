import React, { useState } from 'react';
import { ToolDefinition, Language, ViewState } from '../types';
import { CATEGORIES } from '../data/categories';
import { TOOLS } from '../data/tools';
import { TRANSLATIONS } from '../data/translations';
import { ToolRenderer } from './ToolRenderer';
import { AdContainer } from './AdContainer';
import { Star, ShieldCheck, ChevronRight, HelpCircle, CheckCircle, Code, Copy, Check, ArrowLeft, Share2, FileSpreadsheet, Mail } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ToolViewerProps {
  tool: ToolDefinition;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onNavigate: (view: ViewState) => void;
  lang: Language;
}

export const ToolViewer: React.FC<ToolViewerProps> = ({
  tool,
  isFavorite,
  onToggleFavorite,
  onNavigate,
  lang
}) => {
  const t = TRANSLATIONS[lang];
  const category = CATEGORIES.find(c => c.id === tool.categoryId);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const relatedTools = TOOLS.filter(t => tool.relatedToolIds.includes(t.id)).slice(0, 4);

  const toolEmbedCode = `<!-- AI Saathi Hub Tool: ${tool.name} -->
<iframe 
  src="${window.location.origin}/?tool=${tool.slug}" 
  width="100%" 
  height="680" 
  style="border:0; border-radius:12px; box-shadow:0 4px 20px rgba(0,0,0,0.06);" 
  title="${tool.name} - AI Saathi Hub" 
  loading="lazy">
</iframe>`;

  const copyToolEmbed = () => {
    navigator.clipboard.writeText(toolEmbedCode);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2000);
  };

  const handleFavoriteClick = () => {
    onToggleFavorite(tool.id);
    if (!isFavorite) {
      try {
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
      } catch {
        // ignore
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      {/* BREADCRUMBS & NAVIGATION */}
      <div className="flex items-center justify-between flex-wrap gap-2 text-xs text-slate-500 mb-6">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <button onClick={() => onNavigate({ type: 'home' })} className="hover:text-blue-600 font-medium transition">
            {t.home}
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          {category && (
            <>
              <button
                onClick={() => onNavigate({ type: 'category', categoryId: category.id })}
                className="hover:text-blue-600 font-medium transition"
              >
                {lang === 'hi' ? category.nameHi : category.name}
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </>
          )}
          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{lang === 'hi' ? tool.nameHi : tool.name}</span>
        </div>

        <button
          onClick={handleFavoriteClick}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${isFavorite ? 'bg-amber-50 text-amber-600 border-amber-300 dark:bg-amber-950/40 dark:border-amber-700' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'}`}
        >
          <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-500 text-amber-500' : ''}`} />
          <span>{isFavorite ? 'Favorited' : 'Add to Favorites'}</span>
        </button>
      </div>

      {/* TOP AD CONTAINER */}
      <AdContainer slot="top-banner" />

      {/* TOOL HERO HEADER */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                {category?.name || 'Utility Tool'}
              </span>
              {tool.isPopular && (
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  🔥 Popular Tool
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {lang === 'hi' ? tool.nameHi : tool.name}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2 leading-relaxed max-w-3xl">
              {lang === 'hi' ? tool.descriptionHi : tool.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => onNavigate({ type: 'sheets' })}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 flex items-center gap-1.5 transition border border-emerald-200 dark:border-emerald-800"
              title="Open Google Sheets Manager"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.googleSheets}</span>
            </button>
            <button
              onClick={() =>
                onNavigate({
                  type: 'gmail',
                  composeDraft: {
                    subject: `${tool.name} Output & Details - AI Saathi Hub`,
                    body: `Hi,\n\nSharing results and details from ${tool.name} on AI Saathi Hub:\n\nTool URL: ${window.location.origin}/?tool=${tool.slug}\n\nKey Highlights:\n- ${tool.description}\n\nGenerated via AI Saathi Hub Free Tools.`
                  }
                })
              }
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/60 flex items-center gap-1.5 transition border border-red-200 dark:border-red-800"
              title="Email this tool via Gmail"
            >
              <Mail className="w-3.5 h-3.5 text-red-600" />
              <span>{t.gmail}</span>
            </button>
            <button
              onClick={copyToolEmbed}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition"
              title="Embed this tool on your blog"
            >
              {copiedEmbed ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Code className="w-3.5 h-3.5" />}
              <span>{copiedEmbed ? 'Embed Code Copied!' : 'Embed on Blogger'}</span>
            </button>
          </div>
        </div>

        {/* LOCAL PRIVACY GUARANTEE BANNER */}
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60 flex items-center gap-2.5 text-xs text-emerald-900 dark:text-emerald-200 mb-6 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{t.localPrivacyBadge}</span>
        </div>

        {/* THE WORKING INTERACTIVE TOOL COMPONENT */}
        <div className="pt-2">
          <ToolRenderer tool={tool} />
        </div>
      </div>

      {/* AD CONTAINER BELOW TOOL */}
      <AdContainer slot="below-tool" />

      {/* SEO ACCORDION / HOW TO USE / KEY FEATURES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* HOW TO USE STEPS */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-blue-600" />
            {t.howToUse} ({lang === 'hi' ? tool.nameHi : tool.name})
          </h2>
          <ol className="space-y-3">
            {tool.howToUseSteps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* KEY FEATURES */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            {t.features}
          </h2>
          <ul className="space-y-2.5">
            {tool.features.map((feat, idx) => (
              <li key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* FREQUENTLY ASKED QUESTIONS */}
      {tool.faqs.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 mb-12 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-600" />
            {t.faqs}
          </h2>
          <div className="space-y-3">
            {tool.faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between hover:bg-slate-100/70 transition"
                  >
                    <span>{faq.q}</span>
                    <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="p-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* RELATED TOOLS */}
      {relatedTools.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">{t.relatedTools}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedTools.map(rel => (
              <div
                key={rel.id}
                onClick={() => onNavigate({ type: 'tool', toolId: rel.id })}
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 cursor-pointer shadow-sm transition group"
              >
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 block mb-1">
                  {lang === 'hi' ? rel.nameHi : rel.name}
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {lang === 'hi' ? rel.descriptionHi : rel.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
