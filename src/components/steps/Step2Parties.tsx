import React from 'react';
import { 
  Building2, 
  UserCheck, 
  CreditCard, 
  ArrowLeft, 
  ArrowRight, 
  ShieldAlert, 
  Building, 
  MapPin, 
  Mail, 
  Phone,
  FileCheck2,
  Sparkles
} from 'lucide-react';
import { SupplierDetails, BuyerDetails, EnterpriseCategory } from '../../types';
import { INDIAN_STATES } from '../../utils/calculator';

interface Step2PartiesProps {
  supplier: SupplierDetails;
  buyer: BuyerDetails;
  onUpdateSupplier: (supplier: SupplierDetails) => void;
  onUpdateBuyer: (buyer: BuyerDetails) => void;
  onNext: () => void;
  onBack: () => void;
  onAutofillDemo: () => void;
}

export const Step2Parties: React.FC<Step2PartiesProps> = ({
  supplier,
  buyer,
  onUpdateSupplier,
  onUpdateBuyer,
  onNext,
  onBack,
  onAutofillDemo,
}) => {
  const handleSupplierChange = (field: keyof SupplierDetails, val: string) => {
    onUpdateSupplier({
      ...supplier,
      [field]: val,
    });
  };

  const handleBuyerChange = (field: keyof BuyerDetails, val: string) => {
    const updated = { ...buyer, [field]: val };
    // If GSTIN changed and PAN is empty, auto-extract PAN (characters 3 to 12)
    if (field === 'gstin' && val.length >= 12) {
      const extractedPan = val.substring(2, 12).toUpperCase();
      if (/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(extractedPan) && !buyer.pan) {
        updated.pan = extractedPan;
      }
    }
    onUpdateBuyer(updated);
  };

  const validateAndProceed = () => {
    if (!supplier.businessName.trim()) {
      alert("Please provide the Supplier Enterprise Name.");
      return;
    }
    if (!supplier.udyamNumber.trim()) {
      alert("Please enter the Udyam Registration Number.");
      return;
    }
    if (!supplier.accountNumber.trim()) {
      alert("Please specify your Bank Account Number for statutory remittance.");
      return;
    }
    if (!buyer.companyName.trim()) {
      alert("Please provide the Defaulting Buyer/Company Name.");
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Autofill Demo Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-blue-950/40 border border-blue-800/40">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-600/30 text-blue-300">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Party Identification &amp; Statutory Remittance</h4>
            <p className="text-xs text-slate-400">
              Ensure accurate enterprise categorization and bank details for direct RTGS/NEFT settlement.
            </p>
          </div>
        </div>

        <button
          onClick={onAutofillDemo}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-semibold transition cursor-pointer self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Autofill Demo Parties</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* SUPPLIER SECTION */}
        <div className="space-y-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">1. Supplier Details (Claimant)</h3>
                <p className="text-xs text-slate-400">MSMED Act Protected Enterprise</p>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              Claimant Entity
            </span>
          </div>

          {/* Enterprise Category: Micro or Small strictly */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">
              Statutory Enterprise Category (MSMED Act Chapter V)
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['Micro', 'Small'] as EnterpriseCategory[]).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleSupplierChange('category', cat)}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    supplier.category === cat
                      ? 'bg-blue-600/20 border-blue-500 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">{cat} Enterprise</span>
                    <span className={`w-3 h-3 rounded-full ${supplier.category === cat ? 'bg-blue-400' : 'bg-slate-700'}`} />
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    {cat === 'Micro' ? 'Investment < ₹1 Cr & Turnover < ₹5 Cr' : 'Investment < ₹10 Cr & Turnover < ₹50 Cr'}
                  </span>
                </button>
              ))}
            </div>

            {/* Strict Notice regarding Medium enterprises */}
            <div className="mt-2.5 p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-400">
                <strong className="text-amber-300">Statutory Exclusion Notice:</strong> Medium enterprises are <strong>strictly excluded</strong> from Section 15-24 delayed payment remedies and Section 43B(h) disallowance protection under the MSMED Act.
              </p>
            </div>
          </div>

          {/* Supplier Business Name */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Enterprise / Trade Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Apex Precision Tools & Components"
              value={supplier.businessName}
              onChange={(e) => handleSupplierChange('businessName', e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Udyam Registration Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Udyam Registration No. *
              </label>
              <input
                type="text"
                placeholder="UDYAM-UP-00-0012345"
                value={supplier.udyamNumber}
                onChange={(e) => handleSupplierChange('udyamNumber', e.target.value.toUpperCase())}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono uppercase focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                State of Registration
              </label>
              <select
                value={supplier.state}
                onChange={(e) => handleSupplierChange('state', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Contact Email
              </label>
              <input
                type="email"
                placeholder="accounts@apexprecision.in"
                value={supplier.email}
                onChange={(e) => handleSupplierChange('email', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Contact Phone
              </label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={supplier.phone}
                onChange={(e) => handleSupplierChange('phone', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Registered Factory / Office Address */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Registered / Works Address
            </label>
            <textarea
              rows={2}
              placeholder="Plot No. B-42, Industrial Area Phase II, Kanpur, Uttar Pradesh - 208022"
              value={supplier.address}
              onChange={(e) => handleSupplierChange('address', e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Signatory */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Authorized Signatory Name
              </label>
              <input
                type="text"
                placeholder="e.g. Ramesh Chandra Verma"
                value={supplier.authorizedSignatory}
                onChange={(e) => handleSupplierChange('authorizedSignatory', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Designation
              </label>
              <input
                type="text"
                placeholder="Managing Partner / Proprietor"
                value={supplier.designation}
                onChange={(e) => handleSupplierChange('designation', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Bank Remittance Details Box */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Bank Remittance Details (For Defaulter's RTGS/NEFT)
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  placeholder="State Bank of India / HDFC Bank"
                  value={supplier.bankName}
                  onChange={(e) => handleSupplierChange('bankName', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Account Number *
                </label>
                <input
                  type="text"
                  placeholder="309100123456"
                  value={supplier.accountNumber}
                  onChange={(e) => handleSupplierChange('accountNumber', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  IFSC Code
                </label>
                <input
                  type="text"
                  placeholder="SBIN0001234"
                  value={supplier.ifscCode}
                  onChange={(e) => handleSupplierChange('ifscCode', e.target.value.toUpperCase())}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono uppercase focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  UPI ID (Optional)
                </label>
                <input
                  type="text"
                  placeholder="apexprecision@sbi"
                  value={supplier.upiId}
                  onChange={(e) => handleSupplierChange('upiId', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* DEFAULTING BUYER SECTION */}
        <div className="space-y-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-rose-600/20 text-rose-400">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">2. Defaulting Buyer Details</h3>
                  <p className="text-xs text-slate-400">Notice Recipient &amp; Corporate Debtor</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
                Defaulting Entity
              </span>
            </div>

            {/* Buyer Company Name */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Company / Buyer Legal Entity Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Zenith Infrastructure Projects Limited"
                value={buyer.companyName}
                onChange={(e) => handleBuyerChange('companyName', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Attention Line */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Notice Attention Line (Statutory Recipient)
              </label>
              <input
                type="text"
                placeholder="The Board of Directors, Managing Director & Chief Financial Officer"
                value={buyer.attentionLine}
                onChange={(e) => handleBuyerChange('attentionLine', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Serving notice to Directors &amp; CFO ensures personal corporate notice under MSMED Act.
              </span>
            </div>

            {/* GSTIN & PAN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Buyer GSTIN (15 Digits)
                </label>
                <input
                  type="text"
                  placeholder="09AAACZ1234F1Z5"
                  maxLength={15}
                  value={buyer.gstin}
                  onChange={(e) => handleBuyerChange('gstin', e.target.value.toUpperCase())}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono uppercase focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Buyer PAN
                </label>
                <input
                  type="text"
                  placeholder="AAACZ1234F"
                  maxLength={10}
                  value={buyer.pan}
                  onChange={(e) => handleBuyerChange('pan', e.target.value.toUpperCase())}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono uppercase focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Buyer Email */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Buyer Accounts / Legal Desk Email
              </label>
              <input
                type="email"
                placeholder="finance@zenithinfra.com, md@zenithinfra.com"
                value={buyer.email}
                onChange={(e) => handleBuyerChange('email', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Buyer Registered Office Address */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Registered Corporate Office Address
              </label>
              <textarea
                rows={3}
                placeholder="Zenith Tower, 8th Floor, Sector 62, Noida, Uttar Pradesh - 201309"
                value={buyer.registeredAddress}
                onChange={(e) => handleBuyerChange('registeredAddress', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-400 mt-4">
            <span className="font-semibold text-slate-200">Legal Postal Transmission Tip:</span> This notice is drafted for formal transmission through <strong>Registered Post with A.D.</strong> and concurrent copy via official corporate email.
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <button
          onClick={onBack}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Invoices &amp; Rates</span>
        </button>

        <button
          onClick={validateAndProceed}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-bold text-white shadow-xl shadow-blue-900/40 transition cursor-pointer active:scale-98"
        >
          <span>Continue to Notice Review Summary</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
