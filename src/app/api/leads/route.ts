import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createLead, listLeads } from "@/lib/server/repository";
import { jsonError, parseBody, requireAdmin } from "@/lib/server/http";

const createLeadSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome.").max(120),
  company: z.string().trim().min(1, "Informe o nome da empresa.").max(160),
  phone: z
    .string()
    .transform((value) => value.replace(/\D/g, ""))
    .pipe(z.string().min(10, "Informe um telefone válido.").max(15, "Informe um telefone válido.")),
  email: z.string().trim().toLowerCase().pipe(z.email("Informe um e-mail válido.")),
  /// Honeypot: campo invisível no formulário — só bot preenche.
  website: z.string().optional(),
});

/// Limite simples por IP (memória do processo) pra segurar spam no formulário
/// público: 5 envios a cada 10 minutos.
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_MAX;
}

/// Público: formulário "Solicitar agendamento" da home.
export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) return jsonError("Muitas solicitações. Tente novamente em alguns minutos.", 429);

  const { data, error } = await parseBody(request, createLeadSchema);
  if (error) return error;

  // Bot caiu no honeypot: responde sucesso sem gravar nada.
  if (data.website) return NextResponse.json({ ok: true }, { status: 201 });

  await createLead({ name: data.name, company: data.company, phone: data.phone, email: data.email });
  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const search = request.nextUrl.searchParams.get("q") ?? undefined;
  return NextResponse.json(await listLeads(search));
}
