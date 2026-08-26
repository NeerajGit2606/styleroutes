import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { sendEnquiryNotificationEmail } from "@/lib/mailer";

export async function POST(request: NextRequest) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const { name, contact, message, latitude, longitude } = body ?? {};

  if (!name || !contact) {
    return NextResponse.json({ error: "Name and contact are required" }, { status: 400 });
  }

  const enquiry = await db.enquiry.create({
    data: {
      name: String(name).trim(),
      contact: String(contact).trim(),
      message: message ? String(message).trim() : undefined,
      latitude: typeof latitude === "number" ? latitude : undefined,
      longitude: typeof longitude === "number" ? longitude : undefined,
    },
  });

  sendEnquiryNotificationEmail({
    name: enquiry.name,
    contact: enquiry.contact,
    message: enquiry.message ?? undefined,
    latitude: enquiry.latitude ?? undefined,
    longitude: enquiry.longitude ?? undefined,
  });

  return NextResponse.json({ ok: true });
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const enquiries = await db.enquiry.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ enquiries });
}
