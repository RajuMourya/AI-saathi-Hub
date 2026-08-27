import { Language, FeedbackItem } from '../types';

const FAVORITES_KEY = 'ai_saathi_favorites';
const HISTORY_KEY = 'ai_saathi_history';
const THEME_KEY = 'ai_saathi_theme';
const LANG_KEY = 'ai_saathi_lang';
const FEEDBACK_KEY = 'ai_saathi_feedback_logs';
const FEEDBACK_EMAIL_KEY = 'ai_saathi_feedback_email';

export const DEFAULT_FEEDBACK_EMAIL = 'support@aisaathihub.com';

export function getFavorites(): string[] {
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : ['image-compressor', 'pdf-merger', 'resume-builder', 'age-calculator'];
  } catch {
    return ['image-compressor', 'pdf-merger', 'resume-builder', 'age-calculator'];
  }
}

export function toggleFavorite(toolId: string): string[] {
  const current = getFavorites();
  let updated: string[];
  if (current.includes(toolId)) {
    updated = current.filter(id => id !== toolId);
  } else {
    updated = [toolId, ...current];
  }
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error(e);
  }
  return updated;
}

export function getHistory(): string[] {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : ['image-compressor', 'age-calculator', 'pdf-merger', 'gst-calculator'];
  } catch {
    return ['image-compressor', 'age-calculator', 'pdf-merger', 'gst-calculator'];
  }
}

export function addToHistory(toolId: string): string[] {
  const current = getHistory().filter(id => id !== toolId);
  const updated = [toolId, ...current].slice(0, 12);
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error(e);
  }
  return updated;
}

export function clearHistory(): string[] {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (e) {
    console.error(e);
  }
  return [];
}

export function getStoredTheme(): 'light' | 'dark' {
  try {
    const theme = localStorage.getItem(THEME_KEY);
    if (theme === 'dark' || theme === 'light') return theme;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export function setStoredTheme(theme: 'light' | 'dark'): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {
    console.error(e);
  }
}

export function getStoredLanguage(): Language {
  try {
    const lang = localStorage.getItem(LANG_KEY);
    if (lang === 'hi' || lang === 'en') return lang;
    return 'en';
  } catch {
    return 'en';
  }
}

export function setStoredLanguage(lang: Language): void {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch (e) {
    console.error(e);
  }
}

// FEEDBACK STORAGE & CONFIGURATION
export function getStoredFeedback(): FeedbackItem[] {
  try {
    const data = localStorage.getItem(FEEDBACK_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveFeedback(item: Omit<FeedbackItem, 'id' | 'createdAt'>): FeedbackItem {
  const newItem: FeedbackItem = {
    ...item,
    id: 'fb-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    createdAt: new Date().toISOString(),
  };

  const current = getStoredFeedback();
  const updated = [newItem, ...current];

  try {
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error(e);
  }

  return newItem;
}

export function deleteFeedbackItem(id: string): FeedbackItem[] {
  const current = getStoredFeedback();
  const updated = current.filter(item => item.id !== id);
  try {
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error(e);
  }
  return updated;
}

export function clearStoredFeedback(): void {
  try {
    localStorage.removeItem(FEEDBACK_KEY);
  } catch (e) {
    console.error(e);
  }
}

export function getFeedbackRecipientEmail(): string {
  try {
    return localStorage.getItem(FEEDBACK_EMAIL_KEY) || DEFAULT_FEEDBACK_EMAIL;
  } catch {
    return DEFAULT_FEEDBACK_EMAIL;
  }
}

export function setFeedbackRecipientEmail(email: string): void {
  try {
    localStorage.setItem(FEEDBACK_EMAIL_KEY, email.trim() || DEFAULT_FEEDBACK_EMAIL);
  } catch (e) {
    console.error(e);
  }
}
