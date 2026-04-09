import { fetchPageBySlug, fetchPostBySlugAndType } from '@/lib/wordpress'
import { DivTag, H1Tag, PTag } from '@/components/Common/HTMLTags';
import { generatePageMetadatas, getStructuredData } from '@/lib/rankmath-utils';
import StructuredData from '@/components/Common/StructuredData';
import { notFound } from 'next/navigation';

import CaseStudySectionClient from '@/components/CaseStudySectionClient';

const parent_path = 'case-studies';

export async function generateMetadata({ params }) {
    try {
        const resolvedParams = await params;
        const slug = resolvedParams.slug;
        
        console.log('📝 Generating metadata for slug:', slug);
        
        // Check if the case study actually exists before generating metadata
        const pageData = await fetchPostBySlugAndType(slug, 'case-study');
        console.log('📦 Page data found:', !!pageData);
        
        if (!pageData) {
            console.log('❌ Case study not found, returning 404 metadata');
            return {
                title: 'Case Study Not Found',
                description: 'The requested case study could not be found.'
            };
        }
        
        // Get the hero section title as primary source for metadata
        const heroSection = pageData?.acf?.case_study_sections?.find(
            section => section.acf_fc_layout === 'case_study_hero'
        );
        const caseStudyTitle = heroSection?.title || pageData?.title?.rendered || slug;
        const caseStudyDescription = heroSection?.subtitle || pageData?.excerpt?.rendered || 'Learn more about this case study';
        
        console.log('🎯 Using title:', caseStudyTitle);
        console.log('📄 Using description:', caseStudyDescription);

        // For case studies, build metadata directly instead of relying on Rank Math
        // since the URL structure might not be properly exposed in Rank Math
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://qbotica.com';
        const pageUrl = `${siteUrl}/case-studies/${slug}`;
        
        const metadata = {
            title: caseStudyTitle,
            description: caseStudyDescription,
            openGraph: {
                title: caseStudyTitle,
                description: caseStudyDescription,
                url: pageUrl,
                type: 'article',
                siteName: 'Qbotica',
                ...(heroSection?.hero_image?.guid && {
                    images: [{
                        url: heroSection.hero_image.guid,
                        width: 1200,
                        height: 630,
                        alt: caseStudyTitle
                    }]
                })
            },
            twitter: {
                card: 'summary_large_image',
                title: caseStudyTitle,
                description: caseStudyDescription,
                ...(heroSection?.hero_image?.guid && {
                    images: [heroSection.hero_image.guid]
                })
            },
            alternates: {
                canonical: pageUrl
            }
        };
        
        console.log('✅ Generated metadata:', metadata.title);
        return metadata;
    } catch (error) {
        console.error('❌ Error generating metadata:', error);
        return {
            title: 'Case Study',
            description: 'Case study details'
        };
    }
}

export default async function SolutionPage({ params }) {

    const resolvedParams = await params;
    const slug = resolvedParams.slug;
    try {
        // Fetch the case-study post (custom post type - use singular form for REST API)
        const pageData = await fetchPostBySlugAndType(slug, 'case-study');
        
        // Fetch banner from case-studies page
        const caseStudiesPageData = await fetchPageBySlug('case-studies');
        const bannerSection = caseStudiesPageData?.acf?.page_sections?.find(
            section => section.acf_fc_layout === 'banner_section'
        );
        
        const metadata = await generatePageMetadatas(resolvedParams.slug, 'case-study', parent_path, {});
        const structuredData = getStructuredData(metadata);
        
        // Check if we have case_study_sections (the correct field name)
        const caseSections = pageData?.acf?.case_study_sections;
        
        console.log('Page Data ACF:', pageData?.acf);
        console.log('Case Sections:', caseSections);
        
        if (!pageData || !caseSections || caseSections.length === 0) {
            console.warn('No case study sections found for:', slug);
            notFound();
        }
        
        // Process the case study sections directly without layout processing
        return (
            <>
                
                <DivTag className="case-studies-single-page light-gray">
                      <StructuredData data={structuredData} />
                    <CaseStudySectionClient sections={caseSections} />
                </DivTag>
            </>
        );
    } catch (error) {
        console.error('Error rendering SolutionPage:', error);

        return (
            <DivTag className="case-studies-single-page light-gray">
                <div className="text-center py-16">
                    <h1>Something went wrong</h1>
                    <p>We are experiencing technical difficulties. Please try again later.</p>
                </div>
            </DivTag>
        );
    }
}