import React, { useState, useEffect } from 'react';
import { ViewState, Language, GmailMessageSummary, GmailMessageDetail } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { initAuth, googleSignIn, googleSignOut } from '../services/googleDrive';
import {
  getGmailProfile,
  listMessages,
  getMessageDetails,
  sendEmail,
  saveDraft,
  modifyLabels,
  trashMessage,
  GMAIL_TEMPLATES
} from '../services/gmail';
import {
  Mail,
  Send,
  Inbox,
  Star,
  Trash2,
  RefreshCw,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Reply,
  ShieldCheck,
  Zap,
  FileText,
  Clock,
  User,
  Paperclip,
  Check,
  Layers,
  SendHorizontal,
  MailCheck,
  MailQuestion
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface GmailManagerProps {
  onNavigate: (view: ViewState) => void;
  lang: Language;
  initialComposeDraft?: { to?: string; subject?: string; body?: string };
}

type ActiveFolder = 'INBOX' | 'STARRED' | 'SENT' | 'DRAFT' | 'TRASH' | 'ALL';

export const GmailManager: React.FC<GmailManagerProps> = ({
  onNavigate,
  lang,
  initialComposeDraft
}) => {
  const t = TRANSLATIONS[lang];

  // Auth state
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [gmailProfile, setGmailProfile] = useState<{ emailAddress: string; messagesTotal: number } | null>(null);

  // Folder & Search state
  const [activeFolder, setActiveFolder] = useState<ActiveFolder>('INBOX');
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<GmailMessageSummary[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // Selected message state
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<GmailMessageDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  // Compose / Reply state
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [composeTo, setComposeTo] = useState(initialComposeDraft?.to || '');
  const [composeCc, setComposeCc] = useState('');
  const [composeBcc, setComposeBcc] = useState('');
  const [showCcBcc, setShowCcBcc] = useState(false);
  const [composeSubject, setComposeSubject] = useState(initialComposeDraft?.subject || '');
  const [composeBody, setComposeBody] = useState(initialComposeDraft?.body || '');
  const [isSending, setIsSending] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  // Notification banners
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Initialize Auth
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, accessToken) => {
        setUser(currentUser);
        setToken(accessToken);
      },
      () => {
        setUser(null);
        setToken(null);
      }
    );
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Open compose if initialComposeDraft provided
  useEffect(() => {
    if (initialComposeDraft) {
      setShowComposeModal(true);
      if (initialComposeDraft.to) setComposeTo(initialComposeDraft.to);
      if (initialComposeDraft.subject) setComposeSubject(initialComposeDraft.subject);
      if (initialComposeDraft.body) setComposeBody(initialComposeDraft.body);
    }
  }, [initialComposeDraft]);

  // Fetch profile & message list when token is ready
  useEffect(() => {
    if (token) {
      loadProfileAndMessages();
    }
  }, [token, activeFolder]);

  const loadProfileAndMessages = async () => {
    setIsLoadingMessages(true);
    setErrorMessage(null);
    try {
      // Load profile info if not loaded
      if (!gmailProfile) {
        getGmailProfile()
          .then(setGmailProfile)
          .catch(() => {});
      }

      let labelParam: string[] = ['INBOX'];
      if (activeFolder === 'STARRED') labelParam = ['STARRED'];
      else if (activeFolder === 'SENT') labelParam = ['SENT'];
      else if (activeFolder === 'DRAFT') labelParam = ['DRAFT'];
      else if (activeFolder === 'TRASH') labelParam = ['TRASH'];
      else if (activeFolder === 'ALL') labelParam = [];

      const result = await listMessages(searchQuery, labelParam, 20);
      setMessages(result.messages || []);
    } catch (err: any) {
      console.error('Failed to load Gmail messages:', err);
      setErrorMessage(err.message || 'Failed to retrieve messages from Gmail.');
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleSignIn = async () => {
    setIsSigningIn(true);
    setErrorMessage(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setToken(res.accessToken);
        try {
          confetti({ particleCount: 40, spread: 60 });
        } catch {
          // ignore
        }
      }
    } catch (err: any) {
      console.error('Gmail Sign in error:', err);
      setErrorMessage(err.message || 'Google Sign-in could not be completed.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await googleSignOut();
      setUser(null);
      setToken(null);
      setMessages([]);
      setSelectedMessage(null);
      setSelectedMessageId(null);
      setGmailProfile(null);
    } catch (err: any) {
      console.error('Sign out error:', err);
    }
  };

  const handleSelectMessage = async (summary: GmailMessageSummary) => {
    setSelectedMessageId(summary.id);
    setIsLoadingDetail(true);
    setErrorMessage(null);
    try {
      const detail = await getMessageDetails(summary.id);
      setSelectedMessage(detail);

      // If unread, mark as read in Gmail automatically
      if (summary.isUnread) {
        modifyLabels(summary.id, [], ['UNREAD']).catch(() => {});
        setMessages(prev =>
          prev.map(m => (m.id === summary.id ? { ...m, isUnread: false } : m))
        );
      }
    } catch (err: any) {
      console.error('Failed to get message details:', err);
      setErrorMessage(err.message || 'Failed to read email content.');
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleToggleStar = async (e: React.MouseEvent, msgId: string, currentStarred: boolean) => {
    e.stopPropagation();
    try {
      if (currentStarred) {
        await modifyLabels(msgId, [], ['STARRED']);
      } else {
        await modifyLabels(msgId, ['STARRED'], []);
      }

      setMessages(prev =>
        prev.map(m => (m.id === msgId ? { ...m, isStarred: !currentStarred } : m))
      );

      if (selectedMessage && selectedMessage.id === msgId) {
        setSelectedMessage(prev => (prev ? { ...prev, isStarred: !currentStarred } : null));
      }
    } catch (err: any) {
      console.error('Toggle star error:', err);
    }
  };

  const handleToggleReadStatus = async (msgId: string, currentlyUnread: boolean) => {
    try {
      if (currentlyUnread) {
        await modifyLabels(msgId, [], ['UNREAD']);
      } else {
        await modifyLabels(msgId, ['UNREAD'], []);
      }

      setMessages(prev =>
        prev.map(m => (m.id === msgId ? { ...m, isUnread: !currentlyUnread } : m))
      );

      if (selectedMessage && selectedMessage.id === msgId) {
        setSelectedMessage(prev => (prev ? { ...prev, isUnread: !currentlyUnread } : null));
      }
    } catch (err: any) {
      console.error('Toggle read status error:', err);
    }
  };

  const handleTrashMessage = async (msgId: string) => {
    try {
      await trashMessage(msgId);
      setMessages(prev => prev.filter(m => m.id !== msgId));
      if (selectedMessageId === msgId) {
        setSelectedMessage(null);
        setSelectedMessageId(null);
      }
      setSuccessMessage(lang === 'hi' ? 'ईमेल ट्रैश में ले जाया गया' : 'Email moved to Trash.');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to delete message.');
    }
  };

  const handleReply = () => {
    if (!selectedMessage) return;
    setComposeTo(selectedMessage.from || '');
    setComposeSubject(
      selectedMessage.subject?.startsWith('Re:')
        ? selectedMessage.subject
        : `Re: ${selectedMessage.subject || ''}`
    );
    setComposeBody(
      `\n\n--- On ${selectedMessage.date || 'earlier'}, ${selectedMessage.from} wrote:\n> ${
        (selectedMessage.bodyPlain || selectedMessage.snippet || '').replace(/\n/g, '\n> ')
      }`
    );
    setShowComposeModal(true);
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeTo.trim()) {
      setErrorMessage('Please provide a recipient email address.');
      return;
    }

    setIsSending(true);
    setErrorMessage(null);
    try {
      await sendEmail({
        to: composeTo.trim(),
        subject: composeSubject.trim() || '(No Subject)',
        body: composeBody,
        cc: composeCc.trim() || undefined,
        bcc: composeBcc.trim() || undefined
      });

      setShowComposeModal(false);
      setComposeTo('');
      setComposeCc('');
      setComposeBcc('');
      setComposeSubject('');
      setComposeBody('');
      setSuccessMessage(
        lang === 'hi'
          ? 'आपका ईमेल Gmail के ज़रिए सफलतापूर्वक भेज दिया गया!'
          : 'Email sent successfully via your Gmail account!'
      );
      setTimeout(() => setSuccessMessage(null), 4000);
      try {
        confetti({ particleCount: 50, spread: 60 });
      } catch {
        // ignore
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to send email.');
    } finally {
      setIsSending(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsSavingDraft(true);
    setErrorMessage(null);
    try {
      await saveDraft({
        to: composeTo.trim(),
        subject: composeSubject.trim() || '(Draft)',
        body: composeBody
      });
      setShowComposeModal(false);
      setSuccessMessage('Draft saved in Gmail.');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save draft.');
    } finally {
      setIsSavingDraft(false);
    }
  };

  const applyTemplate = (tmpl: (typeof GMAIL_TEMPLATES)[0]) => {
    setComposeSubject(tmpl.subject);
    setComposeBody(tmpl.body);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* TOP NAVIGATION BAR */}
      <div className="flex items-center justify-between">
        <button
          id="btn-gmail-back"
          onClick={() => onNavigate({ type: 'home' })}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t.backToHome}</span>
        </button>

        {user && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-red-600 text-white font-bold flex items-center justify-center text-xs">
                  {(user.displayName || user.email || 'G')[0].toUpperCase()}
                </div>
              )}
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  {user.displayName || 'Gmail User'}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  {gmailProfile?.emailAddress || user.email}
                </div>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{lang === 'hi' ? 'लॉगआउट' : 'Disconnect'}</span>
            </button>
          </div>
        )}
      </div>

      {/* HERO BANNER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-red-950 via-rose-950 to-slate-950 text-white shadow-xl">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-400/30 text-xs font-bold uppercase tracking-wider">
            <Mail className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'गूगल जीमेल क्लाउड हब' : 'Gmail Cloud Integration'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {lang === 'hi'
              ? 'जीमेल संदेश पढ़ें, ईमेल भेजें और टूल परिणाम सीधे प्रेषित करें'
              : 'Read, Compose & Transmit Emails Directly with Gmail'}
          </h1>
          <p className="text-sm text-red-100/80 leading-relaxed">
            {lang === 'hi'
              ? 'अपने जीमेल इनबॉक्स को ब्राउज़ करें, ईमेल का उत्तर दें, और इनवॉइस, रिज्यूमे या रिपोर्ट को सीधे 1-क्लिक में ग्राहक या टीम को भेजें।'
              : 'Access your inbox, search messages, send rich emails, and instantly dispatch job resumes, GST calculations or customer reports via your authentic Gmail account.'}
          </p>
        </div>

        {user && (
          <button
            id="btn-compose-gmail"
            onClick={() => setShowComposeModal(true)}
            className="px-5 py-3 rounded-2xl bg-red-500 hover:bg-red-400 text-white font-extrabold text-xs transition shadow-lg flex items-center gap-2 shrink-0 self-start md:self-center"
          >
            <Plus className="w-4 h-4" />
            <span>{lang === 'hi' ? 'नया ईमेल लिखें (Compose)' : 'Compose Email'}</span>
          </button>
        )}
      </div>

      {/* NOTIFICATIONS */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="font-bold underline ml-4">
            Dismiss
          </button>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* UNAUTHENTICATED STATE */}
      {!user ? (
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center max-w-2xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
            <Mail className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {lang === 'hi' ? 'जीमेल कनेक्ट करें' : 'Connect Your Gmail'}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md mx-auto">
              {lang === 'hi'
                ? 'अपने गूगल खाते से सुरक्षित रूप से साइन इन करें ताकि आप सीधे इस ऐप से इनबॉक्स देख सकें और ईमेल भेज सकें।'
                : 'Sign in with your Google account to read, draft, and send emails directly with privacy and security.'}
            </p>
          </div>

          <div className="flex justify-center pt-2">
            <button
              id="btn-google-gmail-sign-in"
              onClick={handleSignIn}
              disabled={isSigningIn}
              className="inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              <span>{isSigningIn ? (lang === 'hi' ? 'कनेक्ट हो रहा है...' : 'Connecting...') : (lang === 'hi' ? 'गूगल के साथ साइन इन करें' : 'Sign in with Google')}</span>
            </button>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
              <ShieldCheck className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{lang === 'hi' ? 'सुरक्षित OAuth2' : 'Direct Gmail API'}</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
              <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>{lang === 'hi' ? 'तुरंत ईमेल प्रेषण' : 'Instant 1-Click Send'}</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
              <FileText className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{lang === 'hi' ? 'रेडीमेड टेम्पलेट्स' : '5+ Professional Templates'}</span>
            </div>
          </div>
        </div>
      ) : (
        /* MAIN WORKSPACE GRID */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: FOLDER LIST & TEMPLATES (3 COLS) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <button
                onClick={() => {
                  setActiveFolder('INBOX');
                  setSelectedMessage(null);
                  setSelectedMessageId(null);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-bold transition ${
                  activeFolder === 'INBOX'
                    ? 'bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Inbox className="w-4 h-4" />
                  <span>Inbox</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveFolder('STARRED');
                  setSelectedMessage(null);
                  setSelectedMessageId(null);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-bold transition ${
                  activeFolder === 'STARRED'
                    ? 'bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Star className="w-4 h-4" />
                  <span>Starred</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveFolder('SENT');
                  setSelectedMessage(null);
                  setSelectedMessageId(null);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-bold transition ${
                  activeFolder === 'SENT'
                    ? 'bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Send className="w-4 h-4" />
                  <span>Sent</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveFolder('DRAFT');
                  setSelectedMessage(null);
                  setSelectedMessageId(null);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-bold transition ${
                  activeFolder === 'DRAFT'
                    ? 'bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4" />
                  <span>Drafts</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveFolder('TRASH');
                  setSelectedMessage(null);
                  setSelectedMessageId(null);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-bold transition ${
                  activeFolder === 'TRASH'
                    ? 'bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Trash2 className="w-4 h-4" />
                  <span>Trash</span>
                </div>
              </button>
            </div>

            {/* PRESET EMAIL TEMPLATES */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{lang === 'hi' ? 'क्विक ईमेल टेम्पलेट्स' : 'Quick Email Templates'}</span>
              </div>
              <div className="space-y-1.5">
                {GMAIL_TEMPLATES.map(tmpl => (
                  <button
                    key={tmpl.id}
                    onClick={() => {
                      applyTemplate(tmpl);
                      setShowComposeModal(true);
                    }}
                    className="w-full text-left p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-red-300 dark:hover:border-red-700 bg-slate-50/50 dark:bg-slate-800/30 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-red-600 transition flex items-center justify-between group"
                  >
                    <span className="truncate">{lang === 'hi' ? tmpl.nameHi : tmpl.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* MIDDLE COLUMN: MESSAGES LIST (4 COLS) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              {/* SEARCH & REFRESH */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && loadProfileAndMessages()}
                    placeholder={lang === 'hi' ? 'जीमेल में खोजें...' : 'Search in Gmail...'}
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <button
                  onClick={loadProfileAndMessages}
                  disabled={isLoadingMessages}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0"
                  title="Refresh emails"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingMessages ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {/* MESSAGES LIST */}
              <div className="space-y-1.5 max-h-[520px] overflow-y-auto pr-1">
                {isLoadingMessages ? (
                  <div className="py-16 text-center text-xs text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-red-500 mb-2" />
                    Loading Gmail messages...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-400 space-y-2">
                    <MailCheck className="w-8 h-8 text-slate-300 mx-auto" />
                    <p>No messages found in this folder.</p>
                  </div>
                ) : (
                  messages.map(msg => {
                    const isSelected = selectedMessageId === msg.id;
                    return (
                      <div
                        key={msg.id}
                        onClick={() => handleSelectMessage(msg)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                          isSelected
                            ? 'bg-red-50 dark:bg-red-950/40 border-red-500 ring-1 ring-red-500'
                            : msg.isUnread
                            ? 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 font-bold shadow-xs'
                            : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/80 hover:border-red-300'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 text-[11px]">
                          <span className="truncate font-semibold text-slate-900 dark:text-white max-w-[170px]">
                            {msg.from || '(Unknown Sender)'}
                          </span>
                          <div className="flex items-center gap-1 shrink-0">
                            <span className="text-[10px] text-slate-400">
                              {msg.date ? new Date(msg.date).toLocaleDateString() : ''}
                            </span>
                            <button
                              onClick={e => handleToggleStar(e, msg.id, !!msg.isStarred)}
                              className="p-0.5 text-slate-400 hover:text-amber-500"
                            >
                              <Star
                                className={`w-3.5 h-3.5 ${
                                  msg.isStarred ? 'fill-amber-400 text-amber-400' : ''
                                }`}
                              />
                            </button>
                          </div>
                        </div>

                        <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {msg.subject || '(No Subject)'}
                        </div>

                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                          {msg.snippet || ''}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: MESSAGE DETAILS VIEWER (5 COLS) */}
          <div className="lg:col-span-5 space-y-4">
            {isLoadingDetail ? (
              <div className="p-16 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center text-xs text-slate-400">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-red-500 mb-2" />
                Fetching email content...
              </div>
            ) : selectedMessage ? (
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                {/* MESSAGE HEADER */}
                <div className="space-y-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                      {selectedMessage.subject || '(No Subject)'}
                    </h2>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={e => handleToggleStar(e, selectedMessage.id, !!selectedMessage.isStarred)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-amber-500"
                        title="Star message"
                      >
                        <Star
                          className={`w-3.5 h-3.5 ${
                            selectedMessage.isStarred ? 'fill-amber-400 text-amber-400' : ''
                          }`}
                        />
                      </button>
                      <button
                        onClick={() => handleTrashMessage(selectedMessage.id)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-red-600"
                        title="Trash email"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <div>
                      <div>
                        From: <strong className="text-slate-900 dark:text-white">{selectedMessage.from}</strong>
                      </div>
                      {selectedMessage.to && <div>To: {selectedMessage.to}</div>}
                    </div>
                    <div className="text-right text-[11px]">
                      {selectedMessage.date || ''}
                    </div>
                  </div>
                </div>

                {/* EMAIL BODY */}
                <div className="min-h-[220px] max-h-[460px] overflow-y-auto pr-2 text-xs leading-relaxed text-slate-800 dark:text-slate-200">
                  {selectedMessage.bodyHtml ? (
                    <div
                      className="gmail-body-preview prose dark:prose-invert max-w-none text-xs"
                      dangerouslySetInnerHTML={{ __html: selectedMessage.bodyHtml }}
                    />
                  ) : (
                    <pre className="whitespace-pre-wrap font-sans text-xs">
                      {selectedMessage.bodyPlain || selectedMessage.snippet}
                    </pre>
                  )}
                </div>

                {/* ATTACHMENTS (IF ANY) */}
                {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                      <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                      <span>Attachments ({selectedMessage.attachments.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedMessage.attachments.map((att, idx) => (
                        <div
                          key={idx}
                          className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
                        >
                          <FileText className="w-3 h-3 text-red-500" />
                          <span className="truncate max-w-[140px]">{att.filename}</span>
                          <span className="text-[9px] text-slate-400 font-mono">
                            ({Math.round((att.size || 0) / 1024)} KB)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* REPLY ACTION BUTTON */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <button
                    onClick={handleReply}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                  >
                    <Reply className="w-3.5 h-3.5" />
                    <span>{lang === 'hi' ? 'उत्तर दें (Reply)' : 'Reply'}</span>
                  </button>
                </div>
              </div>
            ) : (
              /* EMPTY READING PANE */
              <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950 text-red-600 flex items-center justify-center mx-auto">
                  <Mail className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {lang === 'hi' ? 'कोई ईमेल चयनित नहीं' : 'No Email Selected'}
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    {lang === 'hi'
                      ? 'सूची से कोई ईमेल चुनें या सीधे नया संदेश भेजने के लिए "नया ईमेल लिखें" पर क्लिक करें।'
                      : 'Select a message from the list to view full content, or compose a new email.'}
                  </p>
                </div>
                <button
                  onClick={() => setShowComposeModal(true)}
                  className="px-5 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition inline-flex items-center gap-1.5 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>{lang === 'hi' ? 'नया ईमेल लिखें' : 'Compose Email'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: COMPOSE EMAIL */}
      {showComposeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-bold text-base">
                <Send className="w-5 h-5 text-red-600" />
                <span>{lang === 'hi' ? 'नया ईमेल भेजें (Gmail Compose)' : 'Compose Gmail Message'}</span>
              </div>
              <button
                type="button"
                onClick={() => setShowComposeModal(false)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendEmail} className="space-y-3.5">
              {/* RECIPIENT TO */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    To (Recipient Email)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowCcBcc(!showCcBcc)}
                    className="text-[11px] text-red-600 dark:text-red-400 font-semibold hover:underline"
                  >
                    {showCcBcc ? 'Hide CC/BCC' : 'Cc / Bcc'}
                  </button>
                </div>
                <input
                  type="email"
                  required
                  autoFocus
                  value={composeTo}
                  onChange={e => setComposeTo(e.target.value)}
                  placeholder="recipient@example.com"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* OPTIONAL CC / BCC */}
              {showCcBcc && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Cc
                    </label>
                    <input
                      type="text"
                      value={composeCc}
                      onChange={e => setComposeCc(e.target.value)}
                      placeholder="cc@example.com"
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Bcc
                    </label>
                    <input
                      type="text"
                      value={composeBcc}
                      onChange={e => setComposeBcc(e.target.value)}
                      placeholder="bcc@example.com"
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
              )}

              {/* SUBJECT */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={composeSubject}
                  onChange={e => setComposeSubject(e.target.value)}
                  placeholder="Subject of your email..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-red-500 font-semibold"
                />
              </div>

              {/* EMAIL BODY */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Message Body
                </label>
                <textarea
                  rows={8}
                  required
                  value={composeBody}
                  onChange={e => setComposeBody(e.target.value)}
                  placeholder="Write your email here..."
                  className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-red-500 font-sans leading-relaxed"
                />
              </div>

              {/* ACTIONS */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={isSavingDraft}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {isSavingDraft ? 'Saving Draft...' : 'Save Draft'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowComposeModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    disabled={isSending}
                    className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition disabled:opacity-50 flex items-center gap-1.5 shadow-md"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSending ? 'Sending via Gmail...' : 'Send Email'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
