import React, { useState } from 'react';
import { Copy, Check, Sparkles, Youtube, Instagram, Hash, Type, Image as ImageIcon, Download, Share2 } from 'lucide-react';

interface SocialMediaToolsProps {
  toolId: string;
}

export const SocialMediaTools: React.FC<SocialMediaToolsProps> = ({ toolId }) => {
  const [topic, setTopic] = useState<string>('Learn Web Development');
  const [category, setCategory] = useState<string>('tech');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [generatedResults, setGeneratedResults] = useState<string[]>([]);
  const [inputCaption, setInputCaption] = useState<string>('');
  const [unicodeInput, setUnicodeInput] = useState<string>('Supercharge Your Growth');

  // Thumbnail generator state
  const [thumbTitle, setThumbTitle] = useState<string>('TOP 10 FREE TOOLS');
  const [thumbSubtitle, setThumbSubtitle] = useState<string>('In 2026 You Must Try!');
  const [thumbBgColor, setThumbBgColor] = useState<string>('#1e1b4b');
  const [thumbBadge, setThumbBadge] = useState<string>('100% FREE');

  const copyText = (text: string, idx = 0) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Generate YouTube Titles
  const generateTitles = () => {
    const t = topic.trim() || 'My Topic';
    const templates = [
      `How to ${t} (Step-by-Step Complete Guide)`,
      `I Tried ${t} For 30 Days and This Happened...`,
      `The Secret to ${t} Nobody Tells You!`,
      `7 Biggest Mistakes People Make When ${t}`,
      `${t}: Everything You Need to Know (2026)`,
      `Stop Doing ${t} The Wrong Way! (Do This Instead)`,
      `Top 5 Tools for ${t} That Will Blow Your Mind`,
      `How I Mastered ${t} in 7 Days (Full Blueprint)`,
      `The Ultimate ${t} Masterclass for Beginners`,
      `Is ${t} Really Worth It in 2026? Honest Review`
    ];
    setGeneratedResults(templates);
  };

  // Generate Descriptions
  const generateDescription = () => {
    const t = topic.trim() || 'this topic';
    const desc = `🔥 In this video, we dive deep into ${t}! Whether you are a beginner or looking to scale your workflow, this step-by-step breakdown covers everything you need to know.

📌 Timestamps:
0:00 - Introduction & Overview
01:30 - Key Concepts of ${t}
04:15 - Practical Step-by-Step Walkthrough
08:45 - Pro Tips & Common Mistakes to Avoid
11:20 - Final Summary & Takeaways

🔗 Important Resources & Tools Mentioned:
👉 Free Tools Hub: ${window.location.origin}
👉 Subscribe for more daily guides: @YourChannel

💬 Leave a comment below with your favorite tip!
Don't forget to Like, Share, and Subscribe!

#${t.replace(/\s+/g, '')} #Productivity #DailyTools #Tutorial #Tips`;
    setGeneratedResults([desc]);
  };

  // Generate Hashtags
  const generateHashtags = () => {
    const tagBank: Record<string, string[]> = {
      tech: ['#Technology', '#Coding', '#WebDev', '#SoftwareEngineer', '#TechTips', '#Developer', '#AI', '#Innovation', '#ComputerScience', '#Programming'],
      motivation: ['#Motivation', '#SuccessMindset', '#GrowthMindset', '#Hustle', '#DailyInspiration', '#SelfImprovement', '#Discipline', '#Goals2026', '#Focus'],
      fitness: ['#FitnessMotivation', '#WorkoutDaily', '#HealthyLifestyle', '#GymLife', '#FitnessGoals', '#DietTips', '#Cardio', '#StrengthTraining'],
      business: ['#Startup', '#Entrepreneur', '#BusinessGrowth', '#MarketingTips', '#PassiveIncome', '#SideHustle', '#Leadership', '#DigitalMarketing'],
      creator: ['#ContentCreator', '#YouTuber', '#ReelsInstagram', '#ViralVideo', '#VideoEditing', '#CreatorEconomy', '#TrendingReels', '#InstaGood']
    };
    const selected = tagBank[category] || tagBank.tech;
    const custom = `#${topic.replace(/[^a-zA-Z0-9]/g, '')}`;
    const all = [custom, ...selected];
    setGeneratedResults([all.join(' '), all.slice(0, 5).join(' '), all.slice(5).join(' ')]);
  };

  // Unicode text conversion
  const convertUnicode = (str: string, type: 'bold' | 'italic' | 'mono' | 'circle' | 'square') => {
    const chars = str.split('');
    if (type === 'bold') {
      return chars.map(c => {
        const code = c.charCodeAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(0x1d400 + code - 65);
        if (code >= 97 && code <= 122) return String.fromCodePoint(0x1d41a + code - 97);
        if (code >= 48 && code <= 57) return String.fromCodePoint(0x1d7ce + code - 48);
        return c;
      }).join('');
    }
    if (type === 'italic') {
      return chars.map(c => {
        const code = c.charCodeAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(0x1d434 + code - 65);
        if (code >= 97 && code <= 122) return String.fromCodePoint(0x1d44e + code - 97);
        return c;
      }).join('');
    }
    if (type === 'mono') {
      return chars.map(c => {
        const code = c.charCodeAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(0x1d670 + code - 65);
        if (code >= 97 && code <= 122) return String.fromCodePoint(0x1d68a + code - 97);
        if (code >= 48 && code <= 57) return String.fromCodePoint(0x1d7f6 + code - 48);
        return c;
      }).join('');
    }
    return str;
  };

  // Download Canvas Thumbnail
  const handleDownloadThumbnail = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 1280, 720);
    grad.addColorStop(0, thumbBgColor);
    grad.addColorStop(1, '#09090b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1280, 720);

    // Decorative glow circle
    ctx.beginPath();
    ctx.arc(1100, 100, 300, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
    ctx.fill();

    // Badge
    if (thumbBadge) {
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.roundRect(100, 120, 220, 55, 12);
      ctx.fill();
      ctx.font = 'bold 24px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(thumbBadge, 130, 156);
    }

    // Main Title
    ctx.font = '900 68px Impact, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(thumbTitle, 100, 320);

    // Subtitle
    ctx.font = 'bold 38px sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(thumbSubtitle, 100, 410);

    // Watermark tag
    ctx.font = 'bold 22px sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fillText('AI Saathi Hub Creator Studio', 100, 620);

    const link = document.createElement('a');
    link.download = 'youtube-thumbnail-1280x720.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* 1. YOUTUBE TITLE & DESCRIPTION GENERATOR */}
      {(toolId === 'youtube-title-generator' || toolId === 'youtube-description-formatter' || toolId === 'instagram-caption-generator' || toolId === 'social-bio-generator') && (
        <div className="space-y-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="Enter your video/post topic (e.g. Graphic Design Tips)..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-rose-500"
            />
            <button
              onClick={toolId === 'youtube-title-generator' ? generateTitles : generateDescription}
              className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition"
            >
              <Sparkles className="w-4 h-4" />
              Generate Now
            </button>
          </div>

          {generatedResults.length > 0 && (
            <div className="space-y-2.5">
              <span className="text-xs font-semibold text-slate-500 block">Generated Results (Click to Copy):</span>
              {generatedResults.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => copyText(item, idx)}
                  className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-400 cursor-pointer flex items-center justify-between text-xs sm:text-sm font-medium transition"
                >
                  <span className="text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">{item}</span>
                  <span className="ml-3 shrink-0 p-1.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                    {copiedIndex === idx ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. HASHTAG GENERATOR */}
      {toolId === 'hashtag-generator' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="Keyword (e.g. WebDesign)"
              className="px-4 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
            />
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
            >
              <option value="tech">Technology & Coding</option>
              <option value="motivation">Motivation & Success</option>
              <option value="fitness">Health & Fitness</option>
              <option value="business">Business & Startup</option>
              <option value="creator">Content Creator & Reels</option>
            </select>
            <button
              onClick={generateHashtags}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
            >
              <Hash className="w-4 h-4" /> Find Hashtags
            </button>
          </div>

          {generatedResults.length > 0 && (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-500 block mb-2">High-Reach Tag Cloud:</span>
                <p className="text-sm font-mono text-blue-600 dark:text-blue-400 leading-relaxed">{generatedResults[0]}</p>
                <button
                  onClick={() => copyText(generatedResults[0], 0)}
                  className="mt-3 px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5"
                >
                  {copiedIndex === 0 ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedIndex === 0 ? 'Copied Tags' : 'Copy All Tags'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. UNICODE BOLD & FANCY FONT FORMATTER */}
      {toolId === 'social-media-unicode-formatter' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">Type Your Text</label>
            <input
              type="text"
              value={unicodeInput}
              onChange={e => setUnicodeInput(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
            />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-500">Copy Formatted Text for Instagram, Bio & Twitter:</span>
            {[
              { label: '𝗕𝗼𝗹𝗱 𝗦𝗮𝗻𝘀', val: convertUnicode(unicodeInput, 'bold') },
              { label: '𝘐𝘵𝘢𝘭𝘪𝘤 𝘚𝘢𝘯𝘴', val: convertUnicode(unicodeInput, 'italic') },
              { label: '𝙼𝚘𝚗𝚘𝚜𝚙𝚊𝚌𝚎', val: convertUnicode(unicodeInput, 'mono') }
            ].map((style, i) => (
              <div
                key={i}
                onClick={() => copyText(style.val, i)}
                className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 cursor-pointer flex items-center justify-between transition"
              >
                <div>
                  <span className="text-xs text-slate-400 block">{style.label}</span>
                  <span className="text-base text-slate-900 dark:text-white font-medium">{style.val}</span>
                </div>
                <button className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600">
                  {copiedIndex === i ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. YOUTUBE THUMBNAIL CANVAS MAKER */}
      {(toolId === 'youtube-thumbnail-maker' || toolId === 'thumbnail-size-calculator') && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-4">
            <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-700 flex flex-col justify-center p-8" style={{ backgroundColor: thumbBgColor }}>
              {thumbBadge && (
                <span className="self-start px-3 py-1 bg-red-600 text-white font-bold text-xs rounded-md uppercase tracking-wider mb-2">
                  {thumbBadge}
                </span>
              )}
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-impact tracking-wide uppercase leading-tight drop-shadow-md">
                {thumbTitle}
              </h2>
              <p className="text-sm sm:text-base font-semibold text-sky-400 mt-1">
                {thumbSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Headline Text</label>
                <input
                  type="text"
                  value={thumbTitle}
                  onChange={e => setThumbTitle(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Subtitle Text</label>
                <input
                  type="text"
                  value={thumbSubtitle}
                  onChange={e => setThumbSubtitle(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Badge Tag</label>
                <input
                  type="text"
                  value={thumbBadge}
                  onChange={e => setThumbBadge(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Background Theme</label>
                <select
                  value={thumbBgColor}
                  onChange={e => setThumbBgColor(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                >
                  <option value="#1e1b4b">Deep Indigo (#1e1b4b)</option>
                  <option value="#0f172a">Dark Slate (#0f172a)</option>
                  <option value="#7f1d1d">Crimson Red (#7f1d1d)</option>
                  <option value="#064e3b">Emerald Green (#064e3b)</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleDownloadThumbnail}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg"
            >
              <Download className="w-4 h-4" /> Download 1280x720 High-Res Thumbnail (PNG)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
