import React from 'react';
import { 
  Plus, 
  Trash2, 
  Percent, 
  Calendar, 
  Calculator, 
  ArrowRight, 
  Sparkles, 
  Info,
  Clock,
  TrendingUp,
  Scale
} from 'lucide-react';
import { InvoiceItem, CalculationSettings, CalculationSummary } from '../../types';
import { formatINR, formatLegalDate } from '../../utils/calculator';

interface Step1CalculatorProps {
  invoices: InvoiceItem[];
  settings: CalculationSettings;
  summary: CalculationSummary;
  onUpdateInvoices: (invoices: InvoiceItem[]) => void;
  onUpdateSettings: (settings: CalculationSettings) => void;
  onNext: () => void;
  onLoadDemo: () => void;
}

export const Step1Calculator: React.FC<Step1CalculatorProps> = ({
  invoices,
  settings,
  summary,
  onUpdateInvoices,
  onUpdateSettings,
  onNext,
  onLoadDemo,
}) => {
  const handleAddInvoice = () => {
    const today = new Date();
    // Default invoice date 60 days ago so it demonstrates an overdue calculation immediately
    const pastDate = new Date(today);
    pastDate.setDate(today.getDate() - 60);
    const y = pastDate.getFullYear();
    const m = String(pastDate.getMonth() + 1).padStart(2, '0');
    const d = String(pastDate.getDate()).padStart(2, '0');

    const newInvoice: InvoiceItem = {
      id: `inv-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      invoiceNumber: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      invoiceDate: `${y}-${m}-${d}`,
      creditPeriod: 45,
      principalAmount: 250000,
      dueDate: '',
      daysOverdue: 0,
      statutoryRateAnnual: settings.bankRate * 3,
      compoundInterest: 0,
      totalClaim: 0,
    };
    onUpdateInvoices([...invoices, newInvoice]);
  };

  const handleRemoveInvoice = (id: string) => {
    if (invoices.length <= 1) {
      alert("At least one invoice is required for computation.");
      return;
    }
    onUpdateInvoices(invoices.filter((inv) => inv.id !== id));
  };

  const handleInvoiceChange = (
    id: string,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    const updated = invoices.map((inv) => {
      if (inv.id === id) {
        return {
          ...inv,
          [field]: value,
        };
      }
      return inv;
    });
    onUpdateInvoices(updated);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Config & Statutory Rate Bar */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Statutory Benchmark</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Section 16 MSMED Act
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-0.5">RBI Bank Rate &amp; Compounding Multiplier</h2>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                Law prescribes compound interest with monthly rests at <strong>3 times the RBI Bank Rate</strong>. Currently RBI Bank Rate is 6.75% p.a., resulting in a statutory effective rate of <strong>20.25% p.a.</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                RBI Bank Rate (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.05"
                  min="1"
                  max="20"
                  value={settings.bankRate}
                  onChange={(e) => {
                    const rate = parseFloat(e.target.value) || 0;
                    onUpdateSettings({
                      ...settings,
                      bankRate: rate,
                      effectiveRate: Number((rate * 3).toFixed(2)),
                    });
                  }}
                  className="w-28 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm font-bold text-white focus:outline-none focus:border-blue-500 font-mono"
                />
                <Percent className="w-3.5 h-3.5 absolute right-3 top-2.5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="h-10 w-[1px] bg-slate-800 hidden sm:block" />

            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                3x Statutory Rate
              </span>
              <div className="px-3.5 py-1.5 rounded-lg bg-blue-950/60 border border-blue-700/60 text-blue-300 font-bold text-sm font-mono flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{(settings.bankRate * 3).toFixed(2)}% p.a.</span>
              </div>
            </div>

            <div className="h-10 w-[1px] bg-slate-800 hidden sm:block" />

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                Calculation As Of
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={settings.calculationDate}
                  onChange={(e) => {
                    onUpdateSettings({
                      ...settings,
                      calculationDate: e.target.value,
                    });
                  }}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-semibold text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 43B(h) Notice Banner */}
        <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2 text-amber-200">
            <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>
              <strong>Income-Tax Sec 43B(h) Impact:</strong> Amounts unpaid to Micro &amp; Small suppliers beyond statutory 45 days are <strong>disallowed as tax expense</strong> for the buyer!
            </span>
          </div>
          <button
            onClick={onLoadDemo}
            className="text-xs font-bold text-amber-300 hover:text-white underline underline-offset-4 transition flex items-center gap-1 cursor-pointer"
          >
            <span>Load Sample MSME Claim</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Invoice List & Real-time Compounding Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-400" />
              <span>Invoice Registry &amp; Overdue Engine</span>
            </h3>
            <p className="text-xs text-slate-400">
              Add individual commercial invoices. Statutory overdue begins strictly on day 46 (or agreed credit date).
            </p>
          </div>

          <button
            onClick={handleAddInvoice}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-lg shadow-blue-900/30 transition cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Invoice</span>
          </button>
        </div>

        {/* Cards list for each invoice */}
        <div className="space-y-3">
          {invoices.map((inv, index) => {
            const isOverdue = inv.daysOverdue > 0;
            return (
              <div 
                key={inv.id} 
                className={`p-4 rounded-xl border transition-all ${
                  isOverdue 
                    ? 'bg-slate-900/90 border-slate-700/80 shadow-md' 
                    : 'bg-slate-900/40 border-slate-800'
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-end">
                  {/* Serial & Invoice # */}
                  <div className="md:col-span-3">
                    <label className="text-[11px] font-semibold text-slate-400 flex items-center justify-between mb-1">
                      <span>Invoice Number #{index + 1}</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. INV/2026/041"
                      value={inv.invoiceNumber}
                      onChange={(e) => handleInvoiceChange(inv.id, 'invoiceNumber', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Invoice Date */}
                  <div className="md:col-span-2">
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Invoice Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={inv.invoiceDate}
                        onChange={(e) => handleInvoiceChange(inv.id, 'invoiceDate', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Agreed Credit Days (Max 45) */}
                  <div className="md:col-span-2">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-semibold text-slate-400">
                        Credit Period (Days)
                      </label>
                      <span className="text-[10px] text-blue-400 font-bold">Max 45d</span>
                    </div>
                    <input
                      type="number"
                      min="1"
                      max="45"
                      value={inv.creditPeriod}
                      onChange={(e) => {
                        const val = Math.min(45, Math.max(1, parseInt(e.target.value, 10) || 1));
                        handleInvoiceChange(inv.id, 'creditPeriod', val);
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-bold text-white font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Principal Amount (₹) */}
                  <div className="md:col-span-3">
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Principal Amount (₹)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-slate-400 font-semibold text-sm">₹</span>
                      <input
                        type="number"
                        min="1"
                        step="1000"
                        value={inv.principalAmount}
                        onChange={(e) => handleInvoiceChange(inv.id, 'principalAmount', parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-7 pr-3 py-2 text-sm font-bold text-white font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Remove Button */}
                  <div className="md:col-span-2 flex items-center justify-end">
                    <button
                      onClick={() => handleRemoveInvoice(inv.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition border border-transparent hover:border-rose-500/20 cursor-pointer"
                      title="Delete Invoice"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Sub-card with Calculated Telemetry */}
                <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="bg-slate-950/60 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">Statutory Due Date</span>
                    <span className="font-semibold text-slate-200">{formatLegalDate(inv.dueDate) || '—'}</span>
                  </div>

                  <div className="bg-slate-950/60 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">Days Overdue</span>
                    <span className={`font-bold font-mono ${isOverdue ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {inv.daysOverdue} Days {isOverdue ? '⚠️' : '✓'}
                    </span>
                  </div>

                  <div className="bg-slate-950/60 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">Accrued Compound Interest</span>
                    <span className="font-bold text-amber-400 font-mono">
                      {formatINR(inv.compoundInterest)}
                    </span>
                  </div>

                  <div className="bg-blue-950/40 border border-blue-900/40 p-2 rounded-lg">
                    <span className="text-[10px] text-blue-300 block">Total Claim (P + I)</span>
                    <span className="font-bold text-white font-mono">
                      {formatINR(inv.totalClaim)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Real-time Compounding Summary Card */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/60 border border-slate-700/80 p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Statutory Recovery Claim Summary</h4>
              <p className="text-xs text-slate-400">Section 16 Compounding Rest Formula Applied</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 font-mono text-xs font-semibold">
            {summary.invoicesCount} {summary.invoicesCount === 1 ? 'Invoice' : 'Invoices'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-xs text-slate-400 font-medium block">Total Principal Outstanding</span>
            <div className="text-2xl font-black text-white font-mono mt-1">
              {formatINR(summary.totalPrincipal)}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Excluding Tax Adjustments</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-xs text-amber-300/80 font-medium block">Max Days Overdue</span>
            <div className="text-2xl font-black text-amber-400 font-mono mt-1 flex items-center gap-1.5">
              <Clock className="w-5 h-5" />
              <span>{summary.maxDaysOverdue} Days</span>
            </div>
            <span className="text-[11px] text-amber-500/80 mt-1 block">Beyond Section 15 Limit</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-xs text-rose-300/80 font-medium block">Accrued Compound Interest</span>
            <div className="text-2xl font-black text-rose-400 font-mono mt-1">
              {formatINR(summary.totalInterest)}
            </div>
            <span className="text-[11px] text-rose-400/70 mt-1 block">3x RBI Rate (20.25% p.a.)</span>
          </div>

          <div className="p-4 rounded-xl bg-blue-600/20 border border-blue-500/40">
            <span className="text-xs text-blue-300 font-medium block">Total Statutory Claim</span>
            <div className="text-2xl font-black text-white font-mono mt-1">
              {formatINR(summary.totalClaim)}
            </div>
            <span className="text-[11px] text-blue-200 mt-1 block">Principal + Compound Interest</span>
          </div>
        </div>

        {/* Action Button to Step 2 */}
        <div className="mt-8 pt-5 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Mathematical engine validated. Ready to enter party details.</span>
          </div>

          <button
            onClick={onNext}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-bold text-white shadow-xl shadow-blue-900/40 transition cursor-pointer active:scale-98"
          >
            <span>Proceed to Parties &amp; Banking Details</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
