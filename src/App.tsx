/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Scale, 
  FileText, 
  Calculator, 
  ShieldCheck, 
  Users, 
  Zap, 
  HelpCircle, 
  Download, 
  Smartphone, 
  Building, 
  Mail, 
  MapPin, 
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  InvoiceItem, 
  SupplierDetails, 
  BuyerDetails, 
  CalculationSettings, 
  LegalModalType 
} from './types';
import { 
  computeInvoiceItem, 
  summarizeInvoices, 
  getTodayDateString 
} from './utils/calculator';
import { Step1Calculator } from './components/steps/Step1Calculator';
import { Step2Parties } from './components/steps/Step2Parties';
import { Step3CompileNotice } from './components/steps/Step3CompileNotice';
import { LegalModals } from './components/modals/LegalModals';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';

export default function App() {
  // Wizard active step: 1 | 2 | 3
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Active Legal Compliance Modal
  const [activeModal, setActiveModal] = useState<LegalModalType>(null);

  // Calculation Settings
  const [settings, setSettings] = useState<CalculationSettings>({
    bankRate: 6.75, // Baseline RBI Bank Rate
    effectiveRate: 20.25, // 3x Bank Rate
    calculationDate: getTodayDateString(),
  });

  // Invoices (Dynamic Invoice Builder)
  const [invoices, setInvoices] = useState<InvoiceItem[]>(() => {
    const today = new Date();
    // Default invoice 1 (overdue by 40 days past 45d limit = 85 days old)
    const d1 = new Date(today);
    d1.setDate(today.getDate() - 85);
    const date1 = `${d1.getFullYear()}-${String(d1.getMonth() + 1).padStart(2, '0')}-${String(d1.getDate()).padStart(2, '0')}`;

    // Default invoice 2 (overdue by 15 days past 45d limit = 60 days old)
    const d2 = new Date(today);
    d2.setDate(today.getDate() - 60);
    const date2 = `${d2.getFullYear()}-${String(d2.getMonth() + 1).padStart(2, '0')}-${String(d2.getDate()).padStart(2, '0')}`;

    return [
      computeInvoiceItem(
        {
          id: 'inv-1',
          invoiceNumber: 'INV/2026/041',
          invoiceDate: date1,
          creditPeriod: 45,
          principalAmount: 485000,
        },
        { bankRate: 6.75, effectiveRate: 20.25, calculationDate: getTodayDateString() }
      ),
      computeInvoiceItem(
        {
          id: 'inv-2',
          invoiceNumber: 'INV/2026/058',
          invoiceDate: date2,
          creditPeriod: 45,
          principalAmount: 320000,
        },
        { bankRate: 6.75, effectiveRate: 20.25, calculationDate: getTodayDateString() }
      ),
    ];
  });

  // Supplier Details (Claimant)
  const [supplier, setSupplier] = useState<SupplierDetails>({
    businessName: 'Vanguard Precision Engineering Works',
    category: 'Micro',
    udyamNumber: 'UDYAM-UP-28-0049182',
    state: 'Uttar Pradesh',
    email: 'accounts@vanguardprecision.in',
    phone: '+91 94150 82910',
    address: 'Plot No. C-18, Panki Industrial Area Phase III, Kanpur, Uttar Pradesh - 208022',
    bankName: 'State Bank of India',
    accountNumber: '389201948123',
    ifscCode: 'SBIN0001784',
    upiId: 'vanguardprecision@sbi',
    authorizedSignatory: 'Rajesh Kumar Saxena',
    designation: 'Managing Partner',
  });

  // Defaulting Buyer Details
  const [buyer, setBuyer] = useState<BuyerDetails>({
    companyName: 'Apex Commercial Infrastructure Projects Pvt Ltd',
    gstin: '09AAACA8492K1Z8',
    pan: 'AAACA8492K',
    registeredAddress: 'Apex Horizon Tower, 9th Floor, Sector 128, Expressway, Noida, Uttar Pradesh - 201304',
    attentionLine: 'The Board of Directors, Managing Director & Chief Financial Officer',
    email: 'finance@apexinfra.com, legal@apexinfra.com',
  });

  // Recompute invoices when settings change
  const computedInvoices = useMemo(() => {
    return invoices.map((inv) => computeInvoiceItem(inv, settings));
  }, [invoices, settings]);

  // Overall summary metrics
  const summary = useMemo(() => {
    return summarizeInvoices(computedInvoices, settings);
  }, [computedInvoices, settings]);

  // Handler for invoice updates
  const handleUpdateInvoices = (newInvoices: InvoiceItem[]) => {
    setInvoices(newInvoices);
  };

  // Demo Case Loader
  const handleLoadDemo = () => {
    const today = new Date();
    const d1 = new Date(today);
    d1.setDate(today.getDate() - 90);
    const date1 = `${d1.getFullYear()}-${String(d1.getMonth() + 1).padStart(2, '0')}-${String(d1.getDate()).padStart(2, '0')}`;

    const d2 = new Date(today);
    d2.setDate(today.getDate() - 75);
    const date2 = `${d2.getFullYear()}-${String(d2.getMonth() + 1).padStart(2, '0')}-${String(d2.getDate()).padStart(2, '0')}`;

    const d3 = new Date(today);
    d3.setDate(today.getDate() - 55);
    const date3 = `${d3.getFullYear()}-${String(d3.getMonth() + 1).padStart(2, '0')}-${String(d3.getDate()).padStart(2, '0')}`;

    const demoInvoices: InvoiceItem[] = [
      computeInvoiceItem(
        {
          id: 'demo-1',
          invoiceNumber: 'INV/2026/089',
          invoiceDate: date1,
          creditPeriod: 45,
          principalAmount: 650000,
        },
        settings
      ),
      computeInvoiceItem(
        {
          id: 'demo-2',
          invoiceNumber: 'INV/2026/102',
          invoiceDate: date2,
          creditPeriod: 45,
          principalAmount: 420000,
        },
        settings
      ),
      computeInvoiceItem(
        {
          id: 'demo-3',
          invoiceNumber: 'INV/2026/115',
          invoiceDate: date3,
          creditPeriod: 45,
          principalAmount: 310000,
        },
        settings
      ),
    ];
    setInvoices(demoInvoices);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Offline Connectivity Banner */}
      <OfflineIndicator />

      {/* Top Statutory Ticker (Hidden in print) */}
      <div className="no-print bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border-b border-blue-800/40 text-[11px] py-1.5 px-4 text-center text-blue-200 flex items-center justify-center gap-2 overflow-x-auto whitespace-nowrap">
        <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 text-[10px]">
          STATUTORY MANDATE
        </span>
        <span>
          MSMED Act 2006 Sections 15 &amp; 16: Compound interest with monthly rests at 3x RBI Bank Rate (20.25% p.a.).
        </span>
        <span className="hidden md:inline text-blue-400">•</span>
        <span className="hidden md:inline text-blue-300">
          Section 43B(h) Tax Disallowance strictly enforced for buyer defaults beyond 45 days.
        </span>
      </div>

      {/* Main Navigation Header (Hidden in print) */}
      <header className="no-print sticky top-0 z-30 bg-slate-950/85 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Entity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-900/40 border border-blue-400/30 flex-shrink-0">
              <Scale className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black tracking-tight text-white font-legal-heading">
                  UdyamNotice
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  LegalTech v2.4
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block truncate max-w-xs md:max-w-md">
                MSME 45-Days Statutory Delayed Payment Calculator &amp; Notice Generator
              </p>
            </div>
          </div>

          {/* Quick Actions & PWA Install */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setActiveModal('nonAdvocate')}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Legal Disclaimer</span>
            </button>

            <button
              onClick={() => setActiveModal('about')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
              <span>About Utility</span>
            </button>

            {/* PWA Install Button */}
            <PWAInstallButton />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {/* Hero Section (Hidden in print) */}
        <section className="no-print relative overflow-hidden pt-8 pb-6 border-b border-slate-800/80 bg-gradient-to-b from-slate-900/60 to-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
              <span>Statutory Compliance Engine under Sections 15 &amp; 16 of MSMED Act, 2006</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight max-w-4xl mx-auto font-legal-heading leading-tight">
              MSME 45-Days Statutory Delayed Payment <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-300 bg-clip-text text-transparent">Calculator &amp; Notice Generator</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Empowering registered Indian Micro &amp; Small Enterprises to compute statutory compound interest with monthly rests at <strong>3x the RBI Bank Rate (20.25% p.a.)</strong> and synthesize court-ready legal demand notices in seconds.
            </p>

            {/* Core Metrics Bar */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto text-left">
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 shadow-md">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Statutory Interest</span>
                <span className="text-base sm:text-lg font-black text-amber-400 font-mono">20.25% p.a.</span>
                <span className="text-[10px] text-slate-500 block">3x RBI Bank Rate</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 shadow-md">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Max Credit Period</span>
                <span className="text-base sm:text-lg font-black text-blue-400 font-mono">45 Days</span>
                <span className="text-[10px] text-slate-500 block">Section 15 MSMED Act</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 shadow-md">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Income Tax Impact</span>
                <span className="text-base sm:text-lg font-black text-rose-400">Sec 43B(h)</span>
                <span className="text-[10px] text-slate-500 block">Buyer Expense Disallowance</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 shadow-md">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Data Protection</span>
                <span className="text-base sm:text-lg font-black text-emerald-400">100% Client-Side</span>
                <span className="text-[10px] text-slate-500 block">DPDP Act &amp; IT Act 2000</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3-Step Wizard Navigation Stepper (Hidden in print) */}
        <section className="no-print max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
          <div className="grid grid-cols-3 gap-2 sm:gap-4 p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            {/* Step 1 Tab */}
            <button
              onClick={() => setCurrentStep(1)}
              className={`flex items-center justify-center sm:justify-start gap-2 sm:gap-3 p-3 rounded-xl transition text-left cursor-pointer ${
                currentStep === 1
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                currentStep === 1 ? 'bg-white text-blue-600' : 'bg-slate-800 text-slate-300'
              }`}>
                1
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold leading-tight">Step 1: Calculator</p>
                <p className="text-[10px] opacity-80">Invoices &amp; Overdue Engine</p>
              </div>
            </button>

            {/* Step 2 Tab */}
            <button
              onClick={() => setCurrentStep(2)}
              className={`flex items-center justify-center sm:justify-start gap-2 sm:gap-3 p-3 rounded-xl transition text-left cursor-pointer ${
                currentStep === 2
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                currentStep === 2 ? 'bg-white text-blue-600' : 'bg-slate-800 text-slate-300'
              }`}>
                2
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold leading-tight">Step 2: Parties</p>
                <p className="text-[10px] opacity-80">Supplier &amp; Defaulter Details</p>
              </div>
            </button>

            {/* Step 3 Tab */}
            <button
              onClick={() => setCurrentStep(3)}
              className={`flex items-center justify-center sm:justify-start gap-2 sm:gap-3 p-3 rounded-xl transition text-left cursor-pointer ${
                currentStep === 3
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                currentStep === 3 ? 'bg-white text-blue-600' : 'bg-slate-800 text-slate-300'
              }`}>
                3
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold leading-tight">Step 3: Document Compilation</p>
                <p className="text-[10px] opacity-80">Review &amp; Ready Notice</p>
              </div>
            </button>
          </div>
        </section>

        {/* Wizard Step Content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {currentStep === 1 && (
            <Step1Calculator
              invoices={computedInvoices}
              settings={settings}
              summary={summary}
              onUpdateInvoices={handleUpdateInvoices}
              onUpdateSettings={setSettings}
              onNext={() => setCurrentStep(2)}
              onLoadDemo={handleLoadDemo}
            />
          )}

          {currentStep === 2 && (
            <Step2Parties
              supplier={supplier}
              buyer={buyer}
              onUpdateSupplier={setSupplier}
              onUpdateBuyer={setBuyer}
              onNext={() => setCurrentStep(3)}
              onBack={() => setCurrentStep(1)}
              onAutofillDemo={handleLoadDemo}
            />
          )}

          {currentStep === 3 && (
            <Step3CompileNotice
              invoices={computedInvoices}
              supplier={supplier}
              buyer={buyer}
              settings={settings}
              summary={summary}
              onBack={() => setCurrentStep(2)}
            />
          )}
        </section>
      </main>

      {/* Footer (Hidden in print) */}
      <footer className="no-print border-t border-slate-800 bg-slate-950 text-xs text-slate-400 pt-10 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800/80">
            {/* Brand column */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-amber-300">
                  <Scale className="w-4 h-4" />
                </div>
                <span className="font-bold text-white font-legal-heading text-sm">
                  UdyamNotice LegalTech
                </span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Automated statutory delayed payment calculation &amp; court-ready notice synthesis utility under Sections 15 &amp; 16 of the MSMED Act, 2006.
              </p>
              <div className="text-[11px] text-slate-500 space-y-1">
                <p><strong className="text-slate-400">Operating Entity:</strong> UdyamNotice LegalTech Systems</p>
                <p><strong className="text-slate-400">Operational Base:</strong> Uttar Pradesh, India</p>
              </div>
            </div>

            {/* Statutory References */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider">
                Statutory Mandates
              </h4>
              <ul className="space-y-1.5 text-[11px] text-slate-400">
                <li>• Section 15, MSMED Act, 2006 (Max 45-day credit period)</li>
                <li>• Section 16, MSMED Act, 2006 (Compound interest at 3x RBI Bank Rate)</li>
                <li>• Section 18, MSMED Act, 2006 (MSEFC Arbitration &amp; Samadhaan)</li>
                <li>• Section 23, MSMED Act, 2006 (Interest not tax deductible)</li>
                <li>• Section 43B(h), Income-tax Act, 1961 (Buyer disallowance)</li>
              </ul>
            </div>

            {/* Legal & Compliance Links */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider">
                Compliance &amp; Governance
              </h4>
              <ul className="space-y-1.5 text-[11px]">
                <li>
                  <button onClick={() => setActiveModal('about')} className="hover:text-blue-400 transition cursor-pointer">
                    About Us &amp; Legal Tech Scope
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveModal('terms')} className="hover:text-blue-400 transition cursor-pointer">
                    Terms of Service &amp; Computation Responsibilities
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveModal('privacy')} className="hover:text-blue-400 transition cursor-pointer">
                    Privacy Policy (DPDP Act &amp; IT Act 2000)
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveModal('nonAdvocate')} className="hover:text-blue-400 transition cursor-pointer text-amber-300">
                    Non-Advocate &amp; Mathematical Utility Declaration
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveModal('refund')} className="hover:text-blue-400 transition cursor-pointer">
                    Refund Policy (7-Day Technical Failure Terms)
                  </button>
                </li>
              </ul>
            </div>

            {/* Helpdesk & Support Desk */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider">
                Electronic Helpdesk
              </h4>
              <p className="text-[11px] text-slate-400">
                Direct statutory support &amp; bug reporting desk:
              </p>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-xs">
                  <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <a href="mailto:udyamnotice@gmail.com" className="text-white hover:text-blue-400 transition font-mono">
                    udyamnotice@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Uttar Pradesh, India</span>
                </div>
              </div>
              <button 
                onClick={() => setActiveModal('contact')} 
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 underline underline-offset-4 cursor-pointer"
              >
                Open Contact Us Desk
              </button>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <p>© {new Date().getFullYear()} UdyamNotice LegalTech Systems. All rights reserved.</p>
            <p>Non-advocate computational software utility. For informational and algorithmic calculation assistance only.</p>
          </div>
        </div>
      </footer>

      {/* Render Active Legal Compliance Modal */}
      <LegalModals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
      />
    </div>
  );
}
