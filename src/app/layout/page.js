// app/layout/page.js
import { fetchPageBySlug, fetchPosts } from '@/lib/wordpress';
import { DivTag, H1Tag, PTag } from '../../components/Common/HTMLTags';
import { lazy, Suspense, memo } from 'react';
import { generatePageMetadatas, getStructuredData } from '@/lib/rankmath-utils';
import parse from 'html-react-parser';
import StructuredData from '@/components/Common/StructuredData';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

// Map layout types to components
const componentMap = {
  'banner_layout': lazy(() => import('@/components/Layout/banner-layout').catch(() => ({ default: () => <div>Component failed to load</div> }))),
  'blog_layout': lazy(() => import('@/components/Layout/blog-layout').catch(() => ({ default: () => <div>Component failed to load</div> }))),
  'grid_layout': lazy(() => import('@/components/Layout/grid-layout').catch(() => ({ default: () => <div>Component failed to load</div> }))),
  'content_layout': lazy(() => import('@/components/Layout/content-layout').catch(() => ({ default: () => <div>Component failed to load</div> }))),
  'spacing': lazy(() => import('@/components/Common/Spacing').catch(() => ({ default: () => <div>Component failed to load</div> }))),
  'common_heading_section': lazy(() => import('@/components/Layout/common-heading-section').catch(() => ({ default: () => <div>Component failed to load</div> }))),
  'feature_highlight_block': lazy(() => import('@/components/Layout/feature-highlight-block').catch(() => ({ default: () => <div>Component failed to load</div> }))),
  'general_cta_section': lazy(() => import('@/components/Layout/general-cta-section').catch(() => ({ default: () => <div>Component failed to load</div> }))),
};

const slug = 'layout';

export async function generateMetadata() {
  return generatePageMetadatas(slug, 'page', '', {});
}

const DynamicComponent = memo(({ layout, data }) => {
  const Component = componentMap[layout.layout_type];
  if (!Component) {
    console.warn(`Component not found for layout type: ${layout.layout_type}`);
    return <div className="alert alert-warning">Unknown component type: {layout.layout_type}</div>;
  }
  return (
    <Suspense fallback={<div className="animate-pulse bg-gray-100 h-32 rounded"></div>}>
      <Component data={data} />
    </Suspense>
  );
});
DynamicComponent.displayName = 'DynamicComponent';

async function fetchLayout() {
  const page = await fetchPageBySlug(slug);
  
  if (!page) {
    return null;
  }
  
  return page;
}

// Enrich layout data with fetched posts for blog_layout
async function enrichLayoutWithData(layout) {
  if (layout.layout_type === 'blog_layout') {
    const blogLayoutData = layout.blog_layout || {};
    const perPage = parseInt(blogLayoutData.post_per_page) || 10;
    
    try {
      const posts = await fetchPosts({
        per_page: perPage,
        page: 1,
      });

      return {
        ...layout,
        blog_layout: {
          ...blogLayoutData,
          posts: posts || [],
          currentPage: 1,
          totalPages: Math.ceil((posts?.length || 0) / perPage),
        }
      };
    } catch (error) {
      console.error('Error fetching posts for blog layout:', error);
      return layout;
    }
  }
  
  return layout;
}

export default async function LayoutPage() {
  const page = await fetchLayout();

  if (!page) {
    return <div className="container py-5">Layout page not found</div>;
  }

  // Get structured data for SEO
  const structuredData = getStructuredData(page, 'WebPage', {
    publisher: {
      '@type': 'Organization',
      name: 'Qbotica',
    },
  });

  // Get layouts from ACF field and enrich with data
  const rawLayouts = page?.acf?.layouts ?? [];
  const enrichedLayouts = await Promise.all(
    rawLayouts.map(layout => enrichLayoutWithData(layout))
  );

  return (
    <>
      <StructuredData data={structuredData} />
      
      {/* Page Header */}
      {page.title && (
        <DivTag className="page-header bg-light py-5 mb-5">
          <DivTag className="container">
            <H1Tag className="mb-3">{parse(page.title.rendered)}</H1Tag>
            {page.excerpt && (
              <PTag className="lead text-muted">
                {parse(page.excerpt.rendered)}
              </PTag>
            )}
          </DivTag>
        </DivTag>
      )}

      {/* Render Layouts */}
      {enrichedLayouts && enrichedLayouts.length > 0 ? (
        <DivTag>
          {enrichedLayouts.map((layout, index) => {
            if (!layout.layout_type) return null;
            
            const layoutType = layout.layout_type;
            const layoutData = layout[layoutType];
            
            if (!layoutData) return null;

            return (
              <DivTag key={index}>
                <DynamicComponent layout={layout} data={layoutData} />
              </DivTag>
            );
          })}
        </DivTag>
      ) : (
        <DivTag className="container py-5">
          <p className="text-muted">No layouts configured for this page.</p>
        </DivTag>
      )}
    </>
  );
}
