import { NextResponse } from "next/server";
import { z } from "zod";
import { createStage } from "@/lib/server/repository";
import { parseBody, requireAdmin } from "@/lib/server/http";

const stageSchema = z.object({ name: z.string().trim().min(1, "Informe o nome do estágio.").max(60) });

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const { data, error } = await parseBody(request, stageSchema);
  if (error) return error;
  return NextResponse.json({ id: await createStage(data.name) }, { status: 201 });
}
