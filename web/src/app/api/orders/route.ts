import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { sendOrderNotificationEmail } from "@/lib/mailer";

export async function POST(request: NextRequest) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const { orderNumber, items, customer, subtotal, shipping, total } = body ?? {};

  if (!orderNumber || !items || !customer || subtotal == null || shipping == null || total == null) {
    return NextResponse.json({ error: "Missing order fields" }, { status: 400 });
  }

  // Fire the owner-notification email as a backup to WhatsApp — best-effort,
  // never blocks or fails checkout (mailer swallows its own errors).
  sendOrderNotificationEmail({ orderNumber, items, customer, subtotal, shipping, total });

  try {
    await db.order.create({
      data: { orderNumber, items, customer, subtotal, shipping, total },
    });
    return NextResponse.json({ ok: true });
  } catch {
    // The customer's order already made it into WhatsApp and their own
    // "My Orders" (localStorage) regardless of whether this DB write
    // succeeds — so a DB hiccup here shouldn't surface as a checkout error.
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const orders = await db.order.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ orders });
}
