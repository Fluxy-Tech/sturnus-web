import { NextResponse } from "next/server";
import { getBoard } from "@/lib/server/repository";
import { requireAdmin } from "@/lib/server/http";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  return NextResponse.json({ stages: await getBoard() });
}
