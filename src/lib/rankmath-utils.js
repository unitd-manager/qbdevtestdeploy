// lib/meta-handler.js - Enhanced meta handling with JSON-LD support

import { fetchCategoryBySlug } from "./wordpress";

/**
 * Parse Rank Math response with comprehensive error handling
 */
export function parseRankMathData(rawResponse) {
  if (!rawResponse?.head) return null;

  try {
    // Decode the escaped HTML
    const decodedHtml = rawResponse.head
      .replace(/\\u003C/g, '<')
      .replace(/\\u003E/g, '>')
      .replace(/\\"/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#8211;/g, '–')
      .replace(/&#8217;/g, "'");

    const metaData = {
      basic: {},
      openGraph: {},
      twitter: {},
      canonical: null,
      robots: null,
      structuredData: null,
      rawHtml: decodedHtml
    };

    // Extract basic meta tags
    const basicMetaRegex = /<meta name="([^"]*)" content="([^"]*)"[^>]*>/g;
    let match;
    while ((match = basicMetaRegex.exec(decodedHtml)) !== null) {
      metaData.basic[match[1]] = match[2];
    }

    // Extract Open Graph
    const ogRegex = /<meta property="og:([^"]*)" content="([^"]*)"[^>]*>/g;
    while ((match = ogRegex.exec(decodedHtml)) !== null) {
      metaData.openGraph[match[1]] = match[2];
    }

    const articleRegex = /<meta property="article:([^"]*)" content="([^"]*)"[^>]*>/g;
    while ((match = articleRegex.exec(decodedHtml)) !== null) {
      metaData.openGraph[`article_${match[1]}`] = match[2];
    }

    const twitterRegex = /<meta name="twitter:([^"]*)" content="([^"]*)"[^>]*>/g;
    while ((match = twitterRegex.exec(decodedHtml)) !== null) {
      metaData.twitter[match[1]] = match[2];
    }

    const canonicalMatch = decodedHtml.match(/<link rel="canonical" href="([^"]*)"[^>]*>/);
    if (canonicalMatch) {
      metaData.canonical = canonicalMatch[1];
    }

    if (metaData.basic.robots) {
      metaData.robots = metaData.basic.robots;
    }

    const jsonLdRegex = /<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs;
    const jsonLdScripts = [];
    let jsonMatch;
    
    while ((jsonMatch = jsonLdRegex.exec(decodedHtml)) !== null) {
      try {
        const parsedJson = JSON.parse(jsonMatch[1].trim());
        jsonLdScripts.push(parsedJson);
      } catch (jsonError) {
        console.warn('Failed to parse JSON-LD:', jsonError.message);
      }
    }

    // Store all structured data
    if (jsonLdScripts.length > 0) {
      metaData.structuredData = jsonLdScripts.length === 1 ? jsonLdScripts[0] : jsonLdScripts;
    }

    return metaData;

  } catch (error) {
    console.error('Failed to parse Rank Math data:', error);
    return null;
  }
}

/**
 * Convert parsed data to Next.js metadata format
 */
export function toNextJSMetadata(parsedData, fallback = {}) {
  if (!parsedData) return fallback;

  const title = parsedData.openGraph.title || parsedData.basic.title || fallback.title || 'Default Title';
  const description = parsedData.basic.description || parsedData.openGraph.description || fallback.description || 'Default description';

  const metadata = {
    title,
    description,

    // Open Graph metadata
    openGraph: {
      title: parsedData.openGraph.title || title,
      description: parsedData.openGraph.description || description,
      url: parsedData.openGraph.url || fallback.url,
      siteName: parsedData.openGraph.site_name || fallback.siteName,
      type: parsedData.openGraph.type || 'website',
      locale: parsedData.openGraph.locale || 'en_US',
      
      // Article-specific fields
      ...(parsedData.openGraph.article_published_time && {
        publishedTime: parsedData.openGraph.article_published_time
      }),
      ...(parsedData.openGraph.article_modified_time && {
        modifiedTime: parsedData.openGraph.article_modified_time
      }),
      ...(parsedData.openGraph.updated_time && {
        modifiedTime: parsedData.openGraph.updated_time
      }),
      ...(parsedData.openGraph.article_author && {
        authors: [parsedData.openGraph.article_author]
      }),
      
      // Images
      ...(parsedData.openGraph.image && {
        images: [{
          url: parsedData.openGraph.image,
          width: parseInt(parsedData.openGraph.image_width) || 1200,
          height: parseInt(parsedData.openGraph.image_height) || 630,
          alt: parsedData.openGraph.image_alt || title
        }]
      })
    },

    // Twitter metadata
    twitter: {
      card: parsedData.twitter.card || 'summary_large_image',
      title: parsedData.twitter.title || title,
      description: parsedData.twitter.description || description,
      ...(parsedData.twitter.site && { site: parsedData.twitter.site }),
      ...(parsedData.twitter.creator && { creator: parsedData.twitter.creator }),
      ...(parsedData.twitter.image && {
        images: [parsedData.twitter.image]
      }),
      ...(parsedData.twitter.label1 && { label1: parsedData.twitter.label1 }),
      ...(parsedData.twitter.data1 && { data1: parsedData.twitter.data1 })
    },

    // Custom robots configuration
    robots: parsedData.robots || 'index, follow, max-snippet:-1, max-video-preview:-1, max-image-preview:large',

    // Canonical URL
    alternates: {
      canonical: parsedData.canonical || fallback.canonical
    },

    // Additional meta tags
    ...(parsedData.basic.keywords && {
      keywords: parsedData.basic.keywords.split(',').map(k => k.trim())
    }),

    // Verification tags
    verification: {
      ...(parsedData.basic['google-site-verification'] && {
        google: parsedData.basic['google-site-verification']
      })
    },

    // Add custom other meta tags
    other: {
      ...(parsedData.twitter.label1 && {
        'twitter:label1': parsedData.twitter.label1
      }),
      ...(parsedData.twitter.data1 && {
        'twitter:data1': parsedData.twitter.data1
      }),
      ...(parsedData.openGraph.updated_time && {
        'og:updated_time': parsedData.openGraph.updated_time
      })
    }
  };

  return metadata;
}

/**
 * Fetch Rank Math data with caching and error handling
 */

export async function fetchRankMathMetadata(slug, parent) {
  try {
    
    
    // Ensure parent is a string and handle empty/falsy values
    const parentPath = parent && typeof parent === 'string' ? parent.trim() : '';
    
    let fullUrl;
    if (parentPath) {
      fullUrl = `${process.env.NEXT_PUBLIC_WP_URL}/${parentPath}/${slug}/`;
    } else {
      fullUrl = `${process.env.NEXT_PUBLIC_WP_URL}/${slug}/`;
    }
   
    const apiUrl = `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/rankmath/v1/getHead?url=${encodeURIComponent(fullUrl)}`;
    
    const response = await fetch(apiUrl, {
      next: { revalidate: 300, tags: [`rankmath-${slug}`] },
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`Rank Math API error: ${response.status} ${response.statusText}`);
    }

    const rawData = await response.json();
    if (!rawData.success) {
      throw new Error('Rank Math API returned unsuccessful response');
    }

    return parseRankMathData(rawData);

  } catch (error) {
    console.error(`Error fetching Rank Math metadata for ${slug}:`, error.message);
    return null;
  }
}

/**
 * Generate complete metadata for any page with structured data support
 */
export async function generatePageMetadatas(slug, pageType = 'page', parent = '', customFallback = {}) {
  try {

    
    const rankMathData = await fetchRankMathMetadata(slug, parent);

    const fallback = {
      title: `Page - ${slug}`,
      description: `Learn more about ${slug}`,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${slug}`,
      siteName: 'Your Site Name',
      ...customFallback
    };
    
    if (rankMathData) {
      const metadata = toNextJSMetadata(rankMathData, fallback);
      
      // Page type specific adjustments
      if (pageType === 'post') {
        metadata.openGraph.type = 'article';
      }
     
      // Store structured data separately for component use
      if (rankMathData.structuredData) {
        metadata._structuredData = rankMathData.structuredData;
      }
      
      return metadata;
    }

    // Return fallback metadata
    return {
      title: fallback.title,
      description: fallback.description,
      openGraph: {
        title: fallback.title,
        description: fallback.description,
        url: fallback.url,
        siteName: fallback.siteName,
        type: pageType === 'post' ? 'article' : 'website'
      },
      twitter: {
        card: 'summary_large_image',
        title: fallback.title,
        description: fallback.description
      }
    };

  } catch (error) {
    console.error('Metadata generation failed:', error);
    return customFallback;
  }
}


export async function generateCategoryMetadatas(slug, parent = '', customFallback = {}) {
  try {
 const rankMathData = await fetchRankMathMetadata(slug, parent);

    const fallback = {
      title: slug,
      description: `Learn more about ${slug}`,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${slug}`,
      siteName: 'Your Site Name',
      ...customFallback
    };
    
    if (rankMathData) {
      const metadata = toNextJSMetadata(rankMathData, fallback);
      
  
     
      // Store structured data separately for component use
      if (rankMathData.structuredData) {
        metadata._structuredData = rankMathData.structuredData;
      }
      
      return metadata;
    }

    // Return fallback metadata
    return {
      title: fallback.title,
      description: fallback.description,
      openGraph: {
        title: fallback.title,
        description: fallback.description,
        url: fallback.url,
        siteName: fallback.siteName,
        type: pageType === 'post' ? 'article' : 'website'
      },
      twitter: {
        card: 'summary_large_image',
        title: fallback.title,
        description: fallback.description
      }
    };

  } catch (error) {
    console.error('Metadata generation failed:', error);
    return customFallback;
  }
}


/**
 * Generate JSON-LD script component for structured data
 * This returns a React component that can be used in your page
 */
export function generateStructuredDataScript(structuredData) {
  if (!structuredData) return null;

  const jsonLdData = Array.isArray(structuredData) ? structuredData : [structuredData];
  
  return jsonLdData.map((data, index) => {
    // Ensure data is valid JSON
    const jsonString = typeof data === 'string' ? data : JSON.stringify(data);
    
    return {
      key: `structured-data-${index}`,
      type: 'application/ld+json',
      dangerouslySetInnerHTML: {
        __html: jsonString
      }
    };
  });
}

/**
 * Get structured data from metadata
 */
export function getStructuredData(metadata) {
  return metadata?._structuredData || null;
}

