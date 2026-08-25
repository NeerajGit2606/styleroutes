import type { MetadataRoute } from "next";
import { db } from "@/lib/db";

const BASE_URL = "https://styleroute.co.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await db.product.findMany({ select: { id: true } });

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/newborn`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/toddler`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/kids`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/looks`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/about`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/contact`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/policy/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/policy/returns`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/policy/terms`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/policy/shipping`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${BASE_URL}/product/${product.id}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes];
}
