export type CaseStatus = 'pending' | 'under_investigation' | 'recovered' | 'closed';

export interface FraudCase {
  id: string;
  submittedAt: string;
  status: CaseStatus;
  // Victim info
  victimName: string;
  victimEmail: string;
  victimPhone: string;
  victimCountry: string;
  // Scam details
  scamType: string;
  amountLost: number;
  currency: string;
  dateOfIncident: string;
  description: string;
  // Scammer info
  scammerName: string;
  scammerEmail: string;
  scammerWebsite: string;
  scammerAccount: string;
  // Admin fields
  adminNotes: string;
  investigatorAssigned: string;
  recoveryAmount: number;
  lastUpdated: string;
}

const STORAGE_KEY = 'interpol_fraud_cases';

export function generateCaseId(): string {
  const year = new Date().getFullYear();
  const num = Math.floor(100000 + Math.random() * 900000);
  return `IFR-${year}-${num}`;
}

export function getCases(): FraudCase[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getSampleCases();
    return JSON.parse(raw);
  } catch {
    return getSampleCases();
  }
}

export function saveCase(c: FraudCase): void {
  const cases = getCases();
  const idx = cases.findIndex(x => x.id === c.id);
  if (idx >= 0) {
    cases[idx] = c;
  } else {
    cases.push(c);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
}

export function getCaseById(id: string): FraudCase | null {
  return getCases().find(c => c.id === id) || null;
}

export function updateCase(id: string, updates: Partial<FraudCase>): boolean {
  const cases = getCases();
  const idx = cases.findIndex(c => c.id === id);
  if (idx < 0) return false;
  cases[idx] = { ...cases[idx], ...updates, lastUpdated: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
  return true;
}

function getSampleCases(): FraudCase[] {
  const samples: FraudCase[] = [
    {
      id: 'IFR-2025-482931',
      submittedAt: '2025-11-14T09:23:00Z',
      status: 'recovered',
      victimName: 'James Thornton',
      victimEmail: 'j.thornton@email.com',
      victimPhone: '+1-555-0142',
      victimCountry: 'United States',
      scamType: 'Investment Fraud',
      amountLost: 85000,
      currency: 'USD',
      dateOfIncident: '2025-10-02',
      description: 'Fake cryptocurrency trading platform stole funds. Promised 300% ROI within 30 days.',
      scammerName: 'CryptoMaxGains Ltd',
      scammerEmail: 'support@cryptomaxgains.net',
      scammerWebsite: 'cryptomaxgains.net',
      scammerAccount: 'IBAN: GB29NWBK60161331926819',
      adminNotes: 'Traced funds to shell account in Malta. Coordinated with local authorities. Funds frozen and returned.',
      investigatorAssigned: 'Chief Investigator',
      recoveryAmount: 85000,
      lastUpdated: '2026-01-10T14:30:00Z',
    },
    {
      id: 'IFR-2025-731044',
      submittedAt: '2025-12-01T15:10:00Z',
      status: 'under_investigation',
      victimName: 'Amara Osei',
      victimEmail: 'amara.osei@mail.gh',
      victimPhone: '+233-244-555-8821',
      victimCountry: 'Ghana',
      scamType: 'Romance Scam',
      amountLost: 32000,
      currency: 'USD',
      dateOfIncident: '2025-11-20',
      description: 'Met person online who claimed to be a US military officer. Was asked to send money multiple times for emergencies.',
      scammerName: 'Unknown (alias: Cpt. Robert Blake)',
      scammerEmail: 'rblake.us.army@proton.me',
      scammerWebsite: '',
      scammerAccount: 'Bitcoin wallet: 1A1zP1eP5QGefi2DMPTfTL5SLmv7Divf',
      adminNotes: 'Bitcoin trace underway. IP logs requested from Protonmail.',
      investigatorAssigned: 'Chief Investigator',
      recoveryAmount: 0,
      lastUpdated: '2026-01-15T11:00:00Z',
    },
    {
      id: 'IFR-2026-102847',
      submittedAt: '2026-01-18T08:05:00Z',
      status: 'pending',
      victimName: 'Sofia Reyes',
      victimEmail: 'sofia.reyes@correo.mx',
      victimPhone: '+52-55-1234-5678',
      victimCountry: 'Mexico',
      scamType: 'Phishing / Bank Fraud',
      amountLost: 15500,
      currency: 'USD',
      dateOfIncident: '2026-01-10',
      description: 'Received email from fake bank asking to verify account. Credentials stolen and account drained.',
      scammerName: 'Unknown',
      scammerEmail: 'security@firstnationalbank-verify.com',
      scammerWebsite: 'firstnationalbank-verify.com',
      scammerAccount: 'Wire transferred to unknown Cayman account',
      adminNotes: '',
      investigatorAssigned: '',
      recoveryAmount: 0,
      lastUpdated: '2026-01-18T08:05:00Z',
    },
  ];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(samples));
  return samples;
}
