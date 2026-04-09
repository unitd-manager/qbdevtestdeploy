import { fetchPageBySlug, fetchByTestimonialsWithFetch, fetchRecentPost } from '@/lib/wordpress'
import { generatePageMetadatas, getStructuredData } from '@/lib/rankmath-utils';
import { DivTag, H1Tag, PTag } from '../../components/Common/HTMLTags';

import {
  DynamicComponent,
  applyPaddingToLayouts,
  processLayoutData
} from '@/lib/about-page-layout-utils';
import StructuredData from '@/components/Common/StructuredData';

const slug = 'about';
const parent_path = '';

export async function generateMetadata() {
  return generatePageMetadatas(slug, 'page', parent_path, {});
}

export default async function AboutPage() {
  try {
    const pageData = await fetchPageBySlug(slug);
    const metadata = await generatePageMetadatas(slug, 'page', parent_path, {});
    const structuredData = getStructuredData(metadata);
    
    if (!pageData || !pageData.acf || !pageData.acf.about_page_layouts) {
      return (
        <DivTag className="about-page">
          <StructuredData data={structuredData} />
          <DivTag className="d-flex flex-column justify-content-center align-items-center text-center min-vh-100">
            <H1Tag>Welcome</H1Tag>
            <PTag>Content is being updated. Please check back soon.</PTag>
          </DivTag>
        </DivTag>
      );
    }
    const processedLayouts = applyPaddingToLayouts(pageData.acf.about_page_layouts);
    const finalLayouts = await processLayoutData(processedLayouts);
    return (
      <DivTag className="about-page">
        <StructuredData data={structuredData} />
        {finalLayouts.map((item) => (
          <DynamicComponent
            key={`${item.layout.layout_type}-${item.index}`}
            layout={item.layout}
            data={item.data}
          />
        ))}
      </DivTag>
    );
  } catch (error) {
    console.error('Error rendering SolutionPage:', error);

    return (
      <DivTag className="about-page light-gray">
        <div className="text-center py-16">
          <h1>Something went wrong</h1>
          <p>We are experiencing technical difficulties. Please try again later.</p>
        </div>
      </DivTag>
    );
  }
}