import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { serializeProduct } from "@/lib/serialize-product";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await db.product.findUnique({ where: { id: Number(id) } });
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  return NextResponse.json({ product: serializeProduct(product) });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { name, category, ageGroup, price, oldPrice, image, badge, description, sizes } = body ?? {};
  if (!name || !category || !ageGroup || price == null || !image || !description || !Array.isArray(sizes) || sizes.length === 0) {
    return NextResponse.json({ error: "Missing required product fields" }, { status: 400 });
  }

  const product = await db.product.update({
    where: { id: Number(id) },
    data: { name, category, ageGroup, price, oldPrice: oldPrice ?? null, image, badge: badge || null, description, sizes },
  });

  return NextResponse.json({ product: serializeProduct(product) });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await db.product.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
