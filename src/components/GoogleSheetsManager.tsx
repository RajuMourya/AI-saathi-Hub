import React, { useState, useEffect } from 'react';
import { ViewState, Language, SpreadsheetInfo, SpreadsheetDetails } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { initAuth, googleSignIn, googleSignOut } from '../services/googleDrive';
import {
  listSpreadsheets,
  getSpreadsheetDetails,
  getSheetValues,
  createSpreadsheet,
  appendRowToSheet,
  updateSheetValues,
  addSheetTab,
  PRESET_TEMPLATES
} from '../services/googleSheets';
import {
  Table,
  Plus,
  Search,
  RefreshCw,
  ExternalLink,
  Save,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
  FileSpreadsheet,
  Edit3,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface GoogleSheetsManagerProps {
  onNavigate: (view: ViewState) => void;
  lang: Language;
}

export const GoogleSheetsManager: React.FC<GoogleSheetsManagerProps> = ({ onNavigate, lang }) => {
  const t = TRANSLATIONS[lang];

  // Auth State
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Spreadsheets list state
  const [spreadsheets, setSpreadsheets] = useState<SpreadsheetInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Active spreadsheet & sheet state
  const [selectedSpreadsheet, setSelectedSpreadsheet] = useState<SpreadsheetDetails | null>(null);
  const [activeSheetTitle, setActiveSheetTitle] = useState<string>('');
  const [sheetValues, setSheetValues] = useState<string[][]>([]);
  const [isLoadingSheetData, setIsLoadingSheetData] = useState(false);
  const [isSavingChanges, setIsSavingChanges] = useState(false);

  // Create Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('blank');
  const [isCreating, setIsCreating] = useState(false);

  // Add Tab Modal
  const [showAddTabModal, setShowAddTabModal] = useState(false);
  const [newTabTitle, setNewTabTitle] = useState('');
  const [isAddingTab, setIsAddingTab] = useState(false);

  // Append Row Form
  const [showAppendRowModal, setShowAppendRowModal] = useState(false);
  const [newRowData, setNewRowData] = useState<{ [key: number]: string }>({});
  const [isAppending, setIsAppending] = useState(false);

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

  // Fetch spreadsheets list when token is available
  useEffect(() => {
    if (token) {
      loadSpreadsheets();
    }
  }, [token]);

  const loadSpreadsheets = async () => {
    setIsLoadingList(true);
    setErrorMessage(null);
    try {
      const list = await listSpreadsheets(searchQuery);
      setSpreadsheets(list);
    } catch (err: any) {
      console.error('Error loading spreadsheets:', err);
      setErrorMessage(err.message || 'Failed to list Google Sheets.');
    } finally {
      setIsLoadingList(false);
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
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        } catch {
          // ignore
        }
      }
    } catch (err: any) {
      console.error('Google Sheets Sign In Error:', err);
      setErrorMessage(err.message || 'Google sign-in could not be completed.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await googleSignOut();
      setUser(null);
      setToken(null);
      setSpreadsheets([]);
      setSelectedSpreadsheet(null);
      setSheetValues([]);
    } catch (err: any) {
      console.error('Sign out error:', err);
    }
  };

  const handleSelectSpreadsheet = async (item: SpreadsheetInfo) => {
    setIsLoadingSheetData(true);
    setErrorMessage(null);
    try {
      const details = await getSpreadsheetDetails(item.id);
      setSelectedSpreadsheet(details);

      // Select first sheet safely (never assume "Sheet1")
      const firstTab = details.sheets[0]?.title || 'Sheet1';
      setActiveSheetTitle(firstTab);

      // Load values for the first tab
      await loadSheetValues(details.spreadsheetId, firstTab);
    } catch (err: any) {
      console.error('Error loading spreadsheet:', err);
      setErrorMessage(err.message || 'Failed to load spreadsheet details.');
    } finally {
      setIsLoadingSheetData(false);
    }
  };

  const loadSheetValues = async (spreadsheetId: string, sheetTitle: string) => {
    setIsLoadingSheetData(true);
    try {
      const data = await getSheetValues(spreadsheetId, `${sheetTitle}!A1:Z100`);
      setSheetValues(data.values || []);
    } catch (err: any) {
      console.error('Error loading sheet values:', err);
      setErrorMessage(err.message || `Failed to read data from ${sheetTitle}`);
      setSheetValues([]);
    } finally {
      setIsLoadingSheetData(false);
    }
  };

  const handleSwitchTab = async (sheetTitle: string) => {
    if (!selectedSpreadsheet) return;
    setActiveSheetTitle(sheetTitle);
    await loadSheetValues(selectedSpreadsheet.spreadsheetId, sheetTitle);
  };

  const handleCellChange = (rowIndex: number, colIndex: number, newValue: string) => {
    setSheetValues(prev => {
      const copy = prev.map(row => [...row]);
      while (copy.length <= rowIndex) {
        copy.push([]);
      }
      while (copy[rowIndex].length <= colIndex) {
        copy[rowIndex].push('');
      }
      copy[rowIndex][colIndex] = newValue;
      return copy;
    });
  };

  const handleSaveChanges = async () => {
    if (!selectedSpreadsheet || !activeSheetTitle) return;
    setIsSavingChanges(true);
    setErrorMessage(null);
    try {
      await updateSheetValues(
        selectedSpreadsheet.spreadsheetId,
        `${activeSheetTitle}!A1`,
        sheetValues
      );
      setSuccessMessage(
        lang === 'hi'
          ? 'गूगल शीट्स में सभी बदलाव सुरक्षित रूप से सेव हो गए!'
          : 'All changes saved directly to Google Sheets!'
      );
      setTimeout(() => setSuccessMessage(null), 4000);
      try {
        confetti({ particleCount: 30, spread: 50 });
      } catch {
        // ignore
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save changes to Google Sheets');
    } finally {
      setIsSavingChanges(false);
    }
  };

  const handleCreateNewSpreadsheet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsCreating(true);
    setErrorMessage(null);
    try {
      let initialData: string[][] | undefined = undefined;
      const initialTab = 'Sheet 1';

      if (selectedTemplateId !== 'blank') {
        const template = PRESET_TEMPLATES.find(p => p.id === selectedTemplateId);
        if (template) {
          initialData = [template.headers, template.sampleRow];
        }
      }

      const created = await createSpreadsheet(newTitle.trim(), initialTab, initialData);
      setSpreadsheets(prev => [
        {
          id: created.spreadsheetId,
          name: created.title,
          modifiedTime: new Date().toISOString(),
          webViewLink: created.spreadsheetUrl
        },
        ...prev
      ]);

      setSelectedSpreadsheet(created);
      setActiveSheetTitle(initialTab);
      setSheetValues(initialData || []);
      setShowCreateModal(false);
      setNewTitle('');
      setSelectedTemplateId('blank');

      setSuccessMessage(
        lang === 'hi'
          ? `नई गूगल शीट "${created.title}" सफलतापूर्वक बन गई!`
          : `New Google Sheet "${created.title}" created successfully!`
      );
      setTimeout(() => setSuccessMessage(null), 4000);
      try {
        confetti({ particleCount: 50, spread: 60 });
      } catch {
        // ignore
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create new spreadsheet');
    } finally {
      setIsCreating(false);
    }
  };

  const handleAddTab = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSpreadsheet || !newTabTitle.trim()) return;

    setIsAddingTab(true);
    try {
      await addSheetTab(selectedSpreadsheet.spreadsheetId, newTabTitle.trim());
      const updatedDetails = await getSpreadsheetDetails(selectedSpreadsheet.spreadsheetId);
      setSelectedSpreadsheet(updatedDetails);
      setActiveSheetTitle(newTabTitle.trim());
      setSheetValues([]);
      setShowAddTabModal(false);
      setNewTabTitle('');
      setSuccessMessage(`New tab "${newTabTitle}" added successfully!`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to add tab');
    } finally {
      setIsAddingTab(false);
    }
  };

  const handleAppendRow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSpreadsheet || !activeSheetTitle) return;

    setIsAppending(true);
    try {
      const maxCol = Math.max(
        sheetValues[0]?.length || 0,
        ...Object.keys(newRowData).map(k => parseInt(k, 10) + 1)
      );

      const rowArray: string[] = [];
      for (let i = 0; i < maxCol; i++) {
        rowArray.push(newRowData[i] || '');
      }

      await appendRowToSheet(selectedSpreadsheet.spreadsheetId, `${activeSheetTitle}!A1`, [rowArray]);
      setSheetValues(prev => [...prev, rowArray]);
      setShowAppendRowModal(false);
      setNewRowData({});
      setSuccessMessage('Row appended successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to append row');
    } finally {
      setIsAppending(false);
    }
  };

  // Helper to generate column headers A, B, C ...
  const getColLetter = (index: number) => {
    return String.fromCharCode(65 + index);
  };

  const headerColumns = sheetValues[0] || [];
  const maxCols = Math.max(headerColumns.length, 6);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* TOP NAVIGATION BAR */}
      <div className="flex items-center justify-between">
        <button
          id="btn-sheets-back"
          onClick={() => onNavigate({ type: 'home' })}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
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
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                  {(user.displayName || user.email || 'G')[0].toUpperCase()}
                </div>
              )}
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  {user.displayName || 'Google Sheets User'}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  {user.email}
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white shadow-xl">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold uppercase tracking-wider">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'गूगल शीट्स क्लाउड वर्कबुक' : 'Google Sheets Cloud Integration'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {lang === 'hi'
              ? 'गूगल शीट्स बनाएं, संपादित करें और टूल डेटा सीधे निर्यात करें'
              : 'Create, Read & Sync Live Google Spreadsheets'}
          </h1>
          <p className="text-sm text-emerald-100/80 leading-relaxed">
            {lang === 'hi'
              ? 'अपने खाते से Google Sheets खोलें, स्प्रेडशीट में पंक्तियाँ जोड़ें या GST, EMI, उपस्थिति व बजट डेटा को सीधे गूगल शीट्स में सुरक्षित करें।'
              : 'Seamlessly access your spreadsheets, edit cells in real-time, append rows, and export GST calculations or financial ledgers straight to Google Sheets.'}
          </p>
        </div>

        {user && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition shadow-lg flex items-center gap-2 shrink-0 self-start md:self-center"
          >
            <Plus className="w-4 h-4" />
            <span>{lang === 'hi' ? 'नई गूगल शीट बनाएँ' : 'New Spreadsheet'}</span>
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
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <Table className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {lang === 'hi' ? 'गूगल शीट्स कनेक्ट करें' : 'Connect Google Sheets'}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md mx-auto">
              {lang === 'hi'
                ? 'अपने गूगल खाते से सुरक्षित रूप से साइन इन करें ताकि आप अपनी स्प्रेडशीट देख सकें, डेटा एडिट कर सकें और टूल आउटपुट सहेज सकें।'
                : 'Sign in to access your spreadsheets, edit data live in table grid, and export financial tools directly into your Google Sheets account.'}
            </p>
          </div>

          <div className="flex justify-center pt-2">
            <button
              id="btn-google-sheets-sign-in"
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
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>{lang === 'hi' ? 'सुरक्षित प्रमाणीकरण' : 'Direct Sheets API'}</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
              <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>{lang === 'hi' ? 'लाइव ग्रिड एडिटर' : 'Live Interactive Grid'}</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
              <Table className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
              <span>{lang === 'hi' ? 'रेडीमेड टेम्पलेट्स' : '5+ Preset Calculators'}</span>
            </div>
          </div>
        </div>
      ) : (
        /* MAIN WORKSPACE */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: SPREADSHEETS LIST (4 COLS) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'hi' ? 'आपकी गूगल शीट्स' : 'Your Google Sheets'}</span>
                </h3>
                <button
                  onClick={loadSpreadsheets}
                  disabled={isLoadingList}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  title="Refresh spreadsheets"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingList ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {/* SEARCH INPUT */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && loadSpreadsheets()}
                  placeholder={lang === 'hi' ? 'स्प्रेडशीट खोजें...' : 'Search sheets...'}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* LIST OF SHEETS */}
              <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
                {isLoadingList ? (
                  <div className="py-12 text-center text-xs text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-500 mb-2" />
                    Loading spreadsheets...
                  </div>
                ) : spreadsheets.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400 space-y-2">
                    <FileSpreadsheet className="w-8 h-8 text-slate-300 mx-auto" />
                    <p>No spreadsheets found.</p>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="text-emerald-600 font-bold underline"
                    >
                      Create one now
                    </button>
                  </div>
                ) : (
                  spreadsheets.map(sheet => {
                    const isSelected = selectedSpreadsheet?.spreadsheetId === sheet.id;
                    return (
                      <div
                        key={sheet.id}
                        onClick={() => handleSelectSpreadsheet(sheet)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                          isSelected
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500'
                            : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/80 hover:border-emerald-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Table className={`w-4 h-4 shrink-0 ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`} />
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-900 dark:text-white truncate" title={sheet.name}>
                              {sheet.name}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {sheet.modifiedTime ? new Date(sheet.modifiedTime).toLocaleDateString() : ''}
                            </div>
                          </div>
                        </div>

                        {sheet.webViewLink && (
                          <a
                            href={sheet.webViewLink}
                            target="_blank"
                            rel="noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="p-1 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-white dark:hover:bg-slate-700 transition shrink-0"
                            title="Open in Google Sheets"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* PRESET TEMPLATES FAST ACTIONS */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{lang === 'hi' ? 'AI साथी रेडीमेड टेम्पलेट्स' : 'Quick Starter Templates'}</span>
              </div>
              <div className="space-y-1.5">
                {PRESET_TEMPLATES.slice(0, 3).map(tmpl => (
                  <button
                    key={tmpl.id}
                    onClick={() => {
                      setNewTitle(lang === 'hi' ? tmpl.nameHi : tmpl.name);
                      setSelectedTemplateId(tmpl.id);
                      setShowCreateModal(true);
                    }}
                    className="w-full text-left p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 bg-slate-50/50 dark:bg-slate-800/30 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition flex items-center justify-between group"
                  >
                    <span className="truncate">{lang === 'hi' ? tmpl.nameHi : tmpl.name}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: ACTIVE SPREADSHEET VIEWER & EDITOR (8 COLS) */}
          <div className="lg:col-span-8 space-y-4">
            {selectedSpreadsheet ? (
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                {/* SPREADSHEET HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                        {selectedSpreadsheet.title}
                      </h2>
                      <a
                        href={selectedSpreadsheet.spreadsheetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline inline-flex items-center gap-1"
                      >
                        <span>Open on Web</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Spreadsheet ID: <code className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">{selectedSpreadsheet.spreadsheetId.slice(0, 16)}...</code>
                    </p>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowAppendRowModal(true)}
                      className="px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 transition flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{lang === 'hi' ? 'पंक्ति जोड़ें' : 'Add Row'}</span>
                    </button>

                    <button
                      onClick={handleSaveChanges}
                      disabled={isSavingChanges}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{isSavingChanges ? 'Saving...' : (lang === 'hi' ? 'बदलाव सेव करें' : 'Save Changes')}</span>
                    </button>
                  </div>
                </div>

                {/* TAB SELECTOR (TABS WITHIN SPREADSHEET) */}
                <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
                  <div className="flex items-center gap-1.5">
                    {selectedSpreadsheet.sheets.map(sheet => {
                      const isActive = activeSheetTitle === sheet.title;
                      return (
                        <button
                          key={sheet.sheetId}
                          onClick={() => handleSwitchTab(sheet.title)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                            isActive
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                          }`}
                        >
                          <Layers className="w-3 h-3" />
                          <span>{sheet.title}</span>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setShowAddTabModal(true)}
                    className="p-1.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 hover:text-emerald-600 hover:border-emerald-400 text-xs font-semibold flex items-center gap-1 shrink-0"
                    title="Add new sheet tab"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Tab</span>
                  </button>
                </div>

                {/* INTERACTIVE TABLE GRID */}
                <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800/40">
                  {isLoadingSheetData ? (
                    <div className="py-24 text-center text-xs text-slate-400 space-y-2">
                      <RefreshCw className="w-8 h-8 animate-spin mx-auto text-emerald-500" />
                      <p>Reading rows from {activeSheetTitle}...</p>
                    </div>
                  ) : sheetValues.length === 0 ? (
                    <div className="py-20 text-center text-xs text-slate-400 space-y-3">
                      <Table className="w-10 h-10 text-slate-300 mx-auto" />
                      <p>This sheet tab is currently empty.</p>
                      <button
                        onClick={() => setShowAppendRowModal(true)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs"
                      >
                        Add First Row
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto max-h-[500px]">
                      <table className="w-full text-xs text-left border-collapse">
                        {/* COLUMN HEADERS: A, B, C... */}
                        <thead>
                          <tr className="bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-700 select-none">
                            <th className="w-10 p-2 text-center text-[10px] text-slate-400 border-r border-slate-200 dark:border-slate-700">
                              #
                            </th>
                            {Array.from({ length: maxCols }).map((_, cIdx) => (
                              <th
                                key={cIdx}
                                className="p-2.5 font-extrabold text-[11px] text-slate-600 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700 min-w-[130px]"
                              >
                                {getColLetter(cIdx)}
                              </th>
                            ))}
                          </tr>
                        </thead>

                        {/* DATA CELLS */}
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-900">
                          {sheetValues.map((row, rIdx) => {
                            const isHeaderRow = rIdx === 0;
                            return (
                              <tr
                                key={rIdx}
                                className={isHeaderRow ? 'bg-emerald-50/40 dark:bg-emerald-950/20 font-bold' : ''}
                              >
                                {/* ROW NUMBER */}
                                <td className="p-2 text-center text-[10px] text-slate-400 font-mono bg-slate-50 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 select-none">
                                  {rIdx + 1}
                                </td>

                                {/* CELLS */}
                                {Array.from({ length: maxCols }).map((_, cIdx) => {
                                  const cellVal = row[cIdx] !== undefined ? String(row[cIdx]) : '';
                                  return (
                                    <td
                                      key={cIdx}
                                      className="p-1 border-r border-slate-200 dark:border-slate-700"
                                    >
                                      <input
                                        type="text"
                                        value={cellVal}
                                        onChange={e => handleCellChange(rIdx, cIdx, e.target.value)}
                                        className={`w-full px-2 py-1.5 text-xs bg-transparent border-0 rounded focus:bg-emerald-50 dark:focus:bg-emerald-950/50 focus:ring-1 focus:ring-emerald-500 focus:outline-none ${
                                          isHeaderRow
                                            ? 'font-bold text-slate-900 dark:text-white'
                                            : 'text-slate-800 dark:text-slate-200'
                                        }`}
                                      />
                                    </td>
                                  );
                                })}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* FOOTER INFO BAR */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2">
                  <span>
                    Rows: <strong>{sheetValues.length}</strong> | Columns: <strong>{maxCols}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <Edit3 className="w-3 h-3 text-emerald-500" />
                    <span>Click any cell to edit & press <strong>Save Changes</strong></span>
                  </span>
                </div>
              </div>
            ) : (
              /* EMPTY SPREADSHEET STATE */
              <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto">
                  <Table className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {lang === 'hi' ? 'कोई स्प्रेडशीट चयनित नहीं' : 'No Spreadsheet Selected'}
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    {lang === 'hi'
                      ? 'बाएं पैनल से एक शीट चुनें या एक नई स्प्रेडशीट बनाने के लिए "नई गूगल शीट बनाएँ" पर क्लिक करें।'
                      : 'Choose a spreadsheet from the left list or create a new one to view and edit data.'}
                  </p>
                </div>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition inline-flex items-center gap-1.5 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>{lang === 'hi' ? 'नई शीट बनाएँ' : 'Create New Spreadsheet'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: CREATE SPREADSHEET */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-bold text-base">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              <span>{lang === 'hi' ? 'नई गूगल स्प्रेडशीट बनाएँ' : 'Create Google Spreadsheet'}</span>
            </div>

            <form onSubmit={handleCreateNewSpreadsheet} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Spreadsheet Title
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Sales Ledger 2026, GST Records"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Starter Template (Optional)
                </label>
                <select
                  value={selectedTemplateId}
                  onChange={e => setSelectedTemplateId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="blank">Blank Spreadsheet (Blank Sheet 1)</option>
                  {PRESET_TEMPLATES.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition disabled:opacity-50"
                >
                  {isCreating ? 'Creating in Google...' : 'Create Spreadsheet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD TAB SHEET */}
      {showAddTabModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
              <Layers className="w-5 h-5 text-emerald-600" />
              <span>{lang === 'hi' ? 'नया शीट टैब जोड़ें' : 'Add New Sheet Tab'}</span>
            </div>

            <form onSubmit={handleAddTab} className="space-y-4">
              <input
                type="text"
                required
                autoFocus
                value={newTabTitle}
                onChange={e => setNewTabTitle(e.target.value)}
                placeholder="e.g. Q1 Expenses, Summary"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTabModal(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAddingTab}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold transition disabled:opacity-50"
                >
                  {isAddingTab ? 'Adding...' : 'Add Tab'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: APPEND ROW FORM */}
      {showAppendRowModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
              <Plus className="w-5 h-5 text-emerald-600" />
              <span>{lang === 'hi' ? 'नई पंक्ति जोड़ें' : `Append Row to ${activeSheetTitle}`}</span>
            </div>

            <form onSubmit={handleAppendRow} className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {Array.from({ length: maxCols }).map((_, cIdx) => {
                const headerLabel = headerColumns[cIdx] || `Column ${getColLetter(cIdx)}`;
                return (
                  <div key={cIdx}>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      {headerLabel} ({getColLetter(cIdx)})
                    </label>
                    <input
                      type="text"
                      value={newRowData[cIdx] || ''}
                      onChange={e =>
                        setNewRowData(prev => ({
                          ...prev,
                          [cIdx]: e.target.value
                        }))
                      }
                      placeholder={`Enter value for ${headerLabel}`}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                );
              })}

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAppendRowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAppending}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition disabled:opacity-50"
                >
                  {isAppending ? 'Appending in Sheets...' : 'Append Row'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
