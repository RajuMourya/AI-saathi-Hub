import { getAccessToken } from './googleDrive';
import { GmailMessageSummary, GmailMessageDetail, GmailDraft } from '../types';

const GMAIL_API_BASE = 'https://gmail.googleapis.com/gmail/v1/users/me';

// Base64URL decode helper for email body
function decodeBase64Url(input: string): string {
  try {
    let base64 = input.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder('utf-8').decode(bytes);
  } catch (e) {
    try {
      return atob(input.replace(/-/g, '+').replace(/_/g, '/'));
    } catch {
      return input;
    }
  }
}

// Base64URL encode helper for sending emails
function encodeBase64Url(str: string): string {
  const utf8Bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < utf8Bytes.length; i++) {
    binary += String.fromCharCode(utf8Bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Get current user's Gmail profile statistics
 */
export async function getGmailProfile(): Promise<{
  emailAddress: string;
  messagesTotal: number;
  threadsTotal: number;
  historyId: string;
}> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Gmail. Please sign in.');

  const res = await fetch(`${GMAIL_API_BASE}/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to fetch Gmail profile (${res.status})`);
  }

  return await res.json();
}

/**
 * Lists messages matching a query or label.
 */
export async function listMessages(
  query = '',
  labelIds: string[] = ['INBOX'],
  maxResults = 20,
  pageToken?: string
): Promise<{ messages: GmailMessageSummary[]; nextPageToken?: string }> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Gmail. Please sign in.');

  const params = new URLSearchParams();
  params.set('maxResults', String(maxResults));
  if (query && query.trim()) params.set('q', query.trim());
  if (labelIds && labelIds.length > 0 && !query) {
    labelIds.forEach(lbl => params.append('labelIds', lbl));
  }
  if (pageToken) params.set('pageToken', pageToken);

  const res = await fetch(`${GMAIL_API_BASE}/messages?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to fetch messages (${res.status})`);
  }

  const data = await res.json();
  const rawList: Array<{ id: string; threadId: string }> = data.messages || [];

  // Fetch light metadata for each message
  const summaries: GmailMessageSummary[] = await Promise.all(
    rawList.slice(0, 15).map(async item => {
      try {
        const metaRes = await fetch(
          `${GMAIL_API_BASE}/messages/${item.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=To&metadataHeaders=Date`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!metaRes.ok) return { id: item.id, threadId: item.threadId };
        const meta = await metaRes.json();
        const headers: Array<{ name: string; value: string }> = meta.payload?.headers || [];

        const getHeader = (name: string) =>
          headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value || '';

        const labelList: string[] = meta.labelIds || [];

        return {
          id: meta.id,
          threadId: meta.threadId,
          snippet: meta.snippet,
          labelIds: labelList,
          from: getHeader('From'),
          to: getHeader('To'),
          subject: getHeader('Subject') || '(No Subject)',
          date: getHeader('Date'),
          isUnread: labelList.includes('UNREAD'),
          isStarred: labelList.includes('STARRED')
        };
      } catch {
        return { id: item.id, threadId: item.threadId };
      }
    })
  );

  return {
    messages: summaries,
    nextPageToken: data.nextPageToken
  };
}

/**
 * Recursively parses email payload to extract HTML or Plain Text bodies
 */
function extractBodyParts(payload: any): { html: string; plain: string; attachments: any[] } {
  let html = '';
  let plain = '';
  const attachments: any[] = [];

  const traverse = (part: any) => {
    if (!part) return;

    if (part.body && part.body.data) {
      const decoded = decodeBase64Url(part.body.data);
      if (part.mimeType === 'text/html') {
        html = decoded;
      } else if (part.mimeType === 'text/plain' && !plain) {
        plain = decoded;
      }
    }

    if (part.filename && part.body && (part.body.attachmentId || part.body.size > 0)) {
      attachments.push({
        filename: part.filename,
        mimeType: part.mimeType,
        size: part.body.size,
        attachmentId: part.body.attachmentId || ''
      });
    }

    if (part.parts && Array.isArray(part.parts)) {
      for (const child of part.parts) {
        traverse(child);
      }
    }
  };

  traverse(payload);
  return { html, plain, attachments };
}

