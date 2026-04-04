export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: "https://fronnexus.vercel.app/sitemap.xml",
  };
}
