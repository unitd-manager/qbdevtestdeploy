// lib/rankmath-metadata.js
// Optimized RankMath SEO metadata extractor for Next.js

import axios from 'axios'

const WP_API_URL = process.env.WP_API_URL;
const SITE_BASE_URL = process.env.NEXT_PUBLIC_SITE_BASE_URL;

/**
 * Extract RankMath SEO metadata from WordPress item
 * Uses multiple fallback methods for maximum compatibility
 */
export const extractRankMathSEO = async (wordpressItem, slug = '') => {
  try {
    // Method 1: Try RankMath meta fields (most reliable)
    const metaFields = wordpressItem?.meta || {};
    if (hasRankMathMetaFields(metaFields)) {
      return extractFromMetaFields(metaFields, wordpressItem);
    }

    // Method 2: Try RankMath headless API (if available)
    if (slug && SITE_BASE_URL) {
      const headlessData = await fetchRankMathHeadlessData(slug);
      if (headlessData) {
        return headlessData;
      }
    }

    // Method 3: Fallback to WordPress defaults
    return extractFromWordPressDefaults(wordpressItem);
    
  } catch (error) {
    console.warn('Error extracting RankMath SEO data:', error);
    return extractFromWordPressDefaults(wordpressItem);
  }
};

/**
 * Check if RankMath meta fields exist
 */
function hasRankMathMetaFields(metaFields) {
  return metaFields && (
    metaFields.rank_math_title ||
    metaFields.rank_math_description ||
    metaFields.rank_math_facebook_title ||
    metaFields.rank_math_twitter_title
  );
}

/**
 * Extract SEO data from RankMath meta fields (Primary Method)
 * This is the most reliable method as it directly accesses stored meta values
 */
function extractFromMetaFields(metaFields, wordpressItem) {
  // Helper to safely get array value
  const getMetaValue = (field) => {
    const value = metaFields[field];
    return Array.isArray(value) ? value[0] : value || '';
  };

  // Extract robots settings
  const robotsArray = metaFields.rank_math_robots || [];
  const robotsString = Array.isArray(robotsArray) ? robotsArray.join(',') : String(robotsArray);

  return {
    title: getMetaValue('rank_math_title') || wordpressItem.title?.rendered || '',
    description: getMetaValue('rank_math_description') || extractExcerpt(wordpressItem),
    canonical: getMetaValue('rank_math_canonical_url') || '',
    robots: {
      index: !robotsString.includes('noindex'),
      follow: !robotsString.includes('nofollow'),
      noarchive: robotsString.includes('noarchive'),
      nosnippet: robotsString.includes('nosnippet'),
      noimageindex: robotsString.includes('noimageindex'),
    },
    openGraph: {
      title: getMetaValue('rank_math_facebook_title') || 
             getMetaValue('rank_math_title') || 
             wordpressItem.title?.rendered || '',
      description: getMetaValue('rank_math_facebook_description') || 
                  getMetaValue('rank_math_description') || 
                  extractExcerpt(wordpressItem),
      url: getMetaValue('rank_math_canonical_url') || '',
      type: 'article',
      locale: 'en_US',
      siteName: '',
      images: extractOpenGraphImages(metaFields, wordpressItem),
      publishedTime: wordpressItem.date,
      modifiedTime: wordpressItem.modified,
    },
    twitter: {
      card: getMetaValue('rank_math_twitter_card_type') || 'summary_large_image',
      title: getMetaValue('rank_math_twitter_title') || 
             getMetaValue('rank_math_facebook_title') || 
             getMetaValue('rank_math_title') || 
             wordpressItem.title?.rendered || '',
      description: getMetaValue('rank_math_twitter_description') || 
                  getMetaValue('rank_math_facebook_description') || 
                  getMetaValue('rank_math_description') || 
                  extractExcerpt(wordpressItem),
      creator: getMetaValue('rank_math_twitter_creator') || '',
      site: getMetaValue('rank_math_twitter_site') || '',
      images: extractTwitterImages(metaFields, wordpressItem)
    },
    keywords: extractKeywords(metaFields, wordpressItem),
    schema: null // Schema is usually handled separately by RankMath
  };
}

/**
 * Fetch data from RankMath headless CMS API (Backup Method)
 * Only used if meta fields are not available
 */
