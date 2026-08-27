import React, { useState } from 'react';
import { Briefcase, Download, Printer, User, Mail, Phone, MapPin, Globe, Plus, Trash2, Check, Sparkles, Building, DollarSign } from 'lucide-react';

interface CareerToolsProps {
  toolId: string;
}

export const CareerTools: React.FC<CareerToolsProps> = ({ toolId }) => {
  // RESUME BUILDER STATE
  const [resumeData, setResumeData] = useState({
    name: 'Rahul Sharma',
    title: 'Senior Software Developer',
    email: 'rahul.sharma@example.com',
    phone: '+91 98765 43210',
    location: 'Bengaluru, India',
    linkedin: 'linkedin.com/in/rahulsharma',
    summary: 'Results-driven Software Engineer with 4+ years of expertise in building performant, accessible web applications and microservices.',
    skills: ['TypeScript', 'React.js', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Docker', 'Git'],
    experience: [
      { id: '1', role: 'Full Stack Engineer', company: 'TechNova Solutions', duration: '2022 - Present', desc: 'Led a team of 4 engineers in migrating monolithic UI to high-performance SPA, boosting page load speeds by 40%.' },
      { id: '2', role: 'Junior Web Developer', company: 'Apex Digital Labs', duration: '2020 - 2022', desc: 'Developed responsive interfaces for over 15 high-traffic client websites and built reusable React components.' }
    ],
    education: [
      { id: '1', degree: 'B.Tech in Computer Science & Engineering', school: 'National Institute of Technology', year: '2016 - 2020' }
    ]
  });

  const [resumeTheme, setResumeTheme] = useState<'modern' | 'classic' | 'minimal'>('modern');

  // SALARY CALCULATOR STATE
  const [annualCtc, setAnnualCtc] = useState<number>(1200000); // 12 LPA default
  const [regime, setRegime] = useState<'new' | 'old'>('new');

  // COVER LETTER STATE
  const [coverJob, setCoverJob] = useState('Frontend Developer');
  const [coverCompany, setCoverCompany] = useState('Google Cloud');
  const [coverExpYears, setCoverExpYears] = useState('4');

  // EXPERIENCE CALCULATOR
  const [expStart, setExpStart] = useState('2021-06-01');
  const [expEnd, setExpEnd] = useState('2026-08-01');

  const printResume = () => {
    window.print();
  };

  // Salary calculations (India CTC Model with standard ₹75,000 deduction)
  const basicSalary = annualCtc * 0.40; // 40% of CTC
  const epfAnnual = Math.min(basicSalary * 0.12, 180000); // 12% EPF
  const professionalTax = 2400; // standard PT ~200/mo
  const standardDeduction = 75000;

  // Simplified Tax Slab (New Regime FY 2024-2025/26)
  const taxableIncome = Math.max(0, annualCtc - standardDeduction);
  let estimatedTaxAnnual = 0;
  if (taxableIncome > 1500000) {
    estimatedTaxAnnual = 150000 + (taxableIncome - 1500000) * 0.30;
  } else if (taxableIncome > 1200000) {
    estimatedTaxAnnual = 90000 + (taxableIncome - 1200000) * 0.20;
  } else if (taxableIncome > 1000000) {
    estimatedTaxAnnual = 60000 + (taxableIncome - 1000000) * 0.15;
  } else if (taxableIncome > 700000) {
    estimatedTaxAnnual = 20000 + (taxableIncome - 700000) * 0.10;
  } else if (taxableIncome > 300000) {
    estimatedTaxAnnual = (taxableIncome - 300000) * 0.05;
  }
  // 87A rebate for < 7L taxable in new regime
  if (taxableIncome <= 700000) estimatedTaxAnnual = 0;

  const totalDeductionsAnnual = epfAnnual + professionalTax + estimatedTaxAnnual;
  const inHandAnnual = annualCtc - totalDeductionsAnnual;
  const inHandMonthly = inHandAnnual / 12;

  // Experience calculation
  const calcExperience = () => {
    const s = new Date(expStart);
    const e = new Date(expEnd);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return null;
    let months = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
    const years = Math.floor(months / 12);
    const remMonths = months % 12;
    return { years, months: remMonths, totalMonths: months };
  };
  const expRes = calcExperience();

  return (
    <div className="space-y-6">
      {/* 1. RESUME BUILDER */}
      {(toolId === 'resume-builder' || toolId === 'cv-formatter') && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold">Template Design:</span>
              <button
                onClick={() => setResumeTheme('modern')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${resumeTheme === 'modern' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
              >
                Modern Blue
              </button>
              <button
                onClick={() => setResumeTheme('classic')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${resumeTheme === 'classic' ? 'bg-slate-900 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
              >
                Classic ATS
              </button>
              <button
                onClick={() => setResumeTheme('minimal')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${resumeTheme === 'minimal' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
              >
                Clean Minimal
              </button>
            </div>
            <button
              onClick={printResume}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition"
            >
              <Printer className="w-4 h-4" /> Print / Save as PDF
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* INPUT FORM (7 COLS) */}
            <div className="lg:col-span-6 space-y-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" /> Personal Details
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    value={resumeData.name}
                    onChange={e => setResumeData({ ...resumeData, name: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Professional Title</label>
                  <input
                    type="text"
                    value={resumeData.title}
                    onChange={e => setResumeData({ ...resumeData, title: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Email</label>
                  <input
                    type="text"
                    value={resumeData.email}
                    onChange={e => setResumeData({ ...resumeData, email: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Phone</label>
                  <input
                    type="text"
                    value={resumeData.phone}
                    onChange={e => setResumeData({ ...resumeData, phone: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Professional Summary</label>
                <textarea
                  rows={3}
                  value={resumeData.summary}
                  onChange={e => setResumeData({ ...resumeData, summary: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Skills (comma separated)</label>
                <input
                  type="text"
                  value={resumeData.skills.join(', ')}
                  onChange={e => setResumeData({ ...resumeData, skills: e.target.value.split(',').map(s => s.trim()) })}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>
            </div>

            {/* LIVE RESUME PREVIEW (6 COLS / PRINT CONTAINER) */}
            <div className="lg:col-span-6 bg-white text-slate-900 p-8 rounded-2xl border border-slate-300 shadow-lg min-h-[550px] font-sans text-xs print:m-0 print:border-none print:shadow-none print:w-full">
              {/* Header */}
              <div className={`pb-4 border-b ${resumeTheme === 'modern' ? 'border-blue-600' : 'border-slate-800'}`}>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">{resumeData.name || 'Your Name'}</h1>
                <p className={`text-sm font-semibold mt-0.5 ${resumeTheme === 'modern' ? 'text-blue-600' : 'text-slate-600'}`}>
                  {resumeData.title || 'Your Target Job Title'}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600 mt-2">
                  <span>{resumeData.email}</span>
                  <span>•</span>
                  <span>{resumeData.phone}</span>
                  <span>•</span>
                  <span>{resumeData.location}</span>
                </div>
              </div>

              {/* Summary */}
              {resumeData.summary && (
                <div className="py-3 border-b border-slate-100">
                  <h2 className="font-bold uppercase tracking-wider text-[11px] text-slate-500 mb-1">Professional Summary</h2>
                  <p className="text-slate-700 leading-relaxed">{resumeData.summary}</p>
                </div>
              )}

              {/* Experience */}
              <div className="py-3 border-b border-slate-100 space-y-3">
                <h2 className="font-bold uppercase tracking-wider text-[11px] text-slate-500">Work Experience</h2>
                {resumeData.experience.map(exp => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline font-bold text-slate-800">
                      <span>{exp.role}</span>
                      <span className="text-[10px] font-normal text-slate-500">{exp.duration}</span>
                    </div>
                    <div className="text-[11px] text-blue-700 font-medium">{exp.company}</div>
                    <p className="text-slate-600 text-[11px] mt-0.5 leading-normal">{exp.desc}</p>
                  </div>
                ))}
              </div>

              {/* Skills */}
              <div className="py-3 border-b border-slate-100">
                <h2 className="font-bold uppercase tracking-wider text-[11px] text-slate-500 mb-1.5">Core Competencies</h2>
                <div className="flex flex-wrap gap-1.5">
                  {resumeData.skills.filter(Boolean).map((skill, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] font-medium border border-slate-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="pt-3">
                <h2 className="font-bold uppercase tracking-wider text-[11px] text-slate-500 mb-1">Education</h2>
                {resumeData.education.map(edu => (
                  <div key={edu.id} className="flex justify-between items-baseline">
                    <div>
                      <div className="font-bold text-slate-800">{edu.degree}</div>
                      <div className="text-slate-600 text-[11px]">{edu.school}</div>
                    </div>
                    <span className="text-[10px] text-slate-500">{edu.year}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. CTC TO IN-HAND SALARY CALCULATOR */}
      {toolId === 'salary-calculator' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Annual CTC (Cost to Company in ₹)
                </label>
                <input
                  type="number"
                  step="50000"
                  value={annualCtc}
                  onChange={e => setAnnualCtc(Number(e.target.value))}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base font-bold font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Income Tax Regime
                </label>
                <select
                  value={regime}
                  onChange={e => setRegime(e.target.value as any)}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold"
                >
                  <option value="new">New Tax Regime (Default standard ₹75K rebate)</option>
                  <option value="old">Old Tax Regime</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase block mb-1">
                Estimated Monthly In-Hand
              </span>
              <span className="text-3xl font-black text-emerald-900 dark:text-emerald-100">
                ₹{Math.round(inHandMonthly).toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-emerald-600 block mt-1">Direct bank credit / month</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-xs font-semibold text-slate-500 uppercase block mb-1">Annual Take-Home</span>
              <span className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                ₹{Math.round(inHandAnnual).toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-slate-400 block mt-1">Total net salary</span>
            </div>

            <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-center">
              <span className="text-xs font-semibold text-rose-700 dark:text-rose-300 uppercase block mb-1">Total Deductions</span>
              <span className="text-2xl font-bold text-rose-800 dark:text-rose-200">
                ₹{Math.round(totalDeductionsAnnual).toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-rose-500 block mt-1">EPF + Tax + Standard</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
            <h5 className="font-bold text-slate-700 dark:text-slate-300">Deduction Breakdown:</h5>
            <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
              <span>Employee Provident Fund (EPF 12% of basic):</span>
              <span className="font-mono font-semibold">₹{Math.round(epfAnnual).toLocaleString('en-IN')} / yr</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
              <span>Estimated Income Tax (TDS):</span>
              <span className="font-mono font-semibold">₹{Math.round(estimatedTaxAnnual).toLocaleString('en-IN')} / yr</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Professional Tax:</span>
              <span className="font-mono font-semibold">₹2,400 / yr</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. COVER LETTER BUILDER */}
      {toolId === 'cover-letter-builder' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
            <div>
              <label className="block font-semibold mb-1">Target Job Role</label>
              <input
                type="text"
                value={coverJob}
                onChange={e => setCoverJob(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Company Name</label>
              <input
                type="text"
                value={coverCompany}
                onChange={e => setCoverCompany(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Years of Experience</label>
              <input
                type="text"
                value={coverExpYears}
                onChange={e => setCoverExpYears(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-sans leading-relaxed space-y-3">
            <p>Dear Hiring Manager at <strong>{coverCompany}</strong>,</p>
            <p>
              I am writing to express my strong interest in the <strong>{coverJob}</strong> position at {coverCompany}. With over {coverExpYears} years of hands-on experience in building scalable solutions and driving digital innovation, I am confident in my ability to make an immediate impact on your engineering team.
            </p>
            <p>
              Throughout my career, I have specialized in delivering robust, high-performance web applications, streamlining workflows, and collaborating with cross-functional product teams to exceed technical benchmarks.
            </p>
            <p>
              I would welcome the opportunity to discuss how my skill set aligns with {coverCompany}'s ongoing objectives. Thank you for your time and consideration.
            </p>
            <p>Sincerely,<br /><strong>{resumeData.name}</strong></p>
          </div>
        </div>
      )}

      {/* 4. EXPERIENCE CALCULATOR */}
      {toolId === 'experience-calculator' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
            <div>
              <label className="block font-semibold mb-1">Joining / Start Date</label>
              <input
                type="date"
                value={expStart}
                onChange={e => setExpStart(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Relieving / End Date</label>
              <input
                type="date"
                value={expEnd}
                onChange={e => setExpEnd(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold"
              />
            </div>
          </div>

          {expRes && (
            <div className="p-6 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-center">
              <span className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase block mb-1">Total Employment Duration</span>
              <span className="text-3xl font-black text-blue-900 dark:text-blue-100">
                {expRes.years} Years, {expRes.months} Months
              </span>
              <span className="text-xs text-blue-600 dark:text-blue-400 block mt-1">({expRes.totalMonths} total months worked)</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
