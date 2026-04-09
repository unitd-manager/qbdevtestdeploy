export async function GET() {
    try {
        const wpRobots = await fetch(`${process.env.NEXT_PUBLIC_WP_URL}/robots.txt`, {
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        let robotsTxt = await wpRobots.text();

        // Rewrite backend URLs → frontend URLs (same as your sitemap logic)
        robotsTxt = robotsTxt.replaceAll(
            process.env.NEXT_PUBLIC_WP_URL,
            process.env.NEXT_PUBLIC_SITE_BASE_URL
        );

        return new Response(robotsTxt, {
            headers: {
                "Content-Type": "text/plain",
            },
        });
    } catch (error) {
        console.error('Error fetching robots.txt:', error);
        const fallbackRobots = `User-agent: *
Allow: /

Sitemap: ${process.env.NEXT_PUBLIC_SITE_BASE_URL}/sitemap.xml`;

        return new Response(fallbackRobots, {
            headers: {
                "Content-Type": "text/plain",
            },
        });
    }
}