import axios from 'axios'

const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL;
const SITE_BASE_URL = process.env.NEXT_PUBLIC_SITE_BASE_URL;

/**
 * PRODUCTION-OPTIMIZED THEME SETTINGS
 * - Uses stale-while-revalidate for instant response
 * - Respects ETag and Last-Modified headers
 * - Automatic cache invalidation on admin updates
 */
export async function fetchThemeSettings() { 
  try { 
    const res = await fetch(`${process.env.NEXT_PUBLIC_WP_API_URL}/custom/v2/theme-settings`, {
      next: { 
        revalidate: 300, // 5 minutes ISR
        tags: ['theme-settings'] // For on-demand revalidation
      },
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip, deflate, br'
      }
    }); 

    if (!res.ok) {
      console.error("Theme settings API failed:", res.status, res.statusText);
      return getDefaultThemeSettings();
    }

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      console.error("Theme settings API did not return JSON. Got:", contentType);
      return getDefaultThemeSettings();
    }

    const data = await res.json();
    return data; 
  } catch (error) { 
    console.error("Error fetching theme settings:", error.message); 
    return getDefaultThemeSettings();
  } 
}

function getDefaultThemeSettings() {
  return {
    logo: '',
    footer_logo: '',
    header_script: '',
    footer_script: '',
    footer_content: '',
    address: '',
    email_address: '',
    phone_number: '',
    phone_number2: '',
    social_link_1: '',
    social_link_2: '',
    social_link_3: '',
    social_link_4: '',
    copyright_text: '',
    header_cta_label: '',
    header_cta_link: '',
    promotion_enable: '',
    promotion_text: '',
    promotion_label: '',
    promotion_link: '',
    site_icon: '',
    site_title: 'Qbotica',
    site_tagline: ''
  };
}

/**
 * OPTIMIZED MENU FETCHING
 * - Longer cache for menus (rarely change)
 * - Tagged for revalidation
 */
export const fetchMenus = async (menu_type) => {
  try {
    const res = await fetch(`${WP_API_URL}/custom/v2/menu/${menu_type}`, {
      next: { 
        revalidate: 600, // 10 minutes for menus
        tags: [`menu-${menu_type}`]
      },
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip'
      }
    });
    
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error(`Error fetching menu ${menu_type}:`, error.message);
    return [];
  }
};

export const fetchFooter = async (menu_type) => {
  try {
    const res = await fetch(`${WP_API_URL}/custom/v2/menu/${menu_type}`, {
      next: { 
        revalidate: 600,
        tags: [`footer-${menu_type}`]
      },
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip'
      }
    });
    
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error(`Error fetching footer menu ${menu_type}:`, error.message); 
    return [];
  }
}

/**
 * OPTIMIZED PAGE FETCHING
 * - Balanced cache for pages
 * - Preserves SEO with proper metadata
 */
export const fetchPageBySlug = async (slug) => {
  try {
    const res = await fetch(`${WP_API_URL}/wp/v2/pages?slug=${slug}&status=publish`, {
      next: { 
        revalidate: 180, // 3 minutes for faster content updates
        tags: [`page-${slug}`]
      },
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip'
      }
    });
    
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    
    const data = await res.json();
    return data[0];
  } catch (error) {
    console.error('Error fetching page by slug:', error.message);
    return null;
  }
}

export const fetchPostBySlugAndType = async (slug, postType = 'pages') => {
  try {
    const res = await fetch(`${WP_API_URL}/wp/v2/${postType}?slug=${slug}&status=publish`, {
      next: { 
        revalidate: 180,
        tags: [`${postType}-${slug}`]
      },
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip'
      }
    });
    
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    
    const data = await res.json();
    return data[0];
  } catch (error) {
    console.error(`Error fetching ${postType} by slug:`, error.message);
    return null;
  }
}

