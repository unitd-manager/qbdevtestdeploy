import { cookies } from 'next/headers';
import { fetchPageBySlugWithPassword, isPasswordProtected } from '@/lib/wordpress';
import { DivTag, H1Tag, PTag } from '../../components/Common/HTMLTags';
import {
  DynamicComponent,
  applyPaddingToLayouts,
  processLayoutData
} from '@/lib/page-layout-utils';
import { generatePageMetadatas, getStructuredData } from '@/lib/rankmath-utils';
import StructuredData from '@/components/Common/StructuredData';
import PasswordProtectedPage from '@/components/Common/PasswordProtectedPage';

// Force dynamic rendering - don't cache this page
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const slug = 'marketing-assets';
const parent_path = '';

export async function generateMetadata() {
  return generatePageMetadatas(slug, 'page', parent_path, {});
}

export default async function AssetsPage() {
  try {
    // Get password from cookies
    const cookieStore = await cookies();
    const savedPassword = cookieStore.get(`page_password_${slug}`)?.value;
    
    const pageData = await fetchPageBySlugWithPassword(slug, savedPassword);
    
    if (isPasswordProtected(pageData)) {
      return <PasswordProtectedPage slug={slug} />;
    }


    const metadata = await generatePageMetadatas(slug, 'page', parent_path, {});
    const structuredData = getStructuredData(metadata);

    if (!pageData || !pageData.acf || !pageData.acf.layouts?.length) {
      return (
        <DivTag className="marketing-assets-page">
          <StructuredData data={structuredData} />
          <DivTag className="d-flex flex-column justify-content-center align-items-center text-center min-vh-100">
            <H1Tag>Welcome</H1Tag>
            <PTag>Content is being updated. Please check back soon.</PTag>
          </DivTag>
        </DivTag>
      );
    }

    const processedLayouts = applyPaddingToLayouts(pageData.acf.layouts);
    const finalLayouts = await processLayoutData(processedLayouts);

    return (
      <DivTag className="marketing-assets-page light-gray">
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
    console.error('Error rendering AssetsPage:', error);
    return (
      <DivTag className="marketing-assets-page light-gray">
        <div className="text-center py-16">
          <h1>Something went wrong</h1>
          <p>We are experiencing technical difficulties. Please try again later.</p>
        </div>
      </DivTag>
    );
  }
}