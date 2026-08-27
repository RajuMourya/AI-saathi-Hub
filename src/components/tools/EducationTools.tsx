import React, { useState, useEffect } from 'react';
import { Calculator, GraduationCap, Clock, Calendar, Check, ArrowRight, RotateCcw, Percent, BookOpen } from 'lucide-react';

interface EducationToolsProps {
  toolId: string;
}

export const EducationTools: React.FC<EducationToolsProps> = ({ toolId }) => {
  // 1. Percentage
  const [percentVal, setPercentVal] = useState<number>(18);
  const [totalVal, setTotalVal] = useState<number>(500);

  // 2. Marks & Division
  const [obtainedMarks, setObtainedMarks] = useState<number>(420);
  const [maxMarks, setMaxMarks] = useState<number>(500);

  // 3. GPA
  const [courses, setCourses] = useState<{ id: string; name: string; credit: number; gradePoint: number }[]>([
    { id: '1', name: 'Mathematics', credit: 4, gradePoint: 9 },
    { id: '2', name: 'Physics', credit: 3, gradePoint: 8 },
    { id: '3', name: 'Programming', credit: 4, gradePoint: 10 },
    { id: '4', name: 'English', credit: 2, gradePoint: 8 }
  ]);

  // 4. Age Calculator
  const [birthDate, setBirthDate] = useState<string>('2000-01-15');
  const [ageDetails, setAgeDetails] = useState<{ years: number; months: number; days: number; nextBirthdayDays: number } | null>(null);

  // 5. Attendance Calculator
  const [totalClasses, setTotalClasses] = useState<number>(40);
  const [attendedClasses, setAttendedClasses] = useState<number>(32);
  const [requiredPercent, setRequiredPercent] = useState<number>(75);

  // 6. Simple / Compound Interest
  const [principal, setPrincipal] = useState<number>(100000);
  const [rate, setRate] = useState<number>(7.5);
  const [timeYears, setTimeYears] = useState<number>(3);
  const [compoundFrequency, setCompoundFrequency] = useState<number>(1); // 1 = yearly, 4 = quarterly, 12 = monthly

  // 7. Roman numerals
  const [numInput, setNumInput] = useState<number>(2026);
  const [romanInput, setRomanInput] = useState<string>('MMXXVI');

  // 8. Number to Words
  const [amountInput, setAmountInput] = useState<number>(45850);
  const [numberFormatStyle, setNumberFormatStyle] = useState<'indian' | 'international'>('indian');

  // 9. Unit Converter
  const [unitCategory, setUnitCategory] = useState<'length' | 'weight' | 'temp' | 'data'>('length');
  const [unitFromVal, setUnitFromVal] = useState<number>(100);
  const [unitFrom, setUnitFrom] = useState<string>('meters');
  const [unitTo, setUnitTo] = useState<string>('feet');

  // 10. Multiplication Table
  const [tableNumber, setTableNumber] = useState<number>(17);

  // AGE CALCULATION EFFECT
  useEffect(() => {
    if (!birthDate) return;
    const dob = new Date(birthDate);
    const today = new Date();
    if (isNaN(dob.getTime())) return;

    let y = today.getFullYear() - dob.getFullYear();
    let m = today.getMonth() - dob.getMonth();
    let d = today.getDate() - dob.getDate();

    if (d < 0) {
      m -= 1;
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      d += prevMonth.getDate();
    }
    if (m < 0) {
      y -= 1;
      m += 12;
    }

    // Next birthday
    let nextBday = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
    if (nextBday < today) {
      nextBday = new Date(today.getFullYear() + 1, dob.getMonth(), dob.getDate());
    }
    const diffMs = nextBday.getTime() - today.getTime();
    const nextDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    setAgeDetails({ years: y, months: m, days: d, nextBirthdayDays: nextDays });
  }, [birthDate]);

  // GPA Calculation
  const totalCredits = courses.reduce((acc, c) => acc + (c.credit || 0), 0);
  const totalPoints = courses.reduce((acc, c) => acc + (c.credit * c.gradePoint || 0), 0);
  const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';

  // Attendance logic
  const currentAttendance = totalClasses > 0 ? ((attendedClasses / totalClasses) * 100) : 0;
  // classes needed to reach required%
  // (attended + x) / (total + x) >= req / 100
  // attended + x >= (req/100)*total + (req/100)*x
  // x*(1 - req/100) >= (req/100)*total - attended
  let classesToAttend = 0;
  let classesCanBunk = 0;
  const targetFraction = requiredPercent / 100;
  if (currentAttendance < requiredPercent) {
    classesToAttend = Math.ceil((targetFraction * totalClasses - attendedClasses) / (1 - targetFraction));
  } else {
    // how many can bunk
    // attended / (total + y) >= req / 100 => attended / targetFraction - total >= y
    classesCanBunk = Math.floor(attendedClasses / targetFraction - totalClasses);
  }

  // Simple Interest
  const simpleInterest = (principal * rate * timeYears) / 100;
  const simpleTotal = principal + simpleInterest;

  // Compound Interest: A = P(1 + r/n)^(nt)
  const compTotal = principal * Math.pow(1 + (rate / 100) / compoundFrequency, compoundFrequency * timeYears);
  const compInterest = compTotal - principal;

  // Roman to Int & Int to Roman
  const intToRoman = (num: number): string => {
    if (num < 1 || num > 3999) return 'Out of range (1-3999)';
    const lookup: Record<string, number> = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 };
    let roman = '';
    for (const i in lookup) {
      while (num >= lookup[i]) {
        roman += i;
        num -= lookup[i];
      }
    }
    return roman;
  };

  const romanToInt = (s: string): number => {
    const map: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
    let total = 0;
    const str = s.toUpperCase();
    for (let i = 0; i < str.length; i++) {
      const cur = map[str[i]] || 0;
      const next = map[str[i + 1]] || 0;
      if (cur < next) {
        total -= cur;
      } else {
        total += cur;
      }
    }
    return total;
  };

  // Number to Indian Words
  const numberToWordsIndian = (num: number): string => {
    if (num === 0) return 'Zero';
    const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const formatHundreds = (n: number) => {
      let str = '';
      if (n > 99) {
        str += a[Math.floor(n / 100)] + ' Hundred ';
        n %= 100;
      }
      if (n > 19) {
        str += b[Math.floor(n / 10)] + ' ' + a[n % 10];
      } else if (n > 0) {
        str += a[n];
      }
      return str.trim();
    };

    let result = '';
    const crore = Math.floor(num / 10000000);
    num %= 10000000;
    const lakh = Math.floor(num / 100000);
    num %= 100000;
    const thousand = Math.floor(num / 1000);
    num %= 1000;
    const remainder = num;

    if (crore) result += formatHundreds(crore) + ' Crore ';
    if (lakh) result += formatHundreds(lakh) + ' Lakh ';
    if (thousand) result += formatHundreds(thousand) + ' Thousand ';
    if (remainder) result += formatHundreds(remainder);

    return result.trim() + ' Rupees Only';
  };

  return (
    <div className="space-y-6">
      {/* 1. PERCENTAGE CALCULATOR */}
      {toolId === 'percentage-calculator' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">Percentage (%)</label>
              <input
                type="number"
                value={percentVal}
                onChange={e => setPercentVal(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">Of Total Value</label>
              <input
                type="number"
                value={totalVal}
                onChange={e => setTotalVal(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-center">
              <span className="text-xs text-blue-700 dark:text-blue-300 block font-semibold">{percentVal}% of {totalVal}</span>
              <span className="text-2xl font-black text-blue-900 dark:text-blue-100">{((percentVal / 100) * totalVal).toFixed(2)}</span>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
              <span className="text-xs text-emerald-700 dark:text-emerald-300 block font-semibold">Adding {percentVal}%</span>
              <span className="text-2xl font-black text-emerald-900 dark:text-emerald-100">{(totalVal + (percentVal / 100) * totalVal).toFixed(2)}</span>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-center">
              <span className="text-xs text-amber-700 dark:text-amber-300 block font-semibold">Subtracting {percentVal}%</span>
              <span className="text-2xl font-black text-amber-900 dark:text-amber-100">{(totalVal - (percentVal / 100) * totalVal).toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. AGE CALCULATOR */}
      {toolId === 'age-calculator' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Select Date of Birth (DOB)</label>
            <input
              type="date"
              value={birthDate}
              onChange={e => setBirthDate(e.target.value)}
              className="w-full sm:w-64 p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold"
            />
          </div>

          {ageDetails && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-center">
                <span className="text-xs text-slate-500 block font-semibold">Years</span>
                <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">{ageDetails.years}</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-center">
                <span className="text-xs text-slate-500 block font-semibold">Months</span>
                <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-200">{ageDetails.months}</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-center">
                <span className="text-xs text-slate-500 block font-semibold">Days</span>
                <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-200">{ageDetails.days}</span>
              </div>
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-center">
                <span className="text-xs text-rose-600 dark:text-rose-400 block font-semibold">Next Birthday</span>
                <span className="text-2xl font-extrabold text-rose-700 dark:text-rose-300">{ageDetails.nextBirthdayDays} Days</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. ATTENDANCE CALCULATOR */}
      {toolId === 'attendance-calculator' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
            <div>
              <label className="block font-semibold mb-1">Total Classes Held</label>
              <input
                type="number"
                value={totalClasses}
                onChange={e => setTotalClasses(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Classes Attended</label>
              <input
                type="number"
                value={attendedClasses}
                onChange={e => setAttendedClasses(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Required Criteria (%)</label>
              <input
                type="number"
                value={requiredPercent}
                onChange={e => setRequiredPercent(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
              />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Current Attendance Status:</span>
              <span className={`text-xl font-bold ${currentAttendance >= requiredPercent ? 'text-emerald-600' : 'text-red-600'}`}>
                {currentAttendance.toFixed(1)}%
              </span>
            </div>

            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full rounded-full ${currentAttendance >= requiredPercent ? 'bg-emerald-500' : 'bg-red-500'}`}
                style={{ width: `${Math.min(100, currentAttendance)}%` }}
              />
            </div>

            <div className="pt-2 text-sm">
              {currentAttendance >= requiredPercent ? (
                <div className="p-3 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 rounded-xl font-medium">
                  🎉 You are safe! You can bunk up to <strong>{classesCanBunk} more classes</strong> and still maintain your {requiredPercent}% requirement.
                </div>
              ) : (
                <div className="p-3 bg-red-100 dark:bg-red-950/50 text-red-900 dark:text-red-200 rounded-xl font-medium">
                  ⚠️ Attendance low! You must attend <strong>{classesToAttend} consecutive classes</strong> to reach {requiredPercent}%.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. SIMPLE & COMPOUND INTEREST */}
      {(toolId === 'simple-interest-calculator' || toolId === 'compound-interest-calculator') && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
            <div>
              <label className="block font-semibold mb-1">Principal Amount (₹)</label>
              <input
                type="number"
                value={principal}
                onChange={e => setPrincipal(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Annual Interest Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={rate}
                onChange={e => setRate(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Duration (Years)</label>
              <input
                type="number"
                value={timeYears}
                onChange={e => setTimeYears(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-xl text-center">
              <span className="text-xs text-slate-500 font-semibold block">Principal Investment</span>
              <span className="text-xl font-bold text-slate-800 dark:text-slate-200">₹{principal.toLocaleString('en-IN')}</span>
            </div>
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-center">
              <span className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold block">Total Interest Earned</span>
              <span className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
                ₹{Math.round(toolId === 'simple-interest-calculator' ? simpleInterest : compInterest).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl text-center">
              <span className="text-xs text-blue-700 dark:text-blue-300 font-semibold block">Maturity Total Amount</span>
              <span className="text-2xl font-black text-blue-900 dark:text-blue-100">
                ₹{Math.round(toolId === 'simple-interest-calculator' ? simpleTotal : compTotal).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 5. NUMBER TO WORDS (INDIAN LAKHS & CRORES) */}
      {toolId === 'number-to-words' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Enter Number / Amount (₹)</label>
            <input
              type="number"
              value={amountInput}
              onChange={e => setAmountInput(Number(e.target.value))}
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-lg font-bold font-mono"
            />
          </div>

          <div className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
            <span className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase block mb-1">In Words (Official / Cheque Format):</span>
            <p className="text-lg font-semibold text-blue-900 dark:text-blue-100">{numberToWordsIndian(amountInput)}</p>
          </div>
        </div>
      )}

      {/* 6. MULTIPLICATION TABLE */}
      {toolId === 'multiplication-tables' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-semibold">Table Number:</span>
            <input
              type="number"
              min={1}
              max={100}
              value={tableNumber}
              onChange={e => setTableNumber(Number(e.target.value))}
              className="w-24 p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-center font-bold"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-sm">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-slate-500">{tableNumber} × {i + 1} = </span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{tableNumber * (i + 1)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. ROMAN NUMERALS */}
      {toolId === 'roman-numeral-converter' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div>
            <label className="block text-xs font-semibold mb-1">Standard Number (1-3999)</label>
            <input
              type="number"
              value={numInput}
              onChange={e => {
                const val = Number(e.target.value);
                setNumInput(val);
                setRomanInput(intToRoman(val));
              }}
              className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Roman Numeral</label>
            <input
              type="text"
              value={romanInput}
              onChange={e => {
                const r = e.target.value.toUpperCase();
                setRomanInput(r);
                setNumInput(romanToInt(r));
              }}
              className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono font-bold"
            />
          </div>
        </div>
      )}
    </div>
  );
};