async function fetchRankMathHeadlessData(slug) {
  try {
    const fullUrl = `${SITE_BASE_URL.replace(/\/$/, '')}/${slug}`;
    const apiUrl = `${SITE_BASE_URL.replace(/\/$/, '')}/wp-json/rankmath/v1/getHead?url=${encodeURIComponent(fullUrl)}`;
    
    const response = await axios.get(apiUrl, {
      timeout: 3000, // Quick timeout to avoid blocking
      validateStatus: (status) => status === 200
    });

    if (response.data?.success && response.data?.head) {
      return parseHeadHTML(response.data.head);
    }
  } catch (error) {
    // Silently fail - this is expected if headless support is not enabled
    return null;
  }
  return null;
}

/**
 * Parse HTML head content from RankMath API
 */
function parseHeadHTML(headHTML) {
  if (!headHTML || typeof headHTML !== 'string') return null;

  // Simple regex parsing to avoid DOM dependencies
  const getMetaContent = (name, property = false) => {
    const attr = property ? 'property' : 'name';
    const regex = new RegExp(`<meta\\s+${attr}=["']${name}["']\\s+content=["']([^"']*)["']`, 'i');
    const match = headHTML.match(regex);
    return match ? match[1] : '';
  };

  const getTitleContent = () => {
    const match = headHTML.match(/<title[^>]*>([^<]*)<\/title>/i);
    return match ? match[1] : '';
  };

  const getCanonical = () => {
    const match = headHTML.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i);
    return match ? match[1] : '';
  };

  const title = getTitleContent();
  const canonical = getCanonical();

  return {
    title,
    description: getMetaContent('description'),
    canonical,
    robots: {
      index: !getMetaContent('robots').includes('noindex'),
      follow: !getMetaContent('robots').includes('nofollow'),
    },
    openGraph: {
      title: getMetaContent('og:title', true) || title,
      description: getMetaContent('og:description', true),
      url: getMetaContent('og:url', true) || canonical,
      type: getMetaContent('og:type', true) || 'article',
      locale: getMetaContent('og:locale', true) || 'en_US',
      siteName: getMetaContent('og:site_name', true),
      images: extractImagesFromHTML(headHTML, 'og:image'),
    },
    twitter: {
      card: getMetaContent('twitter:card') || 'summary_large_image',
      title: getMetaContent('twitter:title'),
      description: getMetaContent('twitter:description'),
      creator: getMetaContent('twitter:creator'),
      site: getMetaContent('twitter:site'),
      images: extractImagesFromHTML(headHTML, 'twitter:image', true)
    },
    keywords: [],
    schema: null
  };
}

/**
 * Extract images from HTML content
 */
function extractImagesFromHTML(html, metaName, isTwitter = false) {
  if (!html) return [];
  
  const attr = metaName.startsWith('og:') ? 'property' : 'name';
  const regex = new RegExp(`<meta\\s+${attr}=["']${metaName}["']\\s+content=["']([^"']*)["']`, 'gi');
  const images = [];
  let match;
  
  while ((match = regex.exec(html)) !== null && images.length < 3) {
    if (isTwitter) {
      images.push(match[1]);
    } else {
      images.push({
        url: match[1],
        width: 1200,
        height: 630,
        alt: ''
      });
    }
  }
  
  return images;
}

/**
 * Extract OpenGraph images from meta fields
 */
function extractOpenGraphImages(metaFields, wordpressItem) {
  const getMetaValue = (field) => {
    const value = metaFields[field];
    return Array.isArray(value) ? value[0] : value || '';
  };

  const fbImage = getMetaValue('rank_math_facebook_image');
  if (fbImage) {
    return [{
      url: fbImage,
      width: 1200,
      height: 630,
      alt: ''
    }];
  }
  
  return getFeaturedImage(wordpressItem);
}

/**
 * Extract Twitter images from meta fields
 */
function extractTwitterImages(metaFields, wordpressItem) {
  const getMetaValue = (field) => {
    const value = metaFields[field];
    return Array.isArray(value) ? value[0] : value || '';
  };

  const twitterImage = getMetaValue('rank_math_twitter_image');
  if (twitterImage) {
    return [twitterImage];
  }

  const fbImage = getMetaValue('rank_math_facebook_image');
  if (fbImage) {
    return [fbImage];
  }

  return getFeaturedImageUrl(wordpressItem);
}

