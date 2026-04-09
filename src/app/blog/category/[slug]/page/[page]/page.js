// app/blog/category/[slug]/page/[page]/page.js - OPTIMIZED PAGINATED CATEGORY
import { fetchPageBySlug, fetchPosts, fetchCategoryBySlug, fetchCategories } from '@/lib/wordpress';
import { fetchRankMathMeta } from '@/lib/fetchRankMathMeta';
import parse from 'html-react-parser';
import { lazy, Suspense, memo } from 'react';
import { notFound } from 'next/navigation';
import { DivTag } from '@/components/Common/HTMLTags';
import BlogSearchSection from '@/components/Layout/blog-search-section';
import BlogCategoryList from '@/components/Blog/BlogCategoryList';
import StructuredData from '@/components/Common/StructuredData';
import { generateCategoryMetadatas, generatePageMetadatas, getStructuredData } from '@/lib/rankmath-utils';

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

    const response = await fetch(`${process.env.NEXT_PUBLIC_WP_API_URL}/wp/v2/posts?${params}`, {
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

export async function generateStaticParams() {
  try {
    const categories = await fetchCategories();
    const blogPage = await fetchPageBySlug('blog');
    const layouts = blogPage?.acf?.layouts ?? [];
    const blogLayoutConfig = layouts.find(layout => layout.layout_type === 'blog_layout');
    const perPage = parseInt(blogLayoutConfig?.blog_layout?.post_per_page) || 12;

    const params = [];

    // Limit to prevent excessive build time
    const maxCategories = 20;
    const limitedCategories = categories.slice(0, maxCategories);

    for (const category of limitedCategories) {
      const totalCount = await getCategoryPostCount(category.id);
      const totalPages = Math.ceil(totalCount / perPage);

      // Limit pages per category
      const maxPagesPerCategory = 10;
      const pagesToGenerate = Math.min(totalPages, maxPagesPerCategory);

      for (let i = 1; i <= pagesToGenerate; i++) {
        params.push({
          slug: category.slug,
          page: i.toString(),
        });
      }
    }

    return params;
  } catch (error) {
    console.error('Error generating category paginated static params:', error);
    return [];
  }
}

const parent_path = 'blog/category';

export async function generateMetadata({ params }) {
  const { slug } = params;
  return generateCategoryMetadatas(slug, parent_path, {});
}

export default async function CategoryPaginatedPage({ params, searchParams }) {
  try {

    const resolvedParams = await Promise.resolve(searchParams);
    const searchQuery = resolvedParams?.search || '';

    const { slug: categorySlug, page } = params;
    
    let resolvedSearchParams = {};
    try {
      resolvedSearchParams = searchParams || {};
    } catch {
      resolvedSearchParams = await searchParams;
    }
  
    const currentPage = parseInt(page) || 1;

    const category = await fetchCategoryBySlug(categorySlug);
    if (!category) return notFound();

    const [blogPage, rankMathHead] = await Promise.all([
      fetchPageBySlug('blog'),
      fetchRankMathMeta('blog')
    ]);

    const layouts = blogPage?.acf?.layouts ?? [];

    // Get perPage dynamically from blog layout configuration
    const blogLayoutConfig = layouts.find(layout => layout.layout_type === 'blog_layout');
    const perPage = parseInt(blogLayoutConfig?.blog_layout?.post_per_page) || 12;

    // Fetch data efficiently with Promise.all
    const [paginatedPosts, totalCount] = await Promise.all([
      // Get posts for current page only
      fetchPosts({
        categories: [category.id],
        search: searchQuery,
        per_page: perPage,
        page: currentPage
      }),
      // Get total count for pagination
      getCategoryPostCount(category.id, searchQuery)
    ]);

    const totalPages = Math.ceil(totalCount / perPage);

    // If no posts found and not first page, show 404
    if (!paginatedPosts?.length && currentPage > 1) {
      return notFound();
    }

    // If no posts found in this category at all
    if (!paginatedPosts?.length && totalCount === 0) {
      return (
        <>
          {rankMathHead && parse(rankMathHead)}
          <DivTag className="blog-page category-page">
            <BlogSearchSection />
            <BlogCategoryList currentCategory={categorySlug} />
            <div className="container mx-auto px-4 py-16 text-center">
              <h1 className="text-3xl font-bold mb-4">{category.name}</h1>
              {category.description && (
                <p className="text-gray-600 mb-8">{category.description}</p>
              )}
              <p className="text-lg">No posts found in this category.</p>
              {searchQuery && (
                <p className="text-sm text-gray-500 mt-2">
                  Try adjusting your search terms or browse other categories.
                </p>
              )}
            </div>
          </DivTag>
        </>
      );
    }

    const processedLayouts = applyPadding(layouts).map((item) => {
      if (item.layout.layout_type === 'blog_layout') {
        return {
          ...item,
          data: {
            ...item.data,
            posts: paginatedPosts || [],
            currentPage,
            totalPages: Math.max(1, totalPages),
            searchQuery,
            post_per_page: perPage,
            category: category,
            custom_title: `${category.name} Posts${currentPage > 1 ? ` - Page ${currentPage}` : ''}`,
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
    console.error('Error rendering category paginated page:', error);
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