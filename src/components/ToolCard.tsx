import React from 'react';
import { ToolDefinition, Language } from '../types';
import { CATEGORIES } from '../data/categories';
import { Star, ArrowUpRight, Sparkles } from 'lucide-react';

interface ToolCardProps {
  tool: ToolDefinition;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelect: (toolId: string) => void;
  lang: Language;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  isFavorite,
  onToggleFavorite,
  onSelect,
  lang
}) => {
  const category = CATEGORIES.find(c => c.id === tool.categoryId);

  return (
    <div
      id={`tool-card-${tool.id}`}
      onClick={() => onSelect(tool.id)}
      className="group relative flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-500/80 dark:hover:border-blue-500/80 hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
    >
      {/* TOP META ROW */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-md">
            {category ? (lang === 'hi' ? category.nameHi : category.name) : 'Tool'}
          </span>

          <div className="flex items-center gap-1.5">
            {tool.isPopular && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-md">
                Popular
              </span>
            )}
            {tool.isNew && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                New
              </span>
            )}
            <button
              onClick={e => {
                e.stopPropagation();
                onToggleFavorite(tool.id);
              }}
              className="p-1 rounded-md text-slate-400 hover:text-amber-500 transition"
              title="Toggle Favorite"
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* TITLE & DESCRIPTION */}
        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1 mb-1.5">
          {lang === 'hi' ? tool.nameHi : tool.name}
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {lang === 'hi' ? tool.descriptionHi : tool.description}
        </p>
      </div>

      {/* BOTTOM FOOTER */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
        <span>{lang === 'hi' ? 'टूल खोलें' : 'Open Tool'}</span>
        <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </div>
    </div>
  );
};
