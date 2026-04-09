/**
 * Handler for dynamic sitemap files like post-sitemap.xml, page-sitemap.xml, etc.
 * Note: The [sitemap].xml pattern captures the full filename including extension
 */
export async function GET(request, { params }) {
  let sitemapFile;
  
  // In Next.js app router, [sitemap] will capture the whole "post-sitemap.xml"
  // So we use it directly
  if (params.sitemap) {
    sitemapFile = params.sitemap;
  } else {
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?><error>No sitemap specified</error>`,
      {
        status: 400,
        headers: { "Content-Type": "application/xml" },
      }
    );
  }

  try {
    // Ensure we're requesting an XML file
    if (!sitemapFile.endsWith('.xml')) {
      sitemapFile = `${sitemapFile}.xml`;
    }

    const wpUrl = `${process.env.NEXT_PUBLIC_WP_URL}/${sitemapFile}`;
    console.log(`[Sitemap] Fetching: ${wpUrl}`);

    const wpSitemap = await fetch(wpUrl, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    // Check if the response is successful
    if (!wpSitemap.ok) {
      console.warn(`[Sitemap] WordPress returned ${wpSitemap.status} for ${sitemapFile}`);
      return new Response(
        `<?xml version="1.0" encoding="UTF-8"?><error>${sitemapFile} not found (${wpSitemap.status})</error>`,
        {
          status: wpSitemap.status,
          headers: {
            "Content-Type": "application/xml",
          },
        }
      );
    }

    let xml = await wpSitemap.text();

    // Rewrite backend URLs → frontend URLs
    xml = xml.replaceAll(process.env.NEXT_PUBLIC_WP_URL, process.env.NEXT_PUBLIC_SITE_BASE_URL);

    // Rewrite stylesheet reference to use local relative path
    xml = xml.replace(
      /href="\/\/[^"]+\/main-sitemap\.xsl"/,
      'href="/sitemap-template.xsl"'
    );

    console.log(`[Sitemap] Successfully serving ${sitemapFile}`);
    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error(`[Sitemap] Error fetching ${sitemapFile}:`, error);
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?><error>Failed to fetch ${sitemapFile}: ${error.message}</error>`,
      {
        status: 500,
        headers: {
          "Content-Type": "application/xml",
        },
      }
    );
  }
}
