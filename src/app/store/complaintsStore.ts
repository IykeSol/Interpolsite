export type ScamType =
  | "Online Shopping"
  | "Investment Fraud"
  | "Romance Scam"
  | "Phishing"
  | "Cryptocurrency Fraud"
  | "Business Email Compromise"
  | "Lottery/Prize Scam"
  | "Tech Support Scam"
  | "Bank Fraud"
  | "Other";

export type CaseStatus =
  | "Pending Review"
  | "Under Investigation"
  | "Evidence Collection"
  | "Recovery In Progress"
  | "Resolved"
  | "Closed";

export interface PaymentDetails {
  method: "bank" | "btc" | "eth";
  // Bank transfer fields
  accountHolder?: string;
  bankName?: string;
  accountNumber?: string;
  ibanRouting?: string;
  swiftBic?: string;
  bankCountry?: string;
  // Crypto fields
  walletAddress?: string;
  submittedAt?: string;
}

export interface Complaint {
  id: string;
  caseNumber: string;
  createdAt: string;
  status: CaseStatus;
  // Victim info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  // Scam details
  scamType: ScamType;
  amountLost: number;
  currency: string;
  dateOfIncident: string;
  scammerName: string;
  scammerEmail: string;
  scammerWebsite: string;
  scammerPhone: string;
  description: string;
  // Admin notes
  adminNotes: string;
  recoveredAmount: number;
  lastUpdated: string;
  receivedByVictim: boolean;
  // Payment details submitted by complainant
  paymentDetails?: PaymentDetails;
}


const STORAGE_KEY = "interpol_complaints";

export function generateCaseNumber(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `IGCI-${year}-${rand}`;
}

export function getComplaints(): Complaint[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : getSeedData();
  } catch {
    return getSeedData();
  }
}

export function saveComplaint(complaint: Complaint): void {
  const complaints = getComplaints();
  complaints.unshift(complaint);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
}

export function updateComplaint(updated: Complaint): void {
  const complaints = getComplaints();
  const index = complaints.findIndex((c) => c.id === updated.id);
  if (index !== -1) {
    complaints[index] = { ...updated, lastUpdated: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
  }
}

export function getComplaintByCaseNumber(caseNumber: string): Complaint | undefined {
  return getComplaints().find(
    (c) => c.caseNumber.toLowerCase() === caseNumber.toLowerCase()
  );
}

function getSeedData(): Complaint[] {
  const seed: Complaint[] = [
    {
      id: "1",
      caseNumber: "IGCI-2024-847392",
      createdAt: "2024-11-15T10:23:00Z",
      status: "Resolved",
      firstName: "James",
      lastName: "Morrison",
      email: "j.morrison@email.com",
      phone: "+1 555-0142",
      country: "United States",
      scamType: "Investment Fraud",
      amountLost: 45000,
      currency: "USD",
      dateOfIncident: "2024-10-01",
      scammerName: "Alex Tanner",
      scammerEmail: "alextanner@cryptopro.fake",
      scammerWebsite: "www.cryptopro-invest.fake",
      scammerPhone: "",
      description:
        "Was contacted via LinkedIn about a high-yield crypto investment. Transferred funds over 3 weeks. When tried to withdraw, account was frozen.",
      adminNotes: "Scammer traced to Eastern Europe. Funds partially recovered via international wire reversal.",
      recoveredAmount: 38500,
      lastUpdated: "2025-01-10T14:00:00Z",
      receivedByVictim: true,
    },
    {
      id: "2",
      caseNumber: "IGCI-2025-112847",
      createdAt: "2025-01-20T08:45:00Z",
      status: "Recovery In Progress",
      firstName: "Amina",
      lastName: "Osei",
      email: "amina.osei@mail.com",
      phone: "+44 7911 234567",
      country: "United Kingdom",
      scamType: "Romance Scam",
      amountLost: 22000,
      currency: "GBP",
      dateOfIncident: "2025-01-05",
      scammerName: "Robert Williams (alias)",
      scammerEmail: "rob.williams2045@proton.fake",
      scammerWebsite: "",
      scammerPhone: "+1 555-9999",
      description:
        "Met on dating app, developed relationship over 4 months. Scammer claimed to be offshore engineer. Requested money for medical emergency.",
      adminNotes: "IP traced to Nigeria. Coordinating with local authorities. Bank flagged transactions.",
      recoveredAmount: 0,
      lastUpdated: "2025-02-01T09:30:00Z",
      receivedByVictim: false,
    },
    {
      id: "3",
      caseNumber: "IGCI-2025-203948",
      createdAt: "2025-02-10T14:12:00Z",
      status: "Under Investigation",
      firstName: "Carlos",
      lastName: "Mendez",
      email: "cmendez@correo.com",
      phone: "+34 612 345 678",
      country: "Spain",
      scamType: "Phishing",
      amountLost: 8500,
      currency: "EUR",
      dateOfIncident: "2025-02-08",
      scammerName: "Unknown",
      scammerEmail: "support@bankofspain-secure.fake",
      scammerWebsite: "www.bankofspain-secure.fake",
      scammerPhone: "",
      description:
        "Received an email claiming my bank account was suspended. Clicked link and entered credentials. Funds were transferred within 10 minutes.",
      adminNotes: "Phishing domain seized. Investigating financial trail.",
      recoveredAmount: 0,
      lastUpdated: "2025-02-12T11:00:00Z",
      receivedByVictim: false,
    },
    {
      id: "4",
      caseNumber: "IGCI-2025-219384",
      createdAt: "2025-02-18T09:00:00Z",
      status: "Pending Review",
      firstName: "Yuki",
      lastName: "Tanaka",
      email: "yuki.tanaka@jpmail.com",
      phone: "+81 90 1234 5678",
      country: "Japan",
      scamType: "Cryptocurrency Fraud",
      amountLost: 15000,
      currency: "USD",
      dateOfIncident: "2025-02-15",
      scammerName: "DeFi Investment Group",
      scammerEmail: "invest@defi-group.fake",
      scammerWebsite: "www.defi-investment-group.fake",
      scammerPhone: "+852 1234 5678",
      description:
        "Found a crypto investment platform promising 300% returns. Invested through their platform. Website went offline after 2 weeks.",
      adminNotes: "",
      recoveredAmount: 0,
      lastUpdated: "2025-02-18T09:00:00Z",
      receivedByVictim: false,
    },
  ];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  return seed;
}
