import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Style Route — The Way of Comfort",
    short_name: "Style Route",
    description: "Premium, comfort-first kidswear for boys and baby boys.",
    start_url: "/",
    background_color: "#12181c",
    theme_color: "#12181c",
    icons: [
      {
        src: "/brand/logo-square.png",
        sizes: "176x176",
        type: "image/png",
      },
    ],
  };
}
