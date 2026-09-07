import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { serializeProduct } from "@/lib/serialize-product";
import { ProductView } from "@/components/ProductView";
import { SITE_URL } from "@/lib/config";

// Product data is admin-editable, so this can't be statically generated.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await db.product.findUnique({ where: { id: Number(id) } });
  if (!product) {
    return { title: "Product — StyleRoute" };
  }
  const title = `${product.name} — StyleRoute`;
  const url = `${SITE_URL}/product/${product.id}`;
  return {
    title,
    description: product.description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: "Style Route",
      title,
      description: product.description,
      images: [{ url: product.image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: product.description,
      images: [product.image],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await db.product.findUnique({ where: { id: Number(id) } });
  if (!product) notFound();

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    sku: String(product.id),
    category: product.category,
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/product/${product.id}`,
      priceCurrency: "INR",
      price: Number(product.price),
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <ProductView product={serializeProduct(product)} />
    </>
  );
}
