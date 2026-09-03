import { NextResponse, type NextRequest } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { sendOrderNotificationEmail } from "@/lib/mailer";
import { RAZORPAY_ENABLED } from "@/lib/razorpay";

export async function POST(request: NextRequest) {
  if (!RAZORPAY_ENABLED) {
    return NextResponse.json({ error: "Online payment is not available right now" }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order } = body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !order) {
    return NextResponse.json({ error: "Missing payment fields" }, { status: 400 });
  }

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
  }

  const { orderNumber, items, customer, subtotal, shipping, total } = order;
  if (!orderNumber || !items || !customer || subtotal == null || shipping == null || total == null) {
    return NextResponse.json({ error: "Missing order fields" }, { status: 400 });
  }

  sendOrderNotificationEmail({ orderNumber, items, customer, subtotal, shipping, total });

  try {
    await db.order.create({
      data: {
        orderNumber,
        items,
        customer,
        subtotal,
        shipping,
        total,
        paymentMethod: "Prepaid",
        paymentStatus: "Paid",
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
      },
    });
  } catch {
    // The payment already succeeded on Razorpay's side — a DB hiccup here
    // shouldn't be surfaced to the customer as a failed payment.
  }

  return NextResponse.json({ ok: true });
}