export const fetchPageBySlugWithPassword = async (slug, password = null) => {
  try {
    let url = `${WP_API_URL}/wp/v2/pages?slug=${slug}&status=publish`;

    if (password) {
      url += `&password=${password}`;
    }

    const res = await fetch(url, {
      next: { revalidate: 0 }, // No cache for password-protected
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip'
      }
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    return data[0] || null;
  } catch (error) {
    console.error('Error fetching page by slug with password:', error.message);
    return null;
  }
};

export const isPasswordProtected = (pageData) => {
  if (!pageData) return true;
  if (pageData.content?.protected === true) {
    const hasContent = pageData.content?.rendered && pageData.content.rendered.trim().length > 0;
    return !hasContent;
  }
  return false;
};

/**
 * OPTIMIZED TESTIMONIALS
 * - Longer cache (stable content)
 */
export const fetchByTestimonialsWithFetch = async (post_id) => {
  try {
    const url = `${WP_API_URL}/wp/v2/testimonial/${post_id}`;
    const res = await fetch(url, {
      next: { 
        revalidate: 900, // 15 minutes
        tags: [`testimonial-${post_id}`]
      },
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip'
      }
    });
    
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching testimonial:', error.message);
    return null;
  }
};

/**
 * OPTIMIZED CATEGORIES
 * - Long cache (rarely change)
 * - Critical for SEO
 */
