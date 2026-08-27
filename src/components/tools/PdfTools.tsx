import React, { useState } from 'react';
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import { FileSpreadsheet, Upload, Download, Check, AlertCircle, Trash2, ArrowUp, ArrowDown, RotateCw, FileText, Layers } from 'lucide-react';

interface PdfToolProps {
  toolId: string;
}

interface UploadedPdfItem {
  id: string;
  name: string;
  size: number;
  arrayBuffer: ArrayBuffer;
  pageCount?: number;
}

export const PdfTools: React.FC<PdfToolProps> = ({ toolId }) => {
  const [pdfFiles, setPdfFiles] = useState<UploadedPdfItem[]>([]);
  const [imageFiles, setImageFiles] = useState<{ id: string; name: string; dataUrl: string }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState<string>('output.pdf');
  
  // Custom inputs for specific tools
  const [pageRange, setPageRange] = useState<string>('1-2');
  const [pageNumberFormat, setPageNumberFormat] = useState<'num' | 'page_of_total' | 'dash'>('page_of_total');
  const [pageNumberPos, setPageNumberPos] = useState<'bottom_center' | 'bottom_right' | 'top_right'>('bottom_center');
  const [textInput, setTextInput] = useState<string>('AI Saathi Hub Document Notes\n\nYour formatted notes will be placed on clean A4 printable sheets.');
  const [htmlInput, setHtmlInput] = useState<string>('<h1>Invoice #1024</h1><p>Customer: Rahul Sharma</p><p>Total: ₹4,500</p>');
  const [metadata, setMetadata] = useState({ title: '', author: '', subject: '', keywords: '' });
  const [pdfInfo, setPdfInfo] = useState<{ pageCount: number; sizeBytes: number; title: string; author: string } | null>(null);

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setStatusMessage(null);
    setDownloadUrl(null);

    const loaded: UploadedPdfItem[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) continue;
      const buffer = await file.arrayBuffer();
      try {
        const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
        const count = doc.getPageCount();
        loaded.push({
          id: Math.random().toString(),
          name: file.name,
          size: file.size,
          arrayBuffer: buffer,
          pageCount: count
        });

        // Set metadata / info if first file
        if (loaded.length === 1) {
          setPdfInfo({
            pageCount: count,
            sizeBytes: file.size,
            title: doc.getTitle() || 'Untitled',
            author: doc.getAuthor() || 'Unknown'
          });
          setMetadata({
            title: doc.getTitle() || '',
            author: doc.getAuthor() || '',
            subject: doc.getSubject() || '',
            keywords: doc.getKeywords() || ''
          });
        }
      } catch (err) {
        console.error(err);
      }
    }

    setPdfFiles(prev => [...prev, ...loaded]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = () => {
        setImageFiles(prev => [...prev, { id: Math.random().toString(), name: file.name, dataUrl: reader.result as string }]);
      };
      reader.readAsDataURL(file);
    }
  };

  // 1. PDF MERGER
  const executeMerge = async () => {
    if (pdfFiles.length < 2) {
      setStatusMessage({ type: 'error', text: 'Please upload at least 2 PDF files to merge.' });
      return;
    }
    setIsProcessing(true);
    try {
      const mergedPdf = await PDFDocument.create();
      for (const item of pdfFiles) {
        const donorPdf = await PDFDocument.load(item.arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(donorPdf, donorPdf.getPageIndices());
        copiedPages.forEach(page => mergedPdf.addPage(page));
      }
      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      setDownloadName('merged-document.pdf');
      setStatusMessage({ type: 'success', text: `Successfully merged ${pdfFiles.length} PDFs into a single document!` });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: `Failed to merge: ${err.message || 'Unknown error'}` });
    } finally {
      setIsProcessing(false);
    }
  };

  // 2. PDF SPLIT & EXTRACT
  const executeSplitOrExtract = async () => {
    if (pdfFiles.length === 0) {
      setStatusMessage({ type: 'error', text: 'Please upload a PDF file first.' });
      return;
    }
    setIsProcessing(true);
    try {
      const srcDoc = await PDFDocument.load(pdfFiles[0].arrayBuffer);
      const total = srcDoc.getPageCount();
      const newDoc = await PDFDocument.create();

      // Parse range like "1-3, 5"
      const pagesToKeep: number[] = [];
      const parts = pageRange.split(',');
      for (const p of parts) {
        const range = p.trim().split('-');
        if (range.length === 2) {
          const start = Math.max(1, parseInt(range[0], 10));
          const end = Math.min(total, parseInt(range[1], 10));
          for (let i = start; i <= end; i++) pagesToKeep.push(i - 1);
        } else if (range.length === 1 && parseInt(range[0], 10)) {
          const pageNum = parseInt(range[0], 10);
          if (pageNum >= 1 && pageNum <= total) pagesToKeep.push(pageNum - 1);
        }
      }

      if (pagesToKeep.length === 0) {
        pagesToKeep.push(0); // default to page 1
      }

      const copied = await newDoc.copyPages(srcDoc, Array.from(new Set(pagesToKeep)));
      copied.forEach(page => newDoc.addPage(page));

      const pdfBytes = await newDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      setDownloadName(`extracted-pages.pdf`);
      setStatusMessage({ type: 'success', text: `Extracted ${copied.length} pages successfully!` });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: `Extraction failed: ${err.message}` });
    } finally {
      setIsProcessing(false);
    }
  };

  // 3. IMAGE TO PDF
  const executeImageToPdf = async () => {
    if (imageFiles.length === 0) {
      setStatusMessage({ type: 'error', text: 'Please upload at least one image.' });
      return;
    }
    setIsProcessing(true);
    try {
      const pdfDoc = await PDFDocument.create();
      for (const imgItem of imageFiles) {
        const response = await fetch(imgItem.dataUrl);
        const imgBytes = await response.arrayBuffer();
        let embedded;
        if (imgItem.dataUrl.startsWith('data:image/png')) {
          embedded = await pdfDoc.embedPng(imgBytes);
        } else {
          embedded = await pdfDoc.embedJpg(imgBytes);
        }
        const { width, height } = embedded.scale(1);
        const page = pdfDoc.addPage([width, height]);
        page.drawImage(embedded, { x: 0, y: 0, width, height });
      }
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      setDownloadName('images-to-document.pdf');
      setStatusMessage({ type: 'success', text: `Converted ${imageFiles.length} images to PDF!` });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: `Failed to convert images: ${err.message}` });
    } finally {
      setIsProcessing(false);
    }
  };

  // 4. TEXT TO PDF
  const executeTextToPdf = async () => {
    setIsProcessing(true);
    try {
      const doc = await PDFDocument.create();
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const page = doc.addPage([595.28, 841.89]); // A4
      const { height } = page.getSize();
      
      const lines = textInput.split('\n');
      let currentY = height - 50;

      for (const line of lines) {
        if (currentY < 50) break;
        page.drawText(line, {
          x: 50,
          y: currentY,
          size: 11,
          font,
          color: rgb(0.1, 0.1, 0.1)
        });
        currentY -= 18;
      }

      const pdfBytes = await doc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      setDownloadName('text-document.pdf');
      setStatusMessage({ type: 'success', text: 'Text PDF generated successfully!' });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: `Failed: ${err.message}` });
    } finally {
      setIsProcessing(false);
    }
  };

  // 5. PDF PAGE NUMBERER
  const executeAddPageNumbers = async () => {
    if (pdfFiles.length === 0) {
      setStatusMessage({ type: 'error', text: 'Please upload a PDF file.' });
      return;
    }
    setIsProcessing(true);
    try {
      const doc = await PDFDocument.load(pdfFiles[0].arrayBuffer);
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const total = doc.getPageCount();

      for (let i = 0; i < total; i++) {
        const page = doc.getPage(i);
        const { width, height } = page.getSize();
        let numStr = `${i + 1}`;
        if (pageNumberFormat === 'page_of_total') numStr = `Page ${i + 1} of ${total}`;
        if (pageNumberFormat === 'dash') numStr = `- ${i + 1} -`;

        let x = width / 2 - 25;
        let y = 25;
        if (pageNumberPos === 'bottom_right') {
          x = width - 80;
          y = 25;
        } else if (pageNumberPos === 'top_right') {
          x = width - 80;
          y = height - 25;
        }

        page.drawText(numStr, {
          x,
          y,
          size: 9,
          font,
          color: rgb(0.3, 0.3, 0.3)
        });
      }

      const pdfBytes = await doc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      setDownloadName('numbered-document.pdf');
      setStatusMessage({ type: 'success', text: `Added page numbers to ${total} pages!` });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: `Failed: ${err.message}` });
    } finally {
      setIsProcessing(false);
    }
  };

  // 6. PDF METADATA EDITOR
  const executeSaveMetadata = async () => {
    if (pdfFiles.length === 0) return;
    setIsProcessing(true);
    try {
      const doc = await PDFDocument.load(pdfFiles[0].arrayBuffer);
      doc.setTitle(metadata.title);
      doc.setAuthor(metadata.author);
      doc.setSubject(metadata.subject);
      doc.setKeywords(metadata.keywords.split(',').map(k => k.trim()));

      const pdfBytes = await doc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      setDownloadName('metadata-updated.pdf');
      setStatusMessage({ type: 'success', text: 'PDF metadata updated and saved!' });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: `Failed: ${err.message}` });
    } finally {
      setIsProcessing(false);
    }
  };

  // 7. ROTATE PAGES
  const executeRotatePages = async (deg = 90) => {
    if (pdfFiles.length === 0) return;
    setIsProcessing(true);
    try {
      const doc = await PDFDocument.load(pdfFiles[0].arrayBuffer);
      const pages = doc.getPages();
      pages.forEach(p => {
        const currentRotation = p.getRotation().angle;
        p.setRotation(degrees(currentRotation + deg));
      });
      const pdfBytes = await doc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      setDownloadName('rotated-document.pdf');
      setStatusMessage({ type: 'success', text: `Rotated all pages by ${deg}°!` });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: `Failed: ${err.message}` });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* UPLOAD BOX (For PDF files or Images depending on tool) */}
      {toolId === 'image-to-pdf' ? (
        <div className="p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-center bg-slate-50/50 dark:bg-slate-900/50">
          <Upload className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Select Image Files (JPG, PNG, WebP)</h3>
          <p className="text-xs text-slate-500 mb-4">Files are converted locally in your browser memory</p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="img-upload-input"
          />
          <label
            htmlFor="img-upload-input"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs cursor-pointer inline-flex items-center gap-2 transition"
          >
            Choose Photos
          </label>
        </div>
      ) : toolId !== 'text-to-pdf' && toolId !== 'html-to-pdf' ? (
        <div className="p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-center bg-slate-50/50 dark:bg-slate-900/50">
          <FileSpreadsheet className="w-10 h-10 text-rose-500 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            {toolId === 'pdf-merger' ? 'Select Multiple PDF Files to Combine' : 'Upload PDF Document'}
          </h3>
          <p className="text-xs text-slate-500 mb-4">Files are processed 100% locally and never uploaded to any server</p>
          <input
            type="file"
            multiple={toolId === 'pdf-merger'}
            accept=".pdf,application/pdf"
            onChange={handlePdfUpload}
            className="hidden"
            id="pdf-upload-input"
          />
          <label
            htmlFor="pdf-upload-input"
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs cursor-pointer inline-flex items-center gap-2 transition"
          >
            Select PDF Files
          </label>
        </div>
      ) : null}

      {/* LOADED PDF FILES LIST */}
      {pdfFiles.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Uploaded PDF Documents ({pdfFiles.length})</span>
          <div className="space-y-2">
            {pdfFiles.map((file, idx) => (
              <div key={file.id} className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="font-bold text-slate-400">#{idx + 1}</span>
                  <FileText className="w-4 h-4 text-rose-500 shrink-0" />
                  <span className="font-medium truncate text-slate-800 dark:text-slate-200">{file.name}</span>
                  <span className="text-slate-400">({(file.size / 1024).toFixed(1)} KB, {file.pageCount} pages)</span>
                </div>
                <div className="flex items-center gap-1">
                  {toolId === 'pdf-merger' && (
                    <>
                      <button
                        onClick={() => {
                          if (idx === 0) return;
                          const copy = [...pdfFiles];
                          const temp = copy[idx - 1];
                          copy[idx - 1] = copy[idx];
                          copy[idx] = temp;
                          setPdfFiles(copy);
                        }}
                        className="p-1 text-slate-400 hover:text-slate-700"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (idx === pdfFiles.length - 1) return;
                          const copy = [...pdfFiles];
                          const temp = copy[idx + 1];
                          copy[idx + 1] = copy[idx];
                          copy[idx] = temp;
                          setPdfFiles(copy);
                        }}
                        className="p-1 text-slate-400 hover:text-slate-700"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setPdfFiles(pdfFiles.filter(f => f.id !== file.id))}
                    className="p-1 text-red-500 hover:text-red-700"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LOADED IMAGES LIST FOR IMAGE TO PDF */}
      {imageFiles.length > 0 && toolId === 'image-to-pdf' && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {imageFiles.map(img => (
            <div key={img.id} className="relative group rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 aspect-square">
              <img src={img.dataUrl} alt="Upload preview" className="w-full h-full object-cover" />
              <button
                onClick={() => setImageFiles(imageFiles.filter(i => i.id !== img.id))}
                className="absolute top-1 right-1 p-1 rounded-full bg-red-600 text-white opacity-90 hover:opacity-100"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* TOOL SPECIFIC SETTINGS */}
      {(toolId === 'pdf-splitter' || toolId === 'pdf-page-extractor') && (
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Page Ranges to Extract (e.g. "1-3, 5, 8-10")
          </label>
          <input
            type="text"
            value={pageRange}
            onChange={e => setPageRange(e.target.value)}
            placeholder="1-2, 4"
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
          />
        </div>
      )}

      {toolId === 'pdf-page-number' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
          <div>
            <label className="block font-semibold mb-1">Numbering Format</label>
            <select
              value={pageNumberFormat}
              onChange={e => setPageNumberFormat(e.target.value as any)}
              className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
            >
              <option value="page_of_total">Page 1 of N</option>
              <option value="num">1, 2, 3...</option>
              <option value="dash">- 1 -, - 2 -</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">Position on Page</label>
            <select
              value={pageNumberPos}
              onChange={e => setPageNumberPos(e.target.value as any)}
              className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
            >
              <option value="bottom_center">Bottom Center (Standard)</option>
              <option value="bottom_right">Bottom Right</option>
              <option value="top_right">Top Right Header</option>
            </select>
          </div>
        </div>
      )}

      {toolId === 'pdf-metadata-viewer' && (
        <div className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
          <div>
            <label className="block font-semibold mb-1">Document Title</label>
            <input
              type="text"
              value={metadata.title}
              onChange={e => setMetadata({ ...metadata, title: e.target.value })}
              className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Author Name</label>
              <input
                type="text"
                value={metadata.author}
                onChange={e => setMetadata({ ...metadata, author: e.target.value })}
                className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Subject</label>
              <input
                type="text"
                value={metadata.subject}
                onChange={e => setMetadata({ ...metadata, subject: e.target.value })}
                className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
          </div>
        </div>
      )}

      {toolId === 'pdf-size-analyzer' && pdfInfo && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-center">
            <span className="text-slate-500 text-[11px] uppercase block font-semibold">Total Pages</span>
            <span className="text-xl font-bold text-rose-600">{pdfInfo.pageCount}</span>
          </div>
          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-center">
            <span className="text-slate-500 text-[11px] uppercase block font-semibold">File Size</span>
            <span className="text-xl font-bold text-slate-800 dark:text-slate-200">{(pdfInfo.sizeBytes / (1024 * 1024)).toFixed(2)} MB</span>
          </div>
          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-center">
            <span className="text-slate-500 text-[11px] uppercase block font-semibold">Title Tag</span>
            <span className="text-xs font-semibold truncate block mt-1">{pdfInfo.title}</span>
          </div>
          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-center">
            <span className="text-slate-500 text-[11px] uppercase block font-semibold">Author</span>
            <span className="text-xs font-semibold truncate block mt-1">{pdfInfo.author}</span>
          </div>
        </div>
      )}

      {toolId === 'text-to-pdf' && (
        <div>
          <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">Document Text Content</label>
          <textarea
            rows={7}
            value={textInput}
            onChange={e => setTextInput(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-mono"
          />
        </div>
      )}

      {toolId === 'html-to-pdf' && (
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Raw HTML Markup</label>
          <textarea
            rows={6}
            value={htmlInput}
            onChange={e => setHtmlInput(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-mono"
          />
          <button
            onClick={() => {
              const win = window.open('', '_blank');
              if (win) {
                win.document.write(`<html><head><title>Print to PDF</title><style>body{font-family:sans-serif;padding:30px;}</style></head><body>${htmlInput}</body></html>`);
                win.document.close();
                win.print();
              }
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-medium hover:bg-slate-900 transition"
          >
            Open Live HTML Print Renderer
          </button>
        </div>
      )}

      {/* STATUS BANNER */}
      {statusMessage && (
        <div className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300'}`}>
          {statusMessage.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* MAIN EXECUTION BUTTONS */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        {toolId === 'pdf-merger' && (
          <button
            onClick={executeMerge}
            disabled={isProcessing || pdfFiles.length < 2}
            className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-semibold shadow-sm transition flex items-center gap-2"
          >
            <Layers className="w-4 h-4" />
            {isProcessing ? 'Merging in Browser...' : 'Merge PDFs Now'}
          </button>
        )}

        {(toolId === 'pdf-splitter' || toolId === 'pdf-page-extractor') && (
          <button
            onClick={executeSplitOrExtract}
            disabled={isProcessing || pdfFiles.length === 0}
            className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-semibold shadow-sm transition"
          >
            {isProcessing ? 'Extracting...' : 'Extract & Save PDF'}
          </button>
        )}

        {toolId === 'image-to-pdf' && (
          <button
            onClick={executeImageToPdf}
            disabled={isProcessing || imageFiles.length === 0}
            className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-semibold shadow-sm transition"
          >
            {isProcessing ? 'Generating PDF...' : 'Convert Images to PDF'}
          </button>
        )}

        {toolId === 'text-to-pdf' && (
          <button
            onClick={executeTextToPdf}
            disabled={isProcessing || !textInput.trim()}
            className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-semibold shadow-sm transition"
          >
            {isProcessing ? 'Creating PDF...' : 'Download Text as PDF'}
          </button>
        )}

        {toolId === 'pdf-page-number' && (
          <button
            onClick={executeAddPageNumbers}
            disabled={isProcessing || pdfFiles.length === 0}
            className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-semibold shadow-sm transition"
          >
            {isProcessing ? 'Numbering...' : 'Add Page Numbers & Download'}
          </button>
        )}

        {toolId === 'pdf-metadata-viewer' && (
          <button
            onClick={executeSaveMetadata}
            disabled={isProcessing || pdfFiles.length === 0}
            className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-semibold shadow-sm transition"
          >
            Update PDF Metadata
          </button>
        )}

        {toolId === 'pdf-page-organizer' && (
          <div className="flex gap-2">
            <button
              onClick={() => executeRotatePages(90)}
              disabled={isProcessing || pdfFiles.length === 0}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <RotateCw className="w-3.5 h-3.5" /> Rotate 90°
            </button>
            <button
              onClick={() => executeRotatePages(180)}
              disabled={isProcessing || pdfFiles.length === 0}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold"
            >
              Rotate 180°
            </button>
          </div>
        )}

        {/* DOWNLOAD BUTTON */}
        {downloadUrl && (
          <a
            href={downloadUrl}
            download={downloadName}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Generated PDF
          </a>
        )}
      </div>
    </div>
  );
};
