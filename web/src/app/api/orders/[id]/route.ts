import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin-auth";

const VALID_STATUSES = ["Awaiting confirmation", "Confirmed", "Shipped", "Delivered", "Cancelled"];

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { status } = await request.json();

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  await db.order.update({ where: { id }, data: { status } });
  return NextResponse.json({ ok: true });
}
