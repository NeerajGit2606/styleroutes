import { NextResponse, type NextRequest } from "next/server";
import { createAdminSession, verifyAdminPassword } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (!(await verifyAdminPassword(password))) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  await createAdminSession();
  return NextResponse.json({ ok: true });
}
