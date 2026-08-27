import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { DriveFile, DriveStorageQuota } from '../types';

// Ensure single Firebase app instance
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

export const SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.activity',
  'https://www.googleapis.com/auth/drive.activity.readonly',
  'https://www.googleapis.com/auth/drive.appdata',
  'https://www.googleapis.com/auth/drive.apps.readonly',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.install',
  'https://www.googleapis.com/auth/drive.meet.readonly',
  'https://www.googleapis.com/auth/drive.metadata',
  'https://www.googleapis.com/auth/drive.metadata.readonly',
  'https://www.googleapis.com/auth/drive.photos.readonly',
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/drive.scripts',
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/spreadsheets.readonly',
  'https://mail.google.com/',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.labels'
];

const provider = new GoogleAuthProvider();
SCOPES.forEach(scope => provider.addScope(scope));

// Memory-only access token caching
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to get access token from Google sign in');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Drive sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const googleSignOut = async (): Promise<void> => {
  await signOut(auth);
  cachedAccessToken = null;
};

// GOOGLE DRIVE REST API OPERATIONS

const DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3';
const UPLOAD_API_BASE = 'https://www.googleapis.com/upload/drive/v3';

export async function fetchDriveFiles(options: {
  folderId?: string;
  query?: string;
  mimeTypeFilter?: string;
  pageSize?: number;
  pageToken?: string;
}): Promise<{ files: DriveFile[]; nextPageToken?: string }> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Google Drive');

  const queryParts: string[] = ['trashed = false'];

  if (options.folderId) {
    queryParts.push(`'${options.folderId}' in parents`);
  } else if (!options.query) {
    // Default to root or top-level if not searching
    // queryParts.push(`'root' in parents`);
  }

  if (options.mimeTypeFilter) {
    if (options.mimeTypeFilter === 'folders') {
      queryParts.push(`mimeType = 'application/vnd.google-apps.folder'`);
    } else if (options.mimeTypeFilter === 'documents') {
      queryParts.push(`(mimeType contains 'document' or mimeType contains 'text' or mimeType contains 'pdf' or mimeType contains 'sheet' or mimeType contains 'presentation')`);
    } else if (options.mimeTypeFilter === 'images') {
      queryParts.push(`mimeType contains 'image/'`);
    } else if (options.mimeTypeFilter === 'pdf') {
      queryParts.push(`mimeType = 'application/pdf'`);
    }
  }

  if (options.query && options.query.trim()) {
    const escaped = options.query.trim().replace(/'/g, "\\'");
    queryParts.push(`name contains '${escaped}'`);
  }

  const q = encodeURIComponent(queryParts.join(' and '));
  const fields = encodeURIComponent('nextPageToken, files(id, name, mimeType, size, modifiedTime, thumbnailLink, webViewLink, webContentLink, iconLink, parents, trashed)');
  const pageSize = options.pageSize || 30;
  const pageTokenParam = options.pageToken ? `&pageToken=${encodeURIComponent(options.pageToken)}` : '';

  const url = `${DRIVE_API_BASE}/files?q=${q}&fields=${fields}&pageSize=${pageSize}&orderBy=folder,modifiedTime desc${pageTokenParam}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to fetch files (Status ${res.status})`);
  }

  const data = await res.json();
  return {
    files: data.files || [],
    nextPageToken: data.nextPageToken
  };
}

export async function fetchDriveAbout(): Promise<{ user?: any; storageQuota?: DriveStorageQuota }> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Google Drive');

  const url = `${DRIVE_API_BASE}/about?fields=user(displayName,emailAddress,photoLink),storageQuota`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to fetch drive info (Status ${res.status})`);
  }

  return await res.json();
}

export async function createDriveFolder(name: string, parentFolderId?: string): Promise<DriveFile> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Google Drive');

  const metadata: { name: string; mimeType: string; parents?: string[] } = {
    name,
    mimeType: 'application/vnd.google-apps.folder'
  };

  if (parentFolderId) {
    metadata.parents = [parentFolderId];
  }

  const res = await fetch(`${DRIVE_API_BASE}/files`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(metadata)
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to create folder in Google Drive');
  }

  return await res.json();
}

export async function uploadFileToDrive(
  file: File | Blob,
  fileName: string,
  parentFolderId?: string
): Promise<DriveFile> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Google Drive');

  const metadata: { name: string; parents?: string[] } = {
    name: fileName
  };

  if (parentFolderId) {
    metadata.parents = [parentFolderId];
  }

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const mimeType = file.type || 'application/octet-stream';

  const metadataPart = `${delimiter}Content-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}`;
  const mediaPartHeader = `${delimiter}Content-Type: ${mimeType}\r\n\r\n`;

  const fileArrayBuffer = await file.arrayBuffer();

  const preContent = new TextEncoder().encode(metadataPart + mediaPartHeader);
  const postContent = new TextEncoder().encode(closeDelimiter);

  const totalLength = preContent.byteLength + fileArrayBuffer.byteLength + postContent.byteLength;
  const combined = new Uint8Array(totalLength);

  combined.set(preContent, 0);
  combined.set(new Uint8Array(fileArrayBuffer), preContent.byteLength);
  combined.set(postContent, preContent.byteLength + fileArrayBuffer.byteLength);

  const res = await fetch(`${UPLOAD_API_BASE}/files?uploadType=multipart&fields=id,name,mimeType,size,webViewLink,webContentLink,modifiedTime`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': `multipart/related; boundary=${boundary}`
    },
    body: combined
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to upload file to Google Drive');
  }

  return await res.json();
}

export async function deleteDriveFile(fileId: string): Promise<void> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Google Drive');

  const res = await fetch(`${DRIVE_API_BASE}/files/${fileId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok && res.status !== 204) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to delete file from Google Drive');
  }
}

export async function findOrCreateAppFolder(folderName = 'AI Saathi Hub'): Promise<string> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Google Drive');

  // Search if folder already exists
  const q = encodeURIComponent(`name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`);
  const res = await fetch(`${DRIVE_API_BASE}/files?q=${q}&fields=files(id,name)`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (res.ok) {
    const data = await res.json();
    if (data.files && data.files.length > 0) {
      return data.files[0].id;
    }
  }

  // Create folder
  const newFolder = await createDriveFolder(folderName);
  return newFolder.id;
}

export async function saveToolContentToDrive(
  fileName: string,
  content: string | Blob | Uint8Array,
  mimeType: string,
  targetFolderName = 'AI Saathi Hub'
): Promise<DriveFile> {
  let blob: Blob;
  if (typeof content === 'string') {
    blob = new Blob([content], { type: mimeType });
  } else if (content instanceof Blob) {
    blob = content;
  } else {
    blob = new Blob([content], { type: mimeType });
  }

  const folderId = await findOrCreateAppFolder(targetFolderName);
  return await uploadFileToDrive(blob, fileName, folderId);
}
