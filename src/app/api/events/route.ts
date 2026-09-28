import { NextResponse, type NextRequest } from "next/server";
import { createEvent, listEvents } from "@/lib/server/repository";
import { jsonError, parseBody, requireAdmin } from "@/lib/server/http";
import { eventFieldsSchema } from "./schema";

const createEventSchema = eventFieldsSchema
  .partial({ description: true, status: true, leadId: true })
  .refine((data) => data.endsAt > data.startsAt, { message: "O término precisa ser depois do início." });

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const from = new Date(request.nextUrl.searchParams.get("from") ?? "");
  const to = new Date(request.nextUrl.searchParams.get("to") ?? "");
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
    return jsonError("Informe o período (from/to).", 400);
  }
  return NextResponse.json(await listEvents(from, to));
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { data, error } = await parseBody(request, createEventSchema);
  if (error) return error;

  const id = await createEvent({
    leadId: data.leadId ?? null,
    title: data.title,
    description: data.description ?? null,
    startsAt: data.startsAt,
    endsAt: data.endsAt,
    status: data.status ?? "scheduled",
  });
  return NextResponse.json({ id }, { status: 201 });
}
