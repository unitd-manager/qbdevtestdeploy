/**
 * Handler for page-sitemap1.xml
 * Maps to /page-sitemap1.xml endpoint
 */
export async function GET() {
  return fetchSitemapFromWordPress('page-sitemap1.xml');
}

async function fetchSitemapFromWordPress(sitemapFile) {
  try {
    const wpUrl = `${process.env.NEXT_PUBLIC_WP_URL}/${sitemapFile}`;
    console.log(`[${sitemapFile}] Fetching from: ${wpUrl}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(wpUrl, {
      next: { revalidate: 3600 }, // Cache for 1 hour
      signal: controller.signal,
      // Disable SSL verification for development (only in development environment)
      ...(process.env.NODE_ENV === 'development' && {
        rejectUnauthorized: false
      })
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`[${sitemapFile}] WordPress returned ${response.status}`);
      return new Response(
        `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>${process.env.NEXT_PUBLIC_SITE_BASE_URL}/sitemap.xml</loc></sitemap></sitemapindex>`,
        {
          status: response.status,
          headers: { "Content-Type": "application/xml; charset=utf-8" },
        }
      );
    }

    let xml = await response.text();

    // Rewrite backend URLs → frontend URLs
    xml = xml.replaceAll(
      process.env.NEXT_PUBLIC_WP_URL,
      process.env.NEXT_PUBLIC_SITE_BASE_URL
    );

    // Rewrite stylesheet reference to use local relative path
    xml = xml.replace(
      /href="\/\/[^"]+\/main-sitemap\.xsl"/,
      'href="/sitemap-template.xsl"'
    );

    console.log(`[${sitemapFile}] Successfully serving (${xml.length} bytes)`);

    return new Response(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error(`[${sitemapFile}] Error:`, error.message);
    
    // Return a fallback sitemap index on error
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>${process.env.NEXT_PUBLIC_SITE_BASE_URL}/sitemap.xml</loc></sitemap></sitemapindex>`,
      {
        status: 503,
        headers: { 
          "Content-Type": "application/xml; charset=utf-8",
          "Retry-After": "3600"
        },
      }
    );
  }
}
