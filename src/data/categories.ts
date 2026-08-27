import { ToolCategory } from '../types';

export const CATEGORIES: ToolCategory[] = [
  {
    id: 'text',
    name: 'Text & Writing',
    nameHi: 'टेक्स्ट और लेखन टूल्स',
    slug: 'text-tools',
    iconName: 'FileText',
    color: 'emerald',
    description: 'Count words, format cases, clean text, check diffs, and manipulate content.',
    descriptionHi: 'शब्द गिनें, केस बदलें, टेक्स्ट साफ करें और सामग्री को फॉर्मेट करें।',
    count: 14
  },
  {
    id: 'pdf',
    name: 'PDF & Documents',
    nameHi: 'PDF और दस्तावेज़',
    slug: 'pdf-tools',
    iconName: 'FileSpreadsheet',
    color: 'rose',
    description: 'Merge, split, extract, convert and compress PDF files 100% locally in browser.',
    descriptionHi: 'ब्राउज़र में 100% सुरक्षित रूप से PDF मर्ज, स्प्लिट और कन्वर्ट करें।',
    count: 10
  },
  {
    id: 'image',
    name: 'Image Tools',
    nameHi: 'इमेज टूल्स',
    slug: 'image-tools',
    iconName: 'Image',
    color: 'sky',
    description: 'Compress, resize, crop, make passport photos, create memes and convert formats.',
    descriptionHi: 'फोटो कंप्रेस करें, रीसाइज़ करें, पासपोर्ट फोटो बनाएं और मीम बनाएं।',
    count: 12
  },
  {
    id: 'social',
    name: 'Social Media',
    nameHi: 'सोशल मीडिया टूल्स',
    slug: 'social-media',
    iconName: 'Share2',
    color: 'violet',
    description: 'Generate viral titles, hashtags, captions, bios, and stylish Unicode text.',
    descriptionHi: 'यूट्यूब टाइटल्स, हैशटैग्स, इंस्टाग्राम कैप्शन्स और स्टाइलिश टेक्स्ट बनाएं।',
    count: 10
  },
  {
    id: 'education',
    name: 'Education',
    nameHi: 'शिक्षा और अध्ययन',
    slug: 'education-tools',
    iconName: 'GraduationCap',
    color: 'amber',
    description: 'Calculate GPA, percentages, age, attendance, exam countdowns and unit conversions.',
    descriptionHi: 'GPA, प्रतिशत, उम्र, अटेंडेंस और यूनिट कन्वर्टर कैलकुलेट करें।',
    count: 11
  },
  {
    id: 'career',
    name: 'Career & Resume',
    nameHi: 'करियर और रिज्यूम',
    slug: 'career-tools',
    iconName: 'Briefcase',
    color: 'blue',
    description: 'Build professional resumes, cover letters, prepare interview answers, and calculate CTC.',
    descriptionHi: 'प्रोफेशनल रिज्यूम, कवर लेटर और इंटरव्यू उत्तर तैयार करें।',
    count: 11
  },
  {
    id: 'finance',
    name: 'Finance & Tax',
    nameHi: 'फाइनेंस और टैक्स',
    slug: 'finance-tools',
    iconName: 'IndianRupee',
    color: 'green',
    description: 'Calculate Indian GST, EMI, discounts, loans, electricity bills, and tips.',
    descriptionHi: 'GST, लोन EMI, डिस्काउंट और बिजली खर्च की सही गणना करें।',
    count: 12
  },
  {
    id: 'developer',
    name: 'Developer Tools',
    nameHi: 'डेवलपर टूल्स',
    slug: 'developer-tools',
    iconName: 'Code2',
    color: 'indigo',
    description: 'Format JSON, minify CSS/JS, test Regex, encode/decode Base64 and URLs.',
    descriptionHi: 'JSON फॉर्मेट करें, कोड मिनिफ़ाई करें, Regex टेस्ट करें और Base64 कन्वर्ट करें।',
    count: 10
  },
  {
    id: 'utility',
    name: 'Daily Utilities',
    nameHi: 'दैनिक उपयोगिता टूल्स',
    slug: 'daily-utilities',
    iconName: 'Wrench',
    color: 'teal',
    description: 'Digital clocks, QR code generator, passwords, BMI, stopwatch and timers.',
    descriptionHi: 'QR कोड, पासवर्ड जनरेटर, BMI, स्टॉपवॉच और डेली टूल्स का उपयोग करें।',
    count: 10
  }
];
