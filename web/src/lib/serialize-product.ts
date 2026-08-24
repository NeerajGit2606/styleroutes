import type { Product as DbProduct } from "@/generated/prisma/client";

export type ApiProduct = {
  id: number;
  name: string;
  category: string;
  ageGroup: string;
  price: number;
  oldPrice?: number;
  image: string;
  badge?: string;
  description: string;
  sizes: string[];
};

export function serializeProduct(product: DbProduct): ApiProduct {
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    ageGroup: product.ageGroup,
    price: Number(product.price),
    oldPrice: product.oldPrice != null ? Number(product.oldPrice) : undefined,
    image: product.image,
    badge: product.badge ?? undefined,
    description: product.description,
    sizes: product.sizes as string[],
  };
}
