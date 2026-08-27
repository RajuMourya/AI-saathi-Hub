import React, { useState, useEffect } from 'react';
import { ViewState, Language, FeedbackItem } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { TOOLS } from '../data/tools';
import {
  getStoredFeedback,
  saveFeedback,
  deleteFeedbackItem,
  clearStoredFeedback,
  getFeedbackRecipientEmail,
  setFeedbackRecipientEmail,
  DEFAULT_FEEDBACK_EMAIL
} from '../utils/storage';
import {
  MessageSquare,
  Send,
  Mail,
  CheckCircle2,
  Star,
  Trash2,
  Download,
  Copy,
  Settings,
  Sparkles,
  Inbox,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FeedbackSystemProps {
  onNavigate: (view: ViewState) => void;
  lang: Language;
}

export const FeedbackSystem: React.FC<FeedbackSystemProps> = ({ onNavigate, lang }) => {
  const t = TRANSLATIONS[lang];

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<'suggestion' | 'bug' | 'compliment' | 'general' | 'blogger'>('suggestion');
  const [toolId, setToolId] = useState('');
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');

  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [recipientEmail, setRecipientEmailState] = useState(DEFAULT_FEEDBACK_EMAIL);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [tempEmail, setTempEmail] = useState(DEFAULT_FEEDBACK_EMAIL);

  const [feedbackLogs, setFeedbackLogs] = useState<FeedbackItem[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setFeedbackLogs(getStoredFeedback());
    const storedEmail = getFeedbackRecipientEmail();
    setRecipientEmailState(storedEmail);
    setTempEmail(storedEmail);
  }, []);

  const handleSaveEmailConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempEmail && tempEmail.includes('@')) {
      setFeedbackRecipientEmail(tempEmail);
      setRecipientEmailState(tempEmail);
      setIsEditingEmail(false);
    }
  };

  const handleLocalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    const saved = saveFeedback({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim() || `${category.toUpperCase()}: Feedback from ${name}`,
      message: message.trim(),
      category,
      toolId: toolId || undefined,
      rating
    });

    setFeedbackLogs([saved, ...feedbackLogs.filter(f => f.id !== saved.id)]);
    setSubmittedSuccess(true);

    try {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    } catch {
      // ignore
    }
  };

  const handleSendViaMailClient = () => {
    if (!name.trim() || !message.trim()) {
      alert(lang === 'hi' ? 'कृपया पहले अपना नाम और संदेश भरें।' : 'Please fill in your name and message first.');
      return;
    }

    const mailSubject = encodeURIComponent(`[AI Saathi Hub Feedback] ${subject || category.toUpperCase()} - from ${name}`);
    const selectedToolName = toolId ? TOOLS.find(t => t.id === toolId)?.name || toolId : 'General Platform';
    const bodyContent = encodeURIComponent(
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Category: ${category}\n` +
      `Related Tool: ${selectedToolName}\n` +
      `Rating: ${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}\n` +
      `Date: ${new Date().toLocaleString()}\n\n` +
      `Message:\n${message}\n\n` +
      `-- Sent from AI Saathi Hub User Feedback System --`
    );

    // Save locally too for auditing
    saveFeedback({
      name: name.trim(),
      email: email.trim() || 'user@direct-email.com',
      subject: subject.trim() || `${category.toUpperCase()}: Direct Email Feedback`,
      message: message.trim(),
      category,
      toolId: toolId || undefined,
      rating
    });
    setFeedbackLogs(getStoredFeedback());

    window.location.href = `mailto:${recipientEmail}?subject=${mailSubject}&body=${bodyContent}`;
  };

  const handleDeleteItem = (id: string) => {
    const updated = deleteFeedbackItem(id);
    setFeedbackLogs(updated);
  };

  const handleClearAll = () => {
    if (window.confirm(lang === 'hi' ? 'क्या आप सभी सहेजे गए फीडबैक रिकॉर्ड्स हटाना चाहते हैं?' : 'Are you sure you want to clear all stored feedback submissions?')) {
      clearStoredFeedback();
      setFeedbackLogs([]);
    }
  };

  const handleCopyFeedback = (item: FeedbackItem) => {
    const text = `Feedback ID: ${item.id}\nFrom: ${item.name} (${item.email})\nSubject: ${item.subject}\nRating: ${item.rating}/5\nCategory: ${item.category}\nDate: ${new Date(item.createdAt).toLocaleString()}\n\nMessage:\n${item.message}`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportJSON = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(feedbackLogs, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `ai_saathi_feedback_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Date', 'Name', 'Email', 'Category', 'Tool', 'Rating', 'Subject', 'Message'];
    const rows = feedbackLogs.map(item => [
      `"${item.id}"`,
      `"${new Date(item.createdAt).toLocaleString()}"`,
      `"${(item.name || '').replace(/"/g, '""')}"`,
      `"${(item.email || '').replace(/"/g, '""')}"`,
      `"${item.category || 'general'}"`,
      `"${item.toolId || 'N/A'}"`,
      item.rating || 5,
      `"${(item.subject || '').replace(/"/g, '""')}"`,
      `"${(item.message || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ai_saathi_feedback_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setRating(5);
    setToolId('');
    setSubmittedSuccess(false);
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6">
      {/* NAVIGATION CRUMB */}
      <button
        id="btn-feedback-back"
        onClick={() => onNavigate({ type: 'home' })}
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
      >
        {t.backToHome}
      </button>

      {/* HEADER HERO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs uppercase tracking-wider font-bold mb-1">
            <MessageSquare className="w-4 h-4" />
            <span>{lang === 'hi' ? 'उपयोगकर्ता फीडबैक और सुझाव' : 'User Feedback System'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {lang === 'hi' ? 'अपनी राय और सुझाव साझा करें' : 'Share Your Thoughts & Feedback'}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1.5 max-w-2xl">
            {lang === 'hi'
              ? 'क्या आपके पास नए टूल का सुझाव है या कोई बग रिपोर्ट करना चाहते हैं? हम हर फीडबैक को गंभीरता से लेते हैं।'
              : 'Have a feature request, found a bug, or want to suggest a new tool? We love hearing from you!'}
          </p>
        </div>

        {/* LOGS TOGGLE BADGE */}
        <button
          onClick={() => setShowLogs(!showLogs)}
          className="self-start sm:self-center px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700/80 transition flex items-center gap-2 shadow-sm"
        >
          <Inbox className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>{lang === 'hi' ? 'सहेजे गए फीडबैक देखें' : 'Stored Feedback'}</span>
          <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-[11px]">
            {feedbackLogs.length}
          </span>
          {showLogs ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* MAIN FEEDBACK FORM (2 COLS) */}
        <div className="lg:col-span-2">
          {submittedSuccess ? (
            <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/80 text-center shadow-lg shadow-emerald-500/5">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
                {lang === 'hi' ? 'फीडबैक सफलतापूर्वक प्राप्त हुआ!' : 'Thank You for Your Feedback!'}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md mx-auto mb-6">
                {lang === 'hi'
                  ? 'आपका संदेश सुरक्षित रूप से दर्ज कर लिया गया है। हम AI Saathi Hub को और बेहतर बनाने में इसका उपयोग करेंगे।'
                  : 'Your submission has been securely recorded in local audit storage. We deeply appreciate your support in making AI Saathi Hub better!'}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={resetForm}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm"
                >
                  {lang === 'hi' ? 'नया फीडबैक भेजें' : 'Submit Another Response'}
                </button>
                <button
                  onClick={() => setShowLogs(true)}
                  className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                >
                  {lang === 'hi' ? 'सहेजे गए रिकॉर्ड्स देखें' : 'View Stored Records'}
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleLocalSubmit}
              className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6"
            >
              {/* CATEGORY TAGS */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  {lang === 'hi' ? 'फीडबैक प्रकार चुनें *' : 'Feedback Category *'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'suggestion', label: '💡 Tool Suggestion', labelHi: '💡 नया टूल सुझाव' },
                    { id: 'bug', label: '🐛 Bug Report', labelHi: '🐛 बग रिपोर्ट' },
                    { id: 'compliment', label: '❤️ Compliment', labelHi: '❤️ प्रशंसा' },
                    { id: 'blogger', label: '🔌 Blogger / Embed', labelHi: '🔌 ब्लॉगर एम्बेड' },
                    { id: 'general', label: '📝 General Query', labelHi: '📝 सामान्य सुझाव' },
                  ].map(cat => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setCategory(cat.id as any)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border text-left transition ${
                        category === cat.id
                          ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      {lang === 'hi' ? cat.labelHi : cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* NAME & EMAIL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    {lang === 'hi' ? 'आपका नाम *' : 'Your Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Ramesh Patel"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    {lang === 'hi' ? 'ईमेल पता *' : 'Your Email Address *'}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* SUBJECT & TARGET TOOL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    {lang === 'hi' ? 'विषय (Subject)' : 'Subject'}
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    placeholder="e.g. Add OCR Text from Image Tool"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    {lang === 'hi' ? 'संबंधित टूल (वैकल्पिक)' : 'Specific Tool (Optional)'}
                  </label>
                  <select
                    value={toolId}
                    onChange={e => setToolId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- General Website / Not Specific --</option>
                    {TOOLS.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.categoryId})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* RATING */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {lang === 'hi' ? 'आपका अनुभव रेटिंग' : 'Overall Experience Rating'}
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(starVal => (
                    <button
                      type="button"
                      key={starVal}
                      onClick={() => setRating(starVal)}
                      className="p-1 rounded-lg hover:scale-110 transition"
                      title={`${starVal} Star`}
                    >
                      <Star
                        className={`w-7 h-7 ${
                          starVal <= rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-500 ml-2">
                    {rating === 5 ? '⭐⭐⭐⭐⭐ Excellent' : rating === 4 ? '⭐⭐⭐⭐ Good' : rating === 3 ? '⭐⭐⭐ Average' : 'Needs Improvement'}
                  </span>
                </div>
              </div>

              {/* MESSAGE TEXTAREA */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {lang === 'hi' ? 'आपका संदेश / विवरण *' : 'Your Message / Description *'}
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder={
                    lang === 'hi'
                      ? 'कृपया अपनी समस्या या टूल सुझाव का विस्तार से विवरण दें...'
                      : 'Please describe your suggestions, tool ideas, or issue in detail...'
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* SUBMISSION BUTTONS */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="submit"
                  id="btn-submit-feedback"
                  className="flex-1 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{lang === 'hi' ? 'फीडबैक सबमिट करें' : 'Submit Feedback'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSendViaMailClient}
                  className="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold transition flex items-center justify-center gap-2"
                  title="Send formatted email via your default mail client"
                >
                  <Mail className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>{lang === 'hi' ? 'ईमेल से भेजें (Mail App)' : 'Send via Email App'}</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-500 text-center">
                🔒 Privacy-first client side: Form submissions are saved directly to your local browser storage or dispatched via your local email client with zero external tracking.
              </p>
            </form>
          )}
        </div>

        {/* SIDEBAR: CONFIG & LOCAL INFO (1 COL) */}
        <div className="space-y-6">
          {/* CONFIGURATION CARD */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <Settings className="w-4 h-4 text-blue-600" />
                <span>{lang === 'hi' ? 'ईमेल सेटिंग्स' : 'Delivery Configuration'}</span>
              </h3>
              {!isEditingEmail && (
                <button
                  onClick={() => setIsEditingEmail(true)}
                  className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                >
                  Edit
                </button>
              )}
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Configured recipient email for feedback dispatches and inquiries:
            </p>

            {isEditingEmail ? (
              <form onSubmit={handleSaveEmailConfig} className="space-y-2">
                <input
                  type="email"
                  required
                  value={tempEmail}
                  onChange={e => setTempEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="admin@example.com"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold"
                  >
                    Save Email
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTempEmail(recipientEmail);
                      setIsEditingEmail(false);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 font-mono text-xs text-slate-800 dark:text-slate-200 break-all">
                {recipientEmail}
              </div>
            )}

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Zero Backend Dependency</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Local Storage Persistence</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Exportable JSON & CSV</span>
              </div>
            </div>
          </div>

          {/* QUICK PROMPT IDEAS */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200/60 dark:border-blue-800/40 space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
              <Sparkles className="w-3.5 h-3.5" /> Popular Requests
            </h3>
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
              <li
                onClick={() => {
                  setCategory('suggestion');
                  setSubject('Add OCR Image to Text Extractor');
                  setMessage('It would be great to have an OCR tool that can extract Hindi and English text directly from pictures locally.');
                }}
                className="cursor-pointer hover:text-blue-600 transition"
              >
                ✨ "Add OCR Image to Text tool"
              </li>
              <li
                onClick={() => {
                  setCategory('suggestion');
                  setSubject('Add EPF / PF Calculator');
                  setMessage('Please add an Employees Provident Fund (EPF) interest calculator for Indian salaried employees.');
                }}
                className="cursor-pointer hover:text-blue-600 transition"
              >
                ✨ "Add EPF / Provident Fund Calculator"
              </li>
              <li
                onClick={() => {
                  setCategory('blogger');
                  setSubject('Need iframe widget customization for my website');
                  setMessage('I want to embed the image compressor tool on my Blogger blog with custom height.');
                }}
                className="cursor-pointer hover:text-blue-600 transition"
              >
                🔌 "Need help with Blogger embed"
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* STORED FEEDBACK AUDIT LOGS MODAL / SECTION */}
      {showLogs && (
        <section className="mt-12 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Inbox className="w-5 h-5 text-blue-600" />
                <span>{lang === 'hi' ? 'स्थानीय रूप से सहेजे गए फीडबैक' : 'Locally Stored Feedback Submissions'}</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Submissions stored in your browser's local database. You can review, copy, or export them.
              </p>
            </div>

            {feedbackLogs.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleExportCSV}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> CSV
                </button>
                <button
                  onClick={handleExportJSON}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> JSON
                </button>
                <button
                  onClick={handleClearAll}
                  className="px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs font-semibold hover:bg-red-100 flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear All
                </button>
              </div>
            )}
          </div>

          <div className="mt-6 space-y-4">
            {feedbackLogs.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
                <Inbox className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {lang === 'hi' ? 'अभी कोई सहेजा गया फीडबैक नहीं है' : 'No stored feedback submissions yet'}
                </p>
                <p className="text-xs text-slate-400 mt-1">Submit a feedback form above to see entries logged here.</p>
              </div>
            ) : (
              feedbackLogs.map(item => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{item.name}</span>
                      <span className="text-xs text-slate-500">&lt;{item.email}&gt;</span>
                      <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 text-[10px] uppercase font-bold">
                        {item.category || 'Feedback'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: item.rating || 5 }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {item.subject && (
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Subject: {item.subject}
                    </div>
                  )}

                  <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                    {item.message}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <div className="text-[10px] text-slate-400 font-mono">ID: {item.id}</div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyFeedback(item)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1"
                      >
                        {copiedId === item.id ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId === item.id ? 'Copied' : 'Copy'}</span>
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="px-2.5 py-1 rounded-lg text-[11px] text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}
    </div>
  );
};
