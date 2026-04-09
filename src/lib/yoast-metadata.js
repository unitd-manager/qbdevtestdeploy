import axios from 'axios'
const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL;

export const extractYoastSEO = async (wordpressItem) => {
  
  const yoastData = wordpressItem.yoast_head_json || {}
  return {
    title: yoastData.title || wordpressItem.title?.rendered || 'title',
    description: '',
    canonical: yoastData.canonical || '',
    robots: {
      index: yoastData.robots?.index !== 'noindex',
      follow: yoastData.robots?.follow !== 'nofollow',
      'max-snippet': yoastData.robots?.['max-snippet'] || -1,
      'max-image-preview': yoastData.robots?.['max-image-preview'] || 'large',
      'max-video-preview': yoastData.robots?.['max-video-preview'] || -1,
    },
    openGraph: {
      title: yoastData.og_title || yoastData.title || wordpressItem.title?.rendered,
      description: yoastData.og_description || yoastData.description,
      url: yoastData.og_url || yoastData.canonical,
      type: yoastData.og_type || 'article',
      locale: yoastData.og_locale || 'en_US',
      siteName: yoastData.og_site_name || '',
      images: yoastData.og_image ? [{
        url: yoastData.og_image[0]?.url || yoastData.og_image,
        width: yoastData.og_image[0]?.width || 1200,
        height: yoastData.og_image[0]?.height || 630,
        alt: yoastData.og_image[0]?.alt || yoastData.title
      }] : getFeaturedImage(wordpressItem),
      publishedTime: yoastData.article_published_time || wordpressItem.date,
      modifiedTime: yoastData.article_modified_time || wordpressItem.modified,
      authors: yoastData.article_author ? [yoastData.article_author] : [],
      tags: yoastData.article_tag || [],
    },
    twitter: {
      card: yoastData.twitter_card || 'summary_large_image',
      title: yoastData.twitter_title || yoastData.og_title || yoastData.title,
      description: yoastData.twitter_description || yoastData.og_description || yoastData.description,
      creator: yoastData.twitter_creator || '',
      site: yoastData.twitter_site || '',
      images: yoastData.twitter_image ? [yoastData.twitter_image] : 
              yoastData.og_image ? [yoastData.og_image[0]?.url || yoastData.og_image] : 
              getFeaturedImageUrl(wordpressItem)
    },
    schema: yoastData.schema || null,
    keywords: extractKeywords(yoastData, wordpressItem),
  }
}

function getFeaturedImage(wordpressItem) {
  const featuredImage = wordpressItem._embedded?.['wp:featuredmedia']?.[0]
  if (!featuredImage) return []
  
  return [{
    url: featuredImage.source_url,
    width: featuredImage.media_details?.width || 1200,
    height: featuredImage.media_details?.height || 630,
    alt: featuredImage.alt_text || featuredImage.title?.rendered || ''
  }]
}

function getFeaturedImageUrl(wordpressItem) {
  const featuredImage = wordpressItem._embedded?.['wp:featuredmedia']?.[0]
  return featuredImage ? [featuredImage.source_url] : []
}

function extractKeywords(yoastData, wordpressItem) {
  const keywords = []
  
  // Add focus keyword from Yoast
  if (yoastData.focus_keyword) {
    keywords.push(yoastData.focus_keyword)
  }
  
  // Add categories and tags
  const categories = wordpressItem._embedded?.['wp:term']?.[0] || []
  const tags = wordpressItem._embedded?.['wp:term']?.[1] || []
  
  categories.forEach(cat => keywords.push(cat.name))
  tags.forEach(tag => keywords.push(tag.name))
  
  return [...new Set(keywords)]
}


export const extractRankMathSEO = async (wordpressItem) => {
  const seo = wordpressItem.rank_math_seo_meta || {}

  return {
    title: seo.title || wordpressItem.title?.rendered || 'title',
    description: seo.description || '',
    canonical: seo.canonical_url || '',
    robots: {
      index: seo.robots?.index !== 'noindex',
      follow: seo.robots?.follow !== 'nofollow',
    },
    openGraph: {
      title: seo.open_graph_title || seo.title,
      description: seo.open_graph_description || seo.description,
      url: seo.canonical_url,
      type: seo.open_graph_type || 'article',
      images: seo.open_graph_image ? [{
        url: seo.open_graph_image,
        width: 1200,
        height: 630,
        alt: seo.open_graph_title || seo.title
      }] : getFeaturedImage(wordpressItem),
      siteName: seo.open_graph_site_name || 'Qbotica',
      publishedTime: wordpressItem.date,
      modifiedTime: wordpressItem.modified,
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.twitter_title || seo.open_graph_title || seo.title,
      description: seo.twitter_description || seo.open_graph_description || seo.description,
      images: seo.twitter_image ? [seo.twitter_image] : [],
    },
    keywords: extractKeywordsFromRankMath(seo, wordpressItem),
  }
}

function extractKeywordsFromRankMath(seo, wordpressItem) {
  const keywords = []
  if (seo.focus_keyword) {
    keywords.push(seo.focus_keyword)
  }
  const categories = wordpressItem._embedded?.['wp:term']?.[0] || []
  const tags = wordpressItem._embedded?.['wp:term']?.[1] || []
  
  categories.forEach(cat => keywords.push(cat.name))
  tags.forEach(tag => keywords.push(tag.name))
  
  return [...new Set(keywords)]
}