/**
 * Gets full message details including HTML/plain body and attachments.
 */
export async function getMessageDetails(messageId: string): Promise<GmailMessageDetail> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Gmail');

  const res = await fetch(`${GMAIL_API_BASE}/messages/${messageId}?format=full`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to read message (${res.status})`);
  }

  const data = await res.json();
  const headers: Array<{ name: string; value: string }> = data.payload?.headers || [];

  const getHeader = (name: string) =>
    headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value || '';

  const labelIds: string[] = data.labelIds || [];
  const { html, plain, attachments } = extractBodyParts(data.payload);

  return {
    id: data.id,
    threadId: data.threadId,
    snippet: data.snippet,
    labelIds,
    headers,
    from: getHeader('From'),
    to: getHeader('To'),
    subject: getHeader('Subject') || '(No Subject)',
    date: getHeader('Date'),
    isUnread: labelIds.includes('UNREAD'),
    isStarred: labelIds.includes('STARRED'),
    bodyHtml: html,
    bodyPlain: plain || data.snippet,
    attachments
  };
}

/**
 * Sends an email from current user's Gmail account.
 */
export async function sendEmail({
  to,
  subject,
  body,
  isHtml = false,
  cc,
  bcc,
  replyToMessageId
}: {
  to: string;
  subject: string;
  body: string;
  isHtml?: boolean;
  cc?: string;
  bcc?: string;
  replyToMessageId?: string;
}): Promise<any> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Gmail');

  const contentType = isHtml ? 'text/html; charset="UTF-8"' : 'text/plain; charset="UTF-8"';

  const lines = [
    `To: ${to}`,
    `Subject: =?UTF-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`
  ];

  if (cc && cc.trim()) lines.push(`Cc: ${cc.trim()}`);
  if (bcc && bcc.trim()) lines.push(`Bcc: ${bcc.trim()}`);
  if (replyToMessageId) {
    lines.push(`In-Reply-To: <${replyToMessageId}>`);
    lines.push(`References: <${replyToMessageId}>`);
  }

  lines.push(`Content-Type: ${contentType}`);
  lines.push('MIME-Version: 1.0');
  lines.push('');
  lines.push(body);

  const rawMime = lines.join('\r\n');
  const encodedRaw = encodeBase64Url(rawMime);

  const res = await fetch(`${GMAIL_API_BASE}/messages/send`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ raw: encodedRaw })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to send email (${res.status})`);
  }

  return await res.json();
}

/**
 * Saves email draft in Gmail.
 */
export async function saveDraft({
  to,
  subject,
  body,
  isHtml = false
}: {
  to: string;
  subject: string;
  body: string;
  isHtml?: boolean;
}): Promise<any> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Gmail');

  const contentType = isHtml ? 'text/html; charset="UTF-8"' : 'text/plain; charset="UTF-8"';

  const lines = [
    `To: ${to}`,
    `Subject: =?UTF-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`,
    `Content-Type: ${contentType}`,
    'MIME-Version: 1.0',
    '',
    body
  ];

  const rawMime = lines.join('\r\n');
  const encodedRaw = encodeBase64Url(rawMime);

  const res = await fetch(`${GMAIL_API_BASE}/drafts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message: { raw: encodedRaw } })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to save draft (${res.status})`);
  }

  return await res.json();
}

/**
 * Modifies message labels (e.g. mark read/unread, star/unstar).
 */
export async function modifyLabels(
  messageId: string,
  addLabelIds: string[] = [],
  removeLabelIds: string[] = []
): Promise<any> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Gmail');

  const res = await fetch(`${GMAIL_API_BASE}/messages/${messageId}/modify`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      addLabelIds,
      removeLabelIds
    })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to update labels (${res.status})`);
  }

  return await res.json();
}

/**
 * Moves message to trash.
 */
export async function trashMessage(messageId: string): Promise<any> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Gmail');

  const res = await fetch(`${GMAIL_API_BASE}/messages/${messageId}/trash`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to trash email (${res.status})`);
  }

  return await res.json();
}

/**
 * Preset email templates for AI Saathi tools
 */
export const GMAIL_TEMPLATES = [
  {
    id: 'job_application',
    name: 'Job Application & Resume Submission',
    nameHi: 'जॉब एप्लीकेशन व रिज्यूमे सबमिशन',
    subject: 'Application for [Job Title] Role - [Your Name]',
    body: `Dear Hiring Team,\n\nI am writing to express my strong interest in the [Job Title] position at [Company Name]. With a proven background in my field and a dedication to high quality outcomes, I am confident in my ability to deliver immediate value to your organization.\n\nPlease find my resume details attached for your review. I look forward to discussing how my skills and experience align with your goals.\n\nWarm regards,\n[Your Name]\n[Phone Number]\n[LinkedIn Profile]`
  },
  {
    id: 'gst_invoice_transmission',
    name: 'Tax Invoice & GST Statement Sharing',
    nameHi: 'टैक्स इनवॉइस व GST स्टेटमेंट प्रेषण',
    subject: 'Tax Invoice #[Invoice-No] from [Company/Your Name]',
    body: `Dear [Client/Party Name],\n\nPlease find attached the tax invoice #[Invoice-No] for the services provided during the recent billing cycle.\n\nSummary of Charges:\n- Invoice Date: [Date]\n- Total Amount: ₹[Amount]\n- Applicable GST: ₹[GST Amount]\n- Due Date: [Due Date]\n\nKindly acknowledge receipt and arrange the payment at your earliest convenience. Feel free to reach out if you have any questions.\n\nSincerely,\n[Your Business Name]\n[Contact Info]`
  },
  {
    id: 'payment_reminder',
    name: 'Payment Reminder & Follow-up',
    nameHi: 'पेमेंट रिमाइंडर व फॉलो-अप',
    subject: 'Friendly Reminder: Invoice #[Invoice-No] Pending Payment',
    body: `Hi [Client Name],\n\nHope you are having a productive week.\n\nThis is a gentle reminder regarding invoice #[Invoice-No] for ₹[Amount], which was due on [Due Date]. If payment has already been initiated, please disregard this note.\n\nOtherwise, we would appreciate it if you could confirm the expected payment schedule today.\n\nThank you for your partnership,\n[Your Name]`
  },
  {
    id: 'meeting_minutes_agenda',
    name: 'Meeting Agenda & Action Items',
    nameHi: 'मीटिंग एजेंडा व एक्शन आइटम्स',
    subject: 'Meeting Summary & Key Action Items - [Project Name]',
    body: `Hi Team,\n\nThank you all for your time during today's discussion. Here is a brief recap of what was agreed upon:\n\nKey Decisions:\n1. [Decision 1]\n2. [Decision 2]\n\nAction Items & Deadlines:\n- [Person A]: [Deliverable 1] by [Date]\n- [Person B]: [Deliverable 2] by [Date]\n\nPlease let me know if any corrections are needed.\n\nBest regards,\n[Your Name]`
  },
  {
    id: 'customer_support_reply',
    name: 'Customer Support / Query Resolution',
    nameHi: 'ग्राहक सहायता व समस्या समाधान',
    subject: 'Resolution for Ticket #[Ticket-No] - AI Saathi Support',
    body: `Dear [Customer Name],\n\nThank you for reaching out to us. We have investigated your reported query regarding [Topic] and are pleased to provide the solution below:\n\n[Explain steps/solution here]\n\nIf you need any further assistance, please simply reply to this email and our team will gladly assist you.\n\nBest regards,\nCustomer Success Team\nAI Saathi Hub`
  }
];
