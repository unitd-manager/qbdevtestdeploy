// app/blog/category/[slug]/page.js
import { fetchPageBySlug, fetchPosts, fetchCategoryBySlug, fetchCategories } from '@/lib/wordpress';
import { fetchRankMathMeta } from '@/lib/fetchRankMathMeta';
import parse from 'html-react-parser';
import { lazy, Suspense, memo } from 'react';
import { notFound, redirect } from 'next/navigation';
import { DivTag } from '@/components/Common/HTMLTags';
import BlogSearchSection from '@/components/Layout/blog-search-section';
import BlogCategoryList from '@/components/Blog/BlogCategoryList';
import StructuredData from '@/components/Common/StructuredData';
import { generateCategoryMetadatas, getStructuredData } from '@/lib/rankmath-utils';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

const componentMap = {
  banner_layout: lazy(() => import('@/components/Layout/banner-layout').catch(() => ({ default: () => <div>Component failed to load</div> }))),
  latest_blog: lazy(() => import('@/components/Layout/latest-post').catch(() => ({ default: () => <div>Component failed to load</div> }))),
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

// Generate static params for categories
export async function generateStaticParams() {
  try {
    const categories = await fetchCategories();
    return categories.slice(0, 50).map((category) => ({
      slug: category.slug,
    }));
  } catch (error) {
    console.error('Error generating static params for categories:', error);
    return [];
  }
}

const parent_path = 'blog/category';

export async function generateMetadata({ params }) {
  // Don't await params here - they're already resolved during static generation
  const { slug } = params;
  return generateCategoryMetadatas(slug, parent_path, {});
}

export default async function CategoryPage({ params, searchParams }) {
  try {

    const resolvedParams = await Promise.resolve(searchParams);
    const searchQuery = resolvedParams?.search || '';

    // Don't await params - they're already resolved synchronously during static generation
    const { slug: categorySlug } = params;
    
    // For searchParams, handle both sync and async cases
    let resolvedSearchParams = {};
    try {
      // Try to access searchParams synchronously first
      resolvedSearchParams = searchParams || {};
    } catch {
      // If that fails, it means we're in a dynamic context
      resolvedSearchParams = await searchParams;
    }
    
    const page = parseInt(resolvedSearchParams.page) || 1;

    // If there's a page parameter, redirect to the paginated route
    if (page > 1) {
      redirect(`/blog/category/${categorySlug}/page/${page}${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ''}`);
    }

    // Get category details
    const category = await fetchCategoryBySlug(categorySlug);
    if (!category) return notFound();

    // Get blog page configuration and rank math data in parallel
    const [blogPage, rankMathHead] = await Promise.all([
      fetchPageBySlug('blog'),
      fetchRankMathMeta('blog')
    ]);

    const layouts = blogPage?.acf?.layouts ?? [];

    // Get perPage dynamically from blog layout configuration
    const blogLayoutConfig = layouts.find(layout => layout.layout_type === 'blog_layout');
    const perPage = parseInt(blogLayoutConfig?.blog_layout?.post_per_page) || 12;

    // Fetch first page of posts
    const paginatedPosts = await fetchPosts({
      categories: [category.id],
      search: searchQuery,
      per_page: perPage,
      page: 1
    });

    // If searching, additionally filter results by title match to reduce unrelated results
    let filteredPosts = paginatedPosts || [];
    if (searchQuery?.trim()) {
      try {
        const cleanedSearch = searchQuery.trim().replace(/[:"']/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
        filteredPosts = filteredPosts.filter(post => {
          const title = (post?.title?.rendered || '').toLowerCase();
          return cleanedSearch.split(' ').every(term => term && title.includes(term));
        });
      } catch (err) {
        console.error('Error filtering category posts by title:', err);
      }
    }

    // Get total count for pagination calculation
    const totalCount = await getCategoryPostCount(category.id, searchQuery);
    const totalPages = Math.ceil(totalCount / perPage);

    const processedLayouts = applyPadding(layouts).map((item) => {
      if (item.layout.layout_type === 'blog_layout') {
        return {
          ...item,
          data: {
            ...item.data,
            posts: paginatedPosts || [],
            currentPage: 1,
            totalPages: Math.max(1, totalPages),
            searchQuery,
            post_per_page: perPage,
            category: category,
            custom_title: `${category.name} Posts`,
            totalPosts: totalCount,
            showPagination: totalPages > 1,
            categorySlug: categorySlug
          },
        };
      }
      return item;
    });

    const metadata = await generateCategoryMetadatas(categorySlug, parent_path, {});
    const structuredData = getStructuredData(metadata);

    return (
      <>
        {rankMathHead && parse(rankMathHead)}
        <DivTag className="blog-page category-page">
          <StructuredData data={structuredData} />
          <BlogSearchSection />
          <BlogCategoryList currentCategory={categorySlug} />

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
    console.error('Error rendering category page:', error);
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

// Helper function to get total post count for category efficiently
const getCategoryPostCount = async (categoryId, searchQuery = '') => {
  try {
    const params = new URLSearchParams({
      per_page: '1',
      page: '1',
      status: 'publish',
      categories: categoryId.toString()
    });

    if (searchQuery?.trim()) {
      params.append('search', searchQuery.trim());
    }

    const response = await fetch(`${process.env.WP_API_URL}/wp/v2/posts?${params}`, {
      next: { revalidate: 600 }
    });

    if (!response.ok) return 0;

    const totalPosts = response.headers.get('X-WP-Total');
    return parseInt(totalPosts) || 0;
  } catch (error) {
    console.error('Error getting category post count:', error);
    return 0;
  }
};