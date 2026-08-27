import { ToolDefinition } from '../types';

export const TOOLS: ToolDefinition[] = [
  // ================= TEXT & WRITING TOOLS (1 - 15) =================
  {
    id: 'word-counter',
    name: 'Word Counter',
    nameHi: 'वर्ड और कैरेक्टर काउंटर',
    slug: 'word-counter',
    categoryId: 'text',
    description: 'Accurately count words, characters, sentences, paragraphs, and estimate reading time.',
    descriptionHi: 'शब्द, अक्षर, वाक्य, पैराग्राफ गिनें और पढ़ने का अनुमानित समय जानें।',
    iconName: 'FileText',
    keywords: ['word counter', 'character count', 'reading time', 'paragraph counter', 'sentence count', 'words'],
    isPopular: true,
    features: ['Live real-time count without delay', 'Characters with & without spaces', 'Estimated reading & speaking time', 'Paragraph and sentence breakdown'],
    steps: ['Type or paste your text into the editor', 'View instant live statistics below', 'Copy or clear formatted text with one click'],
    faqs: [
      { question: 'Does this tool store my text?', answer: 'No. All counting and analysis happens 100% inside your browser.' },
      { question: 'How is reading time calculated?', answer: 'It is based on the standard average reading speed of 200 to 250 words per minute.' }
    ],
    relatedToolIds: ['character-counter', 'sentence-counter', 'case-converter', 'reading-time-calculator']
  },
  {
    id: 'character-counter',
    name: 'Character Counter',
    nameHi: 'कैरेक्टर काउंटर',
    slug: 'character-counter',
    categoryId: 'text',
    description: 'Check exact character limits for Twitter/X (280), SMS (160), Meta & LinkedIn posts.',
    descriptionHi: 'Twitter, SMS, Meta और LinkedIn पोस्ट के लिए सटीक कैरेक्टर सीमा जांचें।',
    iconName: 'Hash',
    keywords: ['character counter', 'tweet counter', 'letter count', 'sms length', 'text length'],
    features: ['Visual limit gauges for social platforms', 'Tracks spaces vs non-space characters', 'Warning alerts when approaching limits'],
    steps: ['Enter text into the box', 'Check platform progress bars', 'Copy when within your target limits'],
    faqs: [
      { question: 'What is Twitter/X character limit?', answer: 'Standard Twitter/X accounts have a 280-character limit per tweet.' }
    ],
    relatedToolIds: ['word-counter', 'sentence-counter', 'social-text-formatter']
  },
  {
    id: 'sentence-counter',
    name: 'Sentence Counter',
    nameHi: 'सेंटेंस काउंटर',
    slug: 'sentence-counter',
    categoryId: 'text',
    description: 'Count sentences, compute average sentence length, and evaluate readability complexity.',
    descriptionHi: 'वाक्यों की संख्या, औसत लंबाई और पठनीयता की गणना करें।',
    iconName: 'ListOrdered',
    keywords: ['sentence counter', 'readability', 'average sentence length', 'grammar count'],
    features: ['Sentence breakdown analysis', 'Average words per sentence', 'Readability ease indicator'],
    steps: ['Paste your article or essay', 'Analyze sentence count and average length', 'Refine long sentences for clarity'],
    faqs: [
      { question: 'What is a good average sentence length?', answer: '15 to 20 words per sentence is ideal for high readability.' }
    ],
    relatedToolIds: ['word-counter', 'paragraph-formatter', 'reading-time-calculator']
  },
  {
    id: 'case-converter',
    name: 'Case Converter',
    nameHi: 'केस कन्वर्टर (UPPER/lower/Title)',
    slug: 'case-converter',
    categoryId: 'text',
    description: 'Convert text to UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, and more.',
    descriptionHi: 'टेक्स्ट को अपरकेस, लोअरकेस, टाइटल केस, camelCase और snake_case में बदलें।',
    iconName: 'Type',
    keywords: ['case converter', 'uppercase', 'lowercase', 'title case', 'sentence case', 'camelcase', 'snake_case'],
    isPopular: true,
    features: ['9 Case styles supported', 'One-click conversion and copy', 'Retains acronyms and clean spacing'],
    steps: ['Paste text into input box', 'Click your desired case transformation button', 'Copy the converted output'],
    faqs: [
      { question: 'What is Title Case?', answer: 'Title Case capitalizes the first letter of major words while keeping minor conjunctions lowercase.' }
    ],
    relatedToolIds: ['remove-extra-spaces', 'text-cleaner', 'text-sorter']
  },
  {
    id: 'remove-extra-spaces',
    name: 'Remove Extra Spaces',
    nameHi: 'एक्स्ट्रा स्पेस रिमूवर',
    slug: 'remove-extra-spaces',
    categoryId: 'text',
    description: 'Clean messy copy by removing multiple spaces, leading/trailing whitespace, and blank lines.',
    descriptionHi: 'अतिरिक्त स्पेस, खाली लाइनें और अनचाहा रिक्त स्थान तुरंत हटाएं।',
    iconName: 'Eraser',
    keywords: ['remove spaces', 'clean whitespace', 'strip spaces', 'remove blank lines', 'trim text'],
    features: ['Remove double & multiple spaces', 'Trim start/end line spaces', 'Remove empty blank lines', 'Single space normalization'],
    steps: ['Paste unformatted text', 'Select space removal mode', 'Get clean, neat paragraphs instantly'],
    faqs: [
      { question: 'Will this affect paragraph indentation?', answer: 'You can choose whether to preserve paragraph breaks or condense everything.' }
    ],
    relatedToolIds: ['text-cleaner', 'duplicate-line-remover', 'paragraph-formatter']
  },
  {
    id: 'duplicate-line-remover',
    name: 'Duplicate Line Remover',
    nameHi: 'डुप्लिकेट लाइन रिमूवर',
    slug: 'duplicate-line-remover',
    categoryId: 'text',
    description: 'Remove repeated lines from lists, data dumps, and keywords while preserving original order.',
    descriptionHi: 'लिस्ट या डेटा से बार-बार आने वाली डुप्लीकेट लाइनें एक क्लिक में हटाएं।',
    iconName: 'CopyX',
    keywords: ['duplicate remover', 'dedupe lines', 'unique lines', 'remove repeated lines'],
    features: ['Case sensitive or insensitive toggle', 'Trims whitespace before comparison', 'Shows total duplicate count removed'],
    steps: ['Paste your list or items', 'Choose case sensitivity option', 'Get clean list of unique lines'],
    faqs: [
      { question: 'Can it sort the unique lines as well?', answer: 'Yes, you can easily pair this with our Text Sorter tool.' }
    ],
    relatedToolIds: ['text-sorter', 'remove-extra-spaces', 'line-counter']
  },
  {
    id: 'text-sorter',
    name: 'Text Sorter',
    nameHi: 'टेक्स्ट सॉर्टर (A-Z, Z-A, Numeric)',
    slug: 'text-sorter',
    categoryId: 'text',
    description: 'Sort lines alphabetically (A to Z or Z to A), by length, numerically, or in reverse order.',
    descriptionHi: 'टेक्स्ट लाइनों को A-Z, Z-A, लंबाई या संख्या के अनुसार क्रमबद्ध करें।',
    iconName: 'ArrowUpDown',
    keywords: ['text sorter', 'alphabetize', 'sort lines', 'sort a-z', 'numeric sort'],
    features: ['Alphabetical (A-Z / Z-A)', 'Natural numeric sorting (1, 2, 10)', 'Sort by line length', 'Shuffle/Randomize lines'],
    steps: ['Enter list of lines', 'Pick sorting criteria', 'Download or copy sorted list'],
    faqs: [
      { question: 'Does numeric sort understand 1, 2, 10 properly?', answer: 'Yes, natural numeric sort ensures 2 comes before 10.' }
    ],
    relatedToolIds: ['duplicate-line-remover', 'text-reverser', 'line-counter']
  },
  {
    id: 'text-reverser',
    name: 'Text Reverser',
    nameHi: 'टेक्स्ट और वर्ड रिवर्सर',
    slug: 'text-reverser',
    categoryId: 'text',
    description: 'Reverse text characters, flip word order, or reverse entire lists line by line.',
    descriptionHi: 'टेक्स्ट के अक्षरों, शब्दों या पूरी लाइनों को उल्टे क्रम में करें।',
    iconName: 'RotateCcw',
    keywords: ['reverse text', 'backwards text', 'flip words', 'reverse lines', 'palindrome checker'],
    features: ['Reverse all characters', 'Reverse word order', 'Reverse line order', 'Built-in Palindrome check'],
    steps: ['Type or paste input', 'Select reversal mode', 'Instantly copy flipped output'],
    faqs: [
      { question: 'What is a Palindrome?', answer: 'A word or phrase that reads the same backward as forward, e.g., "racecar" or "madam".' }
    ],
    relatedToolIds: ['text-sorter', 'case-converter', 'word-counter']
  },
  {
    id: 'text-cleaner',
    name: 'Text Cleaner',
    nameHi: 'टेक्स्ट क्लीनर और सैनिटाइज़र',
    slug: 'text-cleaner',
    categoryId: 'text',
    description: 'Strip HTML tags, remove emojis, strip numbers, normalize punctuation, and sanitize text.',
    descriptionHi: 'HTML टैग्स, इमोजी, नंबर्स और स्पेशल कैरेक्टर्स हटाकर साफ़ टेक्स्ट प्राप्त करें।',
    iconName: 'Sparkles',
    keywords: ['text cleaner', 'strip html', 'remove emojis', 'remove special characters', 'clean text'],
    features: ['Strip HTML/XML tags', 'Remove emojis & symbols', 'Remove non-ASCII characters', 'Normalize quotes and dashes'],
    steps: ['Paste raw web content or noisy text', 'Toggle the cleaning rules', 'Click Clean Text'],
    faqs: [
      { question: 'Is it safe for programming snippets?', answer: 'Yes, you can toggle which elements (like numbers or symbols) to keep or remove.' }
    ],
    relatedToolIds: ['remove-extra-spaces', 'text-extractor', 'find-and-replace']
  },
  {
    id: 'find-and-replace',
    name: 'Find & Replace',
    nameHi: 'फाइंड एंड रिप्लेस टूल',
    slug: 'find-and-replace',
    categoryId: 'text',
    description: 'Quickly find and replace words, phrases, or Regular Expression patterns across large text blocks.',
    descriptionHi: 'टेक्स्ट में शब्दों या वाक्यों को आसानी से ढूंढें और बदलें।',
    iconName: 'Search',
    keywords: ['find and replace', 'replace text', 'batch replace', 'regex replace', 'word replacement'],
    features: ['Match case toggle', 'Whole word match option', 'Regular expression (RegEx) support', 'Live occurrence counter'],
    steps: ['Enter source text', 'Specify what to find and what to replace with', 'Click Replace All to see changes highlighted'],
    faqs: [
      { question: 'Can I use Regular Expressions?', answer: 'Yes, check the "Enable RegEx" option to search using powerful regex patterns.' }
    ],
    relatedToolIds: ['text-cleaner', 'regex-tester', 'text-difference-checker']
  },
  {
    id: 'text-difference-checker',
    name: 'Text Difference Checker',
    nameHi: 'टेक्स्ट डिफरेंस (Diff) चेकर',
    slug: 'text-difference-checker',
    categoryId: 'text',
    description: 'Compare two text blocks side-by-side to highlight added, removed, and modified content.',
    descriptionHi: 'दो टेक्स्ट की तुलना करें और अंतर (Diff) को रंगों में हाइलाइट देखें।',
    iconName: 'GitCompare',
    keywords: ['text diff', 'compare text', 'difference checker', 'text compare', 'diff tool'],
    features: ['Side-by-side split view', 'Line-by-line and character diff', 'Green/Red additions & deletions indicator'],
    steps: ['Paste Original Text on Left', 'Paste Modified Text on Right', 'View visual differences highlighted in color'],
    faqs: [
      { question: 'Is there a limit on text length?', answer: 'Since it processes locally in your browser memory, it can handle tens of thousands of lines smoothly.' }
    ],
    relatedToolIds: ['find-and-replace', 'duplicate-line-remover', 'word-counter']
  },
  {
    id: 'reading-time-calculator',
    name: 'Reading Time Calculator',
    nameHi: 'रीडिंग टाइम कैलकुलेटर',
    slug: 'reading-time-calculator',
    categoryId: 'text',
    description: 'Calculate silent reading duration and speech presentation time for articles, scripts, and talks.',
    descriptionHi: 'आर्टिकल या स्पीच को पढ़ने और बोलने में लगने वाले समय का सटीक अनुमान लगाएं।',
    iconName: 'Clock',
    keywords: ['reading time', 'speaking time', 'speech length', 'wpm calculator', 'presentation duration'],
    features: ['Adjustable WPM (Words Per Minute) slider', 'Speech / presentation pacing (130 WPM)', 'Silent reading speed breakdown'],
    steps: ['Paste your script or speech', 'Adjust your target words-per-minute speed', 'View time in minutes and seconds'],
    faqs: [
      { question: 'What is the average speech rate?', answer: 'Most public speakers talk at 130-150 words per minute for clear audience comprehension.' }
    ],
    relatedToolIds: ['word-counter', 'sentence-counter', 'paragraph-formatter']
  },
  {
    id: 'paragraph-formatter',
    name: 'Paragraph Formatter',
    nameHi: 'पैराग्राफ फॉर्मेटर',
    slug: 'paragraph-formatter',
    categoryId: 'text',
    description: 'Format unorganized paragraphs with proper indentation, word wrapping, and consistent line spacing.',
    descriptionHi: 'पैराग्राफ में इंडेंटेशन, स्पेसिंग और वर्ड रैप को सही तरीके से व्यवस्थित करें।',
    iconName: 'AlignLeft',
    keywords: ['paragraph formatter', 'text wrap', 'indent text', 'format paragraphs', 'line breaks'],
    features: ['Custom wrap width (e.g. 80 chars)', 'Paragraph tab indentation', 'Double line spacing between paragraphs'],
    steps: ['Paste unformatted block of text', 'Choose wrap limit and indent options', 'Click Format and copy clean output'],
    faqs: [
      { question: 'Why wrap text at 80 characters?', answer: '80 characters is standard for emails, code comments, and terminal readability.' }
    ],
    relatedToolIds: ['remove-extra-spaces', 'word-counter', 'case-converter']
  },
  {
    id: 'text-extractor',
    name: 'Text Extractor / Cleaner',
    nameHi: 'ईमेल, URL और नंबर एक्सट्रैक्टर',
    slug: 'text-extractor',
    categoryId: 'text',
    description: 'Instantly extract email addresses, URLs, phone numbers, hashtags (#), and mentions (@) from any text.',
    descriptionHi: 'किसी भी टेक्स्ट से ईमेल, वेबसाइट लिंक, फोन नंबर और हैशटैग्स अलग निकालें।',
    iconName: 'Filter',
    keywords: ['extract emails', 'extract urls', 'extract phone numbers', 'hashtag extractor', 'data scraping'],
    features: ['Extract all valid emails', 'Extract URLs and web links', 'Extract phone numbers', 'Extract #hashtags and @mentions', 'One-click copy as list'],
    steps: ['Paste any mixed text, document or log dump', 'Click the extractor category (Emails, URLs, etc.)', 'Copy the clean deduplicated results'],
    faqs: [
      { question: 'Are extracted emails saved anywhere?', answer: 'No, all extraction happens 100% locally in your browser memory.' }
    ],
    relatedToolIds: ['text-cleaner', 'find-and-replace', 'duplicate-line-remover']
  },
  {
    id: 'line-counter',
    name: 'Line Counter',
    nameHi: 'लाइन काउंटर',
    slug: 'line-counter',
    categoryId: 'text',
    description: 'Count total lines, non-empty lines, blank lines, and check maximum line length in any text.',
    descriptionHi: 'कुल लाइनें, भरी हुई लाइनें और खाली लाइनें गिनें।',
    iconName: 'ListFilter',
    keywords: ['line counter', 'count lines', 'empty lines', 'line length', 'text lines'],
    features: ['Total line count', 'Non-empty vs empty line breakdown', 'Longest and shortest line length tracker'],
    steps: ['Paste list or source file', 'View instant line metrics', 'Identify any excessively long lines'],
    faqs: [
      { question: 'Does this handle CSV lists and code files?', answer: 'Yes, it works with any plain text, CSV, or code file format.' }
    ],
    relatedToolIds: ['word-counter', 'duplicate-line-remover', 'text-sorter']
  },

  // ================= PDF & DOCUMENT TOOLS (16 - 27) =================
  {
    id: 'pdf-merger',
    name: 'PDF Merger',
    nameHi: 'PDF मर्जर (Combine PDFs)',
    slug: 'pdf-merger',
    categoryId: 'pdf',
    description: 'Combine multiple PDF files into one single organized PDF document right in your browser.',
    descriptionHi: 'कई PDF फाइलों को एक साथ जोड़कर एक सिंगल PDF फाइल बनाएं।',
    iconName: 'Layers',
    keywords: ['pdf merger', 'combine pdf', 'join pdf', 'merge pdf files', 'pdf binder'],
    isPopular: true,
    privacyMessage: 'Your PDF files are merged locally in your browser and never uploaded to any server.',
    features: ['Merge unlimited PDF files', 'Drag & drop reordering of files', 'Fast client-side assembly using pdf-lib', '100% private and offline-capable'],
    steps: ['Select or drag & drop two or more PDF files', 'Rearrange the files into your desired order', 'Click "Merge PDFs" and download your combined document'],
    faqs: [
      { question: 'Are my confidential documents uploaded to a cloud server?', answer: 'No! AI Saathi Hub processes all PDF pages locally using browser WebAssembly & JavaScript.' },
      { question: 'Can I rearrange the order before merging?', answer: 'Yes, you can move files up or down before clicking Merge.' }
    ],
    relatedToolIds: ['pdf-splitter', 'pdf-page-extractor', 'pdf-compressor', 'image-to-pdf']
  },
  {
    id: 'pdf-splitter',
    name: 'PDF Splitter',
    nameHi: 'PDF स्प्लिट्टर (अलग करें)',
    slug: 'pdf-splitter',
    categoryId: 'pdf',
    description: 'Split a large PDF document into individual pages or extract custom page ranges (e.g. 1-3, 5-8).',
    descriptionHi: 'एक बड़ी PDF फाइल को अलग-अलग पेजों या रेंज में विभाजित करें।',
    iconName: 'Scissors',
    keywords: ['pdf splitter', 'split pdf', 'divide pdf', 'extract pages', 'separate pdf'],
    privacyMessage: 'Files are processed locally in your browser and are not uploaded.',
    features: ['Split into single-page PDFs', 'Custom page range extraction (e.g. 1-4, 7-10)', 'Instant preview of total page count'],
    steps: ['Upload your PDF file', 'Specify page ranges or select split all', 'Download the split PDF files'],
    faqs: [
      { question: 'Can I split password protected PDFs?', answer: 'Please unlock or enter the password in your PDF viewer before splitting.' }
    ],
    relatedToolIds: ['pdf-merger', 'pdf-page-extractor', 'pdf-page-organizer']
  },
  {
    id: 'pdf-page-extractor',
    name: 'PDF Page Extractor',
    nameHi: 'PDF पेज एक्सट्रैक्टर',
    slug: 'pdf-page-extractor',
    categoryId: 'pdf',
    description: 'Extract specific pages from a PDF document and save them as a new, compact PDF file.',
    descriptionHi: 'PDF से पसंदीदा पेज चुनकर नई PDF फाइल बनाएं।',
    iconName: 'FileCheck',
    keywords: ['extract pdf pages', 'save specific pages', 'select pdf pages', 'pdf page grabber'],
    privacyMessage: 'Files are processed locally in your browser and are not uploaded.',
    features: ['Page numbers selection (e.g. 1, 3, 5-9)', 'Preserves high quality and text formatting', 'Lightweight instant generation'],
    steps: ['Upload PDF', 'Enter page numbers (e.g. "1, 4, 7-10")', 'Click "Extract Pages" and download'],
    faqs: [
      { question: 'Does extraction reduce quality?', answer: 'No, the original vector elements and crisp text formatting are preserved 100%.' }
    ],
    relatedToolIds: ['pdf-splitter', 'pdf-merger', 'pdf-page-organizer']
  },
  {
    id: 'pdf-to-image',
    name: 'PDF to Image (PNG/JPG)',
    nameHi: 'PDF से इमेज कन्वर्टर',
    slug: 'pdf-to-image',
    categoryId: 'pdf',
    description: 'Convert PDF pages into high-resolution PNG or JPG image files ready for sharing.',
    descriptionHi: 'PDF पेजों को हाई क्वालिटी PNG या JPG फोटो में बदलें।',
    iconName: 'ImageDown',
    keywords: ['pdf to image', 'pdf to png', 'pdf to jpg', 'convert pdf to photo'],
    privacyMessage: 'Files are processed locally in your browser and are not uploaded.',
    features: ['Export individual pages or all pages', 'Select PNG (lossless) or JPG format', 'High DPI canvas rendering'],
    steps: ['Upload your PDF document', 'Choose page and target image format', 'Download generated images'],
    faqs: [
      { question: 'Is the image sharp enough for printing?', answer: 'Yes, pages are rendered at high resolution for crisp text and graphics.' }
    ],
    relatedToolIds: ['image-to-pdf', 'pdf-merger', 'image-compressor']
  },
  {
    id: 'image-to-pdf',
    name: 'Image to PDF',
    nameHi: 'फोटो से PDF कन्वर्टर',
    slug: 'image-to-pdf',
    categoryId: 'pdf',
    description: 'Convert JPG, PNG, and WebP pictures into a clean multi-page PDF document.',
    descriptionHi: 'JPG और PNG तस्वीरों को मिलाकर एक सुंदर PDF फाइल बनाएं।',
    iconName: 'FileImage',
    keywords: ['image to pdf', 'jpg to pdf', 'png to pdf', 'photos to pdf', 'picture document'],
    isPopular: true,
    privacyMessage: 'Files are processed locally in your browser and are not uploaded.',
    features: ['Upload multiple images at once', 'Reorder pages easily', 'Auto-fit A4 or standard page dimensions', 'Zero compression loss option'],
    steps: ['Select photos from your device', 'Drag to arrange order if needed', 'Click "Generate PDF" and save'],
    faqs: [
      { question: 'Can I add multiple photos to one PDF?', answer: 'Yes, add as many images as you like to create a multi-page PDF.' }
    ],
    relatedToolIds: ['pdf-merger', 'pdf-to-image', 'image-compressor']
  },
  {
    id: 'pdf-compressor',
    name: 'PDF Compressor',
    nameHi: 'PDF कंप्रेसर (साइज कम करें)',
    slug: 'pdf-compressor',
    categoryId: 'pdf',
    description: 'Reduce PDF file size for fast email attachments and portal uploads while maintaining readability.',
    descriptionHi: 'PDF फाइल का साइज कम करें ताकि ईमेल और फॉर्म में आसानी से अपलोड हो सके।',
    iconName: 'Minimize2',
    keywords: ['pdf compressor', 'reduce pdf size', 'compress pdf', 'shrink pdf', 'pdf mb to kb'],
    isPopular: true,
    privacyMessage: 'Files are processed locally in your browser and are not uploaded.',
    features: ['Optimizes streams and raster graphics', 'Shows before and after file sizes', 'Safe client-side execution'],
    steps: ['Select your PDF file', 'Select compression level', 'Download the optimized smaller PDF'],
    faqs: [
      { question: 'Will text remain searchable?', answer: 'Yes, text streams and fonts remain intact.' }
    ],
    relatedToolIds: ['pdf-merger', 'image-compressor', 'pdf-size-analyzer']
  },
  {
    id: 'pdf-page-number',
    name: 'PDF Page Number Tool',
    nameHi: 'PDF पेज नंबर टूल',
    slug: 'pdf-page-number',
    categoryId: 'pdf',
    description: 'Add custom page numbers ("Page 1 of N", "1", "- 1 -") to your PDF documents with custom position.',
    descriptionHi: 'PDF फाइलों के ऊपर या नीचे सुंदर पेज नंबर जोड़ें।',
    iconName: 'FileDigit',
    keywords: ['add page numbers to pdf', 'pdf pagination', 'number pdf pages', 'footer page number'],
    privacyMessage: 'Files are processed locally in your browser and are not uploaded.',
    features: ['Top or Bottom positioning (Left, Center, Right)', 'Formats: "1", "Page 1 of N", "- 1 -"', 'Adjustable font size and starting number'],
    steps: ['Upload PDF', 'Configure position and numbering style', 'Download numbered PDF'],
    faqs: [
      { question: 'Can I skip the cover page?', answer: 'Yes, you can set the start page offset to begin numbering from page 2.' }
    ],
    relatedToolIds: ['pdf-metadata-viewer', 'pdf-merger', 'pdf-page-organizer']
  },
  {
    id: 'pdf-metadata-viewer',
    name: 'PDF Metadata Viewer & Editor',
    nameHi: 'PDF मेटाडेटा व्यूअर और एडिटर',
    slug: 'pdf-metadata-viewer',
    categoryId: 'pdf',
    description: 'Inspect and edit PDF metadata properties including Title, Author, Subject, Keywords, and Creator.',
    descriptionHi: 'PDF का टाइटल, लेखक (Author), विषय और कीवर्ड्स देखें और बदलें।',
    iconName: 'FileCode',
    keywords: ['pdf metadata', 'edit pdf author', 'pdf title', 'view pdf properties', 'pdf tags'],
    privacyMessage: 'Files are processed locally in your browser and are not uploaded.',
    features: ['View PDF version and producer info', 'Edit Title, Author, Subject, Keywords', 'Export clean updated PDF'],
    steps: ['Upload PDF to inspect metadata', 'Update fields as needed', 'Download updated PDF with saved metadata'],
    faqs: [
      { question: 'Why is PDF metadata useful?', answer: 'Proper metadata improves document searchability, indexing in libraries, and professional presentation.' }
    ],
    relatedToolIds: ['pdf-size-analyzer', 'pdf-page-number', 'pdf-merger']
  },
  {
    id: 'text-to-pdf',
    name: 'Text to PDF',
    nameHi: 'टेक्स्ट से PDF कन्वर्टर',
    slug: 'text-to-pdf',
    categoryId: 'pdf',
    description: 'Convert plain or formatted text notes, articles, and lists directly into a downloadable PDF document.',
    descriptionHi: 'किसी भी टेक्स्ट या नोट्स को तुरंत PDF डॉक्यूमेंट में बदलें।',
    iconName: 'FileText',
    keywords: ['text to pdf', 'convert txt to pdf', 'create pdf from text', 'notes to pdf'],
    privacyMessage: 'Files are processed locally in your browser and are not uploaded.',
    features: ['Custom font size and line height', 'Auto page-break formatting', 'A4 layout with clean margins'],
    steps: ['Type or paste your text notes', 'Set document title and styling options', 'Click "Download PDF"'],
    faqs: [
      { question: 'Can I print directly from this tool?', answer: 'Yes, the generated PDF can be saved or printed immediately.' }
    ],
    relatedToolIds: ['html-to-pdf', 'image-to-pdf', 'word-counter']
  },
  {
    id: 'html-to-pdf',
    name: 'HTML to PDF',
    nameHi: 'HTML से PDF कनवर्टर',
    slug: 'html-to-pdf',
    categoryId: 'pdf',
    description: 'Render custom HTML code with live preview and generate a styled PDF document.',
    descriptionHi: 'HTML कोड को रेंडर करें और सीधे PDF फाइल में सेव करें।',
    iconName: 'Code',
    keywords: ['html to pdf', 'convert html code to pdf', 'webpage to pdf', 'html print'],
    privacyMessage: 'Files are processed locally in your browser and are not uploaded.',
    features: ['Live HTML & CSS preview frame', 'Supports tables, styled headings, and colors', 'One-click PDF generation via print renderer'],
    steps: ['Paste your HTML code snippet', 'Check the live preview', 'Click Generate PDF or Print'],
    faqs: [
      { question: 'Can I use CSS styling in the HTML?', answer: 'Yes, inline `<style>` and standard CSS rules are fully supported.' }
    ],
    relatedToolIds: ['text-to-pdf', 'html-formatter', 'markdown-editor']
  },
  {
    id: 'pdf-size-analyzer',
    name: 'PDF Size Analyzer',
    nameHi: 'PDF साइज एनालाइज़र',
    slug: 'pdf-size-analyzer',
    categoryId: 'pdf',
    description: 'Inspect PDF structure, exact byte size, page count, embedded font count, and page dimensions.',
    descriptionHi: 'PDF की कुल साइज, पेजों की संख्या, डाइमेंशन्स और तकनीकी जानकारी जानें।',
    iconName: 'BarChart2',
    keywords: ['pdf size analyzer', 'check pdf size', 'pdf page dimensions', 'pdf inspection'],
    privacyMessage: 'Files are processed locally in your browser and are not uploaded.',
    features: ['Exact bytes, KB, MB size readout', 'Page width & height in mm/inches/points', 'Total page count and aspect ratio report'],
    steps: ['Upload any PDF file', 'Instantly see technical breakdown and metrics', 'Compare with file upload requirements'],
    faqs: [
      { question: 'What is standard A4 size in points?', answer: 'Standard A4 is 595.28 x 841.89 points (210 x 297 mm).' }
    ],
    relatedToolIds: ['pdf-compressor', 'pdf-metadata-viewer', 'pdf-merger']
  },
  {
    id: 'pdf-page-organizer',
    name: 'PDF Page Organizer',
    nameHi: 'PDF पेज ऑर्गेनाइज़र (रोटेट व डिलीट)',
    slug: 'pdf-page-organizer',
    categoryId: 'pdf',
    description: 'Reorder pages, rotate upside-down pages (90°/180°), and delete unwanted pages with ease.',
    descriptionHi: 'PDF के पेजों को आगे-पीछे करें, रोटेट करें या अनचाहे पेज डिलीट करें।',
    iconName: 'Grid',
    keywords: ['organize pdf', 'rotate pdf pages', 'delete pdf pages', 'reorder pdf'],
    privacyMessage: 'Files are processed locally in your browser and are not uploaded.',
    features: ['Visual thumbnail-like page list', 'Rotate pages 90° clockwise or counter-clockwise', 'Delete specific page numbers', 'Download clean organized PDF'],
    steps: ['Upload your PDF document', 'Rotate or select pages to delete/keep', 'Download your newly arranged PDF'],
    faqs: [
      { question: 'Can I rotate just one upside-down scan?', answer: 'Yes! You can choose specific pages to rotate individually.' }
    ],
    relatedToolIds: ['pdf-merger', 'pdf-splitter', 'pdf-page-extractor']
  },

  // ================= IMAGE TOOLS (28 - 42) =================
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    nameHi: 'इमेज कंप्रेसर (JPG, PNG, WebP)',
    slug: 'image-compressor',
    categoryId: 'image',
    description: 'Compress JPG, PNG, and WebP images to reduce file size while preserving high visual quality.',
    descriptionHi: 'फोटो की क्वालिटी बनाए रखते हुए उसका साइज (KB/MB) तेजी से कम करें।',
    iconName: 'Image',
    keywords: ['image compressor', 'reduce photo size', 'compress jpg', 'compress png', 'shrink image kb'],
    isPopular: true,
    privacyMessage: 'Your photos are processed directly in your browser canvas and never uploaded.',
    features: ['Adjustable quality slider (10% to 100%)', 'Live before vs after file size calculation', 'Shows percentage saved (e.g. 78% reduction)', 'Instant download in original format'],
    steps: ['Upload or drag & drop your image', 'Adjust the compression quality slider', 'Check the preview and file size savings', 'Click Download Image'],
    faqs: [
      { question: 'Does compressing reduce image dimensions?', answer: 'No, compression reduces the byte payload by optimizing color coding, keeping dimensions the same.' },
      { question: 'Which format compresses best?', answer: 'WebP and JPG generally achieve 70-90% size reduction with minimal visual loss.' }
    ],
    relatedToolIds: ['image-resizer', 'image-converter', 'image-cropper', 'passport-photo-maker']
  },
  {
    id: 'image-resizer',
    name: 'Image Resizer',
    nameHi: 'इमेज रीसाइज़र (पिक्सेल व %)',
    slug: 'image-resizer',
    categoryId: 'image',
    description: 'Resize images by width and height in pixels or percentage with aspect ratio lock.',
    descriptionHi: 'फोटो की चौड़ाई (Width) और ऊंचाई (Height) को पिक्सेल या प्रतिशत में बदलें।',
    iconName: 'Scaling',
    keywords: ['image resizer', 'resize photo', 'change image dimension', 'resize pixels', 'aspect ratio resize'],
    isPopular: true,
    privacyMessage: 'Files are processed locally in your browser and are not uploaded.',
    features: ['Lock or unlock aspect ratio', 'Quick presets: Social, Full HD (1080p), 4K, Avatar', 'Percentage resizing (25%, 50%, 75%)', 'Smooth bicubic canvas resampling'],
    steps: ['Upload your image', 'Enter desired width/height or choose preset', 'Click Resize and download new image'],
    faqs: [
      { question: 'What does Lock Aspect Ratio do?', answer: 'It automatically recalculates the height when you change width to avoid stretching or distorting the photo.' }
    ],
    relatedToolIds: ['image-compressor', 'image-cropper', 'passport-photo-maker']
  },
  {
    id: 'image-cropper',
    name: 'Image Cropper',
    nameHi: 'इमेज क्रॉपर',
    slug: 'image-cropper',
    categoryId: 'image',
    description: 'Crop images to standard aspect ratios (1:1 Square, 16:9 Landscape, 4:3, 9:16 Story) or custom box.',
    descriptionHi: 'फोटो को चौकोर (1:1), 16:9 या मनचाहे साइज में आसानी से क्रॉप करें।',
    iconName: 'Crop',
    keywords: ['crop image', 'crop photo', 'square crop', 'photo trimmer', 'aspect ratio crop'],
    privacyMessage: 'Files are processed locally in your browser and are not uploaded.',
    features: ['Aspect ratio presets (1:1, 16:9, 4:3, 9:16, Free)', 'Interactive drag-to-crop handles', 'Live dimension indicators'],
    steps: ['Upload image', 'Select crop ratio and drag crop area', 'Click Crop Image and download'],
    faqs: [
      { question: 'Can I crop for Instagram DP?', answer: 'Yes! Select the 1:1 Square preset for perfect profile pictures.' }
    ],
    relatedToolIds: ['image-resizer', 'image-rotator', 'passport-photo-maker']
  },
  {
    id: 'image-rotator',
    name: 'Image Rotator & Flipper',
    nameHi: 'इमेज रोटेटर और फ्लिपर',
    slug: 'image-rotator',
    categoryId: 'image',
    description: 'Rotate images 90°, 180°, 270° degrees or flip horizontally (mirror) and vertically.',
    descriptionHi: 'फोटो को 90 डिग्री घुमाएं या मिरर (फ्लिप) करें।',
    iconName: 'RotateCw',
    keywords: ['rotate image', 'flip photo', 'mirror image', 'turn image 90 degrees', 'fix upside down photo'],
    privacyMessage: 'Files are processed locally in your browser and are not uploaded.',
    features: ['Rotate 90° Clockwise & Counter-Clockwise', 'Rotate 180°', 'Horizontal Mirror Flip', 'Vertical Invert Flip'],
    steps: ['Upload your image', 'Click rotation or flip buttons', 'Download rotated picture'],
    faqs: [
      { question: 'Does rotation degrade image quality?', answer: 'No, lossless canvas transformation is used to preserve full detail.' }
    ],
    relatedToolIds: ['image-cropper', 'image-resizer', 'image-converter']
  },
  {
    id: 'image-converter',
    name: 'Image Converter',
    nameHi: 'ऑल-इन-वन इमेज कनवर्टर',
    slug: 'image-converter',
    categoryId: 'image',
    description: 'Convert any image format between JPG, PNG, WebP, GIF, and BMP in high quality.',
    descriptionHi: 'फोटो को किसी भी फॉर्मेट (JPG, PNG, WebP, BMP) में आसानी से बदलें।',
    iconName: 'RefreshCw',
    keywords: ['image converter', 'convert photo format', 'jpg to png', 'png to webp', 'photo converter'],
    isPopular: true,
    privacyMessage: 'Files are processed locally in your browser and are not uploaded.',
    features: ['Supports JPG, PNG, WebP, BMP export', 'Custom quality controls', 'Preserves transparency where supported'],
    steps: ['Upload any image', 'Select target output format', 'Download converted image'],
    faqs: [
      { question: 'Which format supports transparency?', answer: 'PNG and WebP support transparent backgrounds, whereas JPG uses a solid background.' }
    ],
    relatedToolIds: ['jpg-to-png', 'png-to-jpg', 'webp-converter']
  },
  {
    id: 'jpg-to-png',
    name: 'JPG to PNG Converter',
    nameHi: 'JPG से PNG कनवर्टर',
    slug: 'jpg-to-png',
    categoryId: 'image',
    description: 'Convert compressed JPG images to lossless PNG format with crisp edges.',
    descriptionHi: 'JPG तस्वीरों को उच्च गुणवत्ता वाली PNG फोटो में बदलें।',
    iconName: 'FileImage',
    keywords: ['jpg to png', 'convert jpeg to png', 'jpeg to png high quality'],
    privacyMessage: 'Files are processed locally in your browser and are not uploaded.',
    features: ['Lossless PNG rasterization', 'Batch capability', 'Fast single-click conversion'],
    steps: ['Upload JPG photo', 'Click Convert', 'Download clean PNG'],
    faqs: [
      { question: 'Why convert JPG to PNG?', answer: 'PNG preserves pixel-perfect graphics and prevents recurring compression artifacts during repetitive edits.' }
    ],
    relatedToolIds: ['png-to-jpg', 'webp-converter', 'image-converter']
  },
  {
    id: 'png-to-jpg',
    name: 'PNG to JPG Converter',
    nameHi: 'PNG से JPG कनवर्टर',
    slug: 'png-to-jpg',
    categoryId: 'image',
    description: 'Convert PNG images to lightweight JPG files with customizable background fill color.',
    descriptionHi: 'PNG फोटो को छोटे साइज की JPG फाइल में बदलें।',
    iconName: 'FileImage',
    keywords: ['png to jpg', 'convert png to jpeg', 'make png smaller'],
    privacyMessage: 'Files are processed locally in your browser and are not uploaded.',
    features: ['Choose background color for transparent pixels (White, Black, Custom)', 'Adjustable JPG quality slider', 'Immediate file size reduction'],
    steps: ['Upload PNG', 'Choose background color fill', 'Download compact JPG'],
    faqs: [
      { question: 'What happens to transparent backgrounds?', answer: 'You can choose to fill transparent areas with clean white (default) or any custom color.' }
    ],
    relatedToolIds: ['jpg-to-png', 'image-compressor', 'webp-converter']
  },
  {
    id: 'webp-converter',
    name: 'WebP Converter',
    nameHi: 'WebP कनवर्टर (Next-Gen)',
    slug: 'webp-converter',
    categoryId: 'image',
    description: 'Convert images to modern WebP format for 3x faster website loading or convert WebP back to JPG/PNG.',
    descriptionHi: 'वेबसाइट के लिए WebP फॉर्मेट में बदलें या WebP को JPG/PNG बनाएं।',
    iconName: 'Zap',
    keywords: ['webp converter', 'image to webp', 'webp to jpg', 'webp to png', 'next gen image'],
    privacyMessage: 'Files are processed locally in your browser and are not uploaded.',
    features: ['Convert any image to lightweight WebP', 'Convert WebP files back to standard PNG/JPG', 'Supports transparency and high compression'],
    steps: ['Upload photo or WebP', 'Select output format', 'Download converted asset'],
    faqs: [
      { question: 'Why is WebP recommended by Google?', answer: 'WebP provides 25-35% smaller file sizes than comparable JPGs and PNGs with equivalent visual quality.' }
    ],
    relatedToolIds: ['image-compressor', 'image-converter', 'png-to-jpg']
  },
  {
    id: 'image-quality-optimizer',
    name: 'Image Quality Optimizer',
    nameHi: 'फोटो क्वालिटी एनहांसर व फिल्टर',
    slug: 'image-quality-optimizer',
    categoryId: 'image',
    description: 'Enhance photo clarity by adjusting brightness, contrast, saturation, sharpness, and color tone.',
    descriptionHi: 'फोटो की ब्राइटनेस, कंट्रास्ट और शार्पनेस बढ़ाकर उसे और बेहतर बनाएं।',
    iconName: 'Sliders',
    keywords: ['image enhancer', 'photo filters', 'adjust brightness', 'increase contrast', 'sharpen image'],
    privacyMessage: 'Files are processed locally in your browser and are not uploaded.',
    features: ['Brightness, Contrast & Saturation controls', 'Grayscale, Sepia, and Invert filters', 'Real-time canvas filter preview', 'Reset to original anytime'],
    steps: ['Upload photo', 'Tweak enhancement sliders to perfection', 'Download enhanced image'],
    faqs: [
      { question: 'Does this overwrite my original photo?', answer: 'No, you download a newly rendered copy while your original stays untouched on your device.' }
    ],
    relatedToolIds: ['image-compressor', 'passport-photo-maker', 'image-blur-tool']
  },
  {
    id: 'passport-photo-maker',
    name: 'Passport Photo Maker',
    nameHi: 'पासपोर्ट साइज फोटो मेकर (Indian & Global)',
    slug: 'passport-photo-maker',
    categoryId: 'image',
    description: 'Create compliant passport and visa photos (Indian 3.5x4.5cm, US 2x2 inch, Schengen 35x45mm) with printable 4x6 grid.',
    descriptionHi: 'भारतीय पासपोर्ट (3.5x4.5 सेमी) और विदेशी वीजा साइज फोटो व प्रिंटेबल शीट बनाएं।',
    iconName: 'UserCheck',
    keywords: ['passport photo maker', 'indian passport photo size', 'visa photo 2x2', 'passport size photo online', 'print 4x6 photo sheet'],
    isPopular: true,
    privacyMessage: 'Your personal photos are processed strictly in your local browser canvas for privacy.',
    features: ['Indian Passport (35x45 mm)', 'US Visa / OCI (2x2 inch / 51x51 mm)', 'Schengen & UK Passport sizes', 'Single photo download OR 6/8-photo printable 4x6 grid', 'Custom border outline'],
    steps: ['Upload a clear front-facing portrait', 'Select passport size standard (e.g. Indian 3.5x4.5cm)', 'Crop face neatly with guide lines', 'Download single photo or 4x6 print sheet'],
    faqs: [
      { question: 'What is the official Indian passport photo dimension?', answer: 'Official Indian passport size is 35mm x 45mm (width x height) with 70-80% face coverage.' },
      { question: 'Can I print multiple copies on one photo paper?', answer: 'Yes! Click "Generate 4x6 Printable Grid" to get 6 or 8 ready-to-print photos on standard 4x6 paper.' }
    ],
    relatedToolIds: ['id-photo-maker', 'image-cropper', 'image-resizer']
  },
  {
    id: 'id-photo-maker',
    name: 'ID Photo Maker',
    nameHi: 'ID कार्ड फोटो मेकर',
    slug: 'id-photo-maker',
    categoryId: 'image',
    description: 'Create standard ID badge, student card, and employee profile photos with customizable background and border.',
    descriptionHi: 'छात्र व कर्मचारी आईडी कार्ड के लिए फोटो बनाएं व बैकग्राउंड सेट करें।',
    iconName: 'BadgeCheck',
    keywords: ['id photo maker', 'student id photo', 'employee badge photo', 'badge picture'],
    privacyMessage: 'Files are processed locally in your browser and are not uploaded.',
    features: ['Standard 30x40mm & 25x35mm ID sizes', 'Add white/blue/gray background fill', 'Add neat ID card border outline'],
    steps: ['Upload photo', 'Select ID card dimensions and background', 'Download ID photo'],
    faqs: [
      { question: 'What background is commonly required for ID cards?', answer: 'White or light blue backgrounds are standard for most Indian school and corporate ID cards.' }
    ],
    relatedToolIds: ['passport-photo-maker', 'image-cropper', 'image-watermark']
  },
  {
    id: 'image-watermark',
    name: 'Image Watermark Tool',
    nameHi: 'फोटो पर वॉटरमार्क जोड़ें',
    slug: 'image-watermark',
    categoryId: 'image',
    description: 'Protect your photos with customizable text or copyright watermarks with custom opacity, angle, and position.',
    descriptionHi: 'अपनी फोटो पर नाम, कॉपीराइट या वॉटरमार्क टेक्स्ट लगाएं।',
    iconName: 'Stamp',
    keywords: ['image watermark', 'watermark photo', 'add copyright to photo', 'protect photos', 'text watermark'],
    privacyMessage: 'Files are processed locally in your browser and are not uploaded.',
    features: ['Custom watermark text & copyright symbol ©', 'Adjust opacity, font size, and text color', 'Positioning: Center, Corners, or Repeated diagonal grid', 'Rotation angle slider'],
    steps: ['Upload photo', 'Type watermark text (e.g. "© My Brand 2026")', 'Adjust opacity and position', 'Download watermarked image'],
    faqs: [
      { question: 'Can I add a diagonal repeating watermark?', answer: 'Yes, select the "Repeated Pattern" option to tile the watermark across the entire photo.' }
    ],
    relatedToolIds: ['meme-maker', 'image-compressor', 'image-blur-tool']
  },
  {
    id: 'image-blur-tool',
    name: 'Image Blur & Censor Tool',
    nameHi: 'फोटो ब्लर और सेंसर टूल',
    slug: 'image-blur-tool',
    categoryId: 'image',
    description: 'Blur sensitive details, faces, license plates, or confidential documents with blur and pixelate tools.',
    descriptionHi: 'फोटो में निजी जानकारी, चेहरे या संवेदनशील भाग को ब्लर या पिक्सेलेट करें।',
    iconName: 'EyeOff',
    keywords: ['blur image', 'censor photo', 'pixelate face', 'hide sensitive info in photo', 'blur tool'],
    privacyMessage: 'Files are processed locally in your browser and are not uploaded.',
    features: ['Entire image blur or selective box blur', 'Adjustable blur radius slider', 'Pixelation / mosaic censor effect option'],
    steps: ['Upload image', 'Select blur intensity and area', 'Download censored image'],
    faqs: [
      { question: 'Can anyone unblur or reverse the blurred photo?', answer: 'No, the underlying pixel colors are mathematically smoothed and irreversibly rendered into the downloaded image.' }
    ],
    relatedToolIds: ['image-watermark', 'image-cropper', 'image-quality-optimizer']
  },
  {
    id: 'meme-maker',
    name: 'Meme Maker',
    nameHi: 'मीम मेकर (Meme Generator)',
    slug: 'meme-maker',
    categoryId: 'image',
    description: 'Create viral memes with top and bottom bold caption text, font sizes, text outline, and instant download.',
    descriptionHi: 'मजेदार मीम बनाएं, ऊपर और नीचे टेक्स्ट लिखें और तुरंत शेयर करें।',
    iconName: 'Smile',
    keywords: ['meme maker', 'meme generator', 'create memes', 'top bottom text meme', 'funny meme creator'],
    isPopular: true,
    privacyMessage: 'Files are processed locally in your browser and are not uploaded.',
    features: ['Impact font with classic black outline', 'Custom top and bottom text inputs', 'Font size and text color customization', 'Popular meme template picker or custom upload'],
    steps: ['Upload an image or pick a starter template', 'Enter your Top Text and Bottom Text', 'Adjust font size and colors', 'Click "Download Meme"'],
    faqs: [
      { question: 'Can I use my own photos?', answer: 'Yes! Upload any screenshot, photo, or template from your device.' }
    ],
    relatedToolIds: ['social-text-formatter', 'image-watermark', 'image-resizer']
  },

  // ================= SOCIAL MEDIA TOOLS (43 - 54) =================
  {
    id: 'youtube-title-generator',
    name: 'YouTube Title Generator',
    nameHi: 'यूट्यूब वायरल टाइटल जनरेटर',
    slug: 'youtube-title-generator',
    categoryId: 'social',
    description: 'Generate high-CTR, click-worthy YouTube video titles using proven hook formulas and target keywords.',
    descriptionHi: 'यूट्यूब वीडियो के लिए आकर्षक और वायरल टाइटल तैयार करें।',
    iconName: 'Youtube',
    keywords: ['youtube title generator', 'video titles', 'high ctr titles', 'youtube seo', 'viral title ideas'],
    isPopular: true,
    features: ['How-To, Listicle, Curiosity, and Case-Study formulas', 'Includes bracket power words [MUST WATCH], (Step-by-Step)', 'Character length checker for mobile screens (under 60 chars)', 'One-click copy'],
    steps: ['Enter your main video topic or keyword', 'Select your video style (Tutorial, Review, Story, Top 10)', 'Browse and copy your favorite title'],
    faqs: [
      { question: 'Why keep YouTube titles under 60 characters?', answer: 'Titles under 60 characters prevent truncation on mobile devices and YouTube search.' }
    ],
    relatedToolIds: ['youtube-description-formatter', 'hashtag-generator', 'youtube-thumbnail-maker']
  },
  {
    id: 'youtube-description-formatter',
    name: 'YouTube Description Formatter',
    nameHi: 'यूट्यूब डिस्क्रिप्शन फॉर्मेटर',
    slug: 'youtube-description-formatter',
    categoryId: 'social',
    description: 'Structure professional YouTube descriptions with summary, chapters/timestamps, links, gear, and hashtags.',
    descriptionHi: 'यूट्यूब वीडियो के लिए टाइमस्टैम्प, सोशल लिंक्स और डिस्क्रिप्शन फॉर्मेट करें।',
    iconName: 'FileText',
    keywords: ['youtube description', 'video timestamps', 'youtube description template', 'video chapter formatter'],
    features: ['Clean sections with modern dividers', 'Formatted Timestamps (0:00 Intro, 1:20 Steps)', 'Social media & affiliate links block', 'Legal disclaimer & hashtag footer'],
    steps: ['Fill in your video details, links, and chapter marks', 'Preview formatted layout', 'Copy ready-to-paste description'],
    faqs: [
      { question: 'Do timestamps automatically turn into chapters on YouTube?', answer: 'Yes, if you start with 00:00 and include at least 3 timestamps of 10+ seconds each.' }
    ],
    relatedToolIds: ['youtube-title-generator', 'hashtag-generator', 'social-text-formatter']
  },
  {
    id: 'hashtag-generator',
    name: 'Hashtag Generator',
    nameHi: 'ट्रेंडिंग हैशटैग जनरेटर',
    slug: 'hashtag-generator',
    categoryId: 'social',
    description: 'Generate relevant hashtags for Instagram, YouTube Shorts, LinkedIn, and TikTok organized by niche.',
    descriptionHi: 'इंस्टाग्राम, यूट्यूब शॉर्ट्स और लिंक्डइन के लिए ट्रेंडिंग हैशटैग पाएं।',
    iconName: 'Hash',
    keywords: ['hashtag generator', 'instagram hashtags', 'youtube tags', 'reels hashtags', 'popular tags'],
    isPopular: true,
    features: ['Categorized by Niche (Tech, Fitness, Travel, Business, Food, Education, etc.)', 'High-reach vs low-competition tag mix', 'One-click copy all 30 hashtags'],
    steps: ['Type your keyword or select a niche', 'Choose quantity (Top 10, 20, or 30 tags)', 'Click Copy Hashtags and paste into your post'],
    faqs: [
      { question: 'How many hashtags are ideal for Instagram?', answer: 'Instagram recommends using 3 to 5 highly relevant hashtags, while up to 30 can be used in captions or comments.' }
    ],
    relatedToolIds: ['instagram-caption-generator', 'social-bio-generator', 'social-text-formatter']
  },
  {
    id: 'instagram-caption-generator',
    name: 'Instagram Caption Generator',
    nameHi: 'इंस्टाग्राम कैप्शन जनरेटर',
    slug: 'instagram-caption-generator',
    categoryId: 'social',
    description: 'Create engaging Instagram captions with compelling hook openers, storytelling body, and call-to-actions.',
    descriptionHi: 'इंस्टाग्राम पोस्ट व रील्स के लिए आकर्षक कैप्शन्स बनाएं।',
    iconName: 'Instagram',
    keywords: ['instagram caption generator', 'reels captions', 'insta hooks', 'social media captions'],
    features: ['Hook formulas (Curiosity, relatable, educational)', 'Call-to-Action (CTA) suggestions', 'Emoji formatting', 'Copy ready text with line breaks'],
    steps: ['Select post theme (Motivation, Travel, Business, Photography, Daily)', 'Add your core message', 'Copy the styled caption'],
    faqs: [
      { question: 'Does this preserve line breaks on Instagram?', answer: 'Yes! Invisible formatting spaces prevent captions from collapsing into one messy block.' }
    ],
    relatedToolIds: ['hashtag-generator', 'social-bio-generator', 'social-text-formatter']
  },
  {
    id: 'facebook-post-formatter',
    name: 'Facebook Post Formatter',
    nameHi: 'फेसबुक पोस्ट फॉर्मेटर',
    slug: 'facebook-post-formatter',
    categoryId: 'social',
    description: 'Format Facebook posts with clean paragraph spacing, bullet points, and high readability to boost engagement.',
    descriptionHi: 'फेसबुक पोस्ट को बुलेट पॉइंट्स और साफ स्पेसिंग के साथ सुंदर बनाएं।',
    iconName: 'Share2',
    keywords: ['facebook post formatter', 'clean fb text', 'facebook formatting', 'post spaces'],
    features: ['Adds clean invisible spacing', 'Converts lists to aesthetic bullet styles (•, ✔, ➤)', 'Character counter'],
    steps: ['Paste your draft Facebook post', 'Apply spacing and bullet styles', 'Copy and paste into Facebook'],
    faqs: [
      { question: 'Why does Facebook collapse line spaces?', answer: 'Facebook removes regular enter breaks unless formatted with non-breaking whitespace.' }
    ],
    relatedToolIds: ['social-text-formatter', 'instagram-caption-generator', 'word-counter']
  },
  {
    id: 'social-bio-generator',
    name: 'Social Media Bio Generator',
    nameHi: 'सोशल मीडिया बायो जनरेटर (Insta / LinkedIn / X)',
    slug: 'social-bio-generator',
    categoryId: 'social',
    description: 'Create standout bios for Instagram, LinkedIn headline, Twitter/X, and GitHub profiles with aesthetic emojis.',
    descriptionHi: 'इंस्टाग्राम, लिंक्डइन और ट्विटर प्रोफाइल के लिए आकर्षक बायो बनाएं।',
    iconName: 'User',
    keywords: ['bio generator', 'instagram bio', 'linkedin headline', 'twitter bio', 'profile bio creator'],
    features: ['Templates for Creators, Developers, Students, Entrepreneurs, Artists', 'Character counter tailored to platform limits', 'Aesthetic emojis & clean bullet structure'],
    steps: ['Choose platform (Instagram, LinkedIn, Twitter/X)', 'Enter your title, hobbies, and CTA link info', 'Copy your new bio'],
    faqs: [
      { question: 'What is the character limit for Instagram bio?', answer: 'Instagram bios are limited to 150 characters.' }
    ],
    relatedToolIds: ['social-text-formatter', 'instagram-caption-generator', 'professional-bio-maker']
  },
  {
    id: 'thumbnail-size-calculator',
    name: 'Thumbnail & Post Size Calculator',
    nameHi: 'सोशल मीडिया साइज कैलकुलेटर',
    slug: 'thumbnail-size-calculator',
    categoryId: 'social',
    description: 'Interactive cheat-sheet and aspect ratio calculator for YouTube, Instagram, Facebook, TikTok, LinkedIn, and X.',
    descriptionHi: 'यूट्यूब, इंस्टाग्राम और लिंक्डइन के सही पिक्सेल साइज और अनुपात जानें।',
    iconName: 'Maximize2',
    keywords: ['social media image sizes', 'youtube thumbnail dimension', 'instagram post size', 'aspect ratio cheat sheet'],
    features: ['Accurate 2026 dimensions for all major networks', 'Pixel width/height and Aspect Ratio ratios (16:9, 1:1, 4:5, 9:16)', 'Safe zone indicators for reels and stories'],
    steps: ['Select the social platform', 'View exact dimensions and aspect ratios', 'Export dimension guidelines'],
    faqs: [
      { question: 'What is the recommended YouTube thumbnail resolution?', answer: '1280 x 720 pixels (minimum width 640px) with 16:9 aspect ratio.' }
    ],
    relatedToolIds: ['youtube-thumbnail-maker', 'instagram-post-resizer', 'instagram-story-resizer']
  },
  {
    id: 'youtube-thumbnail-maker',
    name: 'YouTube Thumbnail Maker',
    nameHi: 'यूट्यूब थंबनेल मेकर (1280x720 Canvas)',
    slug: 'youtube-thumbnail-maker',
    categoryId: 'social',
    description: 'Design eye-catching 1280x720 YouTube thumbnails with bold text badges, color gradients, and image overlays.',
    descriptionHi: '1280x720 साइज में आकर्षक यूट्यूब थंबनेल बनाएं और डाउनलोड करें।',
    iconName: 'Tv',
    keywords: ['youtube thumbnail maker', 'create youtube thumbnail', '1280x720 thumbnail', 'video cover creator'],
    isPopular: true,
    privacyMessage: 'Files are processed locally in your browser and are not uploaded.',
    features: ['Exact 1280x720 HD canvas output', 'Upload custom background photo or choose gradient', 'Add bold text badge with high contrast background', 'Download ready-to-upload PNG/JPG'],
    steps: ['Upload background picture or pick background gradient', 'Enter bold title text and badge text', 'Customize colors and font size', 'Download 1280x720 thumbnail'],
    faqs: [
      { question: 'Is the downloaded thumbnail 16:9?', answer: 'Yes, it outputs strictly in 1280x720 pixels (16:9) required by YouTube.' }
    ],
    relatedToolIds: ['thumbnail-size-calculator', 'youtube-title-generator', 'meme-maker']
  },
  {
    id: 'instagram-post-resizer',
    name: 'Instagram Post Resizer',
    nameHi: 'इंस्टाग्राम पोस्ट रीसाइज़र (1:1 व 4:5)',
    slug: 'instagram-post-resizer',
    categoryId: 'social',
    description: 'Fit any rectangular image into Instagram Square (1080x1080) or Portrait (1080x1350) with aesthetic background blur.',
    descriptionHi: 'फोटो को बिना काटे इंस्टाग्राम 1:1 स्क्वायर या 4:5 पोर्ट्रेट में फिट करें।',
    iconName: 'Square',
    keywords: ['instagram post resizer', 'no crop instagram', '1080x1080 resizer', 'square fit photo'],
    privacyMessage: 'Files are processed locally in your browser and are not uploaded.',
    features: ['1:1 Square (1080x1080) and 4:5 Portrait (1080x1350)', 'Blurred background fill or solid color border', 'No crop required - fits full picture'],
    steps: ['Upload your photo', 'Choose Square 1:1 or Portrait 4:5', 'Select Blur background or White background', 'Download high-res Instagram post'],
    faqs: [
      { question: 'Why use 4:5 portrait on Instagram?', answer: '4:5 portrait takes up maximum vertical screen space in user feeds, boosting visibility.' }
    ],
    relatedToolIds: ['instagram-story-resizer', 'image-resizer', 'thumbnail-size-calculator']
  },
  {
    id: 'instagram-story-resizer',
    name: 'Instagram Story Resizer',
    nameHi: 'इंस्टाग्राम स्टोरी रीसाइज़र (9:16)',
    slug: 'instagram-story-resizer',
    categoryId: 'social',
    description: 'Convert horizontal photos and artwork into full-screen 9:16 vertical 1080x1920 Story and Reel canvas.',
    descriptionHi: 'फोटो को 9:16 (1080x1920) फुल स्क्रीन इंस्टाग्राम स्टोरी में बदलें।',
    iconName: 'Smartphone',
    keywords: ['story resizer', '9:16 resizer', 'instagram story size', 'fit photo to story'],
    privacyMessage: 'Files are processed locally in your browser and are not uploaded.',
    features: ['Standard 1080x1920 9:16 output', 'Aesthetic soft background blur', 'Safe zone margin guides to avoid UI cutoff'],
    steps: ['Upload photo', 'Adjust photo scale and positioning', 'Download 9:16 story image'],
    faqs: [
      { question: 'What is the safe zone in Instagram stories?', answer: 'Keep important text away from top 250px and bottom 250px so profile headers and reply bars do not cover it.' }
    ],
    relatedToolIds: ['reel-cover-maker', 'instagram-post-resizer', 'social-text-formatter']
  },
  {
    id: 'reel-cover-maker',
    name: 'Reel Cover Maker',
    nameHi: 'रील कवर मेकर (9:16)',
    slug: 'reel-cover-maker',
    categoryId: 'social',
    description: 'Design 9:16 Instagram Reel & YouTube Shorts cover graphics with centered 1:1 grid preview.',
    descriptionHi: 'रील्स और यूट्यूब शॉर्ट्स के लिए सुंदर कवर फोटो बनाएं।',
    iconName: 'Film',
    keywords: ['reel cover maker', 'shorts cover maker', 'reels thumbnail', '9:16 video cover'],
    privacyMessage: 'Files are processed locally in your browser and are not uploaded.',
    features: ['9:16 Full preview with 1:1 profile grid overlay check', 'Add bold text headlines in the safe central square', 'Export high-res 1080x1920 JPG'],
    steps: ['Upload image', 'Add your hook title in the center safe zone', 'Check 1:1 profile grid preview', 'Download cover'],
    faqs: [
      { question: 'Why does my Reel cover look cropped on my profile feed?', answer: 'Profile grids crop Reel covers to a 1:1 center square. Our tool gives you a live preview of that exact center box.' }
    ],
    relatedToolIds: ['instagram-story-resizer', 'youtube-thumbnail-maker', 'social-text-formatter']
  },
  {
    id: 'social-text-formatter',
    name: 'Social Media Text Formatter',
    nameHi: 'यूनिकोड फैंसी टेक्स्ट फॉन्ट (Bold, Italic, Cursive)',
    slug: 'social-text-formatter',
    categoryId: 'social',
    description: 'Convert plain text into bold 𝗕𝗼𝗹𝗱, italic 𝘐𝘵𝘢𝘭𝘪𝘤, cursive 𝓒𝓾𝓻𝓼𝓲𝓿𝓮, gothic 𝔊𝔬𝔱𝔥𝔦𝔠, and monospace for Instagram, X, and WhatsApp.',
    descriptionHi: 'टेक्स्ट को बोल्ड, इटैलिक, कर्सिव और स्टाइलिश फॉन्ट में बदलें।',
    iconName: 'Type',
    keywords: ['fancy text generator', 'bold text for instagram', 'italic text whatsapp', 'unicode fonts', 'cursive text'],
    isPopular: true,
    features: ['15+ Unicode font styles', 'Bold Sans, Serif, Cursive, Fraktur, Monospace, Double-Struck', 'Strikethrough, Underline, and Bubble text', 'Instant one-click copy on each font card'],
    steps: ['Type your message in the input box', 'Browse through live converted styles', 'Click "Copy" next to the style you like and paste into your bio/post'],
    faqs: [
      { question: 'Will these fonts work in Instagram bio and tweets?', answer: 'Yes! They use universal Unicode characters supported across all modern mobile apps and web browsers.' }
    ],
    relatedToolIds: ['case-converter', 'instagram-caption-generator', 'social-bio-generator']
  },

  // ================= EDUCATION TOOLS (55 - 69) =================
  {
    id: 'percentage-calculator',
    name: 'Percentage Calculator',
    nameHi: 'प्रतिशत (Percentage) कैलकुलेटर',
    slug: 'percentage-calculator',
    categoryId: 'education',
    description: 'Calculate what is X% of Y, X is what % of Y, percentage increase/decrease, and percentage difference.',
    descriptionHi: 'प्रतिशत निकालें: X का Y% कितना होगा, बढ़ोतरी/कमी और प्रतिशत अंतर।',
    iconName: 'Percent',
    keywords: ['percentage calculator', 'calculate percent', 'percentage increase', 'percent decrease', 'discount percent'],
    isPopular: true,
    features: ['4-in-1 Percentage modes', 'Step-by-step formula explanation', 'Accurate decimals and clean rounding'],
    steps: ['Select the percentage question type', 'Enter the values', 'Get instant exact calculation with formula'],
    faqs: [
      { question: 'How to calculate percentage increase?', answer: 'Percentage Increase = ((New Value - Old Value) / Old Value) * 100.' }
    ],
    relatedToolIds: ['marks-calculator', 'grade-calculator', 'discount-calculator']
  },
  {
    id: 'gpa-calculator',
    name: 'GPA & CGPA Calculator',
    nameHi: 'GPA और CGPA कैलकुलेटर',
    slug: 'gpa-calculator',
    categoryId: 'education',
    description: 'Calculate Semester GPA (SGPA) and Cumulative GPA (CGPA) on 4.0 or 10.0 grading scales with credit hours.',
    descriptionHi: 'कॉलेज और यूनिवर्सिटी के लिए SGPA और CGPA की गणना करें।',
    iconName: 'Award',
    keywords: ['gpa calculator', 'cgpa calculator', 'sgpa calculator', 'college grade point', 'semester gpa'],
    features: ['Supports 4.0 US Scale and 10.0 Indian University Scale', 'Add/Remove custom course rows and credits', 'Calculates weighted grade points and honors classification'],
    steps: ['Select 4.0 or 10.0 scale', 'Add your subjects, credit hours, and grades', 'View your calculated semester GPA and total credits'],
    faqs: [
      { question: 'How to convert CGPA (10 scale) to percentage in India?', answer: 'As per CBSE/standard Indian AICTE formula: Percentage = CGPA * 9.5.' }
    ],
    relatedToolIds: ['marks-calculator', 'grade-calculator', 'percentage-calculator']
  },
  {
    id: 'marks-calculator',
    name: 'Marks & Percentage Calculator',
    nameHi: 'मार्क्स और डिवीजन कैलकुलेटर',
    slug: 'marks-calculator',
    categoryId: 'education',
    description: 'Calculate total marks obtained, overall percentage, and exam passing division (1st Division, 2nd, 3rd).',
    descriptionHi: 'कुल प्राप्त अंक, प्रतिशत और 1st/2nd डिवीजन की सटीक गणना करें।',
    iconName: 'BookOpen',
    keywords: ['marks calculator', 'exam percentage', 'cbse marks calculator', '1st division marks', 'student total marks'],
    isPopular: true,
    features: ['Multi-subject score list (English, Math, Science, etc.)', 'Total marks, maximum marks, and overall percentage', 'Result status: Distinction (>75%), 1st Div (>60%), 2nd Div (>45%), Pass/Fail'],
    steps: ['Enter marks obtained and maximum marks per subject', 'Add more subject rows if needed', 'View total score, percentage, and division certificate summary'],
    faqs: [
      { question: 'What is 1st Division in Indian Board exams?', answer: 'Scoring 60% or higher is considered First Division (60% - 74.99%), and 75%+ is Distinction.' }
    ],
    relatedToolIds: ['gpa-calculator', 'percentage-calculator', 'grade-calculator']
  },
  {
    id: 'grade-calculator',
    name: 'Final Grade Calculator',
    nameHi: 'ग्रेड व फाइनल एग्जाम कैलकुलेटर',
    slug: 'grade-calculator',
    categoryId: 'education',
    description: 'Calculate your current weighted class grade and determine the score needed on your final exam to get your target grade.',
    descriptionHi: 'जानें कि अपना मनचाहा ग्रेड (A, B) पाने के लिए फाइनल परीक्षा में कितने अंक चाहिए।',
    iconName: 'GraduationCap',
    keywords: ['grade calculator', 'final grade calculator', 'weighted grade', 'score needed on final exam'],
    features: ['Weighted categories (Homework 20%, Quizzes 20%, Midterm 30%, Final 30%)', 'Target Grade Goal (e.g. 90% for A)', 'Computes required final exam percentage'],
    steps: ['Enter your assignment weights and current scores', 'Enter target overall grade', 'See exact percentage needed on the final exam'],
    faqs: [
      { question: 'What if the required final score is over 100%?', answer: 'The tool will alert you if your target requires extra credit or is mathematically unachievable.' }
    ],
    relatedToolIds: ['gpa-calculator', 'marks-calculator', 'percentage-calculator']
  },
  {
    id: 'average-calculator',
    name: 'Average Calculator (Mean, Median, Mode)',
    nameHi: 'औसत कैलकुलेटर (माध्य, माध्यिका, बहुलक)',
    slug: 'average-calculator',
    categoryId: 'education',
    description: 'Compute statistical Average (Mean), Median, Mode, Range, Sum, Count, and Standard Deviation from any number list.',
    descriptionHi: 'संख्याओं का औसत (Mean), Median, Mode और Standard Deviation निकालें।',
    iconName: 'Calculator',
    keywords: ['average calculator', 'mean median mode', 'statistical average', 'standard deviation', 'math average'],
    features: ['Calculates Mean, Median, Mode, Range, Sum, Sample & Population Standard Deviation', 'Accepts comma, space, or newline separated numbers', 'Sorts dataset automatically'],
    steps: ['Enter numbers separated by comma, space, or line', 'Click Calculate', 'View comprehensive statistical breakdown'],
    faqs: [
      { question: 'What is the difference between Mean and Median?', answer: 'Mean is the arithmetic average (sum divided by count), while Median is the middle number when values are sorted.' }
    ],
    relatedToolIds: ['percentage-calculator', 'unit-converter', 'marks-calculator']
  },
  {
    id: 'age-calculator',
    name: 'Age Calculator',
    nameHi: 'आयु (Age) कैलकुलेटर',
    slug: 'age-calculator',
    categoryId: 'education',
    description: 'Calculate exact age in years, months, and days, total weeks, hours, minutes, and countdown to your next birthday.',
    descriptionHi: 'अपनी सटीक उम्र वर्ष, महीने, दिन, घंटे और अगले जन्मदिन का काउंटडाउन जानें।',
    iconName: 'Calendar',
    keywords: ['age calculator', 'calculate exact age', 'how old am i', 'birthday countdown', 'age in days'],
    isPopular: true,
    features: ['Exact years, months, and days', 'Total days, hours, minutes, and seconds lived', 'Day of the week you were born on', 'Countdown timer to upcoming birthday'],
    steps: ['Select your Date of Birth', 'Optionally choose "Age at specific date" (defaults to today)', 'View complete age metrics'],
    faqs: [
      { question: 'Does this account for leap years?', answer: 'Yes, leap years (February 29) and varying month lengths are accounted for with 100% astronomical accuracy.' }
    ],
    relatedToolIds: ['date-difference-calculator', 'exam-countdown', 'study-time-calculator']
  },
  {
    id: 'study-time-calculator',
    name: 'Study Time & Schedule Planner',
    nameHi: 'स्टडी टाइम और टाइम-टेबल प्लानर',
    slug: 'study-time-calculator',
    categoryId: 'education',
    description: 'Plan daily study hours per subject based on syllabus chapters, days remaining until exams, and Pomodoro breaks.',
    descriptionHi: 'परीक्षा से पहले सिलेबस पूरा करने के लिए दैनिक पढ़ाई का समय तय करें।',
    iconName: 'Clock',
    keywords: ['study time calculator', 'study planner', 'exam study schedule', 'pomodoro study tracker'],
    features: ['Calculates required hours per day and chapter pace', 'Pomodoro 25/5 study session breakdown', 'Buffer revision days inclusion'],
    steps: ['Enter total syllabus chapters and exam date', 'Enter available hours per day', 'Get personalized study schedule pace'],
    faqs: [
      { question: 'What is the Pomodoro technique?', answer: 'A study method where you focus for 25 minutes followed by a 5-minute break.' }
    ],
    relatedToolIds: ['exam-countdown', 'attendance-calculator', 'stopwatch']
  },
  {
    id: 'exam-countdown',
    name: 'Exam Countdown Timer',
    nameHi: 'एग्जाम काउंटडाउन टाइमर',
    slug: 'exam-countdown',
    categoryId: 'education',
    description: 'Live ticking countdown timer in days, hours, minutes, and seconds to Board exams, NEET, JEE, UPSC, or finals.',
    descriptionHi: 'बोर्ड, JEE, NEET और प्रतियोगी परीक्षाओं के लिए लाइव उल्टी गिनती टाइमर।',
    iconName: 'Timer',
    keywords: ['exam countdown', 'countdown to exam', 'days left for exam', 'board exam timer', 'neet jee countdown'],
    features: ['Live ticking real-time countdown', 'Add multiple exam target dates', 'Motivational quotes for students', 'Save exam dates in browser'],
    steps: ['Enter your exam name and date/time', 'Watch the live ticking countdown', 'Keep tab pinned for daily motivation'],
    faqs: [
      { question: 'Will my saved exam dates stay when I return?', answer: 'Yes! Your exam target list is stored locally in your browser.' }
    ],
    relatedToolIds: ['study-time-calculator', 'countdown-timer', 'age-calculator']
  },
  {
    id: 'attendance-calculator',
    name: 'Attendance Calculator',
    nameHi: 'अटेंडेंस (हाजिरी) कैलकुलेटर (75% Rule)',
    slug: 'attendance-calculator',
    categoryId: 'education',
    description: 'Calculate your college attendance percentage and see how many classes you can bunk or need to attend to maintain 75%.',
    descriptionHi: 'जानें कि 75% हाजिरी बनाए रखने के लिए कितनी क्लास अटेंड करनी है या छुट्टी ले सकते हैं।',
    iconName: 'CheckSquare',
    keywords: ['attendance calculator', '75 percent attendance', 'college attendance bunk', 'classes to attend'],
    isPopular: true,
    features: ['Target percentage selector (75%, 80%, 85%)', 'Calculates exact classes you can safely miss (Bunk meter)', 'Calculates consecutive classes needed if below target'],
    steps: ['Enter total classes conducted and classes attended so far', 'Set target criteria (e.g. 75%)', 'View bunk allowance or recovery requirement'],
    faqs: [
      { question: 'Why is 75% attendance mandatory in Indian colleges?', answer: 'Most Indian universities and boards (AICTE, UGC, CBSE) mandate 75% minimum attendance to appear for final semester exams.' }
    ],
    relatedToolIds: ['marks-calculator', 'percentage-calculator', 'study-time-calculator']
  },
  {
    id: 'simple-interest-calculator',
    name: 'Simple Interest Calculator',
    nameHi: 'साधारण ब्याज (SI) कैलकुलेटर',
    slug: 'simple-interest-calculator',
    categoryId: 'education',
    description: 'Calculate Simple Interest (SI = P × R × T / 100), total repayment amount, and yearly interest schedule.',
    descriptionHi: 'साधारण ब्याज (SI = P × R × T / 100) और कुल राशि की गणना करें।',
    iconName: 'TrendingUp',
    keywords: ['simple interest calculator', 'si calculator', 'interest formula', 'p r t calculator'],
    features: ['Principal, Rate (% per annum), and Time (Years/Months/Days)', 'Step-by-step formula calculation', 'Total Interest and Maturity Value summary'],
    steps: ['Enter Principal amount', 'Enter Annual Interest Rate (%)', 'Enter Time duration in years or months', 'View total interest and payout'],
    faqs: [
      { question: 'What is the formula for Simple Interest?', answer: 'Simple Interest (SI) = (Principal × Rate × Time) / 100.' }
    ],
    relatedToolIds: ['compound-interest-calculator', 'loan-calculator', 'emi-calculator']
  },
  {
    id: 'compound-interest-calculator',
    name: 'Compound Interest Calculator',
    nameHi: 'चक्रवृद्धि ब्याज (CI) कैलकुलेटर',
    slug: 'compound-interest-calculator',
    categoryId: 'education',
    description: 'Calculate Compound Interest with compounding frequencies (Annually, Semi-Annually, Quarterly, Monthly).',
    descriptionHi: 'चक्रवृद्धि ब्याज (Compound Interest) और रिटर्न का साल-दर-साल चार्ट देखें।',
    iconName: 'LineChart',
    keywords: ['compound interest calculator', 'ci calculator', 'investment returns', 'compounding interest'],
    features: ['Compounding frequencies: Annually, Half-Yearly, Quarterly, Monthly, Daily', 'Principal vs Interest split ratio', 'Year-by-year balance progression table'],
    steps: ['Enter initial Principal and Annual Rate (%)', 'Select compounding frequency and time in years', 'See final maturity amount and interest earned'],
    faqs: [
      { question: 'Why does more frequent compounding increase returns?', answer: 'Because interest earned is added back to the principal earlier, generating interest on interest.' }
    ],
    relatedToolIds: ['simple-interest-calculator', 'emi-calculator', 'gst-calculator']
  },
  {
    id: 'unit-converter',
    name: 'Unit Converter',
    nameHi: 'यूनिट कनवर्टर (लंबाई, वजन, तापमान)',
    slug: 'unit-converter',
    categoryId: 'education',
    description: 'Universal converter for Length (m, km, ft, inch), Weight (kg, g, lb), Temperature (°C, °F, K), Area, Volume, and Digital Storage.',
    descriptionHi: 'लंबाई, वजन, तापमान, क्षेत्रफल, आयतन और डाटा स्टोरेज का ऑल-इन-वन कनवर्टर।',
    iconName: 'Scale',
    keywords: ['unit converter', 'length converter', 'kg to lbs', 'meters to feet', 'celsius to fahrenheit', 'digital storage converter'],
    isPopular: true,
    features: ['8 Categories: Length, Mass/Weight, Temperature, Area, Volume, Speed, Time, Digital Storage', 'Live dual-directional conversion', 'Common real-world quick references'],
    steps: ['Select category (e.g. Length)', 'Choose "From" and "To" units', 'Type value to see instantaneous conversion'],
    faqs: [
      { question: 'How many feet in a meter?', answer: '1 meter is equal to 3.28084 feet (approx 39.37 inches).' }
    ],
    relatedToolIds: ['average-calculator', 'percentage-calculator', 'number-to-words']
  },
  {
    id: 'roman-number-converter',
    name: 'Roman Numeral Converter',
    nameHi: 'रोमन संख्या कनवर्टर (I, V, X, L, C, D, M)',
    slug: 'roman-number-converter',
    categoryId: 'education',
    description: 'Convert Arabic numbers (1 to 3999) to Roman Numerals (e.g. 2026 = MMXXVI) and Roman back to numbers with rules explanation.',
    descriptionHi: 'साधारण संख्याओं को रोमन में और रोमन संख्याओं को नंबर में बदलें।',
    iconName: 'Columns',
    keywords: ['roman numeral converter', 'roman to numbers', 'arabic to roman', 'roman numbers 1 to 100', 'mmxxvi in numbers'],
    features: ['Converts numbers (1-3999) to Roman and vice versa', 'Step-by-step subtractive rule breakdown', 'Reference cheat sheet of Roman symbols (I, V, X, L, C, D, M)'],
    steps: ['Enter a standard number or Roman text (e.g. "XLII")', 'Click Convert', 'View both representations and mathematical derivation'],
    faqs: [
      { question: 'What is 2026 in Roman Numerals?', answer: '2026 is written as MMXXVI (M=1000 + M=1000 + X=10 + X=10 + V=5 + I=1).' }
    ],
    relatedToolIds: ['number-to-words', 'multiplication-table-generator', 'unit-converter']
  },
  {
    id: 'number-to-words',
    name: 'Number to Words Converter',
    nameHi: 'नंबर से शब्द कनवर्टर (Lakhs & Millions)',
    slug: 'number-to-words',
    categoryId: 'education',
    description: 'Convert numbers into words in both Indian numbering system (Lakhs, Crores, Rupees) and Western system (Millions, Billions).',
    descriptionHi: 'संख्याओं को शब्दों में बदलें (लाख, करोड़, रुपए और Millions, Billions)।',
    iconName: 'SpellCheck',
    keywords: ['number to words', 'cheque amount in words', 'rupees in words', 'lakhs crores in words', 'number to english'],
    isPopular: true,
    features: ['Indian System (Thousand, Lakh, Crore) with "Rupees Only" format for banking cheques', 'International System (Thousand, Million, Billion)', 'Hindi words spelling representation', 'Handles decimals/paise accurately'],
    steps: ['Enter any numeric amount', 'Toggle Indian or Western format', 'Copy formatted words string for cheques or invoices'],
    faqs: [
      { question: 'Why is this useful for banking?', answer: 'Filling cheques and legal contracts requires writing the exact amount in words to avoid fraud.' }
    ],
    relatedToolIds: ['roman-number-converter', 'gst-calculator', 'currency-converter']
  },
  {
    id: 'multiplication-table-generator',
    name: 'Multiplication Table Generator',
    nameHi: 'पहाड़ा (Multiplication Table) जनरेटर',
    slug: 'multiplication-table-generator',
    categoryId: 'education',
    description: 'Generate complete multiplication tables from 1 to 100 with printable chart and interactive speed quiz test.',
    descriptionHi: '1 से 100 तक के पहाड़े (टेबल) बनाएं और याद करने के लिए टेस्ट दें।',
    iconName: 'Grid',
    keywords: ['multiplication table', 'math tables 1 to 20', 'pahada in hindi', 'times table generator', 'math quiz'],
    features: ['Multiplication tables from 1 up to 100 (up to 10, 20, or 50 rows)', 'Printable table sheet', 'Interactive flashcard/quiz mode to practice'],
    steps: ['Enter the number for the table (e.g. 17 or 29)', 'Choose number of multiplier rows (10, 20)', 'View, print, or test yourself with quiz mode'],
    faqs: [
      { question: 'Can I print tables for kids?', answer: 'Yes! Click Print Table to get a clean, high-contrast printable handout.' }
    ],
    relatedToolIds: ['average-calculator', 'percentage-calculator', 'random-number-generator']
  },

  // ================= CAREER TOOLS (70 - 77) =================
  {
    id: 'resume-builder',
    name: 'Resume Builder',
    nameHi: 'प्रोफेशनल रिज्यूम मेकर (Free PDF)',
    slug: 'resume-builder',
    categoryId: 'career',
    description: 'Build modern, ATS-friendly resumes with professional templates, live preview, and one-click browser print to PDF.',
    descriptionHi: 'नौकरी के लिए आधुनिक, ATS-फ्रेंडली रिज्यूम बनाएं और PDF में डाउनलोड करें।',
    iconName: 'FileCheck2',
    keywords: ['resume builder', 'free cv maker', 'resume generator', 'ats resume template', 'biodata maker'],
    isPopular: true,
    privacyMessage: 'Your personal career data is saved only in your private browser localStorage.',
    features: ['Sections: Contact, Summary, Work Experience, Education, Skills, Projects, Certifications', 'Multiple Modern ATS Templates', 'Live instant side-by-side preview', 'Print / Save as PDF with clean A4 margins'],
    steps: ['Fill in your profile details and work experience', 'Select your favorite template theme', 'Preview live formatting', 'Click "Print / Download PDF"'],
    faqs: [
      { question: 'Is this resume builder truly free without watermarks?', answer: 'Yes! AI Saathi Hub provides full unrestricted PDF export without any hidden charges or watermarks.' },
      { question: 'Is the resume ATS-friendly?', answer: 'Yes, our templates use clean standard semantic layouts that applicant tracking systems parse smoothly.' }
    ],
    relatedToolIds: ['cv-formatter', 'cover-letter-builder', 'job-application-builder', 'professional-bio-maker']
  },
  {
    id: 'cv-formatter',
    name: 'CV Formatter & Organizer',
    nameHi: 'एकेडमिक और प्रोफेशनल CV फॉर्मेटर',
    slug: 'cv-formatter',
    categoryId: 'career',
    description: 'Format comprehensive Academic Curriculum Vitae (CV) with publications, research, teaching, and awards sections.',
    descriptionHi: 'रिसर्च, टीचिंग और उच्च शिक्षा के लिए विस्तृत CV फॉर्मेट करें।',
    iconName: 'GraduationCap',
    keywords: ['cv formatter', 'curriculum vitae', 'academic cv', 'research cv template'],
    features: ['Dedicated sections for Publications, Grants, Teaching, and Conferences', 'Clean serif & sans-serif academic styles', 'Export to Markdown, HTML, and Printable PDF'],
    steps: ['Enter academic credentials and publications', 'Format chronology', 'Export formatted CV document'],
    faqs: [
      { question: 'What is the difference between a Resume and a CV?', answer: 'A resume is typically a 1-2 page summary of skills and work history, while a CV is an in-depth academic document listing all publications and research.' }
    ],
    relatedToolIds: ['resume-builder', 'cover-letter-builder', 'professional-bio-maker']
  },
  {
    id: 'cover-letter-builder',
    name: 'Cover Letter Builder',
    nameHi: 'कवर लेटर (Cover Letter) बिल्डर',
    slug: 'cover-letter-builder',
    categoryId: 'career',
    description: 'Generate customized, compelling job cover letters tailored to your target company, role, and key achievements.',
    descriptionHi: 'नौकरी के आवेदन के लिए प्रभावशाली कवर लेटर तैयार करें।',
    iconName: 'Mail',
    keywords: ['cover letter builder', 'job cover letter', 'cover letter generator', 'fresher cover letter', 'cover letter template'],
    isPopular: true,
    features: ['Templates for Freshers, Career Switchers, Experienced Professionals, and Tech Roles', 'Customizable company name, hiring manager, and key strengths', 'Formal letterhead formatting'],
    steps: ['Enter your details and recipient job details', 'Select your experience level template', 'Personalize the highlights and copy or export to PDF'],
    faqs: [
      { question: 'Should a cover letter be more than one page?', answer: 'No, a strong cover letter should be concise, ideally 3 to 4 impactful paragraphs fitting on a single page.' }
    ],
    relatedToolIds: ['resume-builder', 'job-application-builder', 'interview-question-generator']
  },
  {
    id: 'job-application-builder',
    name: 'Job Application Letter Builder',
    nameHi: 'जॉब एप्लीकेशन और ईमेल लेटर मेकर',
    slug: 'job-application-builder',
    categoryId: 'career',
    description: 'Create ready-to-send formal job application emails, follow-up messages, resignation letters, and referral requests.',
    descriptionHi: 'जॉब ईमेल, फॉलो-अप, इस्तीफा (Resignation) और रेफरल लेटर लिखें।',
    iconName: 'Send',
    keywords: ['job application letter', 'resignation letter generator', 'job follow up email', 'job inquiry email'],
    features: ['10+ Professional letter scenarios (New Application, Follow-up, Resignation, Offer Negotiation, Referral Request)', 'Proper salutations and professional closing', 'One-click copy formatted text'],
    steps: ['Select letter type (e.g. Resignation Letter or Job Follow-Up)', 'Fill in name, company, and notice period dates', 'Copy or print ready-to-send formal letter'],
    faqs: [
      { question: 'What is the standard notice period wording in a resignation letter?', answer: 'Our resignation template includes polite formal gratitude and specifies your exact last working day clearly.' }
    ],
    relatedToolIds: ['cover-letter-builder', 'resume-builder', 'salary-calculator']
  },
  {
    id: 'interview-question-generator',
    name: 'Interview Question & Prep Guide',
    nameHi: 'इंटरव्यू प्रश्न और उत्तर गाइड',
    slug: 'interview-question-generator',
    categoryId: 'career',
    description: 'Practice top interview questions and STAR method sample answers by role (Software Engineer, HR, Marketing, Fresher).',
    descriptionHi: 'सॉफ्टवेयर, मैनेजमेंट, मार्केटिंग और फ्रेशर्स के लिए इंटरव्यू प्रश्न और उत्तर तैयार करें।',
    iconName: 'HelpCircle',
    keywords: ['interview question generator', 'star method answers', 'job interview preparation', 'behavioral questions', 'fresher interview tips'],
    features: ['Categorized by role: Tech/Developer, Product Manager, Data Analyst, Marketing, HR, Customer Support, Fresher', 'Behavioral STAR framework guide (Situation, Task, Action, Result)', 'Common tricky questions (Strengths, Weaknesses, Gap years)'],
    steps: ['Select your target job domain', 'Review high-probability interview questions', 'Study STAR method model answer structures'],
    faqs: [
      { question: 'What is the STAR method for interviews?', answer: 'STAR stands for Situation, Task, Action, and Result—a structured technique to answer behavioral interview questions persuasively.' }
    ],
    relatedToolIds: ['cover-letter-builder', 'resume-builder', 'salary-calculator']
  },
  {
    id: 'salary-calculator',
    name: 'Salary CTC to In-Hand Calculator',
    nameHi: 'सैलरी (CTC) से इन-हैंड कैलकुलेटर (India)',
    slug: 'salary-calculator',
    categoryId: 'career',
    description: 'Calculate monthly In-Hand / Take-Home salary from Annual Cost to Company (CTC) with EPF, Gratuity, Professional Tax, and Income Tax estimates.',
    descriptionHi: 'सालाना CTC से महीने की इन-हैंड टेक-होम सैलरी, PF और टैक्स की गणना करें।',
    iconName: 'IndianRupee',
    keywords: ['salary calculator', 'ctc to in hand salary', 'take home salary calculator', 'epf calculation', 'indian salary breakup'],
    isPopular: true,
    features: ['Breakdown: Basic Salary, HRA, Special Allowance, Employee & Employer PF (12%), Professional Tax', 'New vs Old Tax Regime estimation', 'Monthly vs Annual earnings table'],
    steps: ['Enter your annual CTC (e.g. ₹6,00,000 or ₹12,00,000)', 'Adjust allowance percentages if known', 'View monthly in-hand take home pay and deductions'],
    faqs: [
      { question: 'Why is in-hand salary lower than CTC / 12?', answer: 'CTC includes employer PF contributions, gratuity, insurance, and taxes which are deducted before net salary is credited to your bank account.' }
    ],
    relatedToolIds: ['experience-calculator', 'gst-calculator', 'emi-calculator']
  },
  {
    id: 'experience-calculator',
    name: 'Work Experience Calculator',
    nameHi: 'कार्य अनुभव (Work Experience) कैलकुलेटर',
    slug: 'experience-calculator',
    categoryId: 'career',
    description: 'Calculate total work experience across multiple company tenures in exact years, months, and days.',
    descriptionHi: 'अलग-अलग नौकरियों के कुल अनुभव की गणना वर्ष, महीने और दिनों में करें।',
    iconName: 'Briefcase',
    keywords: ['experience calculator', 'work experience total', 'job tenure calculator', 'service length calculator'],
    features: ['Add multiple past employment periods', 'Auto-handles overlapping dates or career gaps', 'Total experience summary for resume and job forms'],
    steps: ['Add your previous and current job joining and leaving dates', 'View combined total experience in Years, Months, and Days'],
    faqs: [
      { question: 'Can I set current job as "Present"?', answer: 'Yes! Toggle "Currently Working Here" to calculate experience up to today.' }
    ],
    relatedToolIds: ['salary-calculator', 'resume-builder', 'date-difference-calculator']
  },
  {
    id: 'professional-bio-maker',
    name: 'Professional Bio Maker',
    nameHi: 'प्रोफेशनल बायो मेकर (LinkedIn & Portfolio)',
    slug: 'professional-bio-maker',
    categoryId: 'career',
    description: 'Generate polished 1st-person and 3rd-person professional bios for LinkedIn, speaker profiles, resumes, and portfolios.',
    descriptionHi: 'लिंक्डइन, वेबसाइट और पोर्टफोलियो के लिए प्रोफेशनल बायो तैयार करें।',
    iconName: 'FileUser',
    keywords: ['professional bio maker', 'linkedin bio', 'speaker bio', 'portfolio about me', 'executive summary generator'],
    features: ['First-Person ("I am...") and Third-Person ("Raj is...") styles', 'Short (elevator pitch), Medium (LinkedIn), and Long (Speaker/About page) versions', 'One-click copy'],
    steps: ['Enter your name, job title, years of experience, and key skills', 'Choose style and length', 'Copy ready-to-use bio'],
    faqs: [
      { question: 'When should I use third-person bio?', answer: 'Third-person bios are standard for conference speaker notes, company team pages, and press releases.' }
    ],
    relatedToolIds: ['social-bio-generator', 'resume-builder', 'cover-letter-builder']
  },

  // ================= DEVELOPER TOOLS (78 - 85) =================
  {
    id: 'json-formatter',
    name: 'JSON Formatter & Beautifier',
    nameHi: 'JSON फॉर्मेटर और ब्यूटीफायर',
    slug: 'json-formatter',
    categoryId: 'developer',
    description: 'Format, indent, beautify, and minify messy JSON data with syntax highlighting and instant error checking.',
    descriptionHi: 'JSON डेटा को सुंदर, सही इंडेंटेशन और फॉर्मेटेड रूप में देखें।',
    iconName: 'Braces',
    keywords: ['json formatter', 'json beautifier', 'pretty print json', 'format json online', 'minify json'],
    isPopular: true,
    features: ['2 spaces, 4 spaces, or Tab indentation', 'Minify / Compact JSON option', 'Collapsible tree view / raw text view', 'One-click copy and download .json file'],
    steps: ['Paste raw unformatted JSON into the editor', 'Choose indentation (2 or 4 spaces)', 'Click Beautify or Minify'],
    faqs: [
      { question: 'Is my JSON data secure?', answer: 'Yes! JSON formatting runs purely client-side in your browser JavaScript. Nothing is sent to any server.' }
    ],
    relatedToolIds: ['json-validator', 'html-formatter', 'base64-encoder']
  },
  {
    id: 'json-validator',
    name: 'JSON Validator & Lint',
    nameHi: 'JSON वैलिडेटर (Syntax Checker)',
    slug: 'json-validator',
    categoryId: 'developer',
    description: 'Validate JSON syntax and pinpoint exact line numbers and column errors for invalid commas, quotes, or braces.',
    descriptionHi: 'JSON कोड में सिंटैक्स एरर, छूटे हुए कॉमा या कोट्स को लाइन नंबर सहित खोजें।',
    iconName: 'CheckCircle2',
    keywords: ['json validator', 'validate json', 'json lint', 'fix json error', 'check json syntax'],
    features: ['Exact Line & Column error locator', 'Visual Valid ✓ or Invalid ✗ status banner', 'Auto-fixes trailing commas where possible'],
    steps: ['Paste your JSON text', 'Click "Validate JSON"', 'View error line indicator or valid confirmation'],
    faqs: [
      { question: 'What is the most common JSON error?', answer: 'Trailing commas after the last item in arrays/objects and single quotes instead of double quotes.' }
    ],
    relatedToolIds: ['json-formatter', 'html-formatter', 'regex-tester']
  },
  {
    id: 'html-formatter',
    name: 'HTML Formatter & Beautifier',
    nameHi: 'HTML फॉर्मेटर और ब्यूटीफायर',
    slug: 'html-formatter',
    categoryId: 'developer',
    description: 'Beautify messy HTML code with proper tag nesting, indentation, and clean readable structure.',
    descriptionHi: 'HTML कोड को सही टैग इंडेंटेशन के साथ व्यवस्थित और सुंदर बनाएं।',
    iconName: 'Code',
    keywords: ['html formatter', 'beautify html', 'clean html code', 'html indent', 'html pretty print'],
    features: ['Clean nested tag indentation', 'Removes redundant whitespace', 'Option to wrap long lines or clean inline styles'],
    steps: ['Paste raw HTML markup', 'Click Beautify HTML', 'Copy or download clean HTML code'],
    faqs: [
      { question: 'Does this break preformatted `<pre>` tags?', answer: 'No, content inside `<pre>` and `<code>` blocks is preserved.' }
    ],
    relatedToolIds: ['json-formatter', 'css-minifier', 'js-minifier']
  },
  {
    id: 'css-minifier',
    name: 'CSS Minifier & Compressor',
    nameHi: 'CSS मिनिफ़ायर (कोड कंप्रेसर)',
    slug: 'css-minifier',
    categoryId: 'developer',
    description: 'Minify and compress stylesheet CSS code by removing comments, redundant whitespace, and newlines to accelerate web speed.',
    descriptionHi: 'CSS कोड से अनचाहे स्पेस और कमेंट्स हटाकर फाइल साइज छोटा करें।',
    iconName: 'FileCode',
    keywords: ['css minifier', 'compress css', 'minify stylesheet', 'clean css', 'css optimizer'],
    features: ['Removes comments (`/* ... */`)', 'Strips useless whitespace & trailing semicolons', 'Shows original vs minified byte size and percentage saved'],
    steps: ['Paste your CSS rules', 'Click "Minify CSS"', 'Copy compressed code or download .min.css'],
    faqs: [
      { question: 'Why minify CSS?', answer: 'Minifying CSS reduces network download payload, improving Google Core Web Vitals and PageSpeed scores.' }
    ],
    relatedToolIds: ['js-minifier', 'html-formatter', 'json-formatter']
  },
  {
    id: 'js-minifier',
    name: 'JavaScript Minifier',
    nameHi: 'जावास्क्रिप्ट (JS) मिनिफ़ायर',
    slug: 'js-minifier',
    categoryId: 'developer',
    description: 'Minify JavaScript code in your browser by stripping comments and redundant whitespace for lighter scripts.',
    descriptionHi: 'जावास्क्रिप्ट कोड को सुरक्षित रूप से कंप्रेस और मिनिफ़ाई करें।',
    iconName: 'Terminal',
    keywords: ['javascript minifier', 'minify js', 'compress js code', 'clean javascript'],
    features: ['Strips single-line (`//`) and multi-line comments', 'Normalizes spacing while preserving string literals', 'Shows compression reduction stats'],
    steps: ['Paste JavaScript code', 'Click "Minify JS"', 'Copy minified script'],
    faqs: [
      { question: 'Does it change variable names?', answer: 'No, this fast browser minifier compresses whitespace and comments safely without destructive obfuscation.' }
    ],
    relatedToolIds: ['css-minifier', 'json-formatter', 'html-formatter']
  },
  {
    id: 'base64-encoder',
    name: 'Base64 Encoder & Decoder',
    nameHi: 'Base64 एन्कोडर और डिकोडर',
    slug: 'base64-encoder',
    categoryId: 'developer',
    description: 'Encode plain text or image files to Base64 strings and decode Base64 data back to readable text or files.',
    descriptionHi: 'टेक्स्ट या इमेज को Base64 में बदलें और Base64 को वापस डिकोड करें।',
    iconName: 'Binary',
    keywords: ['base64 encoder', 'base64 decoder', 'text to base64', 'image to base64', 'base64 convert'],
    isPopular: true,
    features: ['Text to Base64 and Base64 to Text', 'Image File to Base64 Data URI string', 'Supports UTF-8 characters and international scripts'],
    steps: ['Choose Encode or Decode mode', 'Enter text or upload a file', 'Instantly copy Base64 string or download decoded output'],
    faqs: [
      { question: 'What is Base64 used for?', answer: 'Base64 is used to safely embed binary data (like small icons or tokens) inside text protocols like JSON, HTML, and CSS.' }
    ],
    relatedToolIds: ['url-encoder', 'json-formatter', 'developer']
  },
  {
    id: 'url-encoder',
    name: 'URL Encoder & Decoder',
    nameHi: 'URL एन्कोडर और डिकोडर (Percent-Encoding)',
    slug: 'url-encoder',
    categoryId: 'developer',
    description: 'Encode special characters into percent-encoded URL safe format (%20, %2F) or decode encoded URLs back to normal text.',
    descriptionHi: 'URL लिंक को सेफ फॉर्मेट में एन्कोड करें या डिकोड करके साफ लिंक देखें।',
    iconName: 'Link',
    keywords: ['url encoder', 'url decoder', 'percent encoding', 'encode uri component', 'decode url'],
    features: ['Encode / Decode URI components', 'Detailed breakdown of URL Protocol, Host, Path, and Query parameters', 'One-click copy'],
    steps: ['Enter URL or string', 'Select Encode or Decode', 'Copy result or inspect individual query parameters'],
    faqs: [
      { question: 'What does %20 mean in a URL?', answer: '%20 represents a space character in standard URL percent-encoding.' }
    ],
    relatedToolIds: ['base64-encoder', 'regex-tester', 'json-formatter']
  },
  {
    id: 'regex-tester',
    name: 'Regex Tester & Debugger',
    nameHi: 'रेगेक्स (Regex) टेस्टर और मैचिंग टूल',
    slug: 'regex-tester',
    categoryId: 'developer',
    description: 'Test Regular Expressions (RegEx) live against sample test strings with flag toggles (g, i, m, s) and match group highlighting.',
    descriptionHi: 'रेगुलर एक्सप्रेशन (Regex) का लाइव टेस्ट करें और मैच ग्रुप्स देखें।',
    iconName: 'FileSearch',
    keywords: ['regex tester', 'test regular expression', 'regex online', 'regex cheat sheet', 'regex validator'],
    features: ['Live real-time match highlighting in color', 'Flag controls: Global (g), Case-Insensitive (i), Multiline (m)', 'Shows matched substrings and captured groups', 'Common regex library presets (Email, Phone, URL, IP, Date)'],
    steps: ['Type your regex pattern (e.g. `[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}`)', 'Paste your test string', 'View instant highlighted matches'],
    faqs: [
      { question: 'Can I test regex substitution/replace?', answer: 'Yes! Toggle the Replace tab to test replacement patterns with `$1`, `$2` capture references.' }
    ],
    relatedToolIds: ['find-and-replace', 'json-validator', 'text-cleaner']
  },

  // ================= DAILY UTILITY & FINANCE TOOLS (86 - 100) =================
  {
    id: 'gst-calculator',
    name: 'GST Calculator',
    nameHi: 'GST कैलकुलेटर (Exclusive & Inclusive)',
    slug: 'gst-calculator',
    categoryId: 'finance',
    description: 'Calculate Indian GST (5%, 12%, 18%, 28% or custom) with CGST, SGST, IGST breakdown for GST-Inclusive and GST-Exclusive prices.',
    descriptionHi: 'GST की सही गणना करें (5%, 12%, 18%, 28%) - CGST और SGST अलग-अलग देखें।',
    iconName: 'IndianRupee',
    keywords: ['gst calculator', 'indian gst calculation', '18 percent gst', 'inclusive gst', 'exclusive gst', 'cgst sgst igst'],
    isPopular: true,
    features: ['GST Exclusive (Add GST to base price) & GST Inclusive (Remove GST to find original base price)', 'Official Indian GST slab rates (5%, 12%, 18%, 28%) + Custom %', 'Equal 50/50 split for CGST and SGST', 'Invoice amount summary in numbers and words'],
    steps: ['Enter initial Amount (₹)', 'Choose GST Rate slab (5%, 12%, 18%, 28% or Custom)', 'Select GST Exclusive (Add) or GST Inclusive (Remove)', 'View Net Amount, Total GST, CGST, SGST, and Gross Total'],
    faqs: [
      { question: 'What is the formula to calculate GST Inclusive price?', answer: 'Base Price = Total Amount / (1 + (GST% / 100)), and GST Amount = Total Amount - Base Price.' },
      { question: 'How is Intra-State GST split?', answer: 'For sales within the same state, GST is split equally into CGST (Central GST) and SGST (State GST).' }
    ],
    relatedToolIds: ['emi-calculator', 'discount-calculator', 'loan-calculator', 'salary-calculator']
  },
  {
    id: 'emi-calculator',
    name: 'EMI Calculator (Home, Car, Personal Loan)',
    nameHi: 'लोन EMI कैलकुलेटर',
    slug: 'emi-calculator',
    categoryId: 'finance',
    description: 'Calculate monthly loan EMI, total interest payable, and total payment for Home Loans, Car Loans, and Personal Loans.',
    descriptionHi: 'होम लोन, कार लोन और पर्सनल लोन की मासिक EMI और कुल ब्याज की गणना करें।',
    iconName: 'CreditCard',
    keywords: ['emi calculator', 'loan emi', 'home loan emi', 'car loan calculator', 'monthly emi calculation'],
    isPopular: true,
    features: ['Loan Amount, Interest Rate (% p.a.), and Tenure (Years or Months)', 'Visual Principal vs Interest payment chart', 'Monthly and yearly amortization schedule table', 'Shows total interest vs principal cost'],
    steps: ['Enter Loan Amount (e.g. ₹5,00,000 or ₹25,00,000)', 'Enter Annual Interest Rate (%)', 'Set Loan Tenure in Years or Months', 'View monthly EMI and total interest breakdown'],
    faqs: [
      { question: 'What is the standard EMI formula?', answer: 'EMI = [P × R × (1+R)^N] / [(1+R)^N - 1], where P is Principal, R is monthly interest rate, and N is number of months.' }
    ],
    relatedToolIds: ['gst-calculator', 'loan-calculator', 'compound-interest-calculator']
  },
  {
    id: 'discount-calculator',
    name: 'Discount & Sale Calculator',
    nameHi: 'डिस्काउंट और सेल कैलकुलेटर',
    slug: 'discount-calculator',
    categoryId: 'finance',
    description: 'Calculate final price after store discounts, extra coupon codes, and sales tax to find exact money saved.',
    descriptionHi: 'दुकान या ऑनलाइन शॉपिंग पर छूट (Discount), कूपन और बचत की गणना करें।',
    iconName: 'Tag',
    keywords: ['discount calculator', 'sale calculator', 'percent off', 'coupon discount', 'savings calculator'],
    features: ['Primary discount percentage (e.g. 30% off)', 'Additional stacking coupon discount (e.g. extra 10% off)', 'Optional sales tax / GST addition', 'Exact savings calculation in Rupees/Dollars'],
    steps: ['Enter original price', 'Enter discount percentage', 'Optionally enter secondary promo coupon', 'See final discounted price and total savings'],
    faqs: [
      { question: 'Does a 50% + 20% discount equal 70% off?', answer: 'No! The second 20% applies to the already discounted price, resulting in a total 60% discount.' }
    ],
    relatedToolIds: ['gst-calculator', 'percentage-calculator', 'tip-calculator']
  },
  {
    id: 'loan-calculator',
    name: 'Loan Affordability Calculator',
    nameHi: 'लोन योग्यता व तुलना कैलकुलेटर',
    slug: 'loan-calculator',
    categoryId: 'finance',
    description: 'Compare multiple loan offers side-by-side to find the lowest total cost and optimal loan tenure.',
    descriptionHi: 'दो अलग-अलग लोन ऑफर्स की तुलना करें और सबसे सस्ता लोन चुनें।',
    iconName: 'Landmark',
    keywords: ['loan calculator', 'compare loans', 'loan interest comparison', 'best loan tenure'],
    features: ['Side-by-side Loan Option A vs Option B comparison', 'Compares total interest paid and difference in monthly EMI', 'Helps identify the most cost-effective borrowing option'],
    steps: ['Enter Principal, Rate, and Tenure for Option 1', 'Enter details for Option 2', 'Compare the savings and total interest cost directly'],
    faqs: [
      { question: 'Is a shorter loan tenure always better?', answer: 'A shorter tenure increases your monthly EMI, but dramatically reduces the total interest paid over the life of the loan.' }
    ],
    relatedToolIds: ['emi-calculator', 'simple-interest-calculator', 'gst-calculator']
  },
  {
    id: 'tip-calculator',
    name: 'Tip & Bill Split Calculator',
    nameHi: 'टिप और बिल स्प्लिट कैलकुलेटर',
    slug: 'tip-calculator',
    categoryId: 'finance',
    description: 'Calculate restaurant tip percentage and split the total bill evenly among friends or group members.',
    descriptionHi: 'होटल या रेस्टोरेंट बिल में टिप जोड़ें और दोस्तों में बराबर बांटें।',
    iconName: 'Receipt',
    keywords: ['tip calculator', 'bill split', 'split bill with friends', 'restaurant tip percentage'],
    features: ['Standard tip presets (10%, 15%, 18%, 20%) or custom tip', 'Split between 1 to 50 persons', 'Shows exact Tip Amount, Total Bill, and Amount per Person'],
    steps: ['Enter total food bill', 'Select tip percentage', 'Enter number of people splitting', 'View individual share per person'],
    faqs: [
      { question: 'What is standard restaurant tip percentage?', answer: '10% to 15% is standard for good dining service.' }
    ],
    relatedToolIds: ['discount-calculator', 'percentage-calculator', 'gst-calculator']
  },
  {
    id: 'electricity-cost-calculator',
    name: 'Electricity Bill & Appliance Cost Calculator',
    nameHi: 'बिजली बिल और उपकरण खर्च कैलकुलेटर',
    slug: 'electricity-cost-calculator',
    categoryId: 'finance',
    description: 'Calculate daily, monthly, and yearly electricity consumption (kWh / units) and running cost for AC, Fridge, Fan, Heater, or PC.',
    descriptionHi: 'AC, पंखे, फ्रिज और हीटर से महीने में कितनी यूनिट और बिजली बिल बनेगा, जानें।',
    iconName: 'Zap',
    keywords: ['electricity bill calculator', 'appliance power consumption', 'kwh calculator', 'units consumed calculator', 'ac power cost'],
    features: ['Common appliance wattage presets (AC 1500W, Fan 75W, Fridge 200W, TV 100W, Geyser 2000W, PC 300W)', 'Hours used per day input', 'Calculates daily units (kWh), monthly units, and estimated monthly cost'],
    steps: ['Enter appliance wattage (Watts)', 'Enter hours used per day', 'Enter your electricity cost per unit (e.g. ₹7/kWh)', 'View exact monthly cost and electricity units'],
    faqs: [
      { question: 'What is 1 Unit of electricity in India?', answer: '1 Unit equals 1 kilowatt-hour (1 kWh), which is using 1000 Watts of power continuously for 1 hour.' }
    ],
    relatedToolIds: ['gst-calculator', 'loan-calculator', 'bmi-calculator']
  },
  {
    id: 'bmi-calculator',
    name: 'BMI Calculator (Body Mass Index)',
    nameHi: 'BMI (बॉडी मास इंडेक्स) कैलकुलेटर',
    slug: 'bmi-calculator',
    categoryId: 'utility',
    description: 'Calculate Body Mass Index (BMI), check healthy weight category (Underweight, Normal, Overweight, Obese), and ideal weight range.',
    descriptionHi: 'अपना BMI निकालें और जानें कि आपका वजन सामान्य, कम या अधिक है।',
    iconName: 'Activity',
    keywords: ['bmi calculator', 'body mass index', 'ideal weight', 'healthy weight range', 'bmi chart'],
    isPopular: true,
    features: ['Supports Metric (cm / kg) and Imperial (ft / in / lbs)', 'Visual BMI color gauge (Underweight <18.5, Normal 18.5-24.9, Overweight 25-29.9, Obese 30+)', 'Calculates recommended healthy weight range for your height'],
    steps: ['Select Metric (cm/kg) or Imperial (ft/lbs)', 'Enter Height and Weight', 'View BMI score and personalized weight guidance'],
    faqs: [
      { question: 'What is a normal healthy BMI range?', answer: 'A BMI between 18.5 and 24.9 is classified as healthy and normal for adult men and women.' }
    ],
    relatedToolIds: ['age-calculator', 'percentage-calculator', 'stopwatch']
  },
  {
    id: 'date-difference-calculator',
    name: 'Date Difference Calculator',
    nameHi: 'दो तारीखों के बीच दिनों की गणना',
    slug: 'date-difference-calculator',
    categoryId: 'utility',
    description: 'Calculate exact duration between two calendar dates in total days, weeks, months, years, and business days.',
    descriptionHi: 'दो तारीखों के बीच कुल दिन, सप्ताह, महीने और वर्किंग डेज की गणना करें।',
    iconName: 'CalendarDays',
    keywords: ['date difference calculator', 'days between dates', 'calculate days', 'duration between dates', 'working days calculator'],
    features: ['Total days, weeks, months, and years breakdown', 'Option to exclude weekends (Business / Working days only)', 'Quick presets: Today, 30 days ago, Year start'],
    steps: ['Select Start Date and End Date', 'Toggle include/exclude end date or weekends', 'View detailed breakdown of days'],
    faqs: [
      { question: 'Does this calculate working days excluding Saturdays & Sundays?', answer: 'Yes, enable the "Count Business Days Only" checkbox to exclude weekends.' }
    ],
    relatedToolIds: ['date-add-subtract-calculator', 'age-calculator', 'exam-countdown']
  },
  {
    id: 'date-add-subtract-calculator',
    name: 'Date Add / Subtract Calculator',
    nameHi: 'तारीख जोड़ें या घटाएं (Future Date Finder)',
    slug: 'date-add-subtract-calculator',
    categoryId: 'utility',
    description: 'Add or subtract days, weeks, months, and years to any starting date to find the exact future or past calendar date.',
    descriptionHi: 'किसी तारीख में दिन या महीने जोड़कर भविष्य या पिछली तारीख जानें।',
    iconName: 'CalendarPlus',
    keywords: ['date add subtract', 'days from today', 'future date calculator', '90 days from now', 'calculate future date'],
    features: ['Add or subtract Days, Weeks, Months, and Years', 'Shows the resulting day of the week (e.g. Tuesday)', 'Handles leap years and month transitions seamlessly'],
    steps: ['Pick starting date (defaults to today)', 'Select Add (+) or Subtract (-)', 'Enter number of days/months/years to see resulting date'],
    faqs: [
      { question: 'What date will it be 90 days from today?', answer: 'Enter 90 in the Days field to instantly see the exact future date and weekday.' }
    ],
    relatedToolIds: ['date-difference-calculator', 'age-calculator', 'timezone-converter']
  },
  {
    id: 'timezone-converter',
    name: 'Time Zone Converter',
    nameHi: 'टाइम ज़ोन कनवर्टर (World Time)',
    slug: 'timezone-converter',
    categoryId: 'utility',
    description: 'Convert time across worldwide zones: IST (India), UTC/GMT, EST/EDT (New York), PST/PDT (San Francisco), GMT (London), JST (Tokyo), and AEST (Sydney).',
    descriptionHi: 'भारतीय समय (IST) को अमेरिका (EST/PST), लंदन (GMT) और टोक्यो (JST) समय में बदलें।',
    iconName: 'Globe',
    keywords: ['time zone converter', 'ist to est', 'utc to ist', 'gmt to ist', 'world clock converter', 'meeting time planner'],
    isPopular: true,
    features: ['Interactive time slider for scheduling global meetings', 'Major zones: IST (+5:30), UTC, EST (-5), PST (-8), GMT (0), CET (+1), JST (+9), AEST (+10), Dubai (+4)', 'Indicates next day / previous day transitions'],
    steps: ['Pick source time zone and time', 'Compare corresponding times in all target world zones in real-time'],
    faqs: [
      { question: 'How much is IST ahead of UTC/GMT?', answer: 'Indian Standard Time (IST) is strictly UTC + 5 hours and 30 minutes ahead with no daylight saving shifts.' }
    ],
    relatedToolIds: ['digital-clock', 'stopwatch', 'countdown-timer']
  },
  {
    id: 'stopwatch',
    name: 'Online Stopwatch & Lap Timer',
    nameHi: 'ऑनलाइन स्टॉपवॉच और लैप टाइमर',
    slug: 'stopwatch',
    categoryId: 'utility',
    description: 'High-precision millisecond stopwatch with lap tracking, split times, keyboard shortcuts (Space/L/R), and lap export.',
    descriptionHi: 'सटीक मिलीसेकंड स्टॉपवॉच और लैप टाइमर (स्पेस बार शॉर्टकट के साथ)।',
    iconName: 'Watch',
    keywords: ['stopwatch online', 'lap timer', 'precision stopwatch', 'timer with laps', 'sports stopwatch'],
    features: ['Millisecond accuracy (00:00:00.00)', 'Unlimited lap recording with fastest and slowest lap highlighting', 'Keyboard hotkeys: Space to Start/Stop, L for Lap, R for Reset', 'Export laps to CSV / copy text'],
    steps: ['Press Start or tap Spacebar', 'Click "Lap" to record splits during running/sports', 'Click Stop and review lap rankings'],
    faqs: [
      { question: 'Does the stopwatch run if I switch tabs?', answer: 'Yes! It calculates elapsed time using performance timestamps, so it never drifts in background tabs.' }
    ],
    relatedToolIds: ['countdown-timer', 'digital-clock', 'study-time-calculator']
  },
  {
    id: 'countdown-timer',
    name: 'Countdown Timer with Sound',
    nameHi: 'काउंटडाउन टाइमर (अलार्म साउंड सहित)',
    slug: 'countdown-timer',
    categoryId: 'utility',
    description: 'Multi-purpose countdown timer with customizable hours, minutes, seconds, audio alarm chime, and popular presets (Pomodoro, Tea, Workout).',
    descriptionHi: 'अलार्म साउंड और पॉमोडोरो प्रीसेट्स के साथ उल्टी गिनती टाइमर।',
    iconName: 'Hourglass',
    keywords: ['countdown timer', 'timer with alarm', 'pomodoro timer', 'kitchen timer', 'online timer'],
    features: ['Audio chime alarm upon completion (pure Web Audio API, no external files)', 'Quick presets: 1 min, 5 min, 15 min, 25 min (Pomodoro), 45 min', 'Visual circular progress animation', 'Pause, Resume, and Fullscreen mode'],
    steps: ['Set hours, minutes, and seconds or choose a preset', 'Click Start Timer', 'Listen for the audio alert when timer hits zero'],
    faqs: [
      { question: 'Does the audio alarm require internet?', answer: 'No! The chime is synthesized locally using the browser Web Audio API.' }
    ],
    relatedToolIds: ['stopwatch', 'exam-countdown', 'digital-clock']
  },
  {
    id: 'digital-clock',
    name: 'Digital Clock & World Clock',
    nameHi: 'डिजिटल क्लॉक और वर्ल्ड क्लॉक (Fullscreen)',
    slug: 'digital-clock',
    categoryId: 'utility',
    description: 'Full-screen digital clock with 12/24 hour format, seconds toggle, date display, and multi-city world clock.',
    descriptionHi: 'फुल स्क्रीन डिजिटल घड़ी, तारीख और दुनिया के प्रमुख शहरों का लाइव समय।',
    iconName: 'Clock',
    keywords: ['digital clock', 'fullscreen clock', 'online clock', 'world clock live', 'ist live time'],
    features: ['12-hour (AM/PM) or 24-hour display toggle', 'Date, Day of Week, and Month display', 'One-click distraction-free Fullscreen Zen Mode', 'Live world clocks for New Delhi, New York, London, Tokyo, Sydney, Dubai'],
    steps: ['Open clock view', 'Toggle 12h/24h or click Fullscreen for a desk ambient clock', 'Check world time zones below'],
    faqs: [
      { question: 'Can I keep this open on a second monitor?', answer: 'Yes! Click "Fullscreen" for a clean, distraction-free bedside or desk clock.' }
    ],
    relatedToolIds: ['timezone-converter', 'stopwatch', 'countdown-timer']
  },
  {
    id: 'password-generator',
    name: 'Secure Password Generator',
    nameHi: 'सुरक्षित पासवर्ड जनरेटर (Strong Password)',
    slug: 'password-generator',
    categoryId: 'utility',
    description: 'Generate strong, unhackable passwords with customizable length, symbols, numbers, uppercase letters, and entropy strength score.',
    descriptionHi: 'मजबूत और सुरक्षित पासवर्ड बनाएं (अक्षर, अंक और स्पेशल कैरेक्टर के साथ)।',
    iconName: 'ShieldCheck',
    keywords: ['password generator', 'strong password', 'random password', 'password creator', 'secure password'],
    isPopular: true,
    features: ['Custom length slider (8 to 64 characters)', 'Toggles for Uppercase (A-Z), Lowercase (a-z), Numbers (0-9), Symbols (!@#$%)', 'Exclude ambiguous characters (like 1, l, I, 0, O) option', 'Pronounceable passphrase mode', 'Live entropy strength meter'],
    steps: ['Adjust desired length slider', 'Toggle included character sets', 'Click Generate and copy your secure password'],
    faqs: [
      { question: 'How secure are passwords generated here?', answer: 'They are generated using cryptographically secure `crypto.getRandomValues()` directly on your device and are never saved or transmitted.' }
    ],
    relatedToolIds: ['random-number-generator', 'qr-code-generator', 'base64-encoder']
  },
  {
    id: 'random-number-generator',
    name: 'Random Number Generator & Dice Roller',
    nameHi: 'रैंडम नंबर जनरेटर और पासा (Dice)',
    slug: 'random-number-generator',
    categoryId: 'utility',
    description: 'Generate single or bulk random numbers between Min and Max, no-duplicate lottery picks, virtual Dice roller, and Coin flipper.',
    descriptionHi: 'न्यूनतम और अधिकतम के बीच रैंडम संख्याएं, डाइस रोल और सिक्का टॉस (Coin Flip) करें।',
    iconName: 'Dice5',
    keywords: ['random number generator', 'rng', 'roll dice online', 'flip coin online', 'lottery number generator', 'random picker'],
    isPopular: true,
    features: ['Generate 1 to 100 random numbers at once', 'Allow or Disallow duplicate numbers option', 'Sort generated numbers ascending or descending', 'Interactive 3D Coin Flip (Heads/Tails) & 6-sided Dice Roller'],
    steps: ['Set Min (e.g. 1) and Max (e.g. 100) range', 'Choose quantity of numbers', 'Click "Generate" or toggle Coin/Dice mode'],
    faqs: [
      { question: 'Is the coin flip truly 50/50 fair?', answer: 'Yes! It utilizes the browser cryptographic random generator for unskewed probability.' }
    ],
    relatedToolIds: ['password-generator', 'multiplication-table-generator', 'stopwatch']
  },
  {
    id: 'qr-code-generator',
    name: 'QR Code Generator',
    nameHi: 'QR कोड जनरेटर (URL, WiFi, Text, UPI)',
    slug: 'qr-code-generator',
    categoryId: 'utility',
    description: 'Generate custom QR codes for Website URLs, WiFi network login, UPI Payments, vCard contacts, WhatsApp, and text with PNG download.',
    descriptionHi: 'वेबसाइट, वाईफाई, UPI पेमेंट और व्हाट्सएप के लिए QR कोड बनाएं।',
    iconName: 'QrCode',
    keywords: ['qr code generator', 'create qr code', 'wifi qr code', 'upi qr code', 'free qr maker'],
    isPopular: true,
    privacyMessage: 'Your QR data is rendered strictly on a local browser canvas without third-party tracking.',
    features: ['Modes: Website URL, Plain Text, WiFi auto-connect, UPI Payment (GPay/PhonePe), WhatsApp message, Phone call', 'Custom foreground and background colors', 'Adjustable QR pixel resolution (High-Res 500x500)', 'Instant PNG download'],
    steps: ['Choose QR category (URL, WiFi, UPI, Text)', 'Enter details', 'Customize color if desired', 'Click "Download QR Code"'],
    faqs: [
      { question: 'Do these QR codes expire?', answer: 'No! These are standard static QR codes that contain your data directly and never expire.' }
    ],
    relatedToolIds: ['password-generator', 'color-picker-palette', 'url-encoder']
  },
  {
    id: 'color-picker-palette',
    name: 'Color Picker & Palette Generator',
    nameHi: 'कलर पिकर और पैलेट जनरेटर (HEX, RGB, HSL)',
    slug: 'color-picker-palette',
    categoryId: 'utility',
    description: 'Pick colors, convert between HEX, RGB, HSL, and CMYK formats, and generate complementary shade palettes.',
    descriptionHi: 'कलर कोड (HEX, RGB, HSL) निकालें और सुंदर कलर पैलेट बनाएं।',
    iconName: 'Palette',
    keywords: ['color picker', 'hex to rgb', 'rgb to hex', 'color palette generator', 'color converter'],
    features: ['Live color wheel and spectrum picker', 'Instant conversions: HEX (#3b82f6), RGB (59, 130, 246), HSL, and CMYK', 'Automatic lighter/darker shade tints generator', 'One-click copy for CSS'],
    steps: ['Select color with the picker or paste a HEX code', 'View conversions across all color models', 'Copy the exact CSS color code needed'],
    faqs: [
      { question: 'How to convert RGB to HEX?', answer: 'Each RGB value (0-255) is converted into a 2-digit hexadecimal number (e.g. RGB(255, 0, 0) = #FF0000).' }
    ],
    relatedToolIds: ['qr-code-generator', 'css-minifier', 'image-quality-optimizer']
  },
  {
    id: 'currency-converter',
    name: 'Currency & Foreign Exchange Converter',
    nameHi: 'करेंसी कनवर्टर (INR, USD, EUR, GBP, AED, SAR)',
    slug: 'currency-converter',
    categoryId: 'utility',
    description: 'Convert currencies between Indian Rupee (INR), US Dollar (USD), Euro (EUR), British Pound (GBP), UAE Dirham (AED), Saudi Riyal (SAR), and Canadian Dollar (CAD) with customizable exchange rates.',
    descriptionHi: 'रुपए (INR) को डॉलर (USD), यूरो (EUR), दिरहम (AED) और पाउंड में बदलें।',
    iconName: 'Coins',
    keywords: ['currency converter', 'inr to usd', 'usd to inr', 'aed to inr', 'rupee to dollar', 'forex converter'],
    isPopular: true,
    features: ['Pre-calibrated benchmark reference rates', 'Customizable exchange rate field to match bank/travel card rates', 'Interactive dual conversion table for 15+ major global currencies'],
    steps: ['Enter base amount and select "From" currency (e.g. USD)', 'Select "To" currency (e.g. INR)', 'View instant conversion and exchange breakdown'],
    faqs: [
      { question: 'Can I customize the conversion rate?', answer: 'Yes! You can edit the exchange rate manually to reflect your exact credit card or forex card rates.' }
    ],
    relatedToolIds: ['gst-calculator', 'number-to-words', 'unit-converter']
  },
  {
    id: 'markdown-editor',
    name: 'Markdown Editor & Live Previewer',
    nameHi: 'मार्कडाउन (Markdown) एडिटर व प्रीव्यूअर',
    slug: 'markdown-editor',
    categoryId: 'utility',
    description: 'Write Markdown with real-time side-by-side formatted preview, formatting toolbar, markdown cheatsheet, and HTML/MD export.',
    descriptionHi: 'मार्कडाउन कोड लिखें, लाइव प्रीव्यू देखें और HTML या .md फाइल में डाउनलोड करें।',
    iconName: 'FileEdit',
    keywords: ['markdown editor', 'markdown preview', 'md to html', 'markdown live editor', 'readme editor'],
    features: ['Side-by-side synchronous live preview', 'Toolbar for Headings, Bold, Italic, Code, Blockquotes, Tables, and Links', 'Export as clean HTML or download .md file', 'Built-in Markdown cheatsheet reference'],
    steps: ['Type markdown on the left pane', 'Check real-time formatted preview on the right', 'Copy compiled HTML or download file'],
    faqs: [
      { question: 'What is Markdown used for?', answer: 'Markdown is a lightweight markup language used for GitHub READMEs, blog posts, documentation, and chat formatting.' }
    ],
    relatedToolIds: ['html-formatter', 'text-to-pdf', 'word-counter']
  },
  {
    id: 'text-to-speech',
    name: 'Text to Speech (Voice Reader)',
    nameHi: 'टेक्स्ट टू स्पीच (आवाज़ में सुनें)',
    slug: 'text-to-speech',
    categoryId: 'utility',
    description: 'Listen to any text, article, or script read aloud naturally using your browser built-in Web Speech synthesis voices with pitch and speed controls.',
    descriptionHi: 'किसी भी टेक्स्ट को प्राकृतिक आवाज़ में सुनें (स्पीड और पिच कंट्रोल के साथ)।',
    iconName: 'Volume2',
    keywords: ['text to speech', 'voice reader', 'read text aloud', 'tts online', 'listen to text'],
    isPopular: true,
    privacyMessage: 'Your text is read using your device local speech engine and is not recorded.',
    features: ['Uses high-quality browser Web Speech API voices (English, Hindi, and regional accents)', 'Adjustable Speaking Speed / Rate slider (0.5x to 2x)', 'Adjustable Pitch slider', 'Play, Pause, Resume, and Stop controls'],
    steps: ['Type or paste any paragraph or article', 'Choose voice, speed, and pitch', 'Click "Play / Speak" to listen'],
    faqs: [
      { question: 'Does this use third-party cloud audio APIs?', answer: 'No! It uses the standard HTML5 Web Speech Synthesis API built natively into your browser.' }
    ],
    relatedToolIds: ['word-counter', 'reading-time-calculator', 'social-text-formatter']
  },
  {
    id: 'screen-recorder-snapshot',
    name: 'Screen Recorder & Snapshot',
    nameHi: 'स्क्रीन रिकॉर्डर और स्क्रीनशॉट टूल',
    slug: 'screen-recorder-snapshot',
    categoryId: 'utility',
    description: 'Record your screen, browser tab, or window into a WebM video or capture high-resolution desktop snapshots with zero software installs.',
    descriptionHi: 'बिना किसी ऐप के सीधे ब्राउज़र से अपनी स्क्रीन रिकॉर्ड करें या स्क्रीनशॉट लें।',
    iconName: 'Video',
    keywords: ['screen recorder online', 'record screen in browser', 'screen capture', 'tab recorder', 'free screen recording'],
    privacyMessage: 'Your video stream is recorded strictly in your browser memory and never uploaded to any cloud.',
    features: ['Record entire screen, individual window, or specific browser tab', 'Include microphone voice commentary option', 'Instant WebM video download', 'Capture single frame HD snapshot'],
    steps: ['Click "Start Recording"', 'Select the window or screen to share in your browser dialog', 'When finished, click "Stop & Download Video"'],
    faqs: [
      { question: 'Is there a recording watermark or time limit?', answer: 'No! Since it runs client-side on your own device, there are zero artificial time limits or watermarks.' }
    ],
    relatedToolIds: ['pdf-to-image', 'image-watermark', 'meme-maker']
  }
];

export const POPULAR_TOOL_IDS = [
  'image-compressor',
  'pdf-merger',
  'age-calculator',
  'resume-builder',
  'percentage-calculator',
  'gst-calculator',
  'image-resizer',
  'word-counter',
  'passport-photo-maker',
  'qr-code-generator',
  'youtube-title-generator',
  'json-formatter'
];

export const NEW_TOOL_IDS = [
  'text-to-speech',
  'screen-recorder-snapshot',
  'passport-photo-maker',
  'salary-calculator',
  'reel-cover-maker',
  'pdf-page-number'
];
