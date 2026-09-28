import { pool } from "./db";

/// Migrations idempotentes (CREATE ... IF NOT EXISTS) rodadas no boot do
/// servidor. Tudo qualificado com `site.` porque o schema pode ainda não
/// existir quando a conexão abre com search_path=site.
const STATEMENTS = [
  `CREATE SCHEMA IF NOT EXISTS site`,

  // ---------- Better Auth (core) ----------
  `CREATE TABLE IF NOT EXISTS site."user" (
    "id" text PRIMARY KEY,
    "name" text NOT NULL,
    "email" text NOT NULL UNIQUE,
    "emailVerified" boolean NOT NULL DEFAULT false,
    "image" text,
    "createdAt" timestamptz NOT NULL DEFAULT now(),
    "updatedAt" timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS site."session" (
    "id" text PRIMARY KEY,
    "expiresAt" timestamptz NOT NULL,
    "token" text NOT NULL UNIQUE,
    "createdAt" timestamptz NOT NULL DEFAULT now(),
    "updatedAt" timestamptz NOT NULL DEFAULT now(),
    "ipAddress" text,
    "userAgent" text,
    "userId" text NOT NULL REFERENCES site."user"("id") ON DELETE CASCADE
  )`,
  `CREATE INDEX IF NOT EXISTS session_user_id_idx ON site."session"("userId")`,
  `CREATE TABLE IF NOT EXISTS site."account" (
    "id" text PRIMARY KEY,
    "accountId" text NOT NULL,
    "providerId" text NOT NULL,
    "userId" text NOT NULL REFERENCES site."user"("id") ON DELETE CASCADE,
    "accessToken" text,
    "refreshToken" text,
    "idToken" text,
    "accessTokenExpiresAt" timestamptz,
    "refreshTokenExpiresAt" timestamptz,
    "scope" text,
    "password" text,
    "createdAt" timestamptz NOT NULL DEFAULT now(),
    "updatedAt" timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS account_user_id_idx ON site."account"("userId")`,
  `CREATE TABLE IF NOT EXISTS site."verification" (
    "id" text PRIMARY KEY,
    "identifier" text NOT NULL,
    "value" text NOT NULL,
    "expiresAt" timestamptz NOT NULL,
    "createdAt" timestamptz NOT NULL DEFAULT now(),
    "updatedAt" timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS verification_identifier_idx ON site."verification"("identifier")`,

  // ---------- CRM ----------
  `CREATE TABLE IF NOT EXISTS site.crm_stage (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    position integer NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS site.lead (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    company text NOT NULL,
    phone text NOT NULL,
    email text NOT NULL,
    source text NOT NULL DEFAULT 'site',
    notes text,
    stage_id uuid REFERENCES site.crm_stage(id) ON DELETE SET NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS lead_stage_id_idx ON site.lead(stage_id)`,
  `CREATE INDEX IF NOT EXISTS lead_created_at_idx ON site.lead(created_at DESC)`,
  `CREATE TABLE IF NOT EXISTS site.lead_event (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id uuid REFERENCES site.lead(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    starts_at timestamptz NOT NULL,
    ends_at timestamptz NOT NULL,
    status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'done', 'canceled')),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS lead_event_starts_at_idx ON site.lead_event(starts_at)`,
  `CREATE INDEX IF NOT EXISTS lead_event_lead_id_idx ON site.lead_event(lead_id)`,
];

const DEFAULT_STAGES = ["Novo lead", "Em contato", "Reunião agendada", "Proposta enviada", "Ganho", "Perdido"];

export async function runMigrations() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    // Evita duas instâncias migrando ao mesmo tempo (deploy com réplicas).
    await client.query("SELECT pg_advisory_xact_lock(hashtext('sturnus-site-migrations'))");
    for (const sql of STATEMENTS) await client.query(sql);

    const { rows } = await client.query<{ count: string }>("SELECT count(*) FROM site.crm_stage");
    if (Number(rows[0].count) === 0) {
      for (const [i, name] of DEFAULT_STAGES.entries()) {
        await client.query("INSERT INTO site.crm_stage (name, position) VALUES ($1, $2)", [name, i + 1]);
      }
    }
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
