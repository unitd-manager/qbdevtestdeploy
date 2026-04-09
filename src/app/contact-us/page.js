import { fetchPageBySlug } from '@/lib/wordpress';
import { DivTag, H1Tag, PTag } from '@/components/Common/HTMLTags';
import {
  DynamicComponent,
  applyPaddingToLayouts,
  processLayoutData,
} from '@/lib/page-layout-utils';

import { generatePageMetadatas, getStructuredData } from '@/lib/rankmath-utils';
import StructuredData from '@/components/Common/StructuredData';

const slug = 'contact-us';
const parent_path = '';

export async function generateMetadata() {
  return generatePageMetadatas(slug, 'page', parent_path, {});
}

export default async function ContactPage() {
  try {

    const pageData = await fetchPageBySlug(slug);
    
    const metadata = await generatePageMetadatas(slug, 'page', parent_path, {});
    const structuredData = getStructuredData(metadata);
    
    const layouts = pageData?.acf?.layouts ?? [];
    
    if (layouts.length === 0) {
      return (
        <DivTag className="contact-us-page">
          <StructuredData data={structuredData} />
          <DivTag className="d-flex flex-column justify-content-center align-items-center text-center min-vh-100">
            <H1Tag>Welcome</H1Tag>
            <PTag>Content is being updated. Please check back soon.</PTag>
          </DivTag>
        </DivTag>
      );
    }

    // Process and render layouts
    const processedLayouts = applyPaddingToLayouts(layouts);
    const finalLayouts = await processLayoutData(processedLayouts);

    return (
      <DivTag className="contact-us-page light-gray">
        <StructuredData data={structuredData} />
        {finalLayouts.map((item) => (
          <DynamicComponent
            key={`${item.layout.layout_type}-${item.index}`}
            layout={item.layout}
            data={{ ...item.data, pageId: pageData.id }}
          />
        ))}
      </DivTag>
    );
  } catch (error) {
    console.error('Error rendering ContactPage:', error);
    return (
      <DivTag className="contact-us-page light-gray">
        <DivTag className="text-center py-16">
          <H1Tag>Something went wrong</H1Tag>
          <PTag>We are experiencing technical difficulties. Please try again later.</PTag>
        </DivTag>
      </DivTag>
    );
  }
}