import React, { useState } from 'react';
import { Copy, Check, Code2, Play, CheckCircle2, AlertCircle, FileCode, RotateCcw } from 'lucide-react';

interface DeveloperToolsProps {
  toolId: string;
}

export const DeveloperTools: React.FC<DeveloperToolsProps> = ({ toolId }) => {
  const [inputCode, setInputCode] = useState<string>('{\n  "name": "AI Saathi Hub",\n  "toolsCount": 100,\n  "privacyFirst": true,\n  "categories": ["PDF", "Image", "Developer", "Career"]\n}');
  const [outputCode, setOutputCode] = useState<string>('');
  const [status, setStatus] = useState<{ valid: boolean; message: string } | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Regex Tester State
  const [regexPattern, setRegexPattern] = useState<string>('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
  const [regexFlags, setRegexFlags] = useState<string>('g');
  const [regexText, setRegexText] = useState<string>('Contact us at support@aisaathi.hub or rahul@example.com for more tools.');

  const copyResult = () => {
    navigator.clipboard.writeText(outputCode || inputCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 1. JSON FORMAT & VALIDATE
  const handleJsonFormat = (indent = 2) => {
    try {
      const parsed = JSON.parse(inputCode);
      const formatted = JSON.stringify(parsed, null, indent);
      setOutputCode(formatted);
      setStatus({ valid: true, message: 'Valid JSON! Formatted successfully.' });
    } catch (err: any) {
      setStatus({ valid: false, message: `JSON Syntax Error: ${err.message}` });
      setOutputCode('');
    }
  };

  const handleJsonMinify = () => {
    try {
      const parsed = JSON.parse(inputCode);
      const minified = JSON.stringify(parsed);
      setOutputCode(minified);
      setStatus({ valid: true, message: 'Valid JSON! Minified successfully.' });
    } catch (err: any) {
      setStatus({ valid: false, message: `JSON Syntax Error: ${err.message}` });
    }
  };

  // 2. BASE64 ENCODE / DECODE
  const handleBase64 = (mode: 'encode' | 'decode') => {
    try {
      if (mode === 'encode') {
        setOutputCode(btoa(unescape(encodeURIComponent(inputCode))));
        setStatus({ valid: true, message: 'Encoded to Base64 successfully!' });
      } else {
        setOutputCode(decodeURIComponent(escape(atob(inputCode.trim()))));
        setStatus({ valid: true, message: 'Decoded from Base64 successfully!' });
      }
    } catch (err: any) {
      setStatus({ valid: false, message: `Base64 Error: ${err.message}` });
    }
  };

  // 3. URL ENCODE / DECODE
  const handleUrlTransform = (mode: 'encode' | 'decode') => {
    try {
      if (mode === 'encode') {
        setOutputCode(encodeURIComponent(inputCode));
        setStatus({ valid: true, message: 'URL Encoded successfully!' });
      } else {
        setOutputCode(decodeURIComponent(inputCode));
        setStatus({ valid: true, message: 'URL Decoded successfully!' });
      }
    } catch (err: any) {
      setStatus({ valid: false, message: `URL Error: ${err.message}` });
    }
  };

  // 4. CSS MINIFIER
  const handleCssMinify = () => {
    const minified = inputCode
      .replace(/\/\*[\s\S]*?\*\//g, '') // remove comments
      .replace(/\s+/g, ' ')
      .replace(/\s*([:;{}])\s*/g, '$1')
      .replace(/;}/g, '}')
      .trim();
    setOutputCode(minified);
    setStatus({ valid: true, message: 'CSS Minified successfully!' });
  };

  // 5. REGEX MATCHES
  const getRegexMatches = () => {
    if (!regexPattern || !regexText) return [];
    try {
      const reg = new RegExp(regexPattern, regexFlags);
      const matches: string[] = [];
      let match;
      if (regexFlags.includes('g')) {
        while ((match = reg.exec(regexText)) !== null) {
          matches.push(match[0]);
        }
      } else {
        const single = regexText.match(reg);
        if (single) matches.push(single[0]);
      }
      return matches;
    } catch {
      return [];
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. REGEX TESTER */}
      {toolId === 'regex-tester' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
            <div className="sm:col-span-3">
              <label className="block font-semibold mb-1">Regular Expression Pattern</label>
              <div className="flex items-center font-mono">
                <span className="p-2 bg-slate-100 dark:bg-slate-800 rounded-l-lg border border-r-0 border-slate-300 dark:border-slate-700 text-slate-500">/</span>
                <input
                  type="text"
                  value={regexPattern}
                  onChange={e => setRegexPattern(e.target.value)}
                  className="flex-1 p-2 border-y border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold"
                />
                <span className="p-2 bg-slate-100 dark:bg-slate-800 rounded-r-lg border border-l-0 border-slate-300 dark:border-slate-700 text-slate-500">/</span>
              </div>
            </div>
            <div>
              <label className="block font-semibold mb-1">Flags (g, i, m)</label>
              <input
                type="text"
                value={regexFlags}
                onChange={e => setRegexFlags(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">Test Input Text</label>
            <textarea
              rows={4}
              value={regexText}
              onChange={e => setRegexText(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono"
            />
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-500 block mb-2">
              Captured Matches ({getRegexMatches().length})
            </span>
            <div className="flex flex-wrap gap-2">
              {getRegexMatches().length > 0 ? (
                getRegexMatches().map((m, i) => (
                  <span key={i} className="px-2.5 py-1 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200 text-xs font-mono font-semibold border border-blue-200 dark:border-blue-800">
                    {m}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">No pattern matches found.</span>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* 2. GENERAL CODE FORMATTERS & CONVERTERS */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">Input Code / Text</label>
              <textarea
                rows={10}
                value={inputCode}
                onChange={e => setInputCode(e.target.value)}
                placeholder="Paste code or data here..."
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono focus:ring-2 focus:ring-blue-500 leading-relaxed"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">Output Result</label>
              <textarea
                rows={10}
                readOnly
                value={outputCode}
                placeholder="Transformed output will appear here..."
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-mono text-emerald-600 dark:text-emerald-400 leading-relaxed"
              />
            </div>
          </div>

          {/* STATUS NOTIFICATION */}
          {status && (
            <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${status.valid ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300' : 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300'}`}>
              {status.valid ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{status.message}</span>
            </div>
          )}

          {/* ACTION BUTTONS ACCORDING TO TOOL */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap gap-2">
              {(toolId === 'json-formatter' || toolId === 'json-validator') && (
                <>
                  <button onClick={() => handleJsonFormat(2)} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition">
                    Beautify (2 Spaces)
                  </button>
                  <button onClick={() => handleJsonFormat(4)} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-semibold transition">
                    Beautify (4 Spaces)
                  </button>
                  <button onClick={handleJsonMinify} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-semibold transition">
                    Minify JSON
                  </button>
                </>
              )}

              {toolId === 'base64-encoder-decoder' && (
                <>
                  <button onClick={() => handleBase64('encode')} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition">
                    Encode to Base64
                  </button>
                  <button onClick={() => handleBase64('decode')} className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold transition">
                    Decode from Base64
                  </button>
                </>
              )}

              {toolId === 'url-encoder-decoder' && (
                <>
                  <button onClick={() => handleUrlTransform('encode')} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition">
                    URL Encode
                  </button>
                  <button onClick={() => handleUrlTransform('decode')} className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold transition">
                    URL Decode
                  </button>
                </>
              )}

              {toolId === 'css-minifier' && (
                <button onClick={handleCssMinify} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition">
                  Minify CSS Stylesheet
                </button>
              )}
            </div>

            {outputCode && (
              <button
                onClick={copyResult}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied Output!' : 'Copy Result'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
