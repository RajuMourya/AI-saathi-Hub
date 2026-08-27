import React from 'react';
import { Language, ViewState } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { CATEGORIES } from '../data/categories';
import { ShieldCheck, Heart, Sparkles, Code2, Globe } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: ViewState) => void;
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, lang }) => {
  const t = TRANSLATIONS[lang];

  return (
    <footer className="w-full bg-slate-900 text-slate-400 border-t border-slate-800 text-xs transition-colors mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* BRAND COL */}
          <div className="lg:col-span-2 space-y-4">
            <div
              onClick={() => onNavigate({ type: 'home' })}
              className="flex items-center gap-2 cursor-pointer select-none"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm">
                AI
              </div>
              <span className="font-extrabold text-base text-white">{t.brandName}</span>
            </div>

            <p className="text-slate-400 leading-relaxed text-xs max-w-sm">
              {t.subheading}
            </p>

            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-300 flex items-center gap-2 max-w-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% Client-Side Processing. Files are never uploaded to any remote server.</span>
            </div>
          </div>

          {/* POPULAR CATEGORIES */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">{t.categories}</h4>
            <ul className="space-y-2">
              {CATEGORIES.slice(0, 5).map(cat => (
                <li key={cat.id}>
                  <button
                    onClick={() => onNavigate({ type: 'category', categoryId: cat.id })}
                    className="hover:text-white transition"
                  >
                    {lang === 'hi' ? cat.nameHi : cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* MORE CATEGORIES */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">More Categories</h4>
            <ul className="space-y-2">
              {CATEGORIES.slice(5).map(cat => (
                <li key={cat.id}>
                  <button
                    onClick={() => onNavigate({ type: 'category', categoryId: cat.id })}
                    className="hover:text-white transition"
                  >
                    {lang === 'hi' ? cat.nameHi : cat.name}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => onNavigate({ type: 'all-tools' })}
                  className="text-blue-400 hover:underline font-semibold"
                >
                  View All 100 Tools →
                </button>
              </li>
            </ul>
          </div>

          {/* LEGAL & BLOGGER EMBED */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">{t.legalAndInfo}</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate({ type: 'about' })} className="hover:text-white transition">
                  {t.about}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate({ type: 'privacy' })} className="hover:text-white transition">
                  {t.privacy}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate({ type: 'terms' })} className="hover:text-white transition">
                  {t.terms}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate({ type: 'disclaimer' })} className="hover:text-white transition">
                  {t.disclaimer}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate({ type: 'contact' })} className="hover:text-white transition">
                  {t.contact}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate({ type: 'feedback' })} className="text-amber-400 hover:text-amber-300 transition font-medium flex items-center gap-1">
                  <span>★ {t.feedback}</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate({ type: 'drive' })} className="text-blue-400 hover:text-blue-300 transition font-medium flex items-center gap-1">
                  <span>☁ {t.googleDrive}</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate({ type: 'sheets' })} className="text-emerald-400 hover:text-emerald-300 transition font-medium flex items-center gap-1">
                  <span>📊 {t.googleSheets}</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate({ type: 'gmail' })} className="text-red-400 hover:text-red-300 transition font-medium flex items-center gap-1">
                  <span>✉ {t.gmail}</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate({ type: 'blogger-guide' })} className="text-indigo-400 hover:underline font-semibold flex items-center gap-1">
                  <Code2 className="w-3.5 h-3.5" />
                  <span>{t.bloggerGuide}</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} AI Saathi Hub. 100+ Free Online Daily Tools. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Client-Side Local Processing</span>
            <span>•</span>
            <span>Zero Data Storage</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
