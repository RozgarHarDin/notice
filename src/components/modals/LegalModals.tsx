import React from 'react';
import { X, ShieldCheck, Scale, FileText, Lock, RefreshCcw, Mail, MapPin, Building, AlertCircle } from 'lucide-react';
import { LegalModalType } from '../../types';

interface LegalModalsProps {
  activeModal: LegalModalType;
  onClose: () => void;
}

export const LegalModals: React.FC<LegalModalsProps> = ({ activeModal, onClose }) => {
  if (!activeModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl max-h-[88vh] rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl flex flex-col overflow-hidden text-slate-200 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            {activeModal === 'about' && <Building className="w-5 h-5 text-blue-400" />}
            {activeModal === 'terms' && <FileText className="w-5 h-5 text-amber-400" />}
            {activeModal === 'privacy' && <Lock className="w-5 h-5 text-emerald-400" />}
            {activeModal === 'nonAdvocate' && <Scale className="w-5 h-5 text-purple-400" />}
            {activeModal === 'refund' && <RefreshCcw className="w-5 h-5 text-sky-400" />}
            {activeModal === 'contact' && <Mail className="w-5 h-5 text-rose-400" />}
            
            <h2 className="text-lg font-bold text-white">
              {activeModal === 'about' && 'About Us & Legal Tech Scope'}
              {activeModal === 'terms' && 'Terms of Service & Computational Responsibilities'}
              {activeModal === 'privacy' && 'Privacy Policy (DPDP Act & IT Act 2000)'}
              {activeModal === 'nonAdvocate' && 'Non-Advocate & Mathematical Utility Declaration'}
              {activeModal === 'refund' && 'Refund Policy (7-Day Technical Failure Terms)'}
              {activeModal === 'contact' && 'Contact Us Desk'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm leading-relaxed text-slate-300">
          {activeModal === 'about' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-800/40 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-200">
                  <strong className="text-white">UdyamNotice LegalTech Systems</strong> is an automated computational aid utility engineered specifically to assist registered Indian Micro and Small Enterprises in calculating statutory interest and formulating preliminary demand notices.
                </p>
              </div>
              <h3 className="font-semibold text-white">1. Operational Mandate</h3>
              <p>
                Delayed receivables severely cripple the working capital cycles of MSMEs. The Micro, Small and Medium Enterprises Development Act, 2006 (MSMED Act) was enacted by the Parliament of India with strict penal provisions under Sections 15, 16, and 17 to curb this exploitation.
              </p>
              <h3 className="font-semibold text-white">2. Scope of Computation</h3>
              <p>
                UdyamNotice provides standardized mathematical compounding engines at 3 times the RBI Bank Rate (fixed with monthly rests) as stipulated by Section 16 of the MSMED Act, 2006, along with correlation to Section 43B(h) of the Income-tax Act, 1961.
              </p>
              <h3 className="font-semibold text-white">3. Operating Entity & Location</h3>
              <div className="text-xs bg-slate-800/80 p-3 rounded-lg border border-slate-700 space-y-1">
                <p><strong className="text-slate-200">Entity:</strong> UdyamNotice LegalTech Systems</p>
                <p><strong className="text-slate-200">Headquarters / Operational Base:</strong> Uttar Pradesh, India</p>
                <p><strong className="text-slate-200">Electronic Desk:</strong> udyamnotice@gmail.com</p>
              </div>
            </div>
          )}

          {activeModal === 'terms' && (
            <div className="space-y-4">
              <p>
                By accessing or utilizing the UdyamNotice utility, you accept and agree to be bound by these Terms of Service.
              </p>
              <h3 className="font-semibold text-white">1. User Verification Responsibility</h3>
              <p>
                The user bears sole responsibility for verifying the factual accuracy of invoice numbers, invoice dates, agreed credit periods, and actual payment status prior to dispatching any statutory notice.
              </p>
              <h3 className="font-semibold text-white">2. Section 15 Limitation (Maximum 45 Days)</h3>
              <p>
                As governed by the proviso to Section 15 of the MSMED Act, 2006, in no case shall the credit period agreed upon between supplier and buyer in writing exceed forty-five (45) days. In the absence of an agreement in writing, payment is legally due within fifteen (15) days.
              </p>
              <h3 className="font-semibold text-white">3. Statutory Compound Rate Calculation</h3>
              <p>
                Calculations are derived algorithmically based on the RBI Bank Rate notification. Users may cross-verify the baseline rate against current Reserve Bank of India gazette publications.
              </p>
              <h3 className="font-semibold text-white">4. No Liability for Unilateral Notices</h3>
              <p>
                UdyamNotice Systems shall not be liable for any legal dispute, counterclaim, defamation allegation, or arbitration claim arising from notices issued by users.
              </p>
            </div>
          )}

          {activeModal === 'privacy' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/40 flex items-start gap-3">
                <Lock className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-200">
                  <strong className="text-white">Zero-Server Storage Architecture:</strong> In compliance with the Digital Personal Data Protection Act, 2023 (DPDP Act) and the Information Technology Act, 2000, all calculation data is processed entirely in your local browser sandbox.
                </p>
              </div>
              <h3 className="font-semibold text-white">1. Local Execution & Data Privacy</h3>
              <p>
                Your invoice details, banking numbers, Udyam registration numbers, and debtor information are never transmitted, saved, logged, or harvested on remote servers during Phase 1 operations.
              </p>
              <h3 className="font-semibold text-white">2. Cookies & Local Storage</h3>
              <p>
                UdyamNotice utilizes standard client-side browser storage solely for caching Progressive Web App application shells for offline functionality. No tracking or marketing cookies are deployed.
              </p>
              <h3 className="font-semibold text-white">3. Data Principal Rights</h3>
              <p>
                Because no personal identifiable information (PII) is stored remotely, clearing your browser cache immediately purges all entered session data.
              </p>
            </div>
          )}

          {activeModal === 'nonAdvocate' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-800/40 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-purple-200">
                  <strong className="text-white">Mandatory Legal Tech Disclaimer:</strong> UdyamNotice is a computational software tool and NOT a law firm.
                </p>
              </div>
              <h3 className="font-semibold text-white">1. Algorithmic Utility, Not Legal Representation</h3>
              <p>
                The materials, calculation sheets, and draft notice templates generated by UdyamNotice are algorithmic self-service computational aids. Neither UdyamNotice LegalTech Systems nor any affiliated personnel act as your advocate or legal counsel.
              </p>
              <h3 className="font-semibold text-white">2. No Advocate-Client Relationship</h3>
              <p>
                Use of this tool does not create an advocate-client relationship. If complex litigation, insolvency proceedings (IBC), or formal arbitration before the Micro and Small Enterprise Facilitation Council (MSEFC / MSME Samadhaan) is initiated, users are advised to consult a qualified Advocate or legal practitioner.
              </p>
              <h3 className="font-semibold text-white">3. Compliance with Bar Council of India Rules</h3>
              <p>
                In strict conformity with Bar Council of India guidelines prohibiting solicitation of legal work, UdyamNotice does not advertise advocate services or solicit legal retainership.
              </p>
            </div>
          )}

          {activeModal === 'refund' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-white">7-Day Technical Failure Refund Terms</h3>
              <p>
                UdyamNotice Phase 1 is offered as a free-to-use community utility for Indian MSMEs. In the event of any premium enterprise report generation or paid statutory add-on:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-300">
                <li>
                  <strong className="text-white">7-Day Window:</strong> If a technical bug, computational corruption, or failed PDF generation prevents document retrieval, a 100% refund is processed within 7 calendar days of notification.
                </li>
                <li>
                  <strong className="text-white">Claim Verification:</strong> Claims must be transmitted with transaction proof to <span className="text-blue-400 font-mono">udyamnotice@gmail.com</span>.
                </li>
                <li>
                  <strong className="text-white">Settlement Channel:</strong> Refunds will be credited directly to the original payment source (UPI/Netbanking) within 5 to 7 business banking days.
                </li>
              </ul>
            </div>
          )}

          {activeModal === 'contact' && (
            <div className="space-y-4">
              <p>
                For technical feedback, statutory bug reports, or legal tech partnership queries, contact our nodal helpdesk:
              </p>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Official Electronic Desk</p>
                    <a href="mailto:udyamnotice@gmail.com" className="text-sm font-semibold text-white hover:text-blue-400 transition font-mono">
                      udyamnotice@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-600/20 text-emerald-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Operational Base</p>
                    <p className="text-sm font-semibold text-white">
                      Uttar Pradesh, India
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-600/20 text-purple-400">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Operating Entity</p>
                    <p className="text-sm font-semibold text-white">
                      UdyamNotice LegalTech Systems
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-800/40 rounded-lg border border-slate-700/60 text-xs text-slate-400">
                Operating Hours: Monday – Saturday (10:00 AM to 6:30 PM IST). Average email response window: under 24 hours.
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
