import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, Sliders, Image as ImageIcon, RotateCw, Crop, Sparkles, RefreshCw, Stamp, Smile, Check, Shield } from 'lucide-react';

interface ImageToolsProps {
  toolId: string;
}

export const ImageTools: React.FC<ImageToolsProps> = ({ toolId }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<{ name: string; size: number; width: number; height: number; type: string } | null>(null);
  const [quality, setQuality] = useState<number>(80);
  const [targetWidth, setTargetWidth] = useState<number>(1080);
  const [targetHeight, setTargetHeight] = useState<number>(1080);
  const [lockRatio, setLockRatio] = useState<boolean>(true);
  const [targetFormat, setTargetFormat] = useState<string>('image/jpeg');
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [processedSize, setProcessedSize] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Filters & enhancements
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [saturation, setSaturation] = useState<number>(100);
  const [blurRadius, setBlurRadius] = useState<number>(0);

  // Watermark
  const [watermarkText, setWatermarkText] = useState<string>('© AI Saathi Hub');
  const [watermarkOpacity, setWatermarkOpacity] = useState<number>(50);
  const [watermarkPos, setWatermarkPos] = useState<'center' | 'bottom_right' | 'diagonal'>('bottom_right');

  // Meme
  const [topText, setTopText] = useState<string>('WHEN THE CODE WORKS');
  const [bottomText, setBottomText] = useState<string>('ON THE FIRST TRY');
  const [memeFontSize, setMemeFontSize] = useState<number>(36);

  // Passport & ID Photo
  const [passportType, setPassportType] = useState<'indian' | 'us_visa' | 'id_badge'>('indian');
  const [printGrid, setPrintGrid] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        setOriginalFile({
          name: file.name,
          size: file.size,
          width: img.width,
          height: img.height,
          type: file.type
        });
        setTargetWidth(img.width);
        setTargetHeight(img.height);
        setImageSrc(reader.result as string);
        setProcessedUrl(null);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const executeProcess = () => {
    if (!imageSrc) return;
    setIsProcessing(true);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. PASSPORT PHOTO GENERATOR
      if (toolId === 'passport-photo-maker' || toolId === 'id-photo-maker') {
        if (printGrid) {
          // 4x6 inch print sheet (1200 x 1800 px at 300 DPI)
          canvas.width = 1800;
          canvas.height = 1200;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          const photoW = 413; // 35mm
          const photoH = 531; // 45mm
          const cols = 3;
          const rows = 2;
          const startX = 150;
          const startY = 60;
          const gapX = 100;
          const gapY = 40;

          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              const x = startX + c * (photoW + gapX);
              const y = startY + r * (photoH + gapY);
              // Draw photo
              ctx.drawImage(img, 0, 0, img.width, img.height, x, y, photoW, photoH);
              // Draw thin border
              ctx.strokeStyle = '#cccccc';
              ctx.lineWidth = 1;
              ctx.strokeRect(x, y, photoW, photoH);
            }
          }
        } else {
          // Single Passport standard
          canvas.width = passportType === 'us_visa' ? 600 : 413;
          canvas.height = passportType === 'us_visa' ? 600 : 531;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
          // subtle border
          ctx.strokeStyle = '#e2e8f0';
          ctx.lineWidth = 2;
          ctx.strokeRect(0, 0, canvas.width, canvas.height);
        }
      }
      // 2. MEME MAKER
      else if (toolId === 'meme-maker') {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        ctx.font = `bold ${memeFontSize}px Impact, sans-serif`;
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = Math.max(3, memeFontSize / 10);
        ctx.textAlign = 'center';

        if (topText) {
          ctx.strokeText(topText.toUpperCase(), canvas.width / 2, memeFontSize + 20);
          ctx.fillText(topText.toUpperCase(), canvas.width / 2, memeFontSize + 20);
        }
        if (bottomText) {
          ctx.strokeText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 30);
          ctx.fillText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 30);
        }
      }
      // 3. WATERMARK TOOL
      else if (toolId === 'image-watermark') {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        ctx.font = `bold ${Math.max(18, Math.floor(img.width / 24))}px Arial, sans-serif`;
        ctx.fillStyle = `rgba(255, 255, 255, ${watermarkOpacity / 100})`;
        ctx.strokeStyle = `rgba(0, 0, 0, ${watermarkOpacity / 100})`;
        ctx.lineWidth = 2;

        if (watermarkPos === 'center') {
          ctx.textAlign = 'center';
          ctx.strokeText(watermarkText, canvas.width / 2, canvas.height / 2);
          ctx.fillText(watermarkText, canvas.width / 2, canvas.height / 2);
        } else if (watermarkPos === 'diagonal') {
          ctx.save();
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate(-Math.PI / 4);
          ctx.textAlign = 'center';
          ctx.strokeText(watermarkText, 0, 0);
          ctx.fillText(watermarkText, 0, 0);
          ctx.restore();
        } else {
          ctx.textAlign = 'right';
          const y = canvas.height - 30;
          const x = canvas.width - 30;
          ctx.strokeText(watermarkText, x, y);
          ctx.fillText(watermarkText, x, y);
        }
      }
      // 4. STANDARD RESIZER / COMPRESSOR / ENHANCER
      else {
        canvas.width = targetWidth || img.width;
        canvas.height = targetHeight || img.height;

        // Apply filters
        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blurRadius}px)`;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }

      // Export format & quality
      let format = targetFormat;
      if (toolId === 'jpg-to-png') format = 'image/png';
      if (toolId === 'png-to-jpg') format = 'image/jpeg';
      if (toolId === 'webp-converter') format = 'image/webp';

      const exportQuality = quality / 100;
      canvas.toBlob(
        blob => {
          if (blob) {
            setProcessedSize(blob.size);
            const url = URL.createObjectURL(blob);
            setProcessedUrl(url);
          }
          setIsProcessing(false);
        },
        format,
        exportQuality
      );
    };
    img.src = imageSrc;
  };

  useEffect(() => {
    if (imageSrc) {
      executeProcess();
    }
  }, [imageSrc, quality, targetWidth, targetHeight, brightness, contrast, saturation, blurRadius, watermarkText, watermarkOpacity, watermarkPos, topText, bottomText, memeFontSize, passportType, printGrid, targetFormat]);

  const percentSaved = originalFile && processedSize > 0
    ? Math.max(0, Math.round(((originalFile.size - processedSize) / originalFile.size) * 100))
    : 0;

  return (
    <div className="space-y-6">
      {/* FILE UPLOAD ZONE */}
      {!imageSrc ? (
        <div className="p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-center bg-slate-50/60 dark:bg-slate-900/50">
          <ImageIcon className="w-12 h-12 text-sky-500 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Choose an Image to {toolId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </h3>
          <p className="text-xs text-slate-500 mb-5">Supports JPG, PNG, WebP, GIF, BMP (100% Private Local Browser Processing)</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="img-single-upload"
          />
          <label
            htmlFor="img-single-upload"
            className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-medium text-xs cursor-pointer inline-flex items-center gap-2 transition shadow-sm"
          >
            <Upload className="w-4 h-4" />
            Upload Image File
          </label>
        </div>
      ) : (
        <div className="space-y-6">
          {/* TOP CONTROLS ACCORDING TO SPECIFIC TOOL */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            {/* QUALITY SLIDER FOR COMPRESSOR */}
            {(toolId === 'image-compressor' || toolId === 'image-converter' || toolId === 'webp-converter' || toolId === 'png-to-jpg') && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>Compression Quality: {quality}%</span>
                  <span className="text-slate-500">File Reduction: ~{percentSaved}%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={100}
                  value={quality}
                  onChange={e => setQuality(Number(e.target.value))}
                  className="w-full accent-sky-600"
                />
              </div>
            )}

            {/* RESIZER DIMENSIONS */}
            {(toolId === 'image-resizer' || toolId === 'instagram-post-resizer' || toolId === 'instagram-story-resizer') && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-semibold mb-1">Width (px)</label>
                  <input
                    type="number"
                    value={targetWidth}
                    onChange={e => {
                      const w = Number(e.target.value);
                      setTargetWidth(w);
                      if (lockRatio && originalFile) {
                        setTargetHeight(Math.round(w / (originalFile.width / originalFile.height)));
                      }
                    }}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Height (px)</label>
                  <input
                    type="number"
                    value={targetHeight}
                    onChange={e => {
                      const h = Number(e.target.value);
                      setTargetHeight(h);
                      if (lockRatio && originalFile) {
                        setTargetWidth(Math.round(h * (originalFile.width / originalFile.height)));
                      }
                    }}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1 flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer pb-2 font-medium">
                    <input
                      type="checkbox"
                      checked={lockRatio}
                      onChange={e => setLockRatio(e.target.checked)}
                      className="rounded"
                    />
                    Lock Aspect Ratio
                  </label>
                </div>
              </div>
            )}

            {/* PASSPORT PHOTO MAKER SETTINGS */}
            {(toolId === 'passport-photo-maker' || toolId === 'id-photo-maker') && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1">Passport Standard</label>
                  <select
                    value={passportType}
                    onChange={e => setPassportType(e.target.value as any)}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="indian">Indian Passport (35 x 45 mm / 3.5 x 4.5 cm)</option>
                    <option value="us_visa">US Visa / OCI (2 x 2 inch / 51 x 51 mm)</option>
                    <option value="id_badge">Standard ID Badge (30 x 40 mm)</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => setPrintGrid(!printGrid)}
                    className={`w-full py-2.5 px-3 rounded-lg text-xs font-semibold border transition ${printGrid ? 'bg-sky-600 text-white border-sky-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700'}`}
                  >
                    {printGrid ? '✓ 4x6 Print Sheet (6 Copies)' : 'Generate 4x6 Printable Sheet'}
                  </button>
                </div>
              </div>
            )}

            {/* MEME CONTROLS */}
            {toolId === 'meme-maker' && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Top Caption Text</label>
                    <input
                      type="text"
                      value={topText}
                      onChange={e => setTopText(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Bottom Caption Text</label>
                    <input
                      type="text"
                      value={bottomText}
                      onChange={e => setBottomText(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">Font Size: {memeFontSize}px</span>
                  <input
                    type="range"
                    min={20}
                    max={72}
                    value={memeFontSize}
                    onChange={e => setMemeFontSize(Number(e.target.value))}
                    className="w-48 accent-sky-600"
                  />
                </div>
              </div>
            )}

            {/* WATERMARK CONTROLS */}
            {toolId === 'image-watermark' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-semibold mb-1">Watermark Text</label>
                  <input
                    type="text"
                    value={watermarkText}
                    onChange={e => setWatermarkText(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Opacity ({watermarkOpacity}%)</label>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    value={watermarkOpacity}
                    onChange={e => setWatermarkOpacity(Number(e.target.value))}
                    className="w-full accent-sky-600 mt-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Position</label>
                  <select
                    value={watermarkPos}
                    onChange={e => setWatermarkPos(e.target.value as any)}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="bottom_right">Bottom Right Corner</option>
                    <option value="center">Center</option>
                    <option value="diagonal">Diagonal Pattern</option>
                  </select>
                </div>
              </div>
            )}

            {/* BLUR TOOL */}
            {toolId === 'image-blur-tool' && (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between font-semibold">
                  <span>Blur Intensity: {blurRadius}px</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={25}
                  value={blurRadius}
                  onChange={e => setBlurRadius(Number(e.target.value))}
                  className="w-full accent-sky-600"
                />
              </div>
            )}

            {/* FILTER & QUALITY ENHANCEMENTS */}
            {toolId === 'image-quality-optimizer' && (
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="block font-semibold mb-1">Brightness: {brightness}%</span>
                  <input type="range" min={50} max={180} value={brightness} onChange={e => setBrightness(Number(e.target.value))} className="w-full accent-sky-600" />
                </div>
                <div>
                  <span className="block font-semibold mb-1">Contrast: {contrast}%</span>
                  <input type="range" min={50} max={180} value={contrast} onChange={e => setContrast(Number(e.target.value))} className="w-full accent-sky-600" />
                </div>
                <div>
                  <span className="block font-semibold mb-1">Saturation: {saturation}%</span>
                  <input type="range" min={0} max={200} value={saturation} onChange={e => setSaturation(Number(e.target.value))} className="w-full accent-sky-600" />
                </div>
              </div>
            )}

            {/* TARGET FORMAT CONVERTER */}
            {toolId === 'image-converter' && (
              <div className="text-xs">
                <label className="block font-semibold mb-1">Target Output Format</label>
                <select
                  value={targetFormat}
                  onChange={e => setTargetFormat(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  <option value="image/jpeg">JPG / JPEG (Standard Photos)</option>
                  <option value="image/png">PNG (Lossless & Transparent)</option>
                  <option value="image/webp">WebP (Lightweight Modern Web)</option>
                </select>
              </div>
            )}
          </div>

          {/* SIDE-BY-SIDE STATS & PREVIEW */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <div className="text-xs font-semibold text-slate-500 mb-2">Original Image</div>
              <div className="max-h-64 flex items-center justify-center overflow-hidden rounded-lg bg-slate-200/40 dark:bg-slate-800/40 p-2">
                <img src={imageSrc} alt="Original preview" className="max-h-56 object-contain rounded" />
              </div>
              {originalFile && (
                <div className="mt-3 text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{(originalFile.size / 1024).toFixed(1)} KB</span> • {originalFile.width}x{originalFile.height}px
                </div>
              )}
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <div className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-2 flex items-center justify-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Processed Output
              </div>
              <div className="max-h-64 flex items-center justify-center overflow-hidden rounded-lg bg-slate-200/40 dark:bg-slate-800/40 p-2">
                {processedUrl ? (
                  <img src={processedUrl} alt="Processed preview" className="max-h-56 object-contain rounded shadow-sm" />
                ) : (
                  <span className="text-xs text-slate-400">Rendering...</span>
                )}
              </div>
              {processedSize > 0 && (
                <div className="mt-3 text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{(processedSize / 1024).toFixed(1)} KB</span>
                  {percentSaved > 0 && <span className="ml-2 font-semibold text-emerald-600">({percentSaved}% smaller)</span>}
                </div>
              )}
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-3">
              {processedUrl && (
                <a
                  href={processedUrl}
                  download={`ai-saathi-${originalFile?.name || 'image'}`}
                  className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-sm transition flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Processed Image
                </a>
              )}
            </div>

            <button
              onClick={() => {
                setImageSrc(null);
                setProcessedUrl(null);
              }}
              className="px-4 py-2 text-xs font-medium text-slate-500 hover:text-red-500 transition"
            >
              Upload Different Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
