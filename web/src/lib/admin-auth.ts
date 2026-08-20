import { cookies } from "next/headers";
import crypto from "node:crypto";

const COOKIE_NAME = "sr_admin_session";

// Not a full user-accounts system — just enough to keep the orders view
// away from casual visitors. The cookie holds an HMAC of the password
// (not the password itself) so it can't be forged without knowing it.
function sign(password: string) {
  return crypto.createHmac("sha256", password).update("styleroute-admin").digest("hex");
}

export async function verifyAdminPassword(password: string) {
  return password === process.env.ADMIN_PASSWORD;
}

export async function createAdminSession() {
  const store = await cookies();
  store.set(COOKIE_NAME, sign(process.env.ADMIN_PASSWORD ?? ""), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function clearAdminSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function isAdminAuthenticated() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return token === sign(process.env.ADMIN_PASSWORD ?? "");
}
