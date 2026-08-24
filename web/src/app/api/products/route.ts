import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { serializeProduct } from "@/lib/serialize-product";

export async function GET(request: NextRequest) {
  const ageGroup = request.nextUrl.searchParams.get("ageGroup");
  const products = await db.product.findMany({
    where: ageGroup ? { ageGroup } : undefined,
    orderBy: { id: "asc" },
  });
  return NextResponse.json({ products: products.map(serializeProduct) });
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

  const product = await db.product.create({
    data: {
      name,
      category,
      ageGroup,
      price,
      oldPrice: oldPrice ?? null,
      image,
      badge: badge || null,
      description,
      sizes,
    },
  });

  return NextResponse.json({ product: serializeProduct(product) }, { status: 201 });
}
