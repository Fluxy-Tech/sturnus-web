import { NextResponse } from "next/server";
import { z } from "zod";
import { deleteLead, getLead, updateLead } from "@/lib/server/repository";
import { isUuid, jsonError, parseBody, requireAdmin } from "@/lib/server/http";

type Context = { params: Promise<{ id: string }> };

const patchLeadSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome.").max(120).optional(),
  company: z.string().trim().min(1, "Informe a empresa.").max(160).optional(),
  phone: z
    .string()
    .transform((value) => value.replace(/\D/g, ""))
    .pipe(z.string().min(10, "Telefone inválido.").max(15, "Telefone inválido."))
    .optional(),
  email: z.string().trim().toLowerCase().pipe(z.email("E-mail inválido.")).optional(),
  notes: z.string().max(5000).nullable().optional(),
  stageId: z.uuid("Estágio inválido.").optional(),
});

export async function GET(_request: Request, { params }: Context) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const { id } = await params;
  if (!isUuid(id)) return jsonError("Lead não encontrado.", 404);
  const lead = await getLead(id);
  return lead ? NextResponse.json(lead) : jsonError("Lead não encontrado.", 404);
}

export async function PATCH(request: Request, { params }: Context) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const { id } = await params;
  if (!isUuid(id)) return jsonError("Lead não encontrado.", 404);

  const { data, error } = await parseBody(request, patchLeadSchema);
  if (error) return error;

  const updated = await updateLead(id, data);
  return updated ? NextResponse.json({ ok: true }) : jsonError("Lead não encontrado.", 404);
}

export async function DELETE(_request: Request, { params }: Context) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const { id } = await params;
  if (!isUuid(id)) return jsonError("Lead não encontrado.", 404);
  const deleted = await deleteLead(id);
  return deleted ? NextResponse.json({ ok: true }) : jsonError("Lead não encontrado.", 404);
}
