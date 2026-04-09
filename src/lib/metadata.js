// lib/metadata.js
import { fetchPageBySlug } from '@/lib/wordpress'
import { extractRankMathSEO } from '@/lib/rankmath-metadata'

export async function generatePageMetadata(slug) {
  const page = await fetchPageBySlug(slug)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_BASE_URL || 'https://qbotica.com';
  const ogImage = `${baseUrl}/assets/images/logo-front.webp`;

  const defaultData = {
    title: 'Qbotica – Intelligent Automation & AI Solutions',
    description:
      'Qbotica empowers enterprises with cutting-edge Intelligent Automation, RPA, and AI solutions to drive digital transformation and operational efficiency.',
    keywords: [
      'Qbotica',
      'Intelligent Automation',
      'RPA',
      'AI solutions',
      'Digital Transformation',
      'Hyperautomation',
      'Intelligent Document Processing',
    ],
    openGraph: {
      title: 'Qbotica – Intelligent Automation & AI Solutions',
      description:
        'Qbotica empowers enterprises with cutting-edge Intelligent Automation, RPA, and AI solutions to drive digital transformation and operational efficiency.',
      url: `${baseUrl}`,
      siteName: 'Qbotica',
      type: 'website',
      locale: 'en_US',
      images: [
        {
          url: ogImage,
          secure_url: ogImage,
          width: 1024,
          height: 287,
          alt: 'Qbotica – AI & Automation Experts',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Qbotica – Intelligent Automation & AI Solutions',
      description:
        'Qbotica empowers enterprises with cutting-edge Intelligent Automation, RPA, and AI solutions to drive digital transformation and operational efficiency.',
      site: '@qbotica',
      creator: '@qbotica',
      images: [ogImage],
    },
  };

  if (page) {
    const rankMathMeta = await extractRankMathSEO(page, slug);

    
    const publishedTime = rankMathMeta.openGraph?.publishedTime || page.date;
    const modifiedTime = rankMathMeta.openGraph?.modifiedTime || page.modified;
    
    return {
      title: rankMathMeta.title || defaultData.title,
      description: rankMathMeta.description || defaultData.description,
      keywords: rankMathMeta.keywords || defaultData.keywords,
      robots: rankMathMeta.robots || { 
        index: true, 
        follow: true,
        noarchive: false,
        nosnippet: false,
        noimageindex: false 
      },
      openGraph: {
        title: rankMathMeta.openGraph?.title || defaultData.openGraph.title,
        description: rankMathMeta.openGraph?.description || defaultData.openGraph.description,
        url: `${baseUrl}/${slug}`,
        locale: rankMathMeta.openGraph?.locale || defaultData.openGraph.locale,
        type: rankMathMeta.openGraph?.type || 'website',
        images: rankMathMeta.openGraph?.images && rankMathMeta.openGraph.images.length > 0
          ? rankMathMeta.openGraph.images
          : defaultData.openGraph.images,
        siteName: rankMathMeta.openGraph?.siteName || defaultData.openGraph.siteName,
        publishedTime: publishedTime ? new Date(publishedTime).toISOString() : undefined,
        modifiedTime: modifiedTime ? new Date(modifiedTime).toISOString() : undefined,
      },
      twitter: {
        card: rankMathMeta.twitter?.card || 'summary_large_image',
        title: rankMathMeta.twitter?.title || defaultData.twitter.title,
        description: rankMathMeta.twitter?.description || defaultData.twitter.description,
        site: rankMathMeta.twitter?.site || defaultData.twitter.site,
        creator: rankMathMeta.twitter?.creator || defaultData.twitter.creator,
        images: Array.isArray(rankMathMeta.twitter?.images) && rankMathMeta.twitter.images.length
          ? rankMathMeta.twitter.images
          : defaultData.twitter.images,
      },
      alternates: {
        canonical: rankMathMeta.canonical || `${baseUrl}/${slug}`,
        types: {
          'application/rss+xml': [
            { title: 'qBotica | Intelligent Automation for your Enterprise | Featured UiPath Platinum Partner » Feed', url: `${baseUrl}/feed/` },
            { title: 'qBotica | Intelligent Automation for your Enterprise | Featured UiPath Platinum Partner » Comments Feed', url: `${baseUrl}/comments/feed/` },
          ],
        },
      },
      // Add structured data if available
      ...(rankMathMeta.schema && { 
        other: { 
          'application/ld+json': JSON.stringify(rankMathMeta.schema) 
        } 
      }),
    }
  }

  // fallback if no page found
  return {
    title: defaultData.title,
    description: defaultData.description,
    keywords: defaultData.keywords,
    openGraph: {
      title: defaultData.openGraph.title,
      description: defaultData.openGraph.description,
      url: `${baseUrl}/${slug}`,
      type: 'website',
      images: defaultData.openGraph.images,
      siteName: defaultData.openGraph.siteName,
    },
    twitter: {
      card: 'summary_large_image',
      title: defaultData.twitter.title,
      description: defaultData.twitter.description,
      site: defaultData.twitter.site,
      creator: defaultData.twitter.creator,
      images: defaultData.twitter.images,
    },
    alternates: {
      canonical: `${baseUrl}/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}