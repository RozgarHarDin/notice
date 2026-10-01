export interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  invoiceDate: string; // YYYY-MM-DD
  creditPeriod: number; // Agreed credit days, default 45 (max 45 per MSMED Act Section 15)
  principalAmount: number; // In INR
  // Computed fields
  dueDate: string;
  daysOverdue: number;
  statutoryRateAnnual: number; // 3x RBI Bank Rate
  compoundInterest: number;
  totalClaim: number;
}

export type EnterpriseCategory = 'Micro' | 'Small';

export interface SupplierDetails {
  businessName: string;
  category: EnterpriseCategory;
  udyamNumber: string;
  state: string;
  email: string;
  phone: string;
  address: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
  authorizedSignatory: string;
  designation: string;
}

export interface BuyerDetails {
  companyName: string;
  gstin: string;
  pan: string;
  registeredAddress: string;
  attentionLine: string;
  email: string;
}

export interface CalculationSettings {
  bankRate: number; // Baseline RBI Bank Rate (default 6.75%)
  effectiveRate: number; // 3x Bank Rate (default 20.25%)
  calculationDate: string; // YYYY-MM-DD
}

export interface CalculationSummary {
  totalPrincipal: number;
  totalInterest: number;
  totalClaim: number;
  maxDaysOverdue: number;
  invoicesCount: number;
  noticeRef: string;
  generatedAt: string;
}

export type LegalModalType = 
  | 'about' 
  | 'terms' 
  | 'privacy' 
  | 'nonAdvocate' 
  | 'refund' 
  | 'contact' 
  | null;
