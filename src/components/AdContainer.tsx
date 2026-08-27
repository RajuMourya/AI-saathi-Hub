import React from 'react';

interface AdContainerProps {
  slot: 'top-banner' | 'between-sections' | 'tool-sidebar' | 'below-tool' | 'footer-banner';
  className?: string;
}

export const AdContainer: React.FC<AdContainerProps> = ({ slot, className = '' }) => {
  return (
    <div
      id={`ad-container-${slot}`}
      className={`my-6 mx-auto w-full max-w-5xl rounded-xl border border-dashed border-slate-300 dark:border-slate-700/60 bg-slate-50/70 dark:bg-slate-900/40 p-4 text-center transition-all ${className}`}
      aria-label="Advertisement Container"
    >
      <div className="flex items-center justify-between text-[11px] font-medium uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5 px-1">
        <span>Advertisement</span>
        <span className="text-[10px] bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300">AdSense Space</span>
      </div>
      <div className="min-h-[90px] flex flex-col items-center justify-center rounded-lg border border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-800/40 p-3 text-xs text-slate-600 dark:text-slate-400">
        <p className="font-medium text-slate-700 dark:text-slate-300">Support Free Daily Tools</p>
        <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">High-speed, privacy-first tools powered 100% locally in your browser.</p>
      </div>
    </div>
  );
};
