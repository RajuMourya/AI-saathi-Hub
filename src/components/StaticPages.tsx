import React, { useState } from 'react';
import { ViewState, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { ShieldCheck, Mail, CheckCircle2, Copy, FileText, Code2, Globe, Sparkles, Send } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StaticPagesProps {
  view: ViewState;
  onNavigate: (view: ViewState) => void;
  lang: Language;
}

export const StaticPages: React.FC<StaticPagesProps> = ({ view, onNavigate, lang }) => {
  const t = TRANSLATIONS[lang];
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    setContactSubmitted(true);
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } catch {
      // ignore
    }
  };

  const bloggerEmbedCode = `<!-- AI Saathi Hub Free Tools Widget -->
<div id="ai-saathi-widget" style="width:100%; min-height:600px; border:none; border-radius:12px; overflow:hidden;">
  <iframe 
    src="${window.location.origin}" 
    width="100%" 
    height="750" 
    style="border:0; border-radius:12px; box-shadow:0 4px 20px rgba(0,0,0,0.08);" 
    title="AI Saathi Hub - 100+ Free Online Tools" 
    loading="lazy" 
    allow="clipboard-write; fullscreen">
  </iframe>
</div>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(bloggerEmbedCode);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6">
      <button
        id="btn-back-home"
        onClick={() => onNavigate({ type: 'home' })}
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
      >
        {t.backToHome}
      </button>

      {/* ABOUT PAGE */}
      {view.type === 'about' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-10 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-blue-600 dark:text-blue-400">
            <Sparkles className="w-7 h-7" />
            <span className="text-sm font-semibold tracking-wider uppercase">About Our Platform</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-6">
            AI Saathi Hub
          </h1>
          <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-6 font-medium">
            "100+ Free Tools for Your Everyday Work — Make useful digital tools simple, fast, and accessible to everyone."
          </p>
          <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed text-sm sm:text-base">
            <p>
              <strong>AI Saathi Hub</strong> is a modern, privacy-first productivity platform built to solve everyday digital challenges for students, creators, developers, freelancers, job seekers, and professionals.
            </p>
            <p>
              Unlike traditional platforms that upload your sensitive documents, passport photos, and PDFs to cloud servers or force tedious registrations, AI Saathi Hub harnesses modern <strong>Client-Side WebAssembly, Canvas, and HTML5 APIs</strong> to execute tools 100% locally on your own machine.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                <h2 className="font-semibold text-slate-900 dark:text-white text-base mb-1">🎯 Our Mission</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">To democratize digital utilities by making 100+ high-utility tools free, fast, uncluttered, and unconditionally private.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                <h2 className="font-semibold text-slate-900 dark:text-white text-base mb-1">🛡️ Privacy Commitment</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">We do not store your uploaded PDFs, pictures, text logs, or passwords on any remote database.</p>
              </div>
            </div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white pt-4">Core Principles</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Zero Mandatory Logins:</strong> Direct instant access to every single tool.</li>
              <li><strong>Offline Capable:</strong> Core calculators and text formatters function smoothly even with intermittent internet.</li>
              <li><strong>Blogger & Embed Compatible:</strong> Clean, modular architecture easy to embed on any blog or educational website.</li>
            </ul>
          </div>
        </div>
      )}

      {/* PRIVACY POLICY */}
      {view.type === 'privacy' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-8 h-8" />
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Privacy Policy</h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Last updated: August 2026</p>

          <div className="space-y-4 text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200 text-sm font-medium">
              🔒 <strong>Local Browser Processing Guarantee:</strong> When you use our Image Compressor, PDF Merger, Passport Photo Maker, Resume Builder, or Text Cleaners, your files and text are processed exclusively in your browser memory via JavaScript. They are NOT uploaded to any external server.
            </div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white pt-2">1. Information We Do NOT Collect</h2>
            <p>
              We do NOT collect, store, or sell:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Your uploaded images, PDFs, resumes, or documents</li>
              <li>Your generated passwords or financial inputs (GST, EMI, Salary)</li>
              <li>Personal identification numbers or bank account records</li>
            </ul>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white pt-2">2. Local Storage Usage</h2>
            <p>
              AI Saathi Hub uses your browser's standard <code>localStorage</code> purely to remember your preferences (such as Dark/Light theme mode, preferred language, favorite starred tools, and recently opened tool history). This data resides exclusively on your local device.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white pt-2">3. Cookies & Advertising</h2>
            <p>
              We may display non-intrusive advertisements (such as Google AdSense) to keep the website 100% free. Third-party advertising vendors may use standard cookies to serve ads based on prior visits.
            </p>
          </div>
        </div>
      )}

      {/* TERMS OF SERVICE */}
      {view.type === 'terms' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400">
            <FileText className="w-8 h-8" />
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Terms of Service</h1>
          </div>
          <div className="space-y-4 text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            <p>
              By accessing and using <strong>AI Saathi Hub</strong>, you agree to comply with and be bound by the following terms and conditions.
            </p>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white pt-2">1. Permitted Use</h2>
            <p>
              You may freely use all 100+ tools for personal, educational, and commercial workflows without restriction.
            </p>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white pt-2">2. User Responsibility</h2>
            <p>
              You are solely responsible for ensuring you have the legal right to process any documents, media, or text files you load into the tools. You agree not to use our tools to create unlawful, infringing, or malicious content.
            </p>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white pt-2">3. Modification of Services</h2>
            <p>
              We reserve the right to add new tools, refine features, or modify service specifications at any time to improve accuracy and user experience.
            </p>
          </div>
        </div>
      )}

      {/* DISCLAIMER */}
      {view.type === 'disclaimer' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-10 shadow-sm space-y-6">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Disclaimer</h1>
          <div className="space-y-4 text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            <p>
              The tools, calculators, and informational guides provided on AI Saathi Hub are provided on an "as is" basis for educational and productivity assistance.
            </p>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white pt-2">Financial & Tax Calculations</h2>
            <p>
              Financial tools (such as GST Calculator, EMI Calculator, Salary CTC Calculator, and Compound Interest) use standard mathematical formulas. However, actual tax liabilities and banking terms vary depending on regional jurisdictions, bank interest structures, and policy amendments. These tools do not constitute certified financial or tax advice.
            </p>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white pt-2">Health & BMI Guidance</h2>
            <p>
              The BMI Calculator and health utilities provide general statistical metrics and do not substitute for professional medical advice, diagnosis, or clinical consultation.
            </p>
          </div>
        </div>
      )}

      {/* CONTACT PAGE */}
      {view.type === 'contact' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-10 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400">
              <Mail className="w-8 h-8" />
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Contact Us</h1>
            </div>
            <button
              onClick={() => onNavigate({ type: 'feedback' })}
              className="self-start sm:self-center px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold hover:bg-amber-100 transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Open Feedback System →</span>
            </button>
          </div>
          <p className="text-slate-600 dark:text-slate-400 mb-8 text-sm sm:text-base">
            Have a tool suggestion, feedback, or inquiry? Fill out the form below or visit our dedicated feedback portal.
          </p>

          {contactSubmitted ? (
            <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-emerald-900 dark:text-emerald-100 mb-2">Message Sent Successfully!</h2>
              <p className="text-sm text-emerald-700 dark:text-emerald-300 mb-4">
                Thank you for reaching out to AI Saathi Hub. We appreciate your valuable feedback!
              </p>
              <button
                onClick={() => {
                  setContactSubmitted(false);
                  setContactForm({ name: '', email: '', subject: '', message: '' });
                }}
                className="px-5 py-2 text-sm font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Your Email Address *</label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                <input
                  type="text"
                  value={contactForm.subject}
                  onChange={e => setContactForm({ ...contactForm, subject: e.target.value })}
                  placeholder="e.g. New Tool Suggestion / Feature Request"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Message *</label>
                <textarea
                  required
                  rows={5}
                  value={contactForm.message}
                  onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="How can we help you?"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <button
                type="submit"
                id="btn-submit-contact"
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-md shadow-blue-500/20 inline-flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Submit Message
              </button>
            </form>
          )}
        </div>
      )}

      {/* BLOGGER & EMBED COMPATIBILITY GUIDE */}
      {view.type === 'blogger-guide' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400">
            <Code2 className="w-8 h-8" />
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Blogger & Website Integration</h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            AI Saathi Hub is engineered to be <strong>100% Client-Side and Serverless</strong>. You can seamlessly embed the entire tools hub or individual tools into any Blogger (Blogspot), WordPress, Wix, or custom HTML website.
          </p>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Blogger / HTML Embed Code Snippet</span>
              <button
                onClick={copyEmbedCode}
                className="px-3 py-1 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 transition"
              >
                {copiedEmbed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedEmbed ? 'Copied!' : 'Copy Embed HTML'}
              </button>
            </div>
            <pre className="p-3 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono overflow-x-auto">
              <code>{bloggerEmbedCode}</code>
            </pre>
          </div>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white pt-2">How to add to Blogger:</h2>
          <ol className="list-decimal pl-5 space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li>Log in to your <strong>Blogger Dashboard</strong>.</li>
            <li>Go to <strong>Pages</strong> &gt; <strong>New Page</strong> (e.g. name it "Free Tools Hub").</li>
            <li>Switch editor to <strong>HTML view</strong> (click the pencil/HTML icon).</li>
            <li>Paste the copied embed code above and click <strong>Publish</strong>.</li>
            <li>Add the page link to your Blogger top navigation menu!</li>
          </ol>
        </div>
      )}
    </div>
  );
};
