import { supabase, isSupabaseConfigured } from "../lib/supabase";
import type { Complaint, PaymentDetails } from "./complaintsStore";

// ── Supabase row shape (snake_case) ──────────────────────────────────────────
interface DbRow {
  id: string;
  case_number: string;
  created_at: string;
  status: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country: string;
  scam_type: string;
  amount_lost: number;
  currency: string;
  date_of_incident: string;
  scammer_name: string;
  scammer_email: string;
  scammer_website: string;
  scammer_phone: string;
  description: string;
  admin_notes: string;
  recovered_amount: number;
  last_updated: string;
  received_by_victim: boolean;
  payment_details: PaymentDetails | null;
}

// ── Camel ↔ Snake mappers ────────────────────────────────────────────────────
function toRow(c: Partial<Complaint>): Partial<DbRow> {
  const row: any = {};
  if (c.id !== undefined) row.id = c.id;
  if (c.caseNumber !== undefined) row.case_number = c.caseNumber;
  if (c.status !== undefined) row.status = c.status;
  if (c.firstName !== undefined) row.first_name = c.firstName;
  if (c.lastName !== undefined) row.last_name = c.lastName;
  if (c.email !== undefined) row.email = c.email;
  if (c.phone !== undefined) row.phone = c.phone;
  if (c.country !== undefined) row.country = c.country;
  if (c.scamType !== undefined) row.scam_type = c.scamType;
  if (c.amountLost !== undefined) row.amount_lost = c.amountLost;
  if (c.currency !== undefined) row.currency = c.currency;
  if (c.dateOfIncident !== undefined) row.date_of_incident = c.dateOfIncident;
  if (c.scammerName !== undefined) row.scammer_name = c.scammerName;
  if (c.scammerEmail !== undefined) row.scammer_email = c.scammerEmail;
  if (c.scammerWebsite !== undefined) row.scammer_website = c.scammerWebsite;
  if (c.scammerPhone !== undefined) row.scammer_phone = c.scammerPhone;
  if (c.description !== undefined) row.description = c.description;
  if (c.adminNotes !== undefined) row.admin_notes = c.adminNotes;
  if (c.recoveredAmount !== undefined) row.recovered_amount = c.recoveredAmount;
  if (c.lastUpdated !== undefined) row.last_updated = c.lastUpdated;
  if (c.receivedByVictim !== undefined) row.received_by_victim = c.receivedByVictim;
  if (c.paymentDetails !== undefined) row.payment_details = c.paymentDetails;
  return row;
}

function fromRow(row: any): Complaint {
  // Use a helper to only map fields that exist in the row object
  // This allows partial selects without wiping data on subsequent updates
  const c: any = {};
  const map = (cam: string, snk: string, def?: any) => {
    if (Object.prototype.hasOwnProperty.call(row, snk)) {
      c[cam] = row[snk] ?? def;
    }
  };

  map("id", "id");
  map("caseNumber", "case_number");
  map("createdAt", "created_at");
  map("status", "status");
  map("firstName", "first_name");
  map("lastName", "last_name");
  map("email", "email");
  map("phone", "phone", "");
  map("country", "country");
  map("scamType", "scam_type");
  map("amountLost", "amount_lost", 0);
  map("currency", "currency");
  map("dateOfIncident", "date_of_incident");
  map("scammerName", "scammer_name", "");
  map("scammerEmail", "scammer_email", "");
  map("scammerWebsite", "scammer_website", "");
  map("scammerPhone", "scammer_phone", "");
  map("description", "description", "");
  map("adminNotes", "admin_notes", "");
  map("recoveredAmount", "recovered_amount", 0);
  map("lastUpdated", "last_updated");
  map("receivedByVictim", "received_by_victim", false);
  map("paymentDetails", "payment_details");

  return c as Complaint;
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function sbGetComplaints(): Promise<Complaint[]> {
  if (!isSupabaseConfigured || !supabase) throw new Error("Supabase not configured");
  const { data, error } = await supabase
    .from("complaints")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as DbRow[]).map(fromRow);
}

export async function sbSaveComplaint(complaint: Complaint): Promise<void> {
  if (!isSupabaseConfigured || !supabase) throw new Error("Supabase not configured");
  const row = { ...toRow(complaint), created_at: complaint.createdAt };
  const { error } = await supabase.from("complaints").insert(row);
  if (error) throw error;
}

export async function sbUpdateComplaint(updated: Complaint): Promise<void> {
  if (!isSupabaseConfigured || !supabase) throw new Error("Supabase not configured");
  const now = new Date().toISOString();
  const row = { ...toRow(updated), last_updated: now };
  const { error } = await supabase
    .from("complaints")
    .update(row)
    .eq("id", updated.id);
  if (error) throw error;
}

export async function sbGetComplaintByCaseNumber(
  caseNumber: string
): Promise<Complaint | null> {
  if (!isSupabaseConfigured || !supabase) throw new Error("Supabase not configured");
  const { data, error } = await supabase
    .from("complaints")
    .select("id, case_number, status, first_name, last_name, country, scam_type, amount_lost, currency, date_of_incident, admin_notes, recovered_amount, last_updated, created_at, received_by_victim, payment_details")
    .ilike("case_number", caseNumber)
    .maybeSingle();
  if (error) throw error;
  return data ? fromRow(data as DbRow) : null;
}

export { isSupabaseConfigured };
