import { fetchPageBySlug } from '@/lib/wordpress'
import { DivTag, H1Tag, PTag } from '../../components/Common/HTMLTags';
import { generatePageMetadatas, getStructuredData } from '@/lib/rankmath-utils';
import StructuredData from '@/components/Common/StructuredData';
import CaseStudyGridWithFilter from '@/components/Layout/case-study-grid-with-filter';
import CaseStudiesBanner from '@/components/Layout/case-studies-banner';
//import IndustriesGrid from '@/components/Layout/industries-grid';

const slug = 'case-studies';
const parent_path = '';

export async function generateMetadata() {
  return generatePageMetadatas(slug, 'page', parent_path, {});
}

export default async function CaseStudyPage() {
  try {
    const pageData = await fetchPageBySlug(slug);
    const metadata = await generatePageMetadatas(slug, 'page', parent_path, {});
    const structuredData = getStructuredData(metadata);

    // Check for page_sections (new flexible content field)
    const pageSections = pageData?.acf?.page_sections;
    
    // Get banner section data
    const bannerSection = pageSections && Array.isArray(pageSections)
      ? pageSections.find(section => section.acf_fc_layout === 'banner_section')
      : null;
    
    // Filter industries grid sections
   
    return (
      <DivTag className="case-studies-page">
        <StructuredData data={structuredData} />
        
        {/* Banner Section - Dynamic from WordPress */}
        <CaseStudiesBanner data={bannerSection} />
        
        {/* Industries Grid Section - Dynamic from WordPress */}
       

        {/* Existing Case Study Sections */}
        {pageSections && Array.isArray(pageSections) && pageSections.length > 0 ? (
          pageSections
            .filter(section => section.acf_fc_layout === 'case_study_grid')
            .map((section, index) => (
              <CaseStudyGridWithFilter key={index} data={section} />
            ))
        ) : (
          <DivTag className="d-flex flex-column justify-content-center align-items-center text-center min-vh-100">
            <H1Tag>Case Studies</H1Tag>
            <PTag>Content is being updated. Please check back soon.</PTag>
          </DivTag>
        )}
      </DivTag>
    );
  } catch (error) {
    console.error('Error rendering case-studies page:', error);
    return (
      <DivTag className="case-studies-page">
        <StructuredData data={{}} />
        
        {/* Banner Section */}
        <CaseStudiesBanner />
        
        

        <div className="text-center py-16">
          <h1>Something went wrong</h1>
          <p>We are experiencing technical difficulties. Please try again later.</p>
        </div>
      </DivTag>
    );
  }
}