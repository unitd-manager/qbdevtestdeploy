// middleware.js
import { NextResponse } from 'next/server';

let redirects = {};
let lastFetch = 0;
let isFetching = false;

const CACHE_LIFETIME = 30000; // 30 seconds

/**
 * Fetches redirects from the WordPress API and updates the in-memory cache.
 */
async function fetchRedirectsFromWordPress() {
    console.log('🔄 Fetching redirects from WordPress...');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
        const apiUrl = `${process.env.NEXT_PUBLIC_WP_API_URL}/custom/v1/redirects`;
        console.log(`📡 API URL: ${apiUrl}`);
        
        const res = await fetch(apiUrl, {
            signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (!res.ok) {
            const errorText = await res.text();
            console.warn(`⚠ HTTP ${res.status}: ${errorText.substring(0, 200)}`);
            console.log('✅ API responded but with warning - continuing anyway');
            return; // Don't crash, just return
        }

        const data = await res.json();
        console.log(`✅ Fetched ${data.length} redirects.`);

        const newRedirects = {};
        data.forEach(item => {
            if (item.url && item.action_data) {
                // Normalize both with and without trailing slash
                const cleanUrl = item.url.replace(/\/$/, '') || '/';
                newRedirects[cleanUrl] = item.action_data;
                if (item.url !== '/') {
                    newRedirects[cleanUrl + '/'] = item.action_data;
                }
            }
        });

        redirects = newRedirects; // Atomically replace the old cache
        lastFetch = Date.now();
        console.log('📋 Loaded redirects into memory cache.');
    } catch (error) {
        console.error('❌ WordPress API Error:', error.message);
    } finally {
        isFetching = false;
    }
}

/**
 * Gets redirects from the cache, triggering a background refresh if needed.
 * @returns {Promise<Object>} A promise that resolves with the current redirect map.
 */
function getRedirects() {
    const now = Date.now();
    const shouldFetch = now - lastFetch > CACHE_LIFETIME;

    // Trigger a new fetch if the cache is stale and a fetch isn't already in progress
    if (shouldFetch && !isFetching) {
        isFetching = true;
        // Do not await the fetch here; let it happen in the background
        fetchRedirectsFromWordPress();
    }

    return redirects;
}

/**
 * Main middleware function to handle requests and apply redirects.
 * @param {import('next/server').NextRequest} request The incoming request object.
 */
export async function middleware(request) {
    const pathname = request.nextUrl.pathname;

    // Handle sitemap XML files first
    if (pathname.endsWith('.xml') && pathname.includes('sitemap')) {
        // Let sitemap routes pass through (they have route handlers in app directory)
        return NextResponse.next();
    }

    // Skip middleware for static assets and API routes for performance
    if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
        return NextResponse.next();
    }

    console.log('🔍 Checking redirect for:', pathname);

    // Get redirects from the fast in-memory cache
    const allRedirects = getRedirects();

    // Normalize pathname (remove trailing slash, except for root "/")
    const cleanPath = pathname.replace(/\/$/, '') || '/';
    const destination = allRedirects[cleanPath];

    if (destination) {
        console.log(`🔀 Redirecting: ${pathname} → ${destination}`);
        return NextResponse.redirect(new URL(destination, request.url), 301);
    }

    return NextResponse.next();
}

/**
 * Configuration to specify which paths the middleware should apply to.
 */
export const config = {
    // Apply middleware everywhere except static assets
    matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
};
