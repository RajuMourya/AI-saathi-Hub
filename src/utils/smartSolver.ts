import { TOOLS } from '../data/tools';
import { ProblemSolverRecommendation, ToolDefinition } from '../types';

interface IntentPattern {
  keywords: string[];
  toolId: string;
  reason: string;
  reasonHi: string;
}

const INTENT_PATTERNS: IntentPattern[] = [
  {
    keywords: ['reduce image', 'compress image', 'compress photo', 'small image', 'photo size', 'kb to mb', 'photo chota', 'image size kam', 'shrink picture', 'compress jpg', 'reduce size'],
    toolId: 'image-compressor',
    reason: 'Image Compressor allows you to shrink JPG/PNG/WebP size with a quality slider.',
    reasonHi: 'इमेज कंप्रेसर से आप फोटो की क्वालिटी खोए बिना उसका साइज (KB) कम कर सकते हैं।'
  },
  {
    keywords: ['combine pdf', 'merge pdf', 'join pdf', 'attach pdfs', 'multiple pdf', 'pdf jodna', 'pdf jodein', 'ek sath pdf'],
    toolId: 'pdf-merger',
    reason: 'PDF Merger lets you combine multiple documents locally into a single file.',
    reasonHi: 'PDF मर्जर से आप कई PDF फाइलों को एक साथ मिलाकर एक डॉक्यूमेंट बना सकते हैं।'
  },
  {
    keywords: ['make resume', 'create cv', 'resume builder', 'biodata', 'job cv', 'cv banana', 'ats resume', 'freshers resume'],
    toolId: 'resume-builder',
    reason: 'Resume Builder creates professional ATS-compliant resumes with free PDF export.',
    reasonHi: 'रिज्यूम बिल्डर से आप नौकरी के लिए सुंदर व ATS-फ्रेंडली रिज्यूम बना सकते हैं।'
  },
  {
    keywords: ['calculate age', 'how old am i', 'birthday count', 'date of birth', 'umar kitni', 'meri age', 'age calculator'],
    toolId: 'age-calculator',
    reason: 'Age Calculator computes your exact age in years, months, days, and your next birthday.',
    reasonHi: 'एज कैलकुलेटर आपकी सटीक उम्र और अगले जन्मदिन की उल्टी गिनती बताता है।'
  },
  {
    keywords: ['passport photo', 'visa photo', '2x2 photo', 'passport size', '4x6 print photo', 'photo print', 'passport size photo'],
    toolId: 'passport-photo-maker',
    reason: 'Passport Photo Maker generates compliant Indian & Global passport photo grids ready to print.',
    reasonHi: 'पासपोर्ट फोटो मेकर से भारतीय व विदेशी वीजा के लिए सही माप की फोटो बनाएं।'
  },
  {
    keywords: ['calculate gst', 'gst rate', '18 percent gst', 'cgst sgst', 'gst kitna', 'tax calculate', 'exclusive gst', 'inclusive gst'],
    toolId: 'gst-calculator',
    reason: 'GST Calculator provides exact CGST, SGST, and net amounts for 5%, 12%, 18%, 28% slabs.',
    reasonHi: 'GST कैलकुलेटर से 5%, 12%, 18% व 28% स्लैब पर CGST और SGST की सटीक गणना करें।'
  },
  {
    keywords: ['emi calculate', 'home loan emi', 'car loan', 'monthly installment', 'kist kitni', 'loan emi'],
    toolId: 'emi-calculator',
    reason: 'EMI Calculator breaks down monthly payments, total interest, and loan amortization.',
    reasonHi: 'EMI कैलकुलेटर से किसी भी लोन की मासिक किस्त और कुल ब्याज का हिसाब लगाएं।'
  },
  {
    keywords: ['count words', 'word count', 'character count', 'essay words', 'shabd count', 'kitne word', 'letter count'],
    toolId: 'word-counter',
    reason: 'Word Counter counts words, characters, reading duration, and paragraphs in real time.',
    reasonHi: 'वर्ड काउंटर से अपने निबंध, आर्टिकल के कुल शब्द और अक्षर तुरंत गिनें।'
  },
  {
    keywords: ['qr code', 'generate qr', 'wifi qr', 'upi qr', 'barcode', 'qr banana', 'scan qr'],
    toolId: 'qr-code-generator',
    reason: 'QR Code Generator creates instant high-res QR codes for URLs, WiFi, and UPI payments.',
    reasonHi: 'QR कोड जनरेटर से वेबसाइट, वाईफाई या UPI के लिए तुरंत QR कोड बनाएं।'
  },
  {
    keywords: ['listen to text', 'voice reader', 'text to speech', 'bol kar sunaye', 'read aloud', 'voice voice', 'tts'],
    toolId: 'text-to-speech',
    reason: 'Text to Speech reads any typed text aloud using natural browser synthesis voices.',
    reasonHi: 'टेक्स्ट टू स्पीच से किसी भी पैराग्राफ या आर्टिकल को आवाज़ में सुनें।'
  },
  {
    keywords: ['strong password', 'password generator', 'random password', 'secure password', 'password banana'],
    toolId: 'password-generator',
    reason: 'Password Generator produces cryptographically secure passwords resistant to hacking.',
    reasonHi: 'पासवर्ड जनरेटर से हैकिंग से सुरक्षित और मजबूत पासवर्ड बनाएं।'
  },
  {
    keywords: ['split pdf', 'separate pdf', 'pdf alag', 'extract pdf page', 'cut pdf'],
    toolId: 'pdf-splitter',
    reason: 'PDF Splitter allows extracting specific pages or cutting a document into pieces.',
    reasonHi: 'PDF स्प्लिट्टर से बड़ी PDF फाइल में से पसंदीदा पेज अलग करें।'
  },
  {
    keywords: ['resize photo', 'change dimension', 'photo resize', '1080x1080', 'aspect ratio', 'photo bada chota'],
    toolId: 'image-resizer',
    reason: 'Image Resizer scales pictures to exact pixel dimensions with locked aspect ratio.',
    reasonHi: 'इमेज रीसाइज़र से फोटो की चौड़ाई व ऊंचाई मनचाहे पिक्सेल में बदलें।'
  },
  {
    keywords: ['make meme', 'meme generator', 'funny meme', 'meme banana', 'top text bottom text'],
    toolId: 'meme-maker',
    reason: 'Meme Maker adds classic bold text to your photos for instant viral sharing.',
    reasonHi: 'मीम मेकर से तस्वीरों पर फनी टेक्स्ट लिखकर मजेदार मीम बनाएं।'
  },
  {
    keywords: ['in hand salary', 'take home salary', 'ctc calculate', 'salary kitni milegi', 'epf deduction'],
    toolId: 'salary-calculator',
    reason: 'Salary Calculator estimates monthly take-home salary, EPF, and tax deductions from Annual CTC.',
    reasonHi: 'सैलरी कैलकुलेटर से सालाना CTC पर मिलने वाली असल इन-हैंड सैलरी का हिसाब लगाएं।'
  },
  {
    keywords: ['calculate bmi', 'body mass index', 'weight check', 'overweight', 'wajan sahi hai', 'ideal weight'],
    toolId: 'bmi-calculator',
    reason: 'BMI Calculator evaluates your Body Mass Index and suggests optimal weight targets.',
    reasonHi: 'BMI कैलकुलेटर से जांचें कि आपकी ऊंचाई के अनुसार आपका वजन सही है या नहीं।'
  },
  {
    keywords: ['format json', 'json beautify', 'pretty json', 'json validator', 'json fix'],
    toolId: 'json-formatter',
    reason: 'JSON Formatter parses and beautifies structured data with collapsible nodes.',
    reasonHi: 'JSON फॉर्मेटर से डेटा को सुंदर इंडेंटेशन और सही सिंटैक्स में देखें।'
  },
  {
    keywords: ['percentage', 'percent', 'pratishat', 'percent increase', 'how much percent'],
    toolId: 'percentage-calculator',
    reason: 'Percentage Calculator solves multiple percentage questions with step-by-step math.',
    reasonHi: 'प्रतिशत कैलकुलेटर से किसी भी संख्या का प्रतिशत तुरंत निकालें।'
  },
  {
    keywords: ['youtube title', 'viral title', 'video title', 'youtube ideas', 'title generator'],
    toolId: 'youtube-title-generator',
    reason: 'YouTube Title Generator produces high-CTR titles based on proven creator formulas.',
    reasonHi: 'यूट्यूब टाइटल जनरेटर से अधिक व्यूज लाने वाले आकर्षक टाइटल बनाएं।'
  }
];

