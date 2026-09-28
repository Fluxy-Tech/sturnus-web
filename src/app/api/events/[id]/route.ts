import { NextResponse } from "next/server";
import { deleteEvent, getEvent, updateEvent } from "@/lib/server/repository";
import { isUuid, jsonError, parseBody, requireAdmin } from "@/lib/server/http";
import { eventFieldsSchema } from "../schema";

type Context = { params: Promise<{ id: string }> };

const patchEventSchema = eventFieldsSchema.partial();

export async function GET(_request: Request, { params }: Context) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const { id } = await params;
  if (!isUuid(id)) return jsonError("Evento não encontrado.", 404);
  const event = await getEvent(id);
  return event ? NextResponse.json(event) : jsonError("Evento não encontrado.", 404);
}

export async function PATCH(request: Request, { params }: Context) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const { id } = await params;
  if (!isUuid(id)) return jsonError("Evento não encontrado.", 404);

  const { data, error } = await parseBody(request, patchEventSchema);
  if (error) return error;

  // Valida o intervalo contra o que já está gravado quando só um lado mudou.
  if (data.startsAt || data.endsAt) {
    const current = await getEvent(id);
    if (!current) return jsonError("Evento não encontrado.", 404);
    const startsAt = data.startsAt ?? new Date(current.startsAt);
    const endsAt = data.endsAt ?? new Date(current.endsAt);
    if (endsAt <= startsAt) return jsonError("O término precisa ser depois do início.", 400);
  }

  const updated = await updateEvent(id, data);
  return updated ? NextResponse.json({ ok: true }) : jsonError("Evento não encontrado.", 404);
}

export async function DELETE(_request: Request, { params }: Context) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const { id } = await params;
  if (!isUuid(id)) return jsonError("Evento não encontrado.", 404);
  const deleted = await deleteEvent(id);
  return deleted ? NextResponse.json({ ok: true }) : jsonError("Evento não encontrado.", 404);
}
