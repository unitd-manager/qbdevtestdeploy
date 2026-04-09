// app/sitemap.xml/route.js
export async function GET() {
  // Fetch WordPress sitemap index
  const wpSitemap = await fetch(`${process.env.NEXT_PUBLIC_WP_URL}/sitemap_index.xml`);
  let xml = await wpSitemap.text();

  // Replace WordPress URLs → frontend URLs
  xml = xml.replaceAll(process.env.NEXT_PUBLIC_WP_URL, process.env.NEXT_PUBLIC_SITE_BASE_URL);

  // Remove existing XML declaration
  xml = xml.replace(/^<\?xml.*\?>/, '');

  // Add XML declaration + XSL reference at the top
  xml = `<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet type="text/xsl" href="/sitemap-template.xsl"?>\n` + xml;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
  