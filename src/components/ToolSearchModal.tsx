import React, { useState, useEffect, useRef } from 'react';
import { ToolDefinition, Language } from '../types';
import { TOOLS } from '../data/tools';
import { CATEGORIES } from '../data/categories';
import { searchTools } from '../utils/smartSolver';
import { Search, X, Star, ArrowUpRight } from 'lucide-react';

interface ToolSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (toolId: string) => void;
  lang: Language;
}

export const ToolSearchModal: React.FC<ToolSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectTool,
  lang
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = searchTools(query).slice(0, 10);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden mt-12 sm:mt-16 flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* SEARCH INPUT BAR */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={lang === 'hi' ? '100+ टूल्स में खोजें...' : 'Search across all 100+ tools (e.g. compress, merge, gst)...'}
            className="flex-1 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 text-sm sm:text-base focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold p-1">
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* RESULTS LIST */}
        <div className="p-2 overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-slate-800/60">
          {results.length > 0 ? (
            results.map(tool => {
              const category = CATEGORIES.find(c => c.id === tool.categoryId);
              return (
                <div
                  key={tool.id}
                  onClick={() => {
                    onSelectTool(tool.id);
                    onClose();
                  }}
                  className="p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/70 rounded-xl cursor-pointer flex items-center justify-between group transition"
                >
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                        {category ? (lang === 'hi' ? category.nameHi : category.name) : 'Tool'}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                        {lang === 'hi' ? tool.nameHi : tool.name}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                      {lang === 'hi' ? tool.descriptionHi : tool.description}
                    </p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition shrink-0" />
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-slate-500">
              No matching tools found for "{query}". Try searching for keywords like "pdf", "image", "calculator", "resume".
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Press ESC to close</span>
          <span>100 Genuine Working Browser Tools</span>
        </div>
      </div>
    </div>
  );
};