export function solveProblemIntent(query: string): ProblemSolverRecommendation | null {
  if (!query || query.trim().length < 2) return null;
  const clean = query.toLowerCase().trim();

  // 1. Direct Pattern Match
  for (const pattern of INTENT_PATTERNS) {
    for (const kw of pattern.keywords) {
      if (clean.includes(kw.toLowerCase())) {
        const tool = TOOLS.find(t => t.id === pattern.toolId);
        if (tool) {
          return {
            tool,
            confidence: 95,
            reason: pattern.reason,
            reasonHi: pattern.reasonHi
          };
        }
      }
    }
  }

  // 2. Fuzzy tool search match
  const words = clean.split(/\s+/).filter(w => w.length > 2);
  let bestTool: ToolDefinition | null = null;
  let bestScore = 0;

  for (const tool of TOOLS) {
    let score = 0;
    const nameLower = tool.name.toLowerCase();
    const nameHiLower = tool.nameHi.toLowerCase();
    const descLower = tool.description.toLowerCase();
    const descHiLower = tool.descriptionHi.toLowerCase();

    for (const word of words) {
      if (nameLower.includes(word)) score += 15;
      if (nameHiLower.includes(word)) score += 15;
      if (tool.keywords.some(k => k.toLowerCase().includes(word))) score += 10;
      if (descLower.includes(word) || descHiLower.includes(word)) score += 5;
    }

    if (score > bestScore) {
      bestScore = score;
      bestTool = tool;
    }
  }

  if (bestTool && bestScore >= 10) {
    return {
      tool: bestTool,
      confidence: Math.min(88, bestScore * 4),
      reason: `Based on your request, "${bestTool.name}" is the most effective utility to accomplish this.`,
      reasonHi: `आपकी आवश्यकता के आधार पर "${bestTool.nameHi}" इसके लिए सबसे उपयुक्त टूल है।`
    };
  }

  // Fallback: Default to Image Compressor or Word Counter if generic
  const fallback = TOOLS.find(t => t.id === 'image-compressor') || TOOLS[0];
  return {
    tool: fallback,
    confidence: 60,
    reason: `You can try "${fallback.name}" or explore our 100+ categories for tailored tools.`,
    reasonHi: `आप "${fallback.nameHi}" आज़मा सकते हैं या हमारी कैटेगरी में अन्य टूल्स देख सकते हैं।`
  };
}

export function searchTools(query: string): ToolDefinition[] {
  if (!query || query.trim().length === 0) return TOOLS;
  const q = query.toLowerCase().trim();
  const qWords = q.split(/\s+/).filter(Boolean);

  const scored = TOOLS.map(tool => {
    let score = 0;
    const name = tool.name.toLowerCase();
    const nameHi = tool.nameHi.toLowerCase();
    const desc = tool.description.toLowerCase();
    const descHi = tool.descriptionHi.toLowerCase();
    const category = tool.categoryId.toLowerCase();

    if (name === q || nameHi === q) score += 100;
    if (name.startsWith(q) || nameHi.startsWith(q)) score += 60;
    if (name.includes(q) || nameHi.includes(q)) score += 40;
    if (category.includes(q)) score += 30;

    for (const kw of tool.keywords) {
      if (kw.toLowerCase().includes(q)) score += 25;
    }

    if (desc.includes(q) || descHi.includes(q)) score += 15;

    for (const w of qWords) {
      if (name.includes(w) || nameHi.includes(w)) score += 10;
      if (tool.keywords.some(k => k.toLowerCase().includes(w))) score += 8;
    }

    return { tool, score };
  });

  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.tool);
}
