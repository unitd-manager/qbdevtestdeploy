import { fetchPageBySlug } from '@/lib/wordpress';
import { DivTag, H1Tag, PTag } from '@/components/Common/HTMLTags';
import {
    DynamicComponent,
    applyPaddingToLayouts,
    processLayoutData,
} from '@/lib/page-layout-utils';

import { generatePageMetadatas, getStructuredData } from '@/lib/rankmath-utils';
import StructuredData from '@/components/Common/StructuredData';

const parent_path = 'services';

export async function generateMetadata({ params }) {
    const resolvedParams = await params;
    return generatePageMetadatas(resolvedParams.slug, 'page', parent_path, {});
}

export default async function SolutionPage({ params }) {
    try {
        const resolvedParams = await params;
        const pageData = await fetchPageBySlug(resolvedParams.slug);

        const metadata = await generatePageMetadatas(resolvedParams.slug, 'page', parent_path, {});
        const structuredData = getStructuredData(metadata);

        const layouts = pageData?.acf?.layouts ?? [];

        if (layouts.length === 0) {
            return (
                <DivTag className="solutions-page">
                    <StructuredData data={structuredData} />
                    <DivTag className="d-flex flex-column justify-content-center align-items-center text-center min-vh-100">
                        <H1Tag>Welcome</H1Tag>
                        <PTag>Content is being updated. Please check back soon.</PTag>
                    </DivTag>
                </DivTag>
            );
        }

        const processedLayouts = applyPaddingToLayouts(layouts);
        const finalLayouts = await processLayoutData(processedLayouts);

        return (
            <DivTag className="solutions-page light-gray">
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
        console.error('Error rendering SolutionPage:', error);
        return (
            <DivTag className="solutions-page light-gray">
                <DivTag className="text-center py-16">
                    <H1Tag>Something went wrong</H1Tag>
                    <PTag>We are experiencing technical difficulties. Please try again later.</PTag>
                </DivTag>
            </DivTag>
        );
    }
}