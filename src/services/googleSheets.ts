import { getAccessToken } from './googleDrive';
import { SpreadsheetInfo, SpreadsheetDetails } from '../types';

const SHEETS_API_BASE = 'https://sheets.googleapis.com/v4/spreadsheets';
const DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3';

/**
 * Lists all Google Sheets from user's Google Drive.
 */
export async function listSpreadsheets(query?: string): Promise<SpreadsheetInfo[]> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Google Sheets. Please sign in.');

  const queryParts = [
    "mimeType = 'application/vnd.google-apps.spreadsheet'",
    'trashed = false'
  ];

  if (query && query.trim()) {
    const escaped = query.trim().replace(/'/g, "\\'");
    queryParts.push(`name contains '${escaped}'`);
  }

  const q = encodeURIComponent(queryParts.join(' and '));
  const fields = encodeURIComponent('files(id, name, modifiedTime, webViewLink)');
  const url = `${DRIVE_API_BASE}/files?q=${q}&fields=${fields}&orderBy=modifiedTime desc&pageSize=50`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to list spreadsheets (${res.status})`);
  }

  const data = await res.json();
  return data.files || [];
}

/**
 * Gets details of a spreadsheet (title, sheets list, properties).
 * Never assumes "Sheet1" as per Google Sheets best practices!
 */
export async function getSpreadsheetDetails(spreadsheetId: string): Promise<SpreadsheetDetails> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Google Sheets');

  const url = `${SHEETS_API_BASE}/${spreadsheetId}?fields=spreadsheetId,properties.title,spreadsheetUrl,sheets.properties`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to load spreadsheet details (${res.status})`);
  }

  const data = await res.json();
  return {
    spreadsheetId: data.spreadsheetId,
    title: data.properties?.title || 'Untitled Spreadsheet',
    spreadsheetUrl: data.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}`,
    sheets: (data.sheets || []).map((s: any) => ({
      sheetId: s.properties?.sheetId ?? 0,
      title: s.properties?.title || 'Sheet',
      index: s.properties?.index ?? 0,
      gridProperties: s.properties?.gridProperties
    }))
  };
}

/**
 * Reads values from a specified sheet and range.
 */
export async function getSheetValues(
  spreadsheetId: string,
  range: string
): Promise<{ range: string; values: any[][] }> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Google Sheets');

  const encodedRange = encodeURIComponent(range);
  const url = `${SHEETS_API_BASE}/${spreadsheetId}/values/${encodedRange}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to read sheet data (${res.status})`);
  }

  const data = await res.json();
  return {
    range: data.range || range,
    values: data.values || []
  };
}

/**
 * Creates a brand new Google Spreadsheet.
 */
export async function createSpreadsheet(
  title: string,
  initialSheetTitle = 'Sheet 1',
  initialData?: any[][]
): Promise<SpreadsheetDetails> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Google Sheets');

  const body: any = {
    properties: {
      title
    },
    sheets: [
      {
        properties: {
          title: initialSheetTitle
        }
      }
    ]
  };

  const res = await fetch(SHEETS_API_BASE, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to create spreadsheet (${res.status})`);
  }

  const data = await res.json();
  const details: SpreadsheetDetails = {
    spreadsheetId: data.spreadsheetId,
    title: data.properties?.title || title,
    spreadsheetUrl: data.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${data.spreadsheetId}`,
    sheets: (data.sheets || []).map((s: any) => ({
      sheetId: s.properties?.sheetId ?? 0,
      title: s.properties?.title || initialSheetTitle,
      index: s.properties?.index ?? 0,
      gridProperties: s.properties?.gridProperties
    }))
  };

  // If initial data provided, write it immediately
  if (initialData && initialData.length > 0) {
    try {
      await updateSheetValues(
        details.spreadsheetId,
        `${initialSheetTitle}!A1`,
        initialData
      );
    } catch (writeErr) {
      console.warn('Initial data write warning:', writeErr);
    }
  }

  return details;
}

/**
 * Appends rows of values to the end of a sheet range.
 */
export async function appendRowToSheet(
  spreadsheetId: string,
  range: string,
  values: any[][]
): Promise<any> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Google Sheets');

  const encodedRange = encodeURIComponent(range);
  const url = `${SHEETS_API_BASE}/${spreadsheetId}/values/${encodedRange}:append?valueInputOption=USER_ENTERED`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ values })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to append rows (${res.status})`);
  }

  return await res.json();
}

/**
 * Updates a specific cell or range of values.
 */
export async function updateSheetValues(
  spreadsheetId: string,
  range: string,
  values: any[][]
): Promise<any> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Google Sheets');

  const encodedRange = encodeURIComponent(range);
  const url = `${SHEETS_API_BASE}/${spreadsheetId}/values/${encodedRange}?valueInputOption=USER_ENTERED`;

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ values })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to update sheet values (${res.status})`);
  }

  return await res.json();
}

/**
 * Adds a new tab sheet to an existing spreadsheet.
 */
export async function addSheetTab(
  spreadsheetId: string,
  sheetTitle: string
): Promise<any> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Google Sheets');

  const url = `${SHEETS_API_BASE}/${spreadsheetId}:batchUpdate`;
  const body = {
    requests: [
      {
        addSheet: {
          properties: {
            title: sheetTitle
          }
        }
      }
    ]
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to add sheet tab (${res.status})`);
  }

  return await res.json();
}

/**
 * Preset templates generator for quick AI Saathi exports
 */
export const PRESET_TEMPLATES = [
  {
    id: 'gst_calculator_export',
    name: 'GST Calculation & Invoice Register',
    nameHi: 'GST कैलकुलेशन व इनवॉइस रजिस्टर',
    headers: ['Date', 'Invoice No.', 'Client / Party', 'Item / Description', 'Net Amount (₹)', 'GST Rate (%)', 'CGST (₹)', 'SGST (₹)', 'IGST (₹)', 'Total Amount (₹)'],
    sampleRow: [new Date().toISOString().slice(0, 10), 'INV-2026-001', 'Rahul Sharma', 'Web Design Services', '50,000', '18%', '4,500', '4,500', '0', '59,000']
  },
  {
    id: 'emi_loan_tracker',
    name: 'Loan & EMI Repayment Schedule',
    nameHi: 'लोन और EMI भुगतान ट्रैकर',
    headers: ['Month', 'Payment Date', 'Principal Amount (₹)', 'Interest Rate (%)', 'Tenure (Months)', 'Monthly EMI (₹)', 'Total Interest (₹)', 'Outstanding Balance (₹)', 'Status'],
    sampleRow: ['1', new Date().toISOString().slice(0, 10), '5,00,000', '8.5%', '60', '10,258', '1,15,496', '4,93,284', 'Paid']
  },
  {
    id: 'monthly_budget_expense',
    name: 'Monthly Budget & Expense Manager',
    nameHi: 'मासिक बजट व खर्च मैनेजर',
    headers: ['Date', 'Category', 'Expense Item', 'Budgeted (₹)', 'Actual Spent (₹)', 'Difference (₹)', 'Payment Method', 'Notes'],
    sampleRow: [new Date().toISOString().slice(0, 10), 'Utilities', 'Electricity & Internet', '4,500', '4,200', '+300', 'UPI', 'Paid on time']
  },
  {
    id: 'student_marks_gpa',
    name: 'Student Marks & GPA Grade Sheet',
    nameHi: 'छात्र अंक और GPA ग्रेड शीट',
    headers: ['Roll No', 'Student Name', 'Subject 1', 'Subject 2', 'Subject 3', 'Subject 4', 'Total Marks', 'Percentage (%)', 'GPA / Grade', 'Result'],
    sampleRow: ['101', 'Amit Patel', '88', '92', '85', '90', '355 / 400', '88.75%', '9.2 / A+', 'Passed']
  },
  {
    id: 'attendance_tracker',
    name: 'Attendance & Working Hours Log',
    nameHi: 'उपस्थिति व कार्य घंटे लॉग',
    headers: ['Date', 'Member Name', 'Status (Present/Absent)', 'Clock In', 'Clock Out', 'Total Hours', 'Overtime (Hrs)', 'Remarks'],
    sampleRow: [new Date().toISOString().slice(0, 10), 'Pooja Verma', 'Present', '09:30 AM', '06:30 PM', '8.0', '1.0', 'Task completed']
  }
];
