// app/blog/page.js - FIXED VERSION
import { fetchPageBySlug, fetchPosts } from '@/lib/wordpress';
import { DivTag, H1Tag, PTag } from '../../components/Common/HTMLTags';
import { lazy, Suspense, memo } from 'react';
import { generatePageMetadatas, getStructuredData } from '@/lib/rankmath-utils';
import parse from 'html-react-parser';
import BlogSearchSection from '@/components/Layout/blog-search-section';
import BlogCategoryList from '@/components/Blog/BlogCategoryList';
import LatestPost from '@/components/Layout/latest-post';
import StructuredData from '@/components/Common/StructuredData';

// IMPORTANT: Remove force-static since we need dynamic search
export const dynamic = 'force-dynamic'; // Changed from 'force-static'
export const revalidate = 3600;

const componentMap = {
  'banner_layout': lazy(() => import('@/components/Layout/banner-layout').catch(() => ({ default: () => <div>Component failed to load</div> }))),
  'blog_layout': lazy(() => import('@/components/Layout/blog-layout').catch(() => ({ default: () => <div>Component failed to load</div> }))),
  'spacing': lazy(() => import('@/components/Common/Spacing').catch(() => ({ default: () => <div>Component failed to load</div> }))),
  'common_heading_section': lazy(() => import('@/components/Layout/common-heading-section').catch(() => ({ default: () => <div>Component failed to load</div> }))),
};

const slug = 'blog';
const parent_path = '';

export async function generateMetadata() {
  return generatePageMetadatas(slug, 'page', parent_path, {});
}

const DynamicComponent = memo(({ layout, data }) => {
  const Component = componentMap[layout.layout_type];
  if (!Component) {
    console.warn(`Component not found for layout type: ${layout.layout_type}`);
    return <div>Unknown component type: {layout.layout_type}</div>;
  }
  return (
    <Suspense fallback={<div className="animate-pulse bg-gray-100 h-32 rounded"></div>}>
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

const getTotalPostCount = async (searchQuery = '') => {
  try {
    const params = new URLSearchParams({
      per_page: '1',
      page: '1',
      status: 'publish'
    });

    if (searchQuery?.trim()) {
      params.append('search', searchQuery.trim());
    }

    const response = await fetch(`${process.env.WP_API_URL}/wp/v2/posts?${params}`, {
      next: { revalidate: 300 }
    });

    if (!response.ok) return 0;

    const totalPosts = response.headers.get('X-WP-Total');
    return parseInt(totalPosts) || 0;
  } catch (error) {
    console.error('Error getting total post count:', error);
    return 0;
  }
};

export default async function BlogPage({ searchParams }) {
  try {
    
    const resolvedParams = await Promise.resolve(searchParams);
    const searchQuery = resolvedParams?.search || '';
    

    const blogPage = await fetchPageBySlug(slug);
    const metadata = await generatePageMetadatas(slug, 'page', parent_path, {});
    const structuredData = getStructuredData(metadata);
    const layouts = blogPage?.acf?.layouts ?? [];

    const currentPage = 1;

    // Get per page setting from layout config
    let perPage = 12;
    const blogLayoutConfig = layouts.find(layout => layout.layout_type === 'blog_layout');
    if (blogLayoutConfig?.blog_layout?.post_per_page) {
      perPage = parseInt(blogLayoutConfig.blog_layout.post_per_page) || 12;
    }

    // Fetch data efficiently with Promise.all
    const [latestPostResponse, paginatedPosts, totalCount] = await Promise.all([
      // Get latest post separately (only when not searching)
      searchQuery ? Promise.resolve([]) : fetchPosts({
        per_page: 1,
        page: 1
      }),

      // Get posts for listing with search
      fetchPosts({
        per_page: perPage,
        page: currentPage,
        search: searchQuery, // This will be passed to the API
      }),

      getTotalPostCount(searchQuery)
    ]);

    const latest_post = !searchQuery ? latestPostResponse?.[0] || null : null;

    let postsForListing = paginatedPosts || [];

    // If searching, additionally filter results by title match to reduce unrelated results
    if (searchQuery?.trim()) {
      try {
        const cleanedSearch = searchQuery.trim().replace(/[:"']/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
        postsForListing = postsForListing.filter(post => {
          const title = (post?.title?.rendered || '').toLowerCase();
          return cleanedSearch.split(' ').every(term => term && title.includes(term));
        });
      } catch (err) {
        console.error('Error filtering posts by title:', err);
      }
    }

    // Only exclude latest post when NOT searching
    if (!searchQuery && latest_post) {
      const latestPostIndex = postsForListing.findIndex(post => post.id === latest_post.id);
      if (latestPostIndex !== -1) {
        postsForListing.splice(latestPostIndex, 1);

        const additionalPosts = await fetchPosts({
          per_page: perPage + 1,
          page: currentPage,
          exclude: [latest_post.id]
        });

        if (additionalPosts && additionalPosts.length > 0) {
          postsForListing = additionalPosts.slice(0, perPage);
        }
      }
    }

    // Calculate total pages
    const adjustedTotal = searchQuery ? totalCount : Math.max(0, totalCount - 1);
    const totalPages = Math.ceil(adjustedTotal / perPage);

    if (!layouts.length) {
      return (
        <DivTag className="blog-page">
          <StructuredData data={structuredData} />
          <DivTag className="d-flex flex-column justify-content-center align-items-center text-center min-vh-100">
            <H1Tag>Welcome</H1Tag>
            <PTag>Content is being updated. Please check back soon.</PTag>
          </DivTag>
        </DivTag>
      );
    }

    const processedLayouts = applyPadding(layouts).map(item => {
      if (item.layout.layout_type === 'blog_layout') {
        return {
          ...item,
          data: {
            ...item.data,
            posts: postsForListing,
            currentPage,
            totalPages: Math.max(1, totalPages),
            searchQuery,
            post_per_page: perPage,
            totalPosts: adjustedTotal,
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
    console.error('Error rendering BlogPage:', error);
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