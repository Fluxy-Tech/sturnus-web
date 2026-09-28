import { NextResponse } from "next/server";
import { z } from "zod";
import { deleteStage, renameStage } from "@/lib/server/repository";
import { isUuid, jsonError, parseBody, requireAdmin } from "@/lib/server/http";

type Context = { params: Promise<{ id: string }> };

const stageSchema = z.object({ name: z.string().trim().min(1, "Informe o nome do estágio.").max(60) });

export async function PATCH(request: Request, { params }: Context) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const { id } = await params;
  if (!isUuid(id)) return jsonError("Estágio não encontrado.", 404);

  const { data, error } = await parseBody(request, stageSchema);
  if (error) return error;

  const updated = await renameStage(id, data.name);
  return updated ? NextResponse.json({ ok: true }) : jsonError("Estágio não encontrado.", 404);
}

export async function DELETE(_request: Request, { params }: Context) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const { id } = await params;
  if (!isUuid(id)) return jsonError("Estágio não encontrado.", 404);

  const result = await deleteStage(id);
  if (result === "not_found") return jsonError("Estágio não encontrado.", 404);
  if (result === "last_stage") return jsonError("O Kanban precisa de pelo menos um estágio.", 409);
  return NextResponse.json({ ok: true });
}
