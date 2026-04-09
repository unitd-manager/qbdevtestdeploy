// app/blog/page/[page]/page.js - FIXED VERSION
import { fetchPageBySlug, fetchPosts } from '@/lib/wordpress';
import { fetchRankMathMeta } from '@/lib/fetchRankMathMeta';
import parse from 'html-react-parser';
import { lazy, Suspense, memo } from 'react';
import { notFound } from 'next/navigation';
import { DivTag } from '@/components/Common/HTMLTags';
import BlogSearchSection from '@/components/Layout/blog-search-section';
import BlogCategoryList from '@/components/Blog/BlogCategoryList';
import LatestPost from '@/components/Layout/latest-post';
import { generatePageMetadatas, getStructuredData } from '@/lib/rankmath-utils';
import StructuredData from '@/components/Common/StructuredData';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

const slug = 'blog';
const parent_path = '';

export async function generateMetadata() {
  return generatePageMetadatas(slug, 'page', parent_path, {});
}

const componentMap = {
  banner_layout: lazy(() => import('@/components/Layout/banner-layout').catch(() => ({ default: () => <div>Component failed to load</div> }))),
  blog_layout: lazy(() => import('@/components/Layout/blog-layout').catch(() => ({ default: () => <div>Component failed to load</div> }))),
  spacing: lazy(() => import('@/components/Common/Spacing').catch(() => ({ default: () => <div>Component failed to load</div> }))),
  common_heading_section: lazy(() => import('@/components/Layout/common-heading-section').catch(() => ({ default: () => <div>Component failed to load</div> }))),
};

const DynamicComponent = memo(({ layout, data }) => {
  const Component = componentMap[layout.layout_type];
  if (!Component) {
    console.warn(`Component not found for layout type: ${layout.layout_type}`);
    return <div>Unknown component type: {layout.layout_type}</div>;
  }
  return (
    <Suspense fallback={<div className="animate-pulse bg-gray-100 h-32 rounded">Loading...</div>}>
      <Component data={data} />
    </Suspense>
  );
});
DynamicComponent.displayName = 'DynamicComponent';

const applyPadding = (layouts) => {
  let pendingPadding = null;
  return layouts.map((layout, index) => {
    const layoutType = layout.layout_type;
    if (layout.section_space_padding) {
      pendingPadding = layout.section_space_padding;
      if (!layout[layoutType]) return null;
    }
    let processedData = layout[layoutType];
    if (pendingPadding) {
      processedData = { ...processedData, padding: pendingPadding };
      pendingPadding = null;
    }
    return { layout, data: processedData, index };
  }).filter(Boolean);
};

// Helper function to get total post count without fetching all posts
const getTotalPostCount = async (searchQuery = '') => {
  try {
    const params = new URLSearchParams({
      per_page: '1', // Only fetch 1 post to get total count from headers
      page: '1',
      status: 'publish'
    });
    
    if (searchQuery?.trim()) {
      params.append('search', searchQuery.trim());
    }
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_WP_API_URL}/wp/v2/posts?${params}`, {
      next: { revalidate: 600 } // Cache for 10 minutes
    });
    
    if (!response.ok) return 0;
    
    // WordPress REST API returns total count in headers
    const totalPosts = response.headers.get('X-WP-Total');
    return parseInt(totalPosts) || 0;
  } catch (error) {
    console.error('Error getting total post count:', error);
    return 0;
  }
};

export async function generateStaticParams() {
  try {
    
    // Get blog page to determine perPage setting
    const blogPage = await fetchPageBySlug('blog');

    const layouts = blogPage?.acf?.layouts ?? [];
    const blogLayoutConfig = layouts.find(layout => layout.layout_type === 'blog_layout');
    const perPage = parseInt(blogLayoutConfig?.blog_layout?.post_per_page) || 12;
    
    // Get total count instead of fetching all posts
    const totalPostCount = await getTotalPostCount();
    const totalPages = Math.ceil(totalPostCount / perPage);

    // Limit to reasonable number of static pages to prevent build issues
    const maxStaticPages = 20;
    const pagesToGenerate = Math.min(totalPages, maxStaticPages);

    console.log(`Generating ${pagesToGenerate} blog pages (total posts: ${totalPostCount})`);

    return Array.from({ length: pagesToGenerate }, (_, i) => ({
      page: `${i + 1}`,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [{ page: '1' }];
  }
}

export default async function BlogPaginated({ params, searchParams }) {
  try {
       const resolvedParams = await Promise.resolve(searchParams);
    const searchQuery = resolvedParams?.search || '';
    const { page } = params;
  
    let resolvedSearchParams = {};
    try {
      resolvedSearchParams = searchParams || {};
    } catch {
      resolvedSearchParams = await searchParams;
    }
    
    const currentPage = parseInt(page || '1');
    
    
    // Fetch page configuration
    const blogPage = await fetchPageBySlug('blog');
    const metadata = await generatePageMetadatas(slug, 'page', parent_path, {});
    const structuredData = getStructuredData(metadata);
    const layouts = blogPage?.acf?.layouts ?? [];

    const blogLayoutConfig = layouts.find(layout => layout.layout_type === 'blog_layout');
    const perPage = parseInt(blogLayoutConfig?.blog_layout?.post_per_page) || 12;

    const [paginatedPosts, latestPostResponse, totalCount] = await Promise.all([
    
      fetchPosts({ 
        search: searchQuery, 
        page: currentPage, 
        per_page: perPage 
      }),

      // Fetch latest post for header (only if not searching)
      !searchQuery ? fetchPosts({ 
        per_page: 1, 
        page: 1 
      }) : Promise.resolve([]),

      // Get total count for pagination
      getTotalPostCount(searchQuery)
    ]);

    const latest_post = latestPostResponse?.[0] || null;
    const totalPages = Math.ceil(totalCount / perPage);

    // If no posts found and not first page, show 404
    if (!paginatedPosts?.length && currentPage > 1) {
      return notFound();
    }

    const processedLayouts = applyPadding(layouts).map((item) => {
      if (item.layout.layout_type === 'blog_layout') {
        return {
          ...item,
          data: {
            ...item.data,
            posts: paginatedPosts || [],
            currentPage,
            totalPages,
            searchQuery,
            post_per_page: perPage,
            totalPosts: totalCount,
            showPagination: totalPages > 1,
          },
        };
      }
      return item;
    });

    return (
      <>
        <DivTag className="blog-page">
          <StructuredData data={structuredData} />
          <BlogSearchSection />
          {!searchQuery && latest_post && <LatestPost data={latest_post} />}
          <BlogCategoryList />
          {processedLayouts.map((item) => (
            <DynamicComponent
              key={`${item.layout.layout_type}-${item.index}`}
              layout={item.layout}
              data={item.data}
            />
          ))}
        </DivTag>
      </>
    );
  } catch (error) {
    console.error('Error rendering paginated blog page:', error);
    return (
      <DivTag className="blog-page">
        <div className="text-center py-16">
          <h1>Something went wrong</h1>
          <p>We are experiencing technical difficulties. Please try again later.</p>
        </div>
      </DivTag>
    );
  }
}