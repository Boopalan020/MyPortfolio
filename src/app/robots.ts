import type { MetadataRoute } from "next";

const BASE_URL = "https://my-portfolio-chi-swart-90.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
