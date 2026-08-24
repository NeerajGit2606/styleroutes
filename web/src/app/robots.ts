import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/cart", "/checkout", "/account", "/orders", "/order-confirmed", "/api"],
    },
    sitemap: "https://styleroute.co.in/sitemap.xml",
  };
}
