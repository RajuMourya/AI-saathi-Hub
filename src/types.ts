export type CategoryId = 
  | 'text'
  | 'pdf'
  | 'image'
  | 'social'
  | 'education'
  | 'career'
  | 'finance'
  | 'developer'
  | 'utility';

export interface ToolCategory {
  id: CategoryId;
  name: string;
  nameHi: string;
  slug: string;
  iconName: string;
  color: string;
  description: string;
  descriptionHi: string;
  count?: number;
}

export interface ToolFAQ {
  question: string;
  questionHi?: string;
  answer: string;
  answerHi?: string;
}

export interface ToolDefinition {
  id: string;
  name: string;
  nameHi: string;
  slug: string;
  categoryId: CategoryId;
  description: string;
  descriptionHi: string;
  iconName: string;
  keywords: string[];
  isPopular?: boolean;
  isNew?: boolean;
  privacyMessage?: string;
  features: string[];
  featuresHi?: string[];
  steps: string[];
  stepsHi?: string[];
  faqs: ToolFAQ[];
  relatedToolIds: string[];
}

export interface SearchResult {
  tool: ToolDefinition;
  score: number;
  matchedOn: string;
}

export interface ProblemSolverRecommendation {
  tool: ToolDefinition;
  confidence: number;
  reason: string;
  reasonHi: string;
}

export type ViewState = 
  | { type: 'home' }
  | { type: 'tool'; toolId: string }
  | { type: 'category'; categoryId: CategoryId }
  | { type: 'favorites' }
  | { type: 'history' }
  | { type: 'all-tools' }
  | { type: 'about' }
  | { type: 'privacy' }
  | { type: 'terms' }
  | { type: 'disclaimer' }
  | { type: 'contact' }
  | { type: 'feedback' }
  | { type: 'blogger-guide' }
  | { type: 'drive' }
  | { type: 'sheets' }
  | { type: 'gmail'; composeDraft?: { to?: string; subject?: string; body?: string } };

export interface GmailMessageHeader {
  name: string;
  value: string;
}

export interface GmailMessageSummary {
  id: string;
  threadId: string;
  snippet?: string;
  historyId?: string;
  internalDate?: string;
  labelIds?: string[];
  from?: string;
  to?: string;
  subject?: string;
  date?: string;
  isUnread?: boolean;
  isStarred?: boolean;
}

export interface GmailMessageDetail extends GmailMessageSummary {
  bodyHtml?: string;
  bodyPlain?: string;
  headers?: GmailMessageHeader[];
  attachments?: Array<{
    filename: string;
    mimeType: string;
    size: number;
    attachmentId: string;
  }>;
}

export interface GmailDraft {
  id: string;
  message?: GmailMessageDetail;
}

export interface SpreadsheetInfo {
  id: string;
  name: string;
  modifiedTime?: string;
  webViewLink?: string;
}

export interface SpreadsheetDetails {
  spreadsheetId: string;
  title: string;
  spreadsheetUrl: string;
  sheets: Array<{
    sheetId: number;
    title: string;
    index: number;
    gridProperties?: {
      rowCount?: number;
      columnCount?: number;
    };
  }>;
}

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime?: string;
  thumbnailLink?: string;
  webViewLink?: string;
  webContentLink?: string;
  iconLink?: string;
  parents?: string[];
  trashed?: boolean;
}

export interface DriveStorageQuota {
  limit?: string;
  usage?: string;
  usageInDrive?: string;
  usageInDriveTrash?: string;
}

export interface DriveUser {
  displayName: string;
  emailAddress: string;
  photoLink?: string;
}

export interface FeedbackItem {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  category?: 'suggestion' | 'bug' | 'compliment' | 'general' | 'blogger';
  toolId?: string;
  rating?: number;
  createdAt: string;
}

export type Language = 'en' | 'hi';
