import { NextResponse } from "next/server";
import type { z } from "zod";
import { getAdminSession } from "./auth";

export function jsonError(message: string, status: number) {
  return NextResponse.json({ message }, { status });
}

/// Retorna uma resposta 401 se não houver sessão de admin, ou null se estiver ok.
export async function requireAdmin() {
  const session = await getAdminSession();
  return session ? null : jsonError("Não autenticado.", 401);
}

export async function parseBody<T extends z.ZodType>(
  request: Request,
  schema: T,
): Promise<{ data: z.infer<T>; error?: never } | { data?: never; error: NextResponse }> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return { error: jsonError("Corpo da requisição inválido.", 400) };
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return { error: jsonError(parsed.error.issues[0]?.message ?? "Dados inválidos.", 400) };
  }
  return { data: parsed.data };
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: string) {
  return UUID_RE.test(value);
}
