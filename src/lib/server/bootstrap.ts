import { randomUUID } from "node:crypto";
import { hashPassword } from "better-auth/crypto";
import { pool } from "./db";
import { runMigrations } from "./migrate";

/// Garante que o admin de ADMIN_EMAIL existe. Não mexe na senha de um admin
/// já criado — trocar ADMIN_PASSWORD depois do primeiro boot não tem efeito.
async function ensureAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() || "Administrador";
  if (!email || !password) return;

  const existing = await pool.query('SELECT 1 FROM site."user" WHERE email = $1', [email]);
  if (existing.rowCount) return;

  const userId = randomUUID();
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      'INSERT INTO site."user" ("id", "name", "email", "emailVerified") VALUES ($1, $2, $3, true)',
      [userId, name, email],
    );
    await client.query(
      `INSERT INTO site."account" ("id", "accountId", "providerId", "userId", "password")
       VALUES ($1, $2, 'credential', $2, $3)`,
      [randomUUID(), userId, await hashPassword(password)],
    );
    await client.query("COMMIT");
    console.log(`[bootstrap] admin ${email} criado.`);
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function bootstrap() {
  await runMigrations();
  await ensureAdmin();
}