/**
 * Extract keywords from RankMath and WordPress data
 */
function extractKeywords(metaFields, wordpressItem) {
  const keywords = new Set();

  // Add RankMath focus keyword
  const getMetaValue = (field) => {
    const value = metaFields[field];
    return Array.isArray(value) ? value[0] : value || '';
  };

  const focusKeyword = getMetaValue('rank_math_focus_keyword');
  if (focusKeyword) {
    keywords.add(focusKeyword);
  }

  // Add WordPress categories and tags
  try {
    const categories = wordpressItem._embedded?.['wp:term']?.[0] || [];
    const tags = wordpressItem._embedded?.['wp:term']?.[1] || [];
    
    categories.forEach(cat => cat.name && keywords.add(cat.name));
    tags.forEach(tag => tag.name && keywords.add(tag.name));
  } catch (error) {
    // Silently continue if terms are not available
  }

  return Array.from(keywords);
}

/**
 * Fallback extraction from WordPress defaults
 */
function extractFromWordPressDefaults(wordpressItem) {
  if (!wordpressItem) {
    return createEmptyMetadata();
  }

  const title = wordpressItem.title?.rendered || '';
  const excerpt = extractExcerpt(wordpressItem);

  return {
    title,
    description: excerpt,
    canonical: '',
    robots: {
      index: true,
      follow: true,
      noarchive: false,
      nosnippet: false,
      noimageindex: false,
    },
    openGraph: {
      title,
      description: excerpt,
      url: '',
      type: 'article',
      locale: 'en_US',
      siteName: '',
      images: getFeaturedImage(wordpressItem),
      publishedTime: wordpressItem.date,
      modifiedTime: wordpressItem.modified,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: excerpt,
      creator: '',
      site: '',
      images: getFeaturedImageUrl(wordpressItem)
    },
    keywords: extractWordPressKeywords(wordpressItem),
    schema: null
  };
}

/**
 * Create empty metadata structure
 */
function createEmptyMetadata() {
  return {
    title: '',
    description: '',
    canonical: '',
    robots: { index: true, follow: true },
    openGraph: {
      title: '',
      description: '',
      url: '',
      type: 'website',
      locale: 'en_US',
      siteName: '',
      images: [],
    },
    twitter: {
      card: 'summary_large_image',
      title: '',
      description: '',
      creator: '',
      site: '',
      images: []
    },
    keywords: [],
    schema: null
  };
}

/**
 * Safely extract excerpt from WordPress item
 */
function extractExcerpt(wordpressItem) {
  try {
    const excerpt = wordpressItem.excerpt?.rendered;
    if (!excerpt) return '';
    
    // Remove HTML tags and limit to 160 characters
    return excerpt
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&[^;]+;/g, ' ') // Remove HTML entities
      .trim()
      .substring(0, 160);
  } catch (error) {
    return '';
  }
}

/**
 * Extract featured image with error handling
 */
function getFeaturedImage(wordpressItem) {
  try {
    const featuredImage = wordpressItem._embedded?.['wp:featuredmedia']?.[0];
    if (!featuredImage?.source_url) return [];
    
    return [{
      url: featuredImage.source_url,
      width: featuredImage.media_details?.width || 1200,
      height: featuredImage.media_details?.height || 630,
      alt: featuredImage.alt_text || featuredImage.title?.rendered || ''
    }];
  } catch (error) {
    return [];
  }
}

/**
 * Extract featured image URL for Twitter
 */
function getFeaturedImageUrl(wordpressItem) {
  try {
    const featuredImage = wordpressItem._embedded?.['wp:featuredmedia']?.[0];
    return featuredImage?.source_url ? [featuredImage.source_url] : [];
  } catch (error) {
    return [];
  }
}

/**
 * Extract keywords from WordPress categories and tags
 */
function extractWordPressKeywords(wordpressItem) {
  try {
    const keywords = new Set();
    const categories = wordpressItem._embedded?.['wp:term']?.[0] || [];
    const tags = wordpressItem._embedded?.['wp:term']?.[1] || [];
    
    categories.forEach(cat => cat.name && keywords.add(cat.name));
    tags.forEach(tag => tag.name && keywords.add(tag.name));
    
    return Array.from(keywords);
  } catch (error) {
    return [];
  }
}

// Export for backward compatibility
export const extractYoastSEO = extractRankMathSEO;