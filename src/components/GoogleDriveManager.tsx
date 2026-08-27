import React, { useState, useEffect, useRef } from 'react';
import { ViewState, Language, DriveFile, DriveStorageQuota } from '../types';
import { TRANSLATIONS } from '../data/translations';
import {
  initAuth,
  googleSignIn,
  googleSignOut,
  fetchDriveFiles,
  fetchDriveAbout,
  createDriveFolder,
  uploadFileToDrive,
  deleteDriveFile,
  saveToolContentToDrive
} from '../services/googleDrive';
import {
  HardDrive,
  FolderPlus,
  Upload,
  Search,
  RefreshCw,
  Folder,
  FileText,
  Image as ImageIcon,
  FileSpreadsheet,
  FileCode,
  File,
  ExternalLink,
  Download,
  Trash2,
  Copy,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  LayoutGrid,
  List,
  Sparkles,
  Cloud,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface GoogleDriveManagerProps {
  onNavigate: (view: ViewState) => void;
  lang: Language;
}

export const GoogleDriveManager: React.FC<GoogleDriveManagerProps> = ({ onNavigate, lang }) => {
  const t = TRANSLATIONS[lang];

  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Files & Drive State
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [storageQuota, setStorageQuota] = useState<DriveStorageQuota | null>(null);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Navigation / Folder State
  const [currentFolderId, setCurrentFolderId] = useState<string | undefined>(undefined);
  const [folderBreadcrumbs, setFolderBreadcrumbs] = useState<Array<{ id?: string; name: string }>>([
    { id: undefined, name: lang === 'hi' ? 'माई ड्राइव' : 'My Drive' }
  ]);

  // Filtering & View
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'folders' | 'documents' | 'images' | 'pdf'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modals & Actions
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  const [fileToDelete, setFileToDelete] = useState<DriveFile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);
  const [copiedFileId, setCopiedFileId] = useState<string | null>(null);

  // Drag-and-drop state
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize Auth state listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, accessToken) => {
        setUser(currentUser);
        setToken(accessToken);
        setIsLoadingAuth(false);
      },
      () => {
        setUser(null);
        setToken(null);
        setIsLoadingAuth(false);
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Fetch files and about info when token or folder changes
  useEffect(() => {
    if (token) {
      loadDriveData();
    }
  }, [token, currentFolderId, filterType]);

  const loadDriveData = async () => {
    setIsLoadingFiles(true);
    setErrorMessage(null);
    try {
      const [filesRes, aboutRes] = await Promise.allSettled([
        fetchDriveFiles({
          folderId: currentFolderId,
          query: searchQuery,
          mimeTypeFilter: filterType === 'all' ? undefined : filterType,
          pageSize: 40
        }),
        fetchDriveAbout()
      ]);

      if (filesRes.status === 'fulfilled') {
        setFiles(filesRes.value.files);
      } else {
        throw filesRes.reason;
      }

      if (aboutRes.status === 'fulfilled' && aboutRes.value.storageQuota) {
        setStorageQuota(aboutRes.value.storageQuota);
      }
    } catch (err: any) {
      console.error('Error loading Drive data:', err);
      setErrorMessage(err.message || 'Failed to load Google Drive files. Please check permissions.');
    } finally {
      setIsLoadingFiles(false);
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
      console.error('Sign-in failed:', err);
      setErrorMessage(err.message || 'Google sign-in was not completed.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await googleSignOut();
      setUser(null);
      setToken(null);
      setFiles([]);
      setStorageQuota(null);
    } catch (err: any) {
      console.error('Sign out error:', err);
    }
  };

  const handleOpenFolder = (folder: DriveFile) => {
    setCurrentFolderId(folder.id);
    setFolderBreadcrumbs(prev => [...prev, { id: folder.id, name: folder.name }]);
    setSearchQuery('');
  };

  const handleNavigateBreadcrumb = (index: number) => {
    const target = folderBreadcrumbs[index];
    setCurrentFolderId(target.id);
    setFolderBreadcrumbs(prev => prev.slice(0, index + 1));
    setSearchQuery('');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadDriveData();
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    setIsCreatingFolder(true);
    try {
      const created = await createDriveFolder(newFolderName.trim(), currentFolderId);
      setFiles(prev => [created, ...prev]);
      setNewFolderName('');
      setShowNewFolderModal(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create folder');
    } finally {
      setIsCreatingFolder(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles || uploadedFiles.length === 0) return;

    setIsUploading(true);
    setUploadSuccessMessage(null);
    try {
      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i];
        const uploaded = await uploadFileToDrive(file, file.name, currentFolderId);
        setFiles(prev => [uploaded, ...prev]);
      }
      setUploadSuccessMessage(
        lang === 'hi'
          ? `सफलतापूर्वक ${uploadedFiles.length} फ़ाइल(ें) गूगल ड्राइव में अपलोड हो गईं!`
          : `Successfully uploaded ${uploadedFiles.length} file(s) to Google Drive!`
      );
      setTimeout(() => setUploadSuccessMessage(null), 4000);
      try {
        confetti({ particleCount: 30, spread: 50 });
      } catch {
        // ignore
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'File upload failed');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;

    setIsUploading(true);
    try {
      const droppedFiles = e.dataTransfer.files;
      for (let i = 0; i < droppedFiles.length; i++) {
        const file = droppedFiles[i];
        const uploaded = await uploadFileToDrive(file, file.name, currentFolderId);
        setFiles(prev => [uploaded, ...prev]);
      }
      setUploadSuccessMessage(
        lang === 'hi'
          ? `सफलतापूर्वक ${droppedFiles.length} फ़ाइल(ें) अपलोड हुईं!`
          : `Successfully uploaded ${droppedFiles.length} file(s)!`
      );
      setTimeout(() => setUploadSuccessMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!fileToDelete) return;
    setIsDeleting(true);
    try {
      await deleteDriveFile(fileToDelete.id);
      setFiles(prev => prev.filter(f => f.id !== fileToDelete.id));
      setFileToDelete(null);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to delete file');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateSampleBackup = async () => {
    try {
      setIsUploading(true);
      const sampleText = `AI Saathi Hub Cloud Backup\nDate: ${new Date().toLocaleString()}\n\nThis note is automatically synced to your Google Drive to verify cloud connectivity.\nYou can use AI Saathi tools (Image compressor, PDF tools, Resume Builder) and save results directly to your Drive.`;
      const uploaded = await saveToolContentToDrive(
        `AI-Saathi-Note-${new Date().toISOString().slice(0, 10)}.txt`,
        sampleText,
        'text/plain'
      );
      setFiles(prev => [uploaded, ...prev]);
      setUploadSuccessMessage(
        lang === 'hi'
          ? 'सैंपल नोट आपके गूगल ड्राइव के "AI Saathi Hub" फोल्डर में सेव हो गया!'
          : 'Sample file saved to "AI Saathi Hub" folder in your Google Drive!'
      );
      setTimeout(() => setUploadSuccessMessage(null), 4000);
      try {
        confetti({ particleCount: 40, spread: 60 });
      } catch {
        // ignore
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save sample backup');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopyLink = (file: DriveFile) => {
    const link = file.webViewLink || file.webContentLink || `https://drive.google.com/file/d/${file.id}/view`;
    navigator.clipboard.writeText(link);
    setCopiedFileId(file.id);
    setTimeout(() => setCopiedFileId(null), 2000);
  };

  const formatFileSize = (bytes?: string | number): string => {
    if (!bytes) return '—';
    const num = typeof bytes === 'string' ? parseInt(bytes, 10) : bytes;
    if (isNaN(num)) return '—';
    if (num < 1024) return `${num} B`;
    if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
    if (num < 1024 * 1024 * 1024) return `${(num / (1024 * 1024)).toFixed(1)} MB`;
    return `${(num / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType === 'application/vnd.google-apps.folder') {
      return <Folder className="w-6 h-6 text-amber-500 fill-amber-500/20" />;
    }
    if (mimeType.includes('pdf')) {
      return <FileText className="w-6 h-6 text-rose-500" />;
    }
    if (mimeType.includes('image/')) {
      return <ImageIcon className="w-6 h-6 text-sky-500" />;
    }
    if (mimeType.includes('spreadsheet') || mimeType.includes('csv') || mimeType.includes('excel')) {
      return <FileSpreadsheet className="w-6 h-6 text-emerald-500" />;
    }
    if (mimeType.includes('code') || mimeType.includes('javascript') || mimeType.includes('json')) {
      return <FileCode className="w-6 h-6 text-indigo-500" />;
    }
    return <File className="w-6 h-6 text-slate-400" />;
  };

  const isFolder = (file: DriveFile) => file.mimeType === 'application/vnd.google-apps.folder';

  // Calculate storage stats
  const usedBytes = storageQuota?.usage ? parseInt(storageQuota.usage, 10) : 0;
  const limitBytes = storageQuota?.limit ? parseInt(storageQuota.limit, 10) : (15 * 1024 * 1024 * 1024); // default 15GB
  const percentUsed = limitBytes > 0 ? Math.min(100, Math.round((usedBytes / limitBytes) * 100)) : 0;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* TOP BAR / BACK NAVIGATION */}
      <div className="flex items-center justify-between">
        <button
          id="btn-drive-back"
          onClick={() => onNavigate({ type: 'home' })}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
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
                  alt={user.displayName || 'Google User'}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                  {(user.displayName || user.email || 'G')[0].toUpperCase()}
                </div>
              )}
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  {user.displayName || 'Google Drive User'}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  {user.email}
                </div>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5"
              title="Sign out of Google Drive"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{lang === 'hi' ? 'लॉगआउट' : 'Disconnect'}</span>
            </button>
          </div>
        )}
      </div>

      {/* HEADER HERO */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white shadow-xl">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold uppercase tracking-wider">
            <HardDrive className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'गूगल ड्राइव क्लाउड स्टोरेज' : 'Google Drive Cloud Integration'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {lang === 'hi' ? 'अपनी फ़ाइलें और टूल आउटपुट सुरक्षित रूप से प्रबंधित करें' : 'Browse, Upload & Save to Google Drive'}
          </h1>
          <p className="text-sm text-blue-100/80 leading-relaxed">
            {lang === 'hi'
              ? 'सीधे AI Saathi Hub से अपनी गूगल ड्राइव फ़ाइलें ब्राउज़ करें, नई फ़ाइलें अपलोड करें और किसी भी टूल के परिणाम को 1-क्लिक में सहेजें।'
              : 'Directly manage your Google Drive files, upload documents, and backup your generated PDFs, compressed images, and resume files.'}
          </p>
        </div>

        {/* STORAGE OR SIGN IN CTA */}
        {user && storageQuota ? (
          <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl min-w-[240px] space-y-2 text-xs">
            <div className="flex items-center justify-between font-bold">
              <span>{lang === 'hi' ? 'स्टोरेज उपयोग' : 'Drive Storage'}</span>
              <span>{percentUsed}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  percentUsed > 85 ? 'bg-rose-400' : percentUsed > 60 ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
                style={{ width: `${percentUsed}%` }}
              />
            </div>
            <div className="text-[11px] text-blue-200 flex justify-between">
              <span>{formatFileSize(usedBytes)} used</span>
              <span>{formatFileSize(limitBytes)} total</span>
            </div>
          </div>
        ) : null}
      </div>

      {/* ERROR MESSAGE NOTIFICATION */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-xs font-bold underline ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* SUCCESS MESSAGE */}
      {uploadSuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
          <span>{uploadSuccessMessage}</span>
        </div>
      )}

      {/* IF NOT AUTHENTICATED: OFFICIAL GOOGLE SIGN IN CARD */}
      {!user ? (
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center max-w-2xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
            <Cloud className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {lang === 'hi' ? 'गूगल ड्राइव कनेक्ट करें' : 'Connect Your Google Drive'}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md mx-auto">
              {lang === 'hi'
                ? 'गूगल के साथ सुरक्षित रूप से साइन इन करें ताकि आप अपनी फ़ाइलों को ब्राउज़ और डाउनलोड कर सकें तथा टूल परिणाम ड्राइव में सुरक्षित रख सकें।'
                : 'Sign in securely to browse files, upload documents, and backup your results from AI Saathi tools directly into your Google Drive.'}
            </p>
          </div>

          {/* OFFICIAL SIGN IN WITH GOOGLE BUTTON (Google Identity standard styling) */}
          <div className="flex justify-center pt-2">
            <button
              id="btn-google-drive-sign-in"
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
              <span>{isSigningIn ? (lang === 'hi' ? 'साइन इन हो रहा है...' : 'Connecting...') : (lang === 'hi' ? 'गूगल के साथ साइन इन करें' : 'Sign in with Google')}</span>
            </button>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>{lang === 'hi' ? '100% सुरक्षित और निजी' : '100% Secure & Client-side'}</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
              <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>{lang === 'hi' ? '1-क्लिक टूल बैकअप' : '1-Click Tool Save & Export'}</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
              <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <span>{lang === 'hi' ? 'अनुमति अनुसार सुरक्षित नियंत्रण' : 'Explicit User Permission'}</span>
            </div>
          </div>
        </div>
      ) : (
        /* IF AUTHENTICATED: FULL DRIVE EXPLORER */
        <div className="space-y-6">
          {/* TOOLBAR & CONTROLS */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* SEARCH & FILTERS */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
              <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={lang === 'hi' ? 'गूगल ड्राइव में खोजें...' : 'Search Google Drive files...'}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </form>

              {/* FILTER PILLS */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {(
                  [
                    { id: 'all', label: 'All', labelHi: 'सभी' },
                    { id: 'folders', label: 'Folders', labelHi: 'फ़ोल्डर' },
                    { id: 'documents', label: 'Docs', labelHi: 'दस्तावेज़' },
                    { id: 'pdf', label: 'PDFs', labelHi: 'PDF' },
                    { id: 'images', label: 'Images', labelHi: 'फ़ोटो' },
                  ] as const
                ).map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setFilterType(tab.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                      filterType === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {lang === 'hi' ? tab.labelHi : tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex items-center gap-2 shrink-0">
              {/* HIDDEN FILE INPUT FOR UPLOAD */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                multiple
                className="hidden"
              />

              <button
                id="btn-drive-upload"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                <Upload className={`w-3.5 h-3.5 ${isUploading ? 'animate-bounce' : ''}`} />
                <span>{isUploading ? (lang === 'hi' ? 'अपलोड हो रहा है...' : 'Uploading...') : (lang === 'hi' ? 'फ़ाइल अपलोड' : 'Upload File')}</span>
              </button>

              <button
                onClick={() => setShowNewFolderModal(true)}
                className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
              >
                <FolderPlus className="w-3.5 h-3.5 text-amber-500" />
                <span>{lang === 'hi' ? 'नया फ़ोल्डर' : 'New Folder'}</span>
              </button>

              <button
                onClick={handleCreateSampleBackup}
                disabled={isUploading}
                className="px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 text-xs font-bold transition flex items-center gap-1.5"
                title="Create a test AI Saathi sync file in Drive"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{lang === 'hi' ? 'टूल सिंक टेस्ट' : 'Quick Tool Sync'}</span>
              </button>

              <button
                onClick={loadDriveData}
                disabled={isLoadingFiles}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="Refresh Drive files"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingFiles ? 'animate-spin' : ''}`} />
              </button>

              <div className="border-l border-slate-200 dark:border-slate-700 pl-2 flex items-center gap-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition ${
                    viewMode === 'grid'
                      ? 'bg-blue-50 dark:bg-blue-950 text-blue-600'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                  title="Grid view"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition ${
                    viewMode === 'list'
                      ? 'bg-blue-50 dark:bg-blue-950 text-blue-600'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                  title="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* BREADCRUMB FOLDER PATH */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 px-1 overflow-x-auto">
            {folderBreadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb.id || 'root'}>
                {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                <button
                  onClick={() => handleNavigateBreadcrumb(idx)}
                  className={`font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition truncate max-w-[150px] ${
                    idx === folderBreadcrumbs.length - 1
                      ? 'text-slate-900 dark:text-white font-bold underline'
                      : ''
                  }`}
                >
                  {crumb.name}
                </button>
              </React.Fragment>
            ))}
          </div>

          {/* DRAG AND DROP ZONE / FILE LISTING CONTAINER */}
          <div
            onDragOver={e => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`min-h-[360px] rounded-3xl p-6 transition-all ${
              isDragging
                ? 'bg-blue-50/80 dark:bg-blue-950/40 border-2 border-dashed border-blue-500 scale-[1.01]'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {isDragging && (
              <div className="text-center py-12 text-blue-600 dark:text-blue-400 font-bold text-base flex flex-col items-center gap-2 pointer-events-none">
                <Upload className="w-10 h-10 animate-bounce" />
                <span>{lang === 'hi' ? 'गूगल ड्राइव में अपलोड करने के लिए फ़ाइलें यहाँ छोड़ें' : 'Drop files here to upload to Google Drive'}</span>
              </div>
            )}

            {!isDragging && isLoadingFiles ? (
              <div className="py-20 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
                <p className="text-xs text-slate-500">{lang === 'hi' ? 'गूगल ड्राइव से फ़ाइलें लोड हो रही हैं...' : 'Loading files from Google Drive...'}</p>
              </div>
            ) : !isDragging && files.length === 0 ? (
              <div className="py-20 text-center space-y-4 max-w-md mx-auto">
                <Folder className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                    {lang === 'hi' ? 'इस फ़ोल्डर में कोई फ़ाइल नहीं मिली' : 'No files found in this folder'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {lang === 'hi'
                      ? 'ऊपर दिए गए "फ़ाइल अपलोड" बटन का उपयोग करें या फ़ाइलें ड्रैग करके यहाँ छोड़ें।'
                      : 'Upload a file or create a folder using the toolbar buttons above.'}
                  </p>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
                >
                  {lang === 'hi' ? 'फ़ाइल अपलोड करें' : 'Upload First File'}
                </button>
              </div>
            ) : !isDragging && viewMode === 'grid' ? (
              /* GRID VIEW */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {files.map(file => (
                  <div
                    key={file.id}
                    className={`group p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                      isFolder(file)
                        ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200/70 dark:border-amber-800/40 hover:border-amber-400'
                        : 'bg-slate-50/60 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/80 hover:border-blue-400'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div
                          onClick={() => (isFolder(file) ? handleOpenFolder(file) : window.open(file.webViewLink, '_blank'))}
                          className="cursor-pointer"
                        >
                          {file.thumbnailLink ? (
                            <img
                              src={file.thumbnailLink}
                              alt={file.name}
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
                            />
                          ) : (
                            getFileIcon(file.mimeType)
                          )}
                        </div>

                        {/* QUICK ACTIONS */}
                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                          <button
                            onClick={() => handleCopyLink(file)}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-700"
                            title="Copy link"
                          >
                            {copiedFileId === file.id ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>

                          {file.webViewLink && (
                            <a
                              href={file.webViewLink}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-white dark:hover:bg-slate-700"
                              title="Open in Google Drive"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}

                          <button
                            onClick={() => setFileToDelete(file)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white dark:hover:bg-slate-700"
                            title="Delete file"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div
                        onClick={() => (isFolder(file) ? handleOpenFolder(file) : window.open(file.webViewLink, '_blank'))}
                        className="cursor-pointer space-y-1"
                      >
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate" title={file.name}>
                          {file.name}
                        </h4>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                          <span>{isFolder(file) ? 'Folder' : formatFileSize(file.size)}</span>
                          <span>{file.modifiedTime ? new Date(file.modifiedTime).toLocaleDateString() : ''}</span>
                        </div>
                      </div>
                    </div>

                    {/* FOLDER OPEN BADGE */}
                    {isFolder(file) && (
                      <button
                        onClick={() => handleOpenFolder(file)}
                        className="mt-3 w-full py-1.5 rounded-lg bg-amber-100/70 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 text-[11px] font-bold hover:bg-amber-200/80 transition flex items-center justify-center gap-1"
                      >
                        <span>Open Folder</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              /* LIST VIEW */
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                      <th className="pb-3 pl-2">Name</th>
                      <th className="pb-3">Type / Size</th>
                      <th className="pb-3">Last Modified</th>
                      <th className="pb-3 text-right pr-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {files.map(file => (
                      <tr key={file.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                        <td className="py-3 pl-2 font-medium">
                          <div
                            onClick={() => (isFolder(file) ? handleOpenFolder(file) : window.open(file.webViewLink, '_blank'))}
                            className="flex items-center gap-2.5 cursor-pointer max-w-sm"
                          >
                            {getFileIcon(file.mimeType)}
                            <span className="truncate font-semibold text-slate-900 dark:text-white" title={file.name}>
                              {file.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 text-slate-500 dark:text-slate-400">
                          {isFolder(file) ? 'Folder' : formatFileSize(file.size)}
                        </td>
                        <td className="py-3 text-slate-500 dark:text-slate-400">
                          {file.modifiedTime ? new Date(file.modifiedTime).toLocaleDateString() : '—'}
                        </td>
                        <td className="py-3 text-right pr-2 space-x-1">
                          <button
                            onClick={() => handleCopyLink(file)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Copy link"
                          >
                            {copiedFileId === file.id ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>

                          {file.webViewLink && (
                            <a
                              href={file.webViewLink}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-block p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                              title="Open in Drive"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}

                          <button
                            onClick={() => setFileToDelete(file)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                            title="Delete file"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CREATE NEW FOLDER MODAL */}
      {showNewFolderModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
              <FolderPlus className="w-5 h-5 text-amber-500" />
              <span>{lang === 'hi' ? 'नया फ़ोल्डर बनाएँ' : 'Create New Folder'}</span>
            </div>

            <form onSubmit={handleCreateFolder} className="space-y-4">
              <input
                type="text"
                required
                autoFocus
                value={newFolderName}
                onChange={e => setNewFolderName(e.target.value)}
                placeholder="e.g. My Invoices, AI Saathi Backups"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewFolderModal(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingFolder}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition disabled:opacity-50"
                >
                  {isCreatingFolder ? 'Creating...' : 'Create Folder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MANDATORY USER CONFIRMATION MODAL FOR DESTRUCTIVE OPERATION */}
      {fileToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                {lang === 'hi' ? 'फ़ाइल हटाने की पुष्टि करें' : 'Delete file from Google Drive?'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {lang === 'hi'
                  ? `क्या आप वाकई "${fileToDelete.name}" को अपने गूगल ड्राइव से हटाना चाहते हैं? यह कार्रवाई पूर्ववत नहीं की जा सकती।`
                  : `Are you sure you want to permanently delete "${fileToDelete.name}" from your Google Drive account? This action cannot be undone.`}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs flex items-center gap-2 text-slate-700 dark:text-slate-300">
              {getFileIcon(fileToDelete.mimeType)}
              <span className="truncate font-semibold">{fileToDelete.name}</span>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setFileToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-rose-600/20 disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isDeleting ? 'Deleting...' : 'Delete Permanently'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
