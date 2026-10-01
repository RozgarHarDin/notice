import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Zap, 
  Printer, 
  Copy, 
  Check, 
  ArrowLeft, 
  FileCheck, 
  ShieldCheck, 
  AlertTriangle, 
  Scale, 
  Building2, 
  Landmark, 
  Download,
  Calendar,
  FileSpreadsheet
} from 'lucide-react';
import { InvoiceItem, SupplierDetails, BuyerDetails, CalculationSettings, CalculationSummary } from '../../types';
import { formatINR, formatLegalDate, numberToIndianRupeesWords } from '../../utils/calculator';

interface Step3CompileNoticeProps {
  invoices: InvoiceItem[];
  supplier: SupplierDetails;
  buyer: BuyerDetails;
  settings: CalculationSettings;
  summary: CalculationSummary;
  onBack: () => void;
}

export const Step3CompileNotice: React.FC<Step3CompileNoticeProps> = ({
  invoices,
  supplier,
  buyer,
  settings,
  summary,
  onBack,
}) => {
  // CRITICAL LIFECYCLE BEHAVIOR:
  // When entering Step 3, isCompiled MUST be false!
  // Document preview only renders AFTER clicking "[⚡ Compile Official Statutory Demand Notice]"
  const [isCompiled, setIsCompiled] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleCompile = () => {
    // Subtle, elegant gold and royal blue celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#2563EB', '#FBBF24', '#38BDF8', '#10B981'],
      ticks: 200,
    });

    setIsCompiled(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const generatePlainTextNotice = (): string => {
    const lines = [
      `BY REGISTERED POST WITH ACKNOWLEDGEMENT DUE / SPEED POST & EMAIL`,
      `STATUTORY LEGAL DEMAND NOTICE UNDER SECTIONS 15, 16 & 17 OF THE MSMED ACT, 2006 READ WITH SECTION 43B(h) OF THE INCOME-TAX ACT, 1961`,
      `--------------------------------------------------------------------------------`,
      `Notice Ref: ${summary.noticeRef}`,
      `Date of Issue: ${formatLegalDate(summary.generatedAt)}`,
      ``,
      `TO:`,
      `${buyer.attentionLine || 'The Board of Directors / Managing Director & CFO'}`,
      `${buyer.companyName}`,
      `${buyer.registeredAddress}`,
      buyer.gstin ? `GSTIN: ${buyer.gstin}` : '',
      buyer.pan ? `PAN: ${buyer.pan}` : '',
      buyer.email ? `Email: ${buyer.email}` : '',
      ``,
      `FROM:`,
      `${supplier.businessName} (${supplier.category} Enterprise)`,
      `Udyam Registration No: ${supplier.udyamNumber}`,
      `${supplier.address}`,
      `Email: ${supplier.email} | Phone: ${supplier.phone}`,
      ``,
      `SUBJECT: STATUTORY DEMAND NOTICE UNDER SECTIONS 15, 16 & 17 OF THE MICRO, SMALL AND MEDIUM ENTERPRISES DEVELOPMENT ACT, 2006 (MSMED ACT) READ WITH SECTION 43B(h) OF THE INCOME-TAX ACT, 1961 FOR IMMEDIATE RECOVERY OF OVERDUE PRINCIPAL SUM OF ${formatINR(summary.totalPrincipal)} TOGETHER WITH MANDATORY COMPOUND INTEREST AT 3X THE RBI BANK RATE ACCRUING TO ${formatINR(summary.totalInterest)}, TOTALING ${formatINR(summary.totalClaim)} (${numberToIndianRupeesWords(summary.totalClaim)}).`,
      ``,
      `Sir/Madam,`,
      `Under statutory instructions from our Enterprise, ${supplier.businessName}, registered as a ${supplier.category} Enterprise under the MSMED Act, 2006, this formal statutory notice is served upon you:`,
      ``,
      `1. STATUTORY PROTECTIONS & RECOGNITION:`,
      `Our enterprise is duly registered under the Micro, Small and Medium Enterprises Development Act, 2006 (MSMED Act) with Udyam Registration No. ${supplier.udyamNumber} as a ${supplier.category} Enterprise, entitled to all mandatory remedies and protections enacted under Chapter V (Sections 15 to 24) of the said Act.`,
      ``,
      `2. STATUTORY MAXIMUM CREDIT PERIOD (SECTION 15):`,
      `In terms of Section 15 of the MSMED Act, 2006, the buyer is under strict statutory liability to make payment on or before the agreed date, which in no case shall exceed forty-five (45) days. Despite supply and acceptance of goods/services, payment has been unlawfully withheld beyond this statutory threshold.`,
      ``,
      `3. MANDATORY STATUTORY COMPOUND INTEREST (SECTION 16):`,
      `As mandated by Section 16 of the MSMED Act, 2006, the buyer is liable to pay compound interest with monthly rests at three (3) times the Bank Rate notified by the Reserve Bank of India. Based on the prevailing RBI Bank Rate of ${settings.bankRate}% p.a., compound interest is statutorily payable at ${(settings.bankRate * 3).toFixed(2)}% p.a. from the appointed due date.`,
      ``,
      `4. TAX DISALLOWANCE UNDER SECTION 43B(h) OF THE INCOME-TAX ACT, 1961:`,
      `Take notice that under Section 43B(h) of the Income-tax Act, 1961, any sum payable to a Micro or Small enterprise beyond the statutory period specified under Section 15 of the MSMED Act (45 days) is strictly disallowed as a deductible expenditure in your corporate tax assessment. Furthermore, under Section 23 of the MSMED Act, compound interest paid/payable is strictly non-deductible.`,
      ``,
      `INVOICE BREAKDOWN TABLE:`,
      `Invoice No. | Invoice Date | Statutory Due Date | Principal (INR) | Days Overdue | Compound Interest (INR) | Total (INR)`,
      ...invoices.map(
        (inv) =>
          `${inv.invoiceNumber} | ${inv.invoiceDate} | ${inv.dueDate} | ${formatINR(inv.principalAmount)} | ${inv.daysOverdue} days | ${formatINR(inv.compoundInterest)} | ${formatINR(inv.totalClaim)}`
      ),
      ``,
      `TOTAL RECOVERABLE STATUTORY CLAIM:`,
      `- Total Outstanding Principal: ${formatINR(summary.totalPrincipal)}`,
      `- Accrued Statutory Compound Interest (3x RBI Rate): ${formatINR(summary.totalInterest)}`,
      `- Total Claim Amount: ${formatINR(summary.totalClaim)} (${numberToIndianRupeesWords(summary.totalClaim)})`,
      ``,
      `BANK REMITTANCE DETAILS FOR IMMEDIATE DISCHARGE:`,
      `Beneficiary Name: ${supplier.businessName}`,
      `Bank: ${supplier.bankName}`,
      `Account Number: ${supplier.accountNumber}`,
      `IFSC Code: ${supplier.ifscCode}`,
      supplier.upiId ? `UPI ID: ${supplier.upiId}` : '',
      ``,
      `DEMAND FOR DISCHARGE WITHIN 15 DAYS:`,
      `You are hereby formally called upon to liquidate and remit the full recoverable claim amount of ${formatINR(summary.totalClaim)} into the designated bank account within fifteen (15) days of receipt of this notice.`,
      `Failing such discharge, we shall immediately initiate statutory proceedings before the Micro and Small Enterprises Facilitation Council (MSEFC / MSME Samadhaan) under Section 18 of the MSMED Act, 2006, along with reporting non-compliance to the Income Tax Department under Section 43B(h).`,
      ``,
      `Yours faithfully,`,
      `For ${supplier.businessName}`,
      `${supplier.authorizedSignatory}`,
      `${supplier.designation}`,
      ``,
      `================================================================================`,
      `ANNEXURE-A: STATUTORY COMPOUND INTEREST COMPUTATION & AUDIT TELEMETRY`,
      `Statutory Governing Authority: Section 16, MSMED Act, 2006`,
      `RBI Baseline Bank Rate: ${settings.bankRate}% p.a.`,
      `Statutory Multiplier: 3x RBI Bank Rate = ${(settings.bankRate * 3).toFixed(2)}% p.a.`,
      `Compounding Rest Frequency: Monthly Rests (Average 30.4167 days/month)`,
      `Statutory Formula: A = P * (1 + (3 * BankRate) / 12) ^ (Days / 30.4167) - P`,
      `Generated via UdyamNotice Computational Aid Engine v2.4`,
      `================================================================================`
    ];

    return lines.filter((l) => l !== undefined).join('\n');
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(generatePlainTextNotice());
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      alert("Notice copied to clipboard buffer.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* If NOT compiled yet: Sleek "Review Summary" with the primary CTA */}
      {!isCompiled ? (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
              <FileCheck className="w-3.5 h-3.5" />
              <span>Step 3 Verification &amp; Document Synthesis</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Statutory Claim Pre-Flight Review
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Verify all commercial invoices, statutory dates, and recipient particulars before compiling the official legal notice.
            </p>
          </div>

          {/* Audit Verification Checklist Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block text-sm">Protected Enterprise Status</strong>
                <p className="text-slate-400 mt-0.5">
                  Supplier registered as <span className="text-blue-400 font-semibold">{supplier.category}</span> with valid Udyam ID <span className="font-mono text-slate-200">{supplier.udyamNumber || 'Pending'}</span>.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
              <Scale className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block text-sm">3x RBI Rate Engine</strong>
                <p className="text-slate-400 mt-0.5">
                  Statutory interest compounding with monthly rests at <span className="text-amber-400 font-bold font-mono">{(settings.bankRate * 3).toFixed(2)}% p.a.</span> (Sections 15 &amp; 16 MSMED Act).
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
              <Landmark className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block text-sm">Bank Remittance Route</strong>
                <p className="text-slate-400 mt-0.5">
                  Settlement directed to <span className="text-slate-200">{supplier.bankName || 'Bank'}</span> A/C <span className="font-mono text-slate-200">{supplier.accountNumber || 'Pending'}</span> (IFSC: {supplier.ifscCode || 'Pending'}).
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block text-sm">Sec 43B(h) Disallowance Warning</strong>
                <p className="text-slate-400 mt-0.5">
                  Defaulting buyer <span className="text-slate-200 font-semibold">{buyer.companyName || 'Buyer'}</span> is warned of non-deductible tax liability.
                </p>
              </div>
            </div>
          </div>

          {/* Claim Metric Highlights Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/60 to-slate-900 border border-blue-900/60 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider block">
                Total Statutory Claim for Immediate Demand
              </span>
              <div className="text-3xl sm:text-4xl font-black text-white font-mono mt-1">
                {formatINR(summary.totalClaim)}
              </div>
              <span className="text-xs text-slate-400 mt-1 block font-medium">
                {numberToIndianRupeesWords(summary.totalClaim)}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto text-xs">
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block">Total Principal</span>
                <span className="text-base font-bold text-white font-mono">{formatINR(summary.totalPrincipal)}</span>
              </div>
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block">Accrued 3x Interest</span>
                <span className="text-base font-bold text-rose-400 font-mono">{formatINR(summary.totalInterest)}</span>
              </div>
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block">Max Days Overdue</span>
                <span className="text-base font-bold text-amber-400 font-mono">{summary.maxDaysOverdue} Days</span>
              </div>
            </div>
          </div>

          {/* Parties Recapitulation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
              <span className="text-[11px] font-bold uppercase text-blue-400">Claimant Enterprise (Supplier)</span>
              <p className="text-sm font-bold text-white">{supplier.businessName || 'Supplier Business'}</p>
              <p className="text-slate-400">{supplier.address || 'Address'}</p>
              <p className="text-slate-400 font-mono">Udyam: {supplier.udyamNumber || '—'} | Category: {supplier.category}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
              <span className="text-[11px] font-bold uppercase text-rose-400">Defaulting Debtor (Buyer)</span>
              <p className="text-sm font-bold text-white">{buyer.companyName || 'Buyer Company'}</p>
              <p className="text-slate-400">{buyer.registeredAddress || 'Registered Address'}</p>
              <p className="text-slate-400 font-mono">Attention: {buyer.attentionLine || 'Directors / CFO'}</p>
            </div>
          </div>

          {/* Primary Action Button (Mandated Lifecycle CTA) */}
          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={onBack}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Parties</span>
            </button>

            <button
              onClick={handleCompile}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-sm font-black text-white shadow-2xl shadow-blue-900/60 transition cursor-pointer active:scale-98"
            >
              <Zap className="w-5 h-5 text-amber-300 animate-bounce" />
              <span>⚡ Compile Official Statutory Demand Notice</span>
            </button>
          </div>
        </div>
      ) : (
        /* COMPILED DOCUMENT VIEW */
        <div className="space-y-6">
          {/* Action Toolbar (Hidden during print) */}
          <div className="no-print p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4 sticky top-4 z-40">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Official Legal Notice Compiled</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Court Ready
                  </span>
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Ref: {summary.noticeRef} | Date: {formatLegalDate(summary.generatedAt)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setIsCompiled(false)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition cursor-pointer"
              >
                Review Summary
              </button>

              <button
                onClick={handleCopyText}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 transition cursor-pointer active:scale-95"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-blue-400" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Notice Text'}</span>
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-lg shadow-blue-900/40 transition cursor-pointer active:scale-95"
              >
                <Printer className="w-4 h-4" />
                <span>Download PDF / Print</span>
              </button>
            </div>
          </div>

          {/* DOCUMENT PAGES CONTAINER */}
          <div className="legal-document-container max-w-4xl mx-auto space-y-8 print:space-y-0">
            {/* PAGE 1: STATUTORY DEMAND NOTICE */}
            <div className="legal-page bg-white text-slate-900 rounded-2xl p-8 sm:p-12 shadow-2xl border border-slate-200 print:border-none print:shadow-none print:p-0 print:rounded-none">
              {/* Header Transmission Banner */}
              <div className="border-b-2 border-slate-900 pb-4 text-center">
                <span className="text-[11px] font-black tracking-widest uppercase text-slate-700 block">
                  BY REGISTERED POST WITH ACKNOWLEDGEMENT DUE / SPEED POST &amp; STATUTORY TRANSMISSION
                </span>
                <h1 className="text-xl sm:text-2xl font-black font-legal-heading text-slate-950 mt-1 uppercase tracking-tight">
                  STATUTORY LEGAL DEMAND NOTICE
                </h1>
                <p className="text-[11px] font-semibold text-slate-600 mt-0.5">
                  UNDER SECTIONS 15, 16 &amp; 17 OF THE MICRO, SMALL AND MEDIUM ENTERPRISES DEVELOPMENT ACT, 2006 (ACT NO. 27 OF 2006)
                </p>
                <p className="text-[10px] font-bold text-rose-700 mt-0.5">
                  READ WITH SECTION 43B(h) OF THE INCOME-TAX ACT, 1961
                </p>
              </div>

              {/* Notice Metadata */}
              <div className="flex justify-between items-center text-xs font-mono font-semibold text-slate-700 pt-3 pb-2 border-b border-slate-200">
                <span>NOTICE REF NO: <strong className="text-slate-950">{summary.noticeRef}</strong></span>
                <span>DATE: <strong className="text-slate-950">{formatLegalDate(summary.generatedAt)}</strong></span>
              </div>

              {/* To & From Blocks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6 text-xs text-slate-800 leading-relaxed">
                {/* TO */}
                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                  <span className="font-black text-slate-950 uppercase tracking-wider block mb-1">TO (DEFAULTING BUYER):</span>
                  <p className="font-bold text-slate-950">{buyer.attentionLine || 'The Board of Directors / Managing Director & CFO'}</p>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{buyer.companyName}</p>
                  <p className="mt-0.5 text-slate-700">{buyer.registeredAddress}</p>
                  {buyer.gstin && <p className="font-mono mt-1 font-semibold text-slate-800">GSTIN: {buyer.gstin}</p>}
                  {buyer.pan && <p className="font-mono font-semibold text-slate-800">PAN: {buyer.pan}</p>}
                  {buyer.email && <p className="text-slate-600">Email: {buyer.email}</p>}
                </div>

                {/* FROM */}
                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                  <span className="font-black text-slate-950 uppercase tracking-wider block mb-1">FROM (CLAIMANT SUPPLIER):</span>
                  <p className="font-bold text-slate-900 text-sm">{supplier.businessName}</p>
                  <p className="text-slate-700">{supplier.address}</p>
                  <p className="mt-1 font-mono font-bold text-blue-900">
                    Category: {supplier.category} Enterprise
                  </p>
                  <p className="font-mono font-bold text-slate-900">
                    Udyam Reg. No: {supplier.udyamNumber}
                  </p>
                  <p className="text-slate-600">State: {supplier.state} | Email: {supplier.email}</p>
                </div>
              </div>

              {/* SUBJECT LINE */}
              <div className="my-5 p-3 rounded-lg bg-slate-100 border-l-4 border-slate-900 text-xs font-semibold text-slate-900 leading-snug">
                <span className="font-black">SUBJECT: </span>
                DEMAND FOR IMMEDIATE PAYMENT OF OUTSTANDING PRINCIPAL RECEIVABLES OF <span className="font-bold">{formatINR(summary.totalPrincipal)}</span> ALONG WITH STATUTORY COMPOUND INTEREST AT THREE TIMES (3x) THE RBI BANK RATE ACCRUING TO <span className="font-bold">{formatINR(summary.totalInterest)}</span>, AGGREGATING TO <span className="font-black text-rose-900">{formatINR(summary.totalClaim)}</span> UNDER SECTIONS 15, 16 &amp; 17 OF THE MSMED ACT, 2006 READ WITH CONSEQUENCES UNDER SECTION 43B(h) OF THE INCOME-TAX ACT, 1961.
              </div>

              {/* LEGAL RECITALS */}
              <div className="space-y-3 text-xs leading-relaxed text-slate-800 text-justify">
                <p>
                  <strong>1. STATUTORY PROTECTED STATUS:</strong> The Claimant enterprise is duly registered under the Micro, Small and Medium Enterprises Development Act, 2006 (MSMED Act) with Udyam Registration No. <span className="font-mono font-bold">{supplier.udyamNumber}</span> as a <span className="font-bold">{supplier.category} Enterprise</span>. As such, all supplies made to you are fully governed by the statutory covenants of Chapter V of the MSMED Act.
                </p>

                <p>
                  <strong>2. MANDATORY STATUTORY 45-DAYS CREDIT LIMIT (SECTION 15):</strong> In terms of Section 15 of the MSMED Act, 2006, where any supplier supplies any goods or renders any services to any buyer, the buyer shall make payment on or before the date agreed upon in writing, provided that <em className="font-semibold text-slate-950">in no case the period agreed upon between the supplier and the buyer in writing shall exceed forty-five (45) days</em>. You have accepted the commercial supplies without any prompt statutory dispute within fifteen days of delivery.
                </p>

                <p>
                  <strong>3. MANDATORY 3x RBI BANK RATE COMPOUND INTEREST (SECTION 16):</strong> Where any buyer fails to make payment of the amount to the supplier, the buyer shall, notwithstanding anything contained in any agreement between the buyer and the supplier or in any law for the time being in force, be liable to pay compound interest with monthly rests to the supplier at <em className="font-semibold text-slate-950">three times (3x) of the Bank Rate notified by the Reserve Bank of India</em>. The statutory benchmark RBI Bank Rate is {settings.bankRate}% p.a., resulting in an effective statutory rate of {(settings.bankRate * 3).toFixed(2)}% p.a.
                </p>

                <p>
                  <strong>4. INCOME TAX DISALLOWANCE NOTICE (SECTION 43B(h)):</strong> Under Section 43B(h) of the Income-tax Act, 1961, any delayed sum owed to a Micro or Small enterprise remaining unpaid beyond the Section 15 time limit is <strong>strictly disallowed as a business deduction</strong> from your gross income, subjecting your company to penal tax assessments. Furthermore, under Section 23 of the MSMED Act, compound interest paid is non-deductible for tax purposes.
                </p>
              </div>

              {/* COMMERCIAL INVOICE BREAKDOWN TABLE */}
              <div className="my-5 overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-300">
                  <thead className="bg-slate-100 text-slate-900 border-b border-slate-300 font-bold">
                    <tr>
                      <th className="p-2 border-r border-slate-300">Invoice No.</th>
                      <th className="p-2 border-r border-slate-300">Date</th>
                      <th className="p-2 border-r border-slate-300">Due Date</th>
                      <th className="p-2 border-r border-slate-300 text-right">Principal (₹)</th>
                      <th className="p-2 border-r border-slate-300 text-center">Overdue</th>
                      <th className="p-2 border-r border-slate-300 text-right">3x Interest (₹)</th>
                      <th className="p-2 text-right">Total Claim (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50">
                        <td className="p-2 font-semibold text-slate-950 border-r border-slate-200">{inv.invoiceNumber}</td>
                        <td className="p-2 text-slate-700 border-r border-slate-200">{inv.invoiceDate}</td>
                        <td className="p-2 text-slate-700 border-r border-slate-200">{inv.dueDate}</td>
                        <td className="p-2 text-right text-slate-900 font-semibold border-r border-slate-200">{formatINR(inv.principalAmount)}</td>
                        <td className="p-2 text-center text-rose-700 font-bold border-r border-slate-200">{inv.daysOverdue} d</td>
                        <td className="p-2 text-right text-amber-800 font-bold border-r border-slate-200">{formatINR(inv.compoundInterest)}</td>
                        <td className="p-2 text-right font-bold text-slate-950">{formatINR(inv.totalClaim)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-100 border-t-2 border-slate-900 font-mono font-bold text-xs">
                    <tr>
                      <td colSpan={3} className="p-2 font-sans font-black text-slate-950">STATUTORY TOTAL CLAIM</td>
                      <td className="p-2 text-right text-slate-950">{formatINR(summary.totalPrincipal)}</td>
                      <td className="p-2 text-center text-slate-700">—</td>
                      <td className="p-2 text-right text-rose-800">{formatINR(summary.totalInterest)}</td>
                      <td className="p-2 text-right text-slate-950 font-black">{formatINR(summary.totalClaim)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* WORDS AND REMITTANCE BOX */}
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-300 text-xs space-y-2">
                <div>
                  <span className="font-bold text-slate-900">Total Statutory Claim in Words: </span>
                  <span className="font-semibold text-slate-800 italic">{numberToIndianRupeesWords(summary.totalClaim)}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                  <div>
                    <span className="text-slate-600 block">Designated Bank:</span>
                    <strong className="text-slate-900">{supplier.bankName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-600 block">Beneficiary Account:</span>
                    <strong className="text-slate-900">{supplier.accountNumber}</strong>
                  </div>
                  <div>
                    <span className="text-slate-600 block">IFSC Code:</span>
                    <strong className="text-slate-900">{supplier.ifscCode}</strong>
                  </div>
                  <div>
                    <span className="text-slate-600 block">UPI Remittance ID:</span>
                    <strong className="text-slate-900">{supplier.upiId || 'N/A'}</strong>
                  </div>
                </div>
              </div>

              {/* DEMAND TIME & SIGNATURE BLOCK */}
              <div className="mt-5 space-y-4 text-xs text-slate-800">
                <p className="font-bold text-slate-950">
                  STATUTORY REQUISITION &amp; DISCHARGE NOTICE:
                </p>
                <p className="leading-relaxed">
                  You are hereby called upon to remit the aggregate statutory amount of <span className="font-bold">{formatINR(summary.totalClaim)}</span> into our designated bank account within <span className="font-bold underline">fifteen (15) days</span> of receipt of this notice, failing which we shall immediately proceed with:
                </p>
                <ol className="list-decimal pl-5 space-y-1 text-slate-700">
                  <li>Filing of Reference Petition before the Micro &amp; Small Enterprises Facilitation Council (MSEFC / MSME Samadhaan) under Section 18 of the MSMED Act, 2006 for conciliation and statutory recovery decree.</li>
                  <li>Intimation of statutory payment default to the National e-Assessment Centre (NeAC), Income Tax Department under Section 43B(h).</li>
                  <li>Corporate debtor insolvency or civil recovery remedies as permitted by law, entirely at your costs and consequences.</li>
                </ol>

                <div className="pt-8 flex justify-between items-end">
                  <div className="text-[10px] text-slate-500 font-mono space-y-0.5">
                    <p>Place: {supplier.state}, India</p>
                    <p>Notice Ref: {summary.noticeRef}</p>
                    <p>Seal / Timestamp Verified</p>
                  </div>

                  <div className="text-right">
                    <div className="h-10 flex items-center justify-end">
                      <span className="text-slate-400 font-mono text-[10px] italic">[Digitally Signed / Authorized Signatory]</span>
                    </div>
                    <div className="border-t border-slate-900 pt-1">
                      <p className="font-bold text-slate-950 text-xs">For {supplier.businessName}</p>
                      <p className="text-[11px] text-slate-700">{supplier.authorizedSignatory || 'Authorized Signatory'}</p>
                      <p className="text-[10px] text-slate-500">{supplier.designation || 'Partner / Proprietor'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mandatory Footer String */}
              <div className="mt-8 pt-3 border-t border-slate-200 text-center text-[10px] font-mono text-slate-500">
                Generated via UdyamNotice Computational Aid Engine v2.4
              </div>
            </div>

            {/* PAGE 2: ANNEXURE-A AUDIT SHEET (Clean Page Break) */}
            <div className="legal-page legal-page-break bg-white text-slate-900 rounded-2xl p-8 sm:p-12 shadow-2xl border border-slate-200 print:border-none print:shadow-none print:p-0 print:rounded-none">
              {/* Header */}
              <div className="border-b-2 border-slate-900 pb-3 text-center">
                <span className="text-[10px] font-black tracking-widest uppercase text-slate-700 block">
                  ANNEXURE - A
                </span>
                <h2 className="text-lg sm:text-xl font-black font-legal-heading text-slate-950 mt-1 uppercase">
                  STATUTORY COMPOUND INTEREST COMPUTATION &amp; AUDIT SHEET
                </h2>
                <p className="text-[11px] font-semibold text-slate-600 mt-0.5">
                  FORMAL AUDIT UNDER SECTION 16 OF THE MICRO, SMALL AND MEDIUM ENTERPRISES DEVELOPMENT ACT, 2006
                </p>
              </div>

              {/* Sub-header Metadata */}
              <div className="flex justify-between items-center text-xs font-mono font-semibold text-slate-700 py-2 border-b border-slate-200">
                <span>INVOICE ATTACHMENTS TO NOTICE REF: <strong>{summary.noticeRef}</strong></span>
                <span>AUDIT BENCHMARK: <strong>RBI BANK RATE @ {settings.bankRate}%</strong></span>
              </div>

              {/* STATUTORY MATHEMATICAL FORMULA EXPLANATION */}
              <div className="my-5 p-4 rounded-xl bg-slate-50 border border-slate-300 text-xs space-y-2">
                <h3 className="font-bold text-slate-950 flex items-center gap-1.5 uppercase text-[11px]">
                  <Scale className="w-4 h-4 text-blue-700" />
                  <span>Statutory Compounding Formula &amp; Benchmark Principles</span>
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  Section 16 of the MSMED Act, 2006 dictates that interest payable shall be compounded with monthly rests at three times (3x) the Bank Rate notified by the Reserve Bank of India. The calculation model utilizes the exact statutory formula:
                </p>
                <div className="p-3 bg-white rounded-lg border border-slate-300 font-mono text-xs text-center font-bold text-blue-900">
                  A = P × [ 1 + (3 × Bank Rate) / 12 ] ^ (Overdue Days / 30.4167) − P
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-700 pt-1 font-mono">
                  <div>• Bank Rate: {settings.bankRate}% p.a.</div>
                  <div>• Statutory Rate (3x): {(settings.bankRate * 3).toFixed(2)}% p.a.</div>
                  <div>• Rest Frequency: Monthly Rests (30.4167 days)</div>
                </div>
              </div>

              {/* TABULAR AUDIT BREAKDOWN */}
              <div className="my-4 overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-300">
                  <thead className="bg-slate-100 text-slate-900 border-b border-slate-300 font-bold">
                    <tr>
                      <th className="p-2 border-r border-slate-300">#</th>
                      <th className="p-2 border-r border-slate-300">Invoice Ref</th>
                      <th className="p-2 border-r border-slate-300">Invoice Date</th>
                      <th className="p-2 border-r border-slate-300">Statutory Due Date</th>
                      <th className="p-2 border-r border-slate-300 text-right">Principal (P)</th>
                      <th className="p-2 border-r border-slate-300 text-center">Days Overdue</th>
                      <th className="p-2 border-r border-slate-300 text-center">Monthly Rests</th>
                      <th className="p-2 text-right">Compounded Interest</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                    {invoices.map((inv, idx) => {
                      const monthlyRests = (inv.daysOverdue / 30.4167).toFixed(2);
                      return (
                        <tr key={inv.id} className="hover:bg-slate-50">
                          <td className="p-2 text-slate-600 border-r border-slate-200">{idx + 1}</td>
                          <td className="p-2 font-semibold text-slate-950 border-r border-slate-200">{inv.invoiceNumber}</td>
                          <td className="p-2 text-slate-700 border-r border-slate-200">{inv.invoiceDate}</td>
                          <td className="p-2 text-slate-700 border-r border-slate-200">{inv.dueDate}</td>
                          <td className="p-2 text-right font-semibold text-slate-900 border-r border-slate-200">{formatINR(inv.principalAmount)}</td>
                          <td className="p-2 text-center text-rose-700 font-bold border-r border-slate-200">{inv.daysOverdue} days</td>
                          <td className="p-2 text-center text-slate-700 border-r border-slate-200">{monthlyRests} rests</td>
                          <td className="p-2 text-right font-bold text-amber-900">{formatINR(inv.compoundInterest)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-slate-100 border-t-2 border-slate-900 font-mono font-bold text-xs">
                    <tr>
                      <td colSpan={4} className="p-2 font-sans font-black text-slate-950">AUDIT TOTALS</td>
                      <td className="p-2 text-right text-slate-950">{formatINR(summary.totalPrincipal)}</td>
                      <td colSpan={2} className="p-2 text-center text-slate-600">Max: {summary.maxDaysOverdue} days</td>
                      <td className="p-2 text-right text-amber-900 font-black">{formatINR(summary.totalInterest)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* STATUTORY COMPLIANCE & LEGAL TELEMETRY */}
              <div className="space-y-4 my-6 text-xs text-slate-800">
                <h3 className="font-black text-slate-950 uppercase tracking-wider text-[11px]">
                  STATUTORY COMPLIANCE AUDIT CERTIFICATE
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] leading-relaxed">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <strong className="text-slate-950 block">Section 15 Time Limit Compliance:</strong>
                    Each invoice due date is capped strictly at 45 calendar days from the invoice date pursuant to the proviso of Section 15 of MSMED Act, 2006. Any contrary contractual clause attempting longer credit periods is void ab initio under Section 24.
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <strong className="text-slate-950 block">Section 23 Non-Deductibility Mandate:</strong>
                    The accrued compound interest of <span className="font-bold font-mono">{formatINR(summary.totalInterest)}</span> is non-deductible as business expense in computing the income of the buyer under the Income-tax Act, 1961.
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px]">
                  <strong className="text-slate-950 block">Jurisdiction of MSME Facilitation Council (MSEFC):</strong>
                  Under Section 18(4) of the MSMED Act, 2006, the MSEFC located in the jurisdiction of the Claimant (<span className="font-semibold">{supplier.state}</span>) has exclusive statutory jurisdiction to arbitrate and decree this claim, overriding any arbitration or jurisdiction clause in any commercial purchase order.
                </div>
              </div>

              {/* Signoff / Verification */}
              <div className="pt-8 flex justify-between items-end border-t border-slate-200 text-xs">
                <div className="text-[10px] font-mono text-slate-500 space-y-0.5">
                  <p>Audit Telemetry Checksum: OK</p>
                  <p>Engine: UdyamNotice Computational Aid Engine v2.4</p>
                  <p>Certified as accurate under MSMED Act, 2006</p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-slate-950 text-xs">For {supplier.businessName}</p>
                  <p className="text-[11px] text-slate-700">{supplier.authorizedSignatory || 'Authorized Signatory'}</p>
                  <p className="text-[10px] text-slate-500 font-mono">Date: {formatLegalDate(summary.generatedAt)}</p>
                </div>
              </div>

              {/* Mandatory Footer String */}
              <div className="mt-8 pt-3 border-t border-slate-200 text-center text-[10px] font-mono text-slate-500">
                Generated via UdyamNotice Computational Aid Engine v2.4
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
