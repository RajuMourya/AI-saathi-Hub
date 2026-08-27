import React, { useState } from 'react';
import { Copy, Check, RotateCcw, Trash2, ArrowUpDown, Sparkles, Search, GitCompare, AlignLeft } from 'lucide-react';

interface TextToolProps {
  toolId: string;
}

export const TextTools: React.FC<TextToolProps> = ({ toolId }) => {
  const [text, setText] = useState<string>('');
  const [diffOriginal, setDiffOriginal] = useState<string>('');
  const [diffModified, setDiffModified] = useState<string>('');
  const [findText, setFindText] = useState<string>('');
  const [replaceText, setReplaceText] = useState<string>('');
  const [isRegex, setIsRegex] = useState<boolean>(false);
  const [matchCase, setMatchCase] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [wpm, setWpm] = useState<number>(225);

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper stats
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charsWithSpaces = text.length;
  const charsNoSpaces = text.replace(/\s+/g, '').length;
  const sentences = text.trim() ? (text.match(/[^.!?]+[.!?]+(\s|$)/g) || [text]).length : 0;
  const paragraphs = text.trim() ? text.split(/\n+/).filter(p => p.trim().length > 0).length : 0;
  const readingTimeMin = Math.ceil(words / wpm);
  const speakingTimeMin = Math.ceil(words / 130);

  // Transformations
  const handleCaseChange = (type: 'upper' | 'lower' | 'title' | 'sentence' | 'capitalize' | 'camel' | 'snake' | 'kebab') => {
    if (!text) return;
    let result = text;
    switch (type) {
      case 'upper':
        result = text.toUpperCase();
        break;
      case 'lower':
        result = text.toLowerCase();
        break;
      case 'title':
        result = text.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
        break;
      case 'sentence':
        result = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
        break;
      case 'capitalize':
        result = text.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        break;
      case 'camel':
        result = text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
        break;
      case 'snake':
        result = text.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
        break;
      case 'kebab':
        result = text.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
        break;
    }
    setText(result);
  };

  const handleRemoveSpaces = (mode: 'all' | 'extra' | 'lines' | 'trim') => {
    if (!text) return;
    if (mode === 'extra') {
      setText(text.replace(/[ \t]+/g, ' ').trim());
    } else if (mode === 'lines') {
      setText(text.split('\n').filter(line => line.trim().length > 0).join('\n'));
    } else if (mode === 'trim') {
      setText(text.split('\n').map(l => l.trim()).join('\n'));
    } else {
      setText(text.replace(/\s+/g, ''));
    }
  };

  const handleRemoveDuplicates = (caseInsensitive = true) => {
    if (!text) return;
    const lines = text.split('\n');
    const seen = new Set<string>();
    const result: string[] = [];
    for (const line of lines) {
      const key = caseInsensitive ? line.trim().toLowerCase() : line.trim();
      if (!seen.has(key)) {
        seen.add(key);
        result.push(line);
      }
    }
    setText(result.join('\n'));
  };

  const handleSortText = (type: 'az' | 'za' | 'num' | 'len' | 'shuffle') => {
    if (!text) return;
    const lines = text.split('\n');
    if (type === 'az') lines.sort((a, b) => a.localeCompare(b));
    else if (type === 'za') lines.sort((a, b) => b.localeCompare(a));
    else if (type === 'num') lines.sort((a, b) => (parseFloat(a) || 0) - (parseFloat(b) || 0));
    else if (type === 'len') lines.sort((a, b) => a.length - b.length);
    else if (type === 'shuffle') lines.sort(() => Math.random() - 0.5);
    setText(lines.join('\n'));
  };

  const handleReverse = (type: 'all' | 'words' | 'lines') => {
    if (!text) return;
    if (type === 'all') setText(text.split('').reverse().join(''));
    else if (type === 'words') setText(text.split(' ').reverse().join(' '));
    else if (type === 'lines') setText(text.split('\n').reverse().join('\n'));
  };

  const handleCleanText = (type: 'html' | 'emojis' | 'numbers' | 'symbols' | 'nonascii') => {
    if (!text) return;
    let res = text;
    if (type === 'html') res = text.replace(/<[^>]*>?/gm, '');
    else if (type === 'emojis') res = text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
    else if (type === 'numbers') res = text.replace(/[0-9]/g, '');
    else if (type === 'symbols') res = text.replace(/[^a-zA-Z0-9\s]/g, '');
    else if (type === 'nonascii') res = text.replace(/[^\x00-\x7F]/g, '');
    setText(res);
  };

  const handleFindReplace = () => {
    if (!text || !findText) return;
    try {
      if (isRegex) {
        const flags = matchCase ? 'g' : 'gi';
        const regex = new RegExp(findText, flags);
        setText(text.replace(regex, replaceText));
      } else {
        if (matchCase) {
          setText(text.split(findText).join(replaceText));
        } else {
          const regex = new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
          setText(text.replace(regex, replaceText));
        }
      }
    } catch {
      // ignore
    }
  };

  const handleExtract = (type: 'email' | 'url' | 'phone' | 'hashtags' | 'mentions') => {
    if (!text) return;
    let matches: string[] = [];
    if (type === 'email') {
      matches = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
    } else if (type === 'url') {
      matches = text.match(/https?:\/\/[^\s]+/g) || [];
    } else if (type === 'phone') {
      matches = text.match(/(\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9})/g) || [];
    } else if (type === 'hashtags') {
      matches = text.match(/#[a-zA-Z0-9_]+/g) || [];
    } else if (type === 'mentions') {
      matches = text.match(/@[a-zA-Z0-9_]+/g) || [];
    }
    const unique = Array.from(new Set(matches));
    setText(unique.length > 0 ? unique.join('\n') : 'No matching items found.');
  };

  const handleParagraphFormat = (wrapChars = 80) => {
    if (!text) return;
    const wordsArr = text.trim().split(/\s+/);
    let curLine = '';
    const lines: string[] = [];
    for (const w of wordsArr) {
      if ((curLine + ' ' + w).trim().length > wrapChars) {
        lines.push(curLine.trim());
        curLine = w;
      } else {
        curLine = (curLine + ' ' + w).trim();
      }
    }
    if (curLine) lines.push(curLine.trim());
    setText(lines.join('\n'));
  };

  return (
    <div className="space-y-6">
      {/* 1. TEXT DIFF CHECKER INTERFACE */}
      {toolId === 'text-difference-checker' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Original Text</label>
              <textarea
                rows={8}
                value={diffOriginal}
                onChange={e => setDiffOriginal(e.target.value)}
                placeholder="Paste original version here..."
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-mono focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Modified Text</label>
              <textarea
                rows={8}
                value={diffModified}
                onChange={e => setDiffModified(e.target.value)}
                placeholder="Paste new modified version here..."
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-mono focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Visual Difference Analysis</h4>
            <div className="font-mono text-xs space-y-1 max-h-60 overflow-y-auto">
              {diffOriginal.split('\n').map((origLine, idx) => {
                const modLine = diffModified.split('\n')[idx];
                if (origLine === modLine) {
                  return <div key={idx} className="text-slate-600 dark:text-slate-400 pl-4">{origLine || ' '}</div>;
                }
                return (
                  <div key={idx} className="space-y-0.5">
                    {origLine !== undefined && (
                      <div className="bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 px-2 py-0.5 rounded">
                        - {origLine}
                      </div>
                    )}
                    {modLine !== undefined && (
                      <div className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded">
                        + {modLine}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* STANDARD TEXT INPUT BOX FOR ALL OTHER TEXT TOOLS */
        <div className="space-y-4">
          <div className="relative">
            <textarea
              rows={8}
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Type or paste your text here..."
              className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-sans leading-relaxed"
            />
            {text && (
              <button
                onClick={() => setText('')}
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-red-500 transition"
                title="Clear text"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* REALTIME STATS BAR */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 text-center border border-slate-200/60 dark:border-slate-800">
              <span className="text-[11px] uppercase tracking-wider text-slate-500 block font-semibold">Words</span>
              <span className="text-xl font-bold text-slate-900 dark:text-white">{words}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 text-center border border-slate-200/60 dark:border-slate-800">
              <span className="text-[11px] uppercase tracking-wider text-slate-500 block font-semibold">Characters</span>
              <span className="text-xl font-bold text-slate-900 dark:text-white">{charsWithSpaces}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 text-center border border-slate-200/60 dark:border-slate-800">
              <span className="text-[11px] uppercase tracking-wider text-slate-500 block font-semibold">No Spaces</span>
              <span className="text-xl font-bold text-slate-900 dark:text-white">{charsNoSpaces}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 text-center border border-slate-200/60 dark:border-slate-800">
              <span className="text-[11px] uppercase tracking-wider text-slate-500 block font-semibold">Sentences</span>
              <span className="text-xl font-bold text-slate-900 dark:text-white">{sentences}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 text-center border border-slate-200/60 dark:border-slate-800">
              <span className="text-[11px] uppercase tracking-wider text-slate-500 block font-semibold">Paragraphs</span>
              <span className="text-xl font-bold text-slate-900 dark:text-white">{paragraphs}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 text-center border border-slate-200/60 dark:border-slate-800">
              <span className="text-[11px] uppercase tracking-wider text-slate-500 block font-semibold">Read Time</span>
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{readingTimeMin} min</span>
            </div>
          </div>

          {/* TOOL SPECIFIC CONTROLS */}
          {toolId === 'case-converter' && (
            <div className="flex flex-wrap gap-2 pt-2">
              <button onClick={() => handleCaseChange('upper')} className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-xs font-semibold text-slate-800 dark:text-slate-200 transition">UPPERCASE</button>
              <button onClick={() => handleCaseChange('lower')} className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-xs font-semibold text-slate-800 dark:text-slate-200 transition">lowercase</button>
              <button onClick={() => handleCaseChange('title')} className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-xs font-semibold text-slate-800 dark:text-slate-200 transition">Title Case</button>
              <button onClick={() => handleCaseChange('sentence')} className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-xs font-semibold text-slate-800 dark:text-slate-200 transition">Sentence case</button>
              <button onClick={() => handleCaseChange('capitalize')} className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-xs font-semibold text-slate-800 dark:text-slate-200 transition">Capitalize Words</button>
              <button onClick={() => handleCaseChange('camel')} className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-xs font-semibold text-slate-800 dark:text-slate-200 transition">camelCase</button>
              <button onClick={() => handleCaseChange('snake')} className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-xs font-semibold text-slate-800 dark:text-slate-200 transition">snake_case</button>
              <button onClick={() => handleCaseChange('kebab')} className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-xs font-semibold text-slate-800 dark:text-slate-200 transition">kebab-case</button>
            </div>
          )}

          {toolId === 'remove-extra-spaces' && (
            <div className="flex flex-wrap gap-2 pt-2">
              <button onClick={() => handleRemoveSpaces('extra')} className="px-3 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition">Remove Multiple Spaces</button>
              <button onClick={() => handleRemoveSpaces('lines')} className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 transition">Remove Blank Lines</button>
              <button onClick={() => handleRemoveSpaces('trim')} className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 transition">Trim Leading/Trailing</button>
              <button onClick={() => handleRemoveSpaces('all')} className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 transition">Strip All Spaces</button>
            </div>
          )}

          {toolId === 'duplicate-line-remover' && (
            <div className="flex flex-wrap gap-2 pt-2">
              <button onClick={() => handleRemoveDuplicates(true)} className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition">Remove Duplicate Lines</button>
              <button onClick={() => handleRemoveDuplicates(false)} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 transition">Case-Sensitive Dedupe</button>
            </div>
          )}

          {toolId === 'text-sorter' && (
            <div className="flex flex-wrap gap-2 pt-2">
              <button onClick={() => handleSortText('az')} className="px-3 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition">Sort A to Z</button>
              <button onClick={() => handleSortText('za')} className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 transition">Sort Z to A</button>
              <button onClick={() => handleSortText('num')} className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 transition">Numeric Sort</button>
              <button onClick={() => handleSortText('len')} className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 transition">By Line Length</button>
              <button onClick={() => handleSortText('shuffle')} className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 transition">Shuffle / Randomize</button>
            </div>
          )}

          {toolId === 'text-reverser' && (
            <div className="flex flex-wrap gap-2 pt-2">
              <button onClick={() => handleReverse('all')} className="px-3 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition">Reverse All Characters</button>
              <button onClick={() => handleReverse('words')} className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 transition">Reverse Words</button>
              <button onClick={() => handleReverse('lines')} className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 transition">Reverse Lines</button>
            </div>
          )}

          {toolId === 'text-cleaner' && (
            <div className="flex flex-wrap gap-2 pt-2">
              <button onClick={() => handleCleanText('html')} className="px-3 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition">Strip HTML Tags</button>
              <button onClick={() => handleCleanText('emojis')} className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 transition">Remove Emojis</button>
              <button onClick={() => handleCleanText('numbers')} className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 transition">Remove Numbers</button>
              <button onClick={() => handleCleanText('symbols')} className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 transition">Remove Symbols</button>
              <button onClick={() => handleCleanText('nonascii')} className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 transition">Strip Non-ASCII</button>
            </div>
          )}

          {toolId === 'find-and-replace' && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Find text or pattern..."
                  value={findText}
                  onChange={e => setFindText(e.target.value)}
                  className="px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
                <input
                  type="text"
                  placeholder="Replace with..."
                  value={replaceText}
                  onChange={e => setReplaceText(e.target.value)}
                  className="px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-4 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked={matchCase} onChange={e => setMatchCase(e.target.checked)} className="rounded" />
                    Match Case
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked={isRegex} onChange={e => setIsRegex(e.target.checked)} className="rounded" />
                    RegEx Mode
                  </label>
                </div>
                <button
                  onClick={handleFindReplace}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition"
                >
                  Replace All
                </button>
              </div>
            </div>
          )}

          {toolId === 'text-extractor' && (
            <div className="flex flex-wrap gap-2 pt-2">
              <button onClick={() => handleExtract('email')} className="px-3 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition">Extract Emails</button>
              <button onClick={() => handleExtract('url')} className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 transition">Extract URLs</button>
              <button onClick={() => handleExtract('phone')} className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 transition">Extract Phones</button>
              <button onClick={() => handleExtract('hashtags')} className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 transition">Extract #Hashtags</button>
              <button onClick={() => handleExtract('mentions')} className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 transition">Extract @Mentions</button>
            </div>
          )}

          {toolId === 'reading-time-calculator' && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span>Reading Speed: {wpm} Words Per Minute</span>
                <span className="text-slate-500">Speaking Speed: ~130 WPM</span>
              </div>
              <input
                type="range"
                min={100}
                max={400}
                value={wpm}
                onChange={e => setWpm(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <div className="grid grid-cols-2 gap-4 text-center pt-2">
                <div className="p-3 bg-white dark:bg-slate-900 rounded-lg">
                  <span className="text-xs text-slate-500 block">Silent Reading</span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">~{readingTimeMin} min ({Math.round(words / (wpm / 60))}s)</span>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-lg">
                  <span className="text-xs text-slate-500 block">Speech / Presentation</span>
                  <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">~{speakingTimeMin} min</span>
                </div>
              </div>
            </div>
          )}

          {toolId === 'paragraph-formatter' && (
            <div className="flex flex-wrap gap-2 pt-2">
              <button onClick={() => handleParagraphFormat(80)} className="px-3 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition">Wrap at 80 Chars</button>
              <button onClick={() => handleParagraphFormat(60)} className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 transition">Wrap at 60 Chars</button>
              <button onClick={() => handleParagraphFormat(120)} className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 transition">Wrap at 120 Chars</button>
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => copyToClipboard(text)}
              disabled={!text}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold flex items-center gap-2 transition shadow-sm"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied to Clipboard ✓' : 'Copy Text'}
            </button>
            <button
              onClick={() => setText('')}
              disabled={!text}
              className="px-4 py-2 text-xs font-medium text-slate-500 hover:text-red-500 transition"
            >
              Reset Content
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
