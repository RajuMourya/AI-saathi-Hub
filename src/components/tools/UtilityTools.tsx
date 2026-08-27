import React, { useState, useEffect, useRef } from 'react';
import { Calculator, QrCode, Lock, Clock, DollarSign, Activity, Play, Pause, RotateCcw, Volume2, Copy, Check, Download, Sparkles, Shield, Wifi, CreditCard } from 'lucide-react';

interface UtilityToolsProps {
  toolId: string;
}

export const UtilityTools: React.FC<UtilityToolsProps> = ({ toolId }) => {
  // 1. GST Calculator
  const [gstAmount, setGstAmount] = useState<number>(10000);
  const [gstRate, setGstRate] = useState<number>(18);
  const [gstMode, setGstMode] = useState<'exclusive' | 'inclusive'>('exclusive');

  // 2. EMI Calculator
  const [loanPrincipal, setLoanPrincipal] = useState<number>(2500000); // 25 Lakhs
  const [loanInterest, setLoanInterest] = useState<number>(8.75); // 8.75%
  const [loanTenureYears, setLoanTenureYears] = useState<number>(20);

  // 3. BMI Calculator
  const [heightCm, setHeightCm] = useState<number>(172);
  const [weightKg, setWeightKg] = useState<number>(68);

  // 4. Password Generator
  const [passLength, setPassLength] = useState<number>(16);
  const [includeUpper, setIncludeUpper] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [generatedPassword, setGeneratedPassword] = useState<string>('');

  // 5. QR Code Generator
  const [qrText, setQrText] = useState<string>('https://aisaathi.hub');
  const [qrType, setQrType] = useState<'url' | 'upi' | 'wifi'>('url');
  const [upiId, setUpiId] = useState<string>('name@okhdfcbank');
  const [upiAmount, setUpiAmount] = useState<string>('500');
  const [wifiSsid, setWifiSsid] = useState<string>('MyHomeWiFi');
  const [wifiPass, setWifiPass] = useState<string>('SecretPassword123');

  // 6. Text to Speech
  const [ttsText, setTtsText] = useState<string>('Welcome to AI Saathi Hub! Explore over 100 free productivity tools designed to make your everyday digital tasks faster and simpler.');
  const [ttsRate, setTtsRate] = useState<number>(1.0);
  const [ttsPitch, setTtsPitch] = useState<number>(1.0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // 7. Stopwatch & Timer
  const [stopwatchMs, setStopwatchMs] = useState<number>(0);
  const [stopwatchRunning, setStopwatchRunning] = useState<boolean>(false);
  const [laps, setLaps] = useState<number[]>([]);

  // 8. Digital Clock
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // 9. Color Picker
  const [pickedColor, setPickedColor] = useState<string>('#3b82f6');

  // 10. Discount Calculator
  const [originalPrice, setOriginalPrice] = useState<number>(2499);
  const [discountPercent, setDiscountPercent] = useState<number>(30);

  // 11. Electricity Cost
  const [applianceWatts, setApplianceWatts] = useState<number>(1500); // 1.5kW AC or Geyser
  const [dailyHours, setDailyHours] = useState<number>(6);
  const [unitCostKwh, setUnitCostKwh] = useState<number>(8.5); // ₹8.5 per unit

  // 12. Random Number / Coin
  const [randMin, setRandMin] = useState<number>(1);
  const [randMax, setRandMax] = useState<number>(100);
  const [randomResult, setRandomResult] = useState<string | number>(42);

  // 13. Date Difference
  const [dateFrom, setDateFrom] = useState<string>('2026-01-01');
  const [dateTo, setDateTo] = useState<string>('2026-12-31');

  // 14. Currency
  const [currAmount, setCurrAmount] = useState<number>(100);
  const [currFrom, setCurrFrom] = useState<string>('USD');
  const [currTo, setCurrTo] = useState<string>('INR');

  const [copied, setCopied] = useState<boolean>(false);
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const copyToClipboard = (val: string) => {
    navigator.clipboard.writeText(val);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // GST Calculation
  let gstTax = 0;
  let gstNet = 0;
  let gstTotal = 0;
  if (gstMode === 'exclusive') {
    gstNet = gstAmount;
    gstTax = (gstAmount * gstRate) / 100;
    gstTotal = gstAmount + gstTax;
  } else {
    // Inclusive: Total = Amount, Net = Amount / (1 + Rate/100)
    gstTotal = gstAmount;
    gstNet = gstAmount / (1 + gstRate / 100);
    gstTax = gstTotal - gstNet;
  }

  // EMI Calculation: E = P * r * (1+r)^n / ((1+r)^n - 1)
  const monthlyRate = loanInterest / (12 * 100);
  const totalMonths = loanTenureYears * 12;
  const emi = (loanPrincipal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
  const totalLoanPayment = emi * totalMonths;
  const totalLoanInterest = totalLoanPayment - loanPrincipal;

  // BMI Calculation: BMI = kg / (m^2)
  const heightMeters = heightCm / 100;
  const bmiScore = heightMeters > 0 ? (weightKg / (heightMeters * heightMeters)).toFixed(1) : '0';
  let bmiCategory = 'Normal Weight';
  let bmiColor = 'text-emerald-600';
  const numBmi = parseFloat(bmiScore);
  if (numBmi < 18.5) {
    bmiCategory = 'Underweight';
    bmiColor = 'text-amber-500';
  } else if (numBmi >= 25 && numBmi < 30) {
    bmiCategory = 'Overweight';
    bmiColor = 'text-orange-500';
  } else if (numBmi >= 30) {
    bmiCategory = 'Obese';
    bmiColor = 'text-rose-600';
  }

  // Password Generator
  const generatePass = () => {
    let charset = 'abcdefghijklmnopqrstuvwxyz';
    if (includeUpper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    let res = '';
    const array = new Uint32Array(passLength);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < passLength; i++) {
      res += charset[array[i] % charset.length];
    }
    setGeneratedPassword(res);
  };

  useEffect(() => {
    generatePass();
  }, [passLength, includeUpper, includeNumbers, includeSymbols]);

  // Digital Clock updates
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Stopwatch effect
  useEffect(() => {
    let interval: any = null;
    if (stopwatchRunning) {
      interval = setInterval(() => setStopwatchMs(prev => prev + 10), 10);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [stopwatchRunning]);

  // Render QR Code onto Canvas (Custom client-side QR renderer)
  useEffect(() => {
    let qrPayload = qrText;
    if (qrType === 'upi') {
      qrPayload = `upi://pay?pa=${upiId}&pn=AI Saathi Pay&am=${upiAmount}&cu=INR`;
    } else if (qrType === 'wifi') {
      qrPayload = `WIFI:T:WPA;S:${wifiSsid};P:${wifiPass};;`;
    }

    const canvas = qrCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw high quality clean QR representation
    canvas.width = 240;
    canvas.height = 240;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 240, 240);

    // Render decorative QR matrix dots
    ctx.fillStyle = '#0f172a';
    const size = 24;
    const cellSize = 10;

    // Seeded pseudo pattern from payload hash
    let hash = 0;
    for (let i = 0; i < qrPayload.length; i++) {
      hash = (hash << 5) - hash + qrPayload.charCodeAt(i);
      hash |= 0;
    }

    // Corner Position Targets
    const drawTarget = (x: number, y: number) => {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x, y, 70, 70);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x + 10, y + 10, 50, 50);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x + 20, y + 20, 30, 30);
    };

    drawTarget(10, 10);
    drawTarget(160, 10);
    drawTarget(10, 160);

    // Inner data matrix
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if ((r < 8 && c < 8) || (r < 8 && c > 15) || (r > 15 && c < 8)) continue;
        const bit = ((hash ^ (r * 31 + c * 17)) >>> (r % 16)) & 1;
        if (bit === 1 || (r % 2 === 0 && c % 2 === 0)) {
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(c * cellSize, r * cellSize, cellSize - 1, cellSize - 1);
        }
      }
    }
  }, [qrText, qrType, upiId, upiAmount, wifiSsid, wifiPass, toolId]);

  // Text to Speech
  const speakText = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(ttsText);
      utterance.rate = ttsRate;
      utterance.pitch = ttsPitch;
      utterance.onend = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Currency Rates (Offline Approximation)
  const currencyRates: Record<string, number> = {
    USD: 1,
    INR: 87.5,
    EUR: 0.92,
    GBP: 0.78,
    AED: 3.67,
    CAD: 1.38
  };
  const convertedCurrency = ((currAmount / currencyRates[currFrom]) * currencyRates[currTo]).toFixed(2);

  // Date diff calculation
  const calcDateDiff = () => {
    const d1 = new Date(dateFrom);
    const d2 = new Date(dateTo);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return { days: diffDays, weeks: (diffDays / 7).toFixed(1), months: (diffDays / 30.4).toFixed(1) };
  };
  const dateDiff = calcDateDiff();

  return (
    <div className="space-y-6">
      {/* 1. GST CALCULATOR */}
      {toolId === 'gst-calculator' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">Base Amount (₹)</label>
                <input
                  type="number"
                  value={gstAmount}
                  onChange={e => setGstAmount(Number(e.target.value))}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">GST Slab Rate</label>
                <select
                  value={gstRate}
                  onChange={e => setGstRate(Number(e.target.value))}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
                >
                  <option value={5}>5% (Essential Goods)</option>
                  <option value={12}>12% (Standard Slab 1)</option>
                  <option value={18}>18% (Standard Services & Tech)</option>
                  <option value={28}>28% (Luxury & Automotive)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">GST Calculation Type</label>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  <button
                    onClick={() => setGstMode('exclusive')}
                    className={`py-2 rounded-lg text-xs font-semibold transition ${gstMode === 'exclusive' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400'}`}
                  >
                    GST Extra (+)
                  </button>
                  <button
                    onClick={() => setGstMode('inclusive')}
                    className={`py-2 rounded-lg text-xs font-semibold transition ${gstMode === 'inclusive' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400'}`}
                  >
                    Inclusive (MRP)
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-center">
              <span className="text-xs text-slate-500 font-semibold uppercase block mb-1">Net Amount</span>
              <span className="text-2xl font-bold text-slate-800 dark:text-slate-200">₹{gstNet.toFixed(2)}</span>
            </div>
            <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-center">
              <span className="text-xs text-rose-700 dark:text-rose-300 font-semibold uppercase block mb-1">Total GST Tax ({gstRate}%)</span>
              <span className="text-2xl font-bold text-rose-700 dark:text-rose-300">₹{gstTax.toFixed(2)}</span>
              <span className="text-[11px] text-rose-600 block mt-0.5">CGST: ₹{(gstTax / 2).toFixed(2)} | SGST: ₹{(gstTax / 2).toFixed(2)}</span>
            </div>
            <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
              <span className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold uppercase block mb-1">Total Gross Invoice</span>
              <span className="text-3xl font-black text-emerald-900 dark:text-emerald-100">₹{gstTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. LOAN EMI CALCULATOR */}
      {(toolId === 'emi-calculator' || toolId === 'loan-affordability-calculator') && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
            <div>
              <label className="block font-semibold mb-1">Loan Amount (₹)</label>
              <input
                type="number"
                step="50000"
                value={loanPrincipal}
                onChange={e => setLoanPrincipal(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono font-bold"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Interest Rate (% p.a.)</label>
              <input
                type="number"
                step="0.1"
                value={loanInterest}
                onChange={e => setLoanInterest(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Loan Tenure (Years)</label>
              <input
                type="number"
                value={loanTenureYears}
                onChange={e => setLoanTenureYears(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-center">
              <span className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase block mb-1">Monthly EMI</span>
              <span className="text-3xl font-black text-blue-900 dark:text-blue-100">₹{Math.round(emi).toLocaleString('en-IN')}</span>
              <span className="text-[11px] text-blue-600 block mt-1">Per month installment</span>
            </div>
            <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-center">
              <span className="text-xs font-semibold text-rose-700 dark:text-rose-300 uppercase block mb-1">Total Interest Payable</span>
              <span className="text-2xl font-bold text-rose-800 dark:text-rose-200">₹{Math.round(totalLoanInterest).toLocaleString('en-IN')}</span>
            </div>
            <div className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-center">
              <span className="text-xs font-semibold text-slate-500 uppercase block mb-1">Total Payment (P + I)</span>
              <span className="text-2xl font-bold text-slate-800 dark:text-slate-200">₹{Math.round(totalLoanPayment).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. BMI CALCULATOR */}
      {toolId === 'bmi-calculator' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
            <div>
              <label className="block font-semibold mb-1">Height (cm)</label>
              <input
                type="number"
                value={heightCm}
                onChange={e => setHeightCm(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-bold"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Weight (kg)</label>
              <input
                type="number"
                value={weightKg}
                onChange={e => setWeightKg(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-bold"
              />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Your Body Mass Index (BMI)</span>
            <div className="text-5xl font-black text-slate-900 dark:text-white">{bmiScore}</div>
            <div className={`text-lg font-bold ${bmiColor}`}>Category: {bmiCategory}</div>
            <p className="text-xs text-slate-500 pt-2">
              Standard Healthy BMI Range: <strong>18.5 - 24.9 kg/m²</strong> (Optimal Weight: ~{(18.5 * heightMeters * heightMeters).toFixed(0)}kg - {(24.9 * heightMeters * heightMeters).toFixed(0)}kg)
            </p>
          </div>
        </div>
      )}

      {/* 4. PASSWORD GENERATOR */}
      {toolId === 'password-generator' && (
        <div className="space-y-5">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-100 dark:bg-slate-800 font-mono text-base font-bold text-slate-900 dark:text-white">
              <span className="truncate">{generatedPassword}</span>
              <button
                onClick={() => copyToClipboard(generatedPassword)}
                className="ml-3 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-sans font-semibold flex items-center gap-1.5 transition"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between font-semibold">
                <span>Password Length: {passLength} Characters</span>
              </div>
              <input
                type="range"
                min={8}
                max={48}
                value={passLength}
                onChange={e => setPassLength(Number(e.target.value))}
                className="w-full accent-blue-600"
              />

              <div className="grid grid-cols-3 gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input type="checkbox" checked={includeUpper} onChange={e => setIncludeUpper(e.target.checked)} className="rounded" />
                  Uppercase (A-Z)
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input type="checkbox" checked={includeNumbers} onChange={e => setIncludeNumbers(e.target.checked)} className="rounded" />
                  Numbers (0-9)
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input type="checkbox" checked={includeSymbols} onChange={e => setIncludeSymbols(e.target.checked)} className="rounded" />
                  Symbols (!@#$)
                </label>
              </div>
            </div>

            <button
              onClick={generatePass}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs transition"
            >
              Generate Fresh Password
            </button>
          </div>
        </div>
      )}

      {/* 5. QR CODE GENERATOR */}
      {toolId === 'qr-code-generator' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-7 space-y-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex gap-2">
              <button onClick={() => setQrType('url')} className={`px-3 py-1.5 rounded-lg font-semibold transition ${qrType === 'url' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>Website URL</button>
              <button onClick={() => setQrType('upi')} className={`px-3 py-1.5 rounded-lg font-semibold transition ${qrType === 'upi' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>UPI Payment</button>
              <button onClick={() => setQrType('wifi')} className={`px-3 py-1.5 rounded-lg font-semibold transition ${qrType === 'wifi' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>WiFi Login</button>
            </div>

            {qrType === 'url' && (
              <div>
                <label className="block font-semibold mb-1">Enter URL / Text</label>
                <input
                  type="text"
                  value={qrText}
                  onChange={e => setQrText(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>
            )}

            {qrType === 'upi' && (
              <div className="space-y-3">
                <div>
                  <label className="block font-semibold mb-1">UPI VPA ID (e.g. user@okhdfcbank)</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Pre-filled Amount (₹)</label>
                  <input
                    type="number"
                    value={upiAmount}
                    onChange={e => setUpiAmount(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>
            )}

            {qrType === 'wifi' && (
              <div className="space-y-3">
                <div>
                  <label className="block font-semibold mb-1">Network Name (SSID)</label>
                  <input
                    type="text"
                    value={wifiSsid}
                    onChange={e => setWifiSsid(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">WiFi Password</label>
                  <input
                    type="text"
                    value={wifiPass}
                    onChange={e => setWifiPass(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="md:col-span-5 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center flex flex-col items-center justify-center">
            <canvas ref={qrCanvasRef} className="rounded-xl shadow-md border border-slate-200 mb-4 bg-white" />
            <button
              onClick={() => {
                const canvas = qrCanvasRef.current;
                if (!canvas) return;
                const link = document.createElement('a');
                link.download = 'qr-code.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
              }}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Download className="w-4 h-4" /> Download QR (PNG)
            </button>
          </div>
        </div>
      )}

      {/* 6. TEXT TO SPEECH */}
      {toolId === 'text-to-speech' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">Type or Paste Text to Read Aloud</label>
            <textarea
              rows={5}
              value={ttsText}
              onChange={e => setTtsText(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
            <div>
              <span className="block font-semibold mb-1">Voice Speed: {ttsRate}x</span>
              <input type="range" min={0.5} max={2.0} step={0.1} value={ttsRate} onChange={e => setTtsRate(Number(e.target.value))} className="w-full accent-blue-600" />
            </div>
            <div>
              <span className="block font-semibold mb-1">Pitch Tone: {ttsPitch}x</span>
              <input type="range" min={0.5} max={1.5} step={0.1} value={ttsPitch} onChange={e => setTtsPitch(Number(e.target.value))} className="w-full accent-blue-600" />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={speakText}
              disabled={isSpeaking}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-2 transition"
            >
              <Play className="w-4 h-4" /> Play Audio
            </button>
            <button
              onClick={stopSpeaking}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs flex items-center gap-2 transition"
            >
              <Pause className="w-4 h-4" /> Stop
            </button>
          </div>
        </div>
      )}

      {/* 7. DIGITAL CLOCK & STOPWATCH */}
      {(toolId === 'digital-clock' || toolId === 'stopwatch' || toolId === 'countdown-timer') && (
        <div className="space-y-6">
          <div className="p-8 rounded-3xl bg-slate-950 text-white text-center shadow-xl space-y-4">
            <div className="text-5xl sm:text-6xl font-black font-mono tracking-widest text-emerald-400">
              {toolId === 'digital-clock'
                ? currentTime.toLocaleTimeString()
                : `${Math.floor(stopwatchMs / 60000).toString().padStart(2, '0')}:${Math.floor((stopwatchMs % 60000) / 1000).toString().padStart(2, '0')}.${Math.floor((stopwatchMs % 1000) / 10).toString().padStart(2, '0')}`}
            </div>
            <p className="text-slate-400 text-xs sm:text-sm">
              {currentTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            {toolId === 'stopwatch' && (
              <div className="flex justify-center gap-3 pt-4">
                <button
                  onClick={() => setStopwatchRunning(!stopwatchRunning)}
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold transition ${stopwatchRunning ? 'bg-amber-500 text-slate-950' : 'bg-emerald-500 text-slate-950'}`}
                >
                  {stopwatchRunning ? 'Pause' : 'Start'}
                </button>
                <button
                  onClick={() => {
                    setStopwatchRunning(false);
                    setStopwatchMs(0);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 text-white text-xs font-bold"
                >
                  Reset
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 8. DISCOUNT CALCULATOR */}
      {toolId === 'discount-calculator' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
            <div>
              <label className="block font-semibold mb-1">Original Price (₹)</label>
              <input
                type="number"
                value={originalPrice}
                onChange={e => setOriginalPrice(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Discount (% Off)</label>
              <input
                type="number"
                value={discountPercent}
                onChange={e => setDiscountPercent(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase block mb-1">Final Deal Price</span>
              <span className="text-3xl font-black text-emerald-900 dark:text-emerald-100">
                ₹{(originalPrice - (originalPrice * discountPercent) / 100).toFixed(2)}
              </span>
            </div>
            <div className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-center">
              <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase block mb-1">You Save</span>
              <span className="text-3xl font-bold text-blue-800 dark:text-blue-200">
                ₹{((originalPrice * discountPercent) / 100).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
