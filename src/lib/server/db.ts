import { Pool } from "pg";

/// Todo o site vive no schema Postgres `site` — o schema `public` do mesmo
/// banco é da plataforma (Agent-Api/Prisma, inclusive as tabelas de Better
/// Auth dela). O search_path faz o Better Auth enxergar só as nossas tabelas
/// `user`/`session`/... sem colidir com as de lá.
export const DB_SCHEMA = "site";

const globalForDb = globalThis as unknown as { pgPool?: Pool };

export const pool =
  globalForDb.pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    options: `-c search_path=${DB_SCHEMA}`,
    max: 10,
  });

// Em dev o HMR reavalia o módulo — reaproveita o pool em vez de abrir outro.
if (process.env.NODE_ENV !== "production") globalForDb.pgPool = pool;
