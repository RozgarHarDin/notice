import { InvoiceItem, CalculationSettings, CalculationSummary } from '../types';

/**
 * Standard Indian States and Union Territories
 */
export const INDIAN_STATES = [
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal'
];

/**
 * Format a number into Indian Rupee Currency representation (e.g. ₹ 12,34,567.89)
 */
export function formatINR(val: number, includeDecimals = true): string {
  if (isNaN(val) || val === null || val === undefined) return '₹0.00';
  const rounded = Number(val.toFixed(2));
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0,
  }).format(rounded);
}

/**
 * Format standard date to legible legal string (e.g. 15th Oct, 2026)
 */
export function formatLegalDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const d = new Date(year, month, day);

    const dayNum = d.getDate();
    const suffix =
      dayNum % 10 === 1 && dayNum !== 11
        ? 'st'
        : dayNum % 10 === 2 && dayNum !== 12
        ? 'nd'
        : dayNum % 10 === 3 && dayNum !== 13
        ? 'rd'
        : 'th';

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return `${dayNum}${suffix} ${monthNames[month]}, ${year}`;
  } catch {
    return dateStr;
  }
}

/**
 * Calculate due date given invoice date and agreed credit days (max 45 per MSMED Act Section 15)
 */
export function calculateDueDate(invoiceDateStr: string, creditDays: number): string {
  if (!invoiceDateStr) return '';
  const effectiveDays = Math.min(Math.max(1, creditDays || 45), 45);
  const parts = invoiceDateStr.split('-');
  if (parts.length !== 3) return '';
  
  const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  d.setDate(d.getDate() + effectiveDays);

  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Calculate days overdue between statutory due date and calculation date
 */
export function calculateDaysOverdue(dueDateStr: string, calculationDateStr: string): number {
  if (!dueDateStr || !calculationDateStr) return 0;
  const dueParts = dueDateStr.split('-');
  const calcParts = calculationDateStr.split('-');
  if (dueParts.length !== 3 || calcParts.length !== 3) return 0;

  const due = new Date(parseInt(dueParts[0], 10), parseInt(dueParts[1], 10) - 1, parseInt(dueParts[2], 10)).getTime();
  const calc = new Date(parseInt(calcParts[0], 10), parseInt(calcParts[1], 10) - 1, parseInt(calcParts[2], 10)).getTime();

  const diffMs = calc - due;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

/**
 * Accrued Compound Interest Calculation as per Sections 15 & 16 of MSMED Act, 2006:
 * Compound interest with monthly rests at 3 times the Bank Rate notified by the Reserve Bank of India.
 * Formula:
 * A = P * (1 + (3 * BankRate) / 12) ^ (Days / 30.4167) - P
 */
export function calculateCompoundInterest(
  principal: number,
  daysOverdue: number,
  bankRatePercent: number
): number {
  if (principal <= 0 || daysOverdue <= 0) return 0;

  // Bank rate as decimal: e.g. 6.75% -> 0.0675
  const bankRateDecimal = bankRatePercent / 100;
  const statutoryAnnualRate = 3 * bankRateDecimal; // e.g. 20.25% -> 0.2025
  const monthlyRate = statutoryAnnualRate / 12; // 0.016875 per month

  // Compounding periods (monthly rests, average 30.4167 days per month)
  const compoundingPeriods = daysOverdue / 30.4167;

  // Compounded interest: A = P * (1 + r)^n - P
  const interest = principal * (Math.pow(1 + monthlyRate, compoundingPeriods) - 1);
  return Number(Math.max(0, interest).toFixed(2));
}

/**
 * Computes all dependent metrics for an invoice item
 */
export function computeInvoiceItem(
  item: Omit<InvoiceItem, 'dueDate' | 'daysOverdue' | 'statutoryRateAnnual' | 'compoundInterest' | 'totalClaim'>,
  settings: CalculationSettings
): InvoiceItem {
  const effectiveCredit = Math.min(Math.max(1, item.creditPeriod || 45), 45);
  const dueDate = calculateDueDate(item.invoiceDate, effectiveCredit);
  const daysOverdue = calculateDaysOverdue(dueDate, settings.calculationDate);
  const effectiveStatutoryRate = Number((settings.bankRate * 3).toFixed(2));
  const compoundInterest = calculateCompoundInterest(item.principalAmount, daysOverdue, settings.bankRate);
  const totalClaim = Number((item.principalAmount + compoundInterest).toFixed(2));

  return {
    ...item,
    creditPeriod: effectiveCredit,
    dueDate,
    daysOverdue,
    statutoryRateAnnual: effectiveStatutoryRate,
    compoundInterest,
    totalClaim,
  };
}

/**
 * Summarize all invoices
 */
export function summarizeInvoices(
  invoices: InvoiceItem[],
  settings: CalculationSettings
): CalculationSummary {
  const totalPrincipal = invoices.reduce((acc, inv) => acc + (inv.principalAmount || 0), 0);
  const totalInterest = invoices.reduce((acc, inv) => acc + (inv.compoundInterest || 0), 0);
  const totalClaim = totalPrincipal + totalInterest;
  const maxDaysOverdue = invoices.reduce((acc, inv) => Math.max(acc, inv.daysOverdue || 0), 0);

  // Generate unique notice reference
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const currentYear = new Date().getFullYear();
  const noticeRef = `UN/MSME/${currentYear}/${randomSuffix}`;

  return {
    totalPrincipal: Number(totalPrincipal.toFixed(2)),
    totalInterest: Number(totalInterest.toFixed(2)),
    totalClaim: Number(totalClaim.toFixed(2)),
    maxDaysOverdue,
    invoicesCount: invoices.length,
    noticeRef,
    generatedAt: settings.calculationDate,
  };
}

/**
 * Convert numbers to Indian Rupees Words for court-ready legal precision
 */
export function numberToIndianRupeesWords(num: number): string {
  if (isNaN(num) || num === null || num === undefined) return 'Zero Rupees Only';
  const rounded = Math.round(num);
  if (rounded === 0) return 'Zero Rupees Only';

  const singleDigits = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convertHundreds(n: number): string {
    let str = '';
    if (n > 99) {
      str += singleDigits[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n > 19) {
      str += tens[Math.floor(n / 10)] + ' ' + singleDigits[n % 10];
    } else if (n > 9) {
      str += teens[n - 10];
    } else if (n > 0) {
      str += singleDigits[n];
    }
    return str.trim();
  }

  let n = Math.abs(rounded);
  const crores = Math.floor(n / 10000000);
  n %= 10000000;
  const lakhs = Math.floor(n / 100000);
  n %= 100000;
  const thousands = Math.floor(n / 1000);
  n %= 1000;
  const remaining = n;

  let result = '';
  if (crores > 0) result += convertHundreds(crores) + ' Crore ';
  if (lakhs > 0) result += convertHundreds(lakhs) + ' Lakh ';
  if (thousands > 0) result += convertHundreds(thousands) + ' Thousand ';
  if (remaining > 0) result += convertHundreds(remaining);

  return `Rupees ${result.trim()} Only`;
}

/**
 * Helper to get today's date formatted as YYYY-MM-DD
 */
export function getTodayDateString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
