import { NextResponse, type NextRequest } from "next/server";
import { razorpay, RAZORPAY_ENABLED } from "@/lib/razorpay";

export async function GET() {
  return NextResponse.json({ enabled: RAZORPAY_ENABLED });
}

export async function POST(request: NextRequest) {
  if (!RAZORPAY_ENABLED || !razorpay) {
    return NextResponse.json({ error: "Online payment is not available right now" }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const amount = body?.amount;
  const receipt = body?.receipt;
  if (!amount || amount <= 0 || !receipt) {
    return NextResponse.json({ error: "Invalid amount or receipt" }, { status: 400 });
  }

  const order = await razorpay.orders.create({
    amount: Math.round(amount * 100),
    currency: "INR",
    receipt,
  });

  return NextResponse.json({
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
  });
}
