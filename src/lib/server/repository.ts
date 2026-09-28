import type { CrmStage, EventStatus, Lead, LeadDetail, LeadEvent } from "@/types/domain";
import { pool } from "./db";

// ---------- mapeamento de linhas ----------

interface LeadRow {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  source: string;
  notes: string | null;
  stage_id: string | null;
  stage_name: string | null;
  created_at: Date;
  updated_at: Date;
}

function toLead(row: LeadRow): Lead {
  return {
    id: row.id,
    name: row.name,
    company: row.company,
    phone: row.phone,
    email: row.email,
    source: row.source,
    notes: row.notes,
    stageId: row.stage_id,
    stageName: row.stage_name,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

interface EventRow {
  id: string;
  lead_id: string | null;
  lead_name: string | null;
  lead_company: string | null;
  title: string;
  description: string | null;
  starts_at: Date;
  ends_at: Date;
  status: EventStatus;
  created_at: Date;
}

function toEvent(row: EventRow): LeadEvent {
  return {
    id: row.id,
    leadId: row.lead_id,
    lead: row.lead_id ? { id: row.lead_id, name: row.lead_name ?? "", company: row.lead_company ?? "" } : null,
    title: row.title,
    description: row.description,
    startsAt: row.starts_at.toISOString(),
    endsAt: row.ends_at.toISOString(),
    status: row.status,
    createdAt: row.created_at.toISOString(),
  };
}

const LEAD_SELECT = `
  SELECT l.*, s.name AS stage_name
  FROM site.lead l
  LEFT JOIN site.crm_stage s ON s.id = l.stage_id`;

const EVENT_SELECT = `
  SELECT e.*, l.name AS lead_name, l.company AS lead_company
  FROM site.lead_event e
  LEFT JOIN site.lead l ON l.id = e.lead_id`;

// ---------- leads ----------

export async function createLead(input: { name: string; company: string; phone: string; email: string }) {
  // Lead novo entra sempre no primeiro estágio do Kanban.
  const { rows } = await pool.query<{ id: string }>(
    `INSERT INTO site.lead (name, company, phone, email, stage_id)
     VALUES ($1, $2, $3, $4, (SELECT id FROM site.crm_stage ORDER BY position LIMIT 1))
     RETURNING id`,
    [input.name, input.company, input.phone, input.email],
  );
  return rows[0].id;
}

export async function listLeads(search?: string): Promise<Lead[]> {
  const term = search?.trim();
  const { rows } = term
    ? await pool.query<LeadRow>(
        `${LEAD_SELECT}
         WHERE l.name ILIKE $1 OR l.company ILIKE $1 OR l.email ILIKE $1 OR l.phone LIKE $2
         ORDER BY l.created_at DESC`,
        [`%${term}%`, `%${term.replace(/\D/g, "") || term}%`],
      )
    : await pool.query<LeadRow>(`${LEAD_SELECT} ORDER BY l.created_at DESC`);
  return rows.map(toLead);
}

export async function getLead(id: string): Promise<LeadDetail | null> {
  const { rows } = await pool.query<LeadRow>(`${LEAD_SELECT} WHERE l.id = $1`, [id]);
  if (!rows[0]) return null;
  const events = await pool.query<EventRow>(`${EVENT_SELECT} WHERE e.lead_id = $1 ORDER BY e.starts_at DESC`, [id]);
  return { ...toLead(rows[0]), events: events.rows.map(toEvent) };
}

const LEAD_COLUMNS = {
  name: "name",
  company: "company",
  phone: "phone",
  email: "email",
  notes: "notes",
  stageId: "stage_id",
} as const;

export type LeadPatch = Partial<Record<keyof typeof LEAD_COLUMNS, string | null>>;

export async function updateLead(id: string, patch: LeadPatch) {
  const sets: string[] = [];
  const values: unknown[] = [];
  for (const [key, column] of Object.entries(LEAD_COLUMNS)) {
    const value = patch[key as keyof LeadPatch];
    if (value === undefined) continue;
    values.push(value);
    sets.push(`${column} = $${values.length}`);
  }
  if (sets.length === 0) return true;
  values.push(id);
  const { rowCount } = await pool.query(
    `UPDATE site.lead SET ${sets.join(", ")}, updated_at = now() WHERE id = $${values.length}`,
    values,
  );
  return (rowCount ?? 0) > 0;
}

export async function deleteLead(id: string) {
  const { rowCount } = await pool.query("DELETE FROM site.lead WHERE id = $1", [id]);
  return (rowCount ?? 0) > 0;
}

// ---------- estágios do CRM ----------

export async function getBoard(): Promise<CrmStage[]> {
  const stages = await pool.query<{ id: string; name: string; position: number }>(
    "SELECT id, name, position FROM site.crm_stage ORDER BY position",
  );
  const leads = await pool.query<LeadRow>(`${LEAD_SELECT} ORDER BY l.updated_at DESC`);
  const all = leads.rows.map(toLead);
  return stages.rows.map((stage) => ({ ...stage, leads: all.filter((lead) => lead.stageId === stage.id) }));
}

export async function createStage(name: string) {
  const { rows } = await pool.query<{ id: string }>(
    `INSERT INTO site.crm_stage (name, position)
     VALUES ($1, COALESCE((SELECT max(position) FROM site.crm_stage), 0) + 1)
     RETURNING id`,
    [name],
  );
  return rows[0].id;
}

export async function renameStage(id: string, name: string) {
  const { rowCount } = await pool.query("UPDATE site.crm_stage SET name = $1 WHERE id = $2", [name, id]);
  return (rowCount ?? 0) > 0;
}

/// Leads do estágio excluído vão pro primeiro estágio restante — nunca ficam
/// "soltos" fora do Kanban. O último estágio não pode ser excluído.
export async function deleteStage(id: string): Promise<"ok" | "not_found" | "last_stage"> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query<{ id: string }>("SELECT id FROM site.crm_stage ORDER BY position FOR UPDATE");
    if (!rows.some((row) => row.id === id)) {
      await client.query("ROLLBACK");
      return "not_found";
    }
    const fallback = rows.find((row) => row.id !== id);
    if (!fallback) {
      await client.query("ROLLBACK");
      return "last_stage";
    }
    await client.query("UPDATE site.lead SET stage_id = $1, updated_at = now() WHERE stage_id = $2", [fallback.id, id]);
    await client.query("DELETE FROM site.crm_stage WHERE id = $1", [id]);
    await client.query("COMMIT");
    return "ok";
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

// ---------- eventos (calendário) ----------

export async function listEvents(from: Date, to: Date): Promise<LeadEvent[]> {
  const { rows } = await pool.query<EventRow>(
    `${EVENT_SELECT} WHERE e.starts_at >= $1 AND e.starts_at <= $2 ORDER BY e.starts_at`,
    [from, to],
  );
  return rows.map(toEvent);
}

export async function getEvent(id: string): Promise<LeadEvent | null> {
  const { rows } = await pool.query<EventRow>(`${EVENT_SELECT} WHERE e.id = $1`, [id]);
  return rows[0] ? toEvent(rows[0]) : null;
}

export async function createEvent(input: {
  leadId: string | null;
  title: string;
  description: string | null;
  startsAt: Date;
  endsAt: Date;
  status: EventStatus;
}) {
  const { rows } = await pool.query<{ id: string }>(
    `INSERT INTO site.lead_event (lead_id, title, description, starts_at, ends_at, status)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
    [input.leadId, input.title, input.description, input.startsAt, input.endsAt, input.status],
  );
  return rows[0].id;
}

const EVENT_COLUMNS = {
  leadId: "lead_id",
  title: "title",
  description: "description",
  startsAt: "starts_at",
  endsAt: "ends_at",
  status: "status",
} as const;

export type EventPatch = Partial<Record<keyof typeof EVENT_COLUMNS, string | Date | null>>;

export async function updateEvent(id: string, patch: EventPatch) {
  const sets: string[] = [];
  const values: unknown[] = [];
  for (const [key, column] of Object.entries(EVENT_COLUMNS)) {
    const value = patch[key as keyof EventPatch];
    if (value === undefined) continue;
    values.push(value);
    sets.push(`${column} = $${values.length}`);
  }
  if (sets.length === 0) return true;
  values.push(id);
  const { rowCount } = await pool.query(
    `UPDATE site.lead_event SET ${sets.join(", ")}, updated_at = now() WHERE id = $${values.length}`,
    values,
  );
  return (rowCount ?? 0) > 0;
}

export async function deleteEvent(id: string) {
  const { rowCount } = await pool.query("DELETE FROM site.lead_event WHERE id = $1", [id]);
  return (rowCount ?? 0) > 0;
}