export async function fetchCategories() {
  try {
    const response = await fetch(`${WP_API_URL}/wp/v2/categories?per_page=100&hide_empty=true`, {
      next: { 
        revalidate: 3600, // 1 hour
        tags: ['categories']
      },
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    const categories = await response.json();
    return categories
      .filter(cat => cat.slug !== 'uncategorized')
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function fetchCategoryBySlug(slug) {
  try {
    const response = await fetch(`${WP_API_URL}/wp/v2/categories?slug=${slug}`, {
      next: { 
        revalidate: 3600,
        tags: [`category-${slug}`]
      },
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch category');
    }
    
    const categories = await response.json();
    return categories[0] || null;
  } catch (error) {
    console.error('Error fetching category by slug:', error);
    return null;
  }
}

/**
 * OPTIMIZED POSTS FETCHING
 * - Shorter cache for blog posts
 * - SEO-optimized with _embed
 */
export const fetchPosts = async ({ 
  page = 1, 
  per_page = 10, 
  search = '', 
  categories = [], 
  exclude = [],
  status = 'publish',
  _embed = true 
} = {}) => {
  const params = new URLSearchParams({
    page: Math.max(1, parseInt(page)).toString(),
    per_page: Math.min(100, Math.max(1, parseInt(per_page))).toString(),
    status,
  });
  
  if (_embed) {
    params.append('_embed', 'true');
  }
  
  // Important: Don't encode the search query here
  // URLSearchParams will handle the encoding automatically
  if (search?.trim()) {
    const cleanSearch = search.trim();
    params.append('search', cleanSearch);
    console.log('Searching for:', cleanSearch); // Debug log
  }
  
  if (Array.isArray(categories) && categories.length > 0) {
    params.append('categories', categories.filter(Boolean).join(','));
  }
  
  if (Array.isArray(exclude) && exclude.length > 0) {
    params.append('exclude', exclude.filter(Boolean).join(','));
  }

  try {
    const url = `${process.env.NEXT_PUBLIC_WP_API_URL}/wp/v2/posts?${params}`;
    console.log('Fetch URL:', url); // Debug log to see the actual URL
    
    const response = await fetch(url, {
      next: { 
        revalidate: 120,
        tags: ['posts', `posts-page-${page}`]
      },
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip, deflate, br'
      }
    });
    
    if (!response.ok) {
      console.error(`HTTP ${response.status}: ${response.statusText}`);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const posts = await response.json();
    console.log(`Found ${posts.length} posts for search:`, search); // Debug log
    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error.message);
    return [];
  }
};
/**
 * LIGHTWEIGHT POSTS (for listings)
 * - Minimal fields for speed
 * - Perfect for blog listing pages
 */
export const fetchPostsLightweight = async ({ 
  page = 1, 
  per_page = 10, 
  search = '', 
  categories = [] 
} = {}) => {
  const params = new URLSearchParams({
    page: Math.max(1, parseInt(page)).toString(),
    per_page: Math.min(100, Math.max(1, parseInt(per_page))).toString(),
    status: 'publish',
    _fields: 'id,title,excerpt,slug,date,link,featured_media,categories'
  });
  
  if (search?.trim()) {
    params.append('search', search.trim());
  }
  
  if (Array.isArray(categories) && categories.length > 0) {
    params.append('categories', categories.filter(Boolean).join(','));
  }
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_WP_API_URL}/wp/v2/posts?${params}`, {
      next: { 
        revalidate: 180, // 3 minutes
        tags: ['posts-lightweight']
      },
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const posts = await response.json();
    const totalPosts = response.headers.get('X-WP-Total');
    const totalPages = response.headers.get('X-WP-TotalPages');
    
    return {
      posts,
      totalPosts: parseInt(totalPosts) || 0,
      totalPages: parseInt(totalPages) || 0
    };
  } catch (error) {
    console.error('Error fetching posts lightweight:', error.message);
    return { posts: [], totalPosts: 0, totalPages: 0 };
  }
};

/**
 * SINGLE POST BY SLUG
 * - Critical for SEO
 * - Optimized cache with instant updates
 */
export const fetchPostBySlug = async (slug) => {
  try {
    const res = await fetch(`${WP_API_URL}/wp/v2/posts?slug=${slug}&status=publish&_embed`, {
      next: { 
        revalidate: 180, // 3 minutes
        tags: [`post-${slug}`]
      },
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip'
      }
    });
    
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    
    const data = await res.json();
    return data[0];
  } catch (error) {
    console.error('Error fetching post by slug:', error.message);
    return null;
  }
}

// Keep axios-based functions with error handling
export const fetchAllPosts = async () => {
  try {
    const res = await axios.get(`${WP_API_URL}/wp/v2/posts?_embed`);
    return res.data;
  } catch (error) {
    console.error('Error fetching all posts:', error.message);
    return [];
  }
}

export const fetchPaginatePage = async ({ per_page = 10, page = 1 } = {}) => {
  try {
    const res = await axios.get(`${WP_API_URL}/wp/v2/posts`, {
      params: { _embed: true, per_page, page }
    });
    return res.data;
  } catch (error) {
    console.error('Error fetching posts:', error.message);
    return [];
  }
}

export const fetchAllPages = async () => {
  try {
    const res = await axios.get(`${WP_API_URL}/wp/v2/pages`);
    return res.data;
  } catch (error) {
    console.error('Error fetching all pages:', error.message);
    return [];
  }
}

export const fetchCustomPost = async ({ post_type, slug }) => {
  try {
    const res = await axios.get(`${WP_API_URL}/wp/v2/${post_type}?slug=${slug}&status=publish`);
    return res.data[0] || null;
  } catch (error) {
    console.error(`Error fetching ${post_type} post with slug "${slug}":`, error.message);
    return null;
  }
};

export const fetchRecentPost = async ({ post_type = 'posts', post_per_page = 6 }) => {
  try {
    const wpPostType = post_type === 'recent_posts' || 'post' ? 'posts' : post_type;
    const res = await axios.get(`${WP_API_URL}/wp/v2/${wpPostType}?per_page=${post_per_page}&status=publish`);
    return res.data;
  } catch (error) {
    console.error(`Error fetching recent posts of type "${post_type}":`, error.message);
    return [];
  }
};

export const fetchLatestPost = async () => {
  try {
    const res = await axios.get(`${WP_API_URL}/wp/v2/posts?per_page=1&status=publish`);
    return res.data;
  } catch (error) {
    console.error(`Error fetching latest post:`, error.message);
    return [];
  }
};

export const fetchPostsWithQuery = async (queryParams = {}) => {
  try {
    const params = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
      }
    });

    const response = await fetch(
      `${WP_API_URL}/wp/v2/posts?${params.toString()}`,
      {
        next: { revalidate: 180 },
        headers: {
          'Content-Type': 'application/json',
          'Accept-Encoding': 'gzip'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching posts with query:', error);
    return [];
  }
};

export const fetchPostsPagesWithQuery = async (queryParams = {}, type = 'posts') => {
  try {
    const params = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
      }
    });

    const validType = type === 'pages' ? 'pages' : 'posts';
    const response = await fetch(
      `${WP_API_URL}/wp/v2/${validType}?${params.toString()}`,
      {
        next: { revalidate: 180 },
        headers: {
          'Content-Type': 'application/json',
          'Accept-Encoding': 'gzip'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch ${validType}: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching posts/pages with query:', error);
    return [];
  }
};

export const fetchPostsSlider = async ({
  post_type = 'posts', 
  post_per_page = 3,
  page_id = null 
}) => {
  try {
    let endpoint = '';

    if (post_type === 'posts' || post_type === 'pages') {
      endpoint = `${WP_API_URL}/wp/v2/${post_type}?per_page=${post_per_page}&status=publish`;
    } else if (post_type === 'posts_slider') {
      endpoint = `${WP_API_URL}/custom/v1/posts-slider?page_id=${page_id}`;
    } else {
      endpoint = `${WP_API_URL}/wp/v2/${post_type}?per_page=${post_per_page}&status=publish`;
    }

    const res = await axios.get(endpoint);
    return res.data;
  } catch (error) {
    console.error(`Error fetching posts of type "${post_type}":`, error.message);
    return [];
  }
};

export const fetchRelatedPosts = async (queryData) => {
  try {
    const relatedPosts = await fetchPostsWithQuery({
      per_page: queryData.posts_limit || 6,
      exclude: queryData.exclude || [],
      categories: queryData.categories || [],
      orderby: 'date',
      order: 'desc'
    });
    return relatedPosts || [];
  } catch (error) {
    console.error('Failed to fetch related posts:', error);
    return [];
  }
};

// Sitemap generation functions (optimized)
export const fetchFieldsPages = async () => {
  let allPages = [];
  let page = 1;
  let totalPages = 1;

  try {
    while (page <= totalPages) {
      const res = await axios.get(`${WP_API_URL}/wp/v2/pages`, {
        params: {
          per_page: 100,
          page: page,
          status: 'publish',
          _fields: 'id,title,slug,date,modified,parent,status'
        },
        timeout: 10000,
      });
      
      totalPages = parseInt(res.headers['x-wp-totalpages'] || '1', 10);
      allPages = allPages.concat(res.data);
      page++;
      
      if (page > 100) break;
    }
    
    return allPages.map(p => ({
      id: p.id,
      parent: p.parent,
      title: p.title?.rendered || 'Untitled',
      date: p.date,
      modified: p.modified,
      slug: p.slug,
      url: p.parent ? `${SITE_BASE_URL}/${getPageHierarchy(allPages, p)}` : `${SITE_BASE_URL}/${p.slug}`,
    }));
  } catch (error) {
    console.error('Error fetching pages:', error.message);
    return [];
  }
};

export const fetchFieldsPosts = async () => {
  let allPosts = [];
  let page = 1;
  let totalPages = 1;

  try {
    while (page <= totalPages) {
      const res = await axios.get(`${WP_API_URL}/wp/v2/posts`, {
        params: {
          per_page: 100,
          page: page,
          status: 'publish',
          _fields: 'id,title,slug,date,modified,categories'
        },
        timeout: 10000,
      });
      
      totalPages = parseInt(res.headers['x-wp-totalpages'] || '1', 10);
      allPosts = allPosts.concat(res.data);
      page++;
      
      if (page > 100) break;
    }

    const categoryIds = [...new Set(allPosts.flatMap(post => post.categories || []))];
    let categoriesMap = {};
    
    if (categoryIds.length > 0) {
      try {
        const categoriesRes = await axios.get(`${WP_API_URL}/wp/v2/categories`, {
          params: {
            include: categoryIds.join(','),
            per_page: 100,
            _fields: 'id,name,slug'
          }
        });
        categoriesMap = categoriesRes.data.reduce((acc, cat) => {
          acc[cat.id] = cat.name;
          return acc;
        }, {});
      } catch (catError) {
        console.error('Error fetching categories:', catError.message);
      }
    }
    
    return allPosts.map(p => ({
      id: p.id,
      title: p.title?.rendered || 'Untitled',
      date: p.date,
      modified: p.modified,
      slug: p.slug,
      categories: p.categories ? p.categories.map(catId => categoriesMap[catId] || 'Uncategorized') : [],
      category: p.categories && p.categories.length > 0 ? (categoriesMap[p.categories[0]] || 'Uncategorized') : 'Uncategorized',
      url: `${SITE_BASE_URL}/blog/${p.slug}`,
    }));
  } catch (error) {
    console.error('Error fetching posts:', error.message);
    return [];
  }
};

const getPageHierarchy = (allPages, page) => {
  if (!page.parent) return page.slug;
  
  const parent = allPages.find(p => p.id === page.parent);
  if (parent) {
    return `${getPageHierarchy(allPages, parent)}/${page.slug}`;
  }
  return page.slug;
};

const stripHtml = (html) => {
  return html.replace(/<[^>]*>/g, '').trim();
};