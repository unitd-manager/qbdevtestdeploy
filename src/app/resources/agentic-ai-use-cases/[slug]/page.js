import { fetchPageBySlug } from '@/lib/wordpress'
import { DivTag, H1Tag, PTag } from '@/components/Common/HTMLTags';
import {
    DynamicComponent,
    applyPaddingToLayouts,
    processLayoutData
} from '@/lib/page-layout-utils';
import { generatePageMetadatas, getStructuredData } from '@/lib/rankmath-utils';
import StructuredData from '@/components/Common/StructuredData';

const parent_path = 'resources/agentic-ai-use-cases';

export async function generateMetadata({ params }) {
    const resolvedParams = await params;
    return generatePageMetadatas(resolvedParams.slug, 'page', parent_path, {});
}

export default async function SolutionPage({ params }) {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;
    try {
        const pageData = await fetchPageBySlug(slug);
        const metadata = await generatePageMetadatas(resolvedParams.slug, 'page', parent_path, {});
        const structuredData = getStructuredData(metadata);
        if (!pageData || !pageData.acf || !pageData.acf.layouts?.length) {
            return (
                <DivTag className="agent-ai-usecase-single-page">
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
            <DivTag className="agent-ai-usecase-single-page light-gray">
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
            <DivTag className="agent-ai-usecase-single-page light-gray">
                <div className="text-center py-16">
                    <h1>Something went wrong</h1>
                    <p>We are experiencing technical difficulties. Please try again later.</p>
                </div>
            </DivTag>
        );
    }
}