import { fetchPageBySlug } from '@/lib/wordpress';
import { DivTag, H2Tag, H1Tag, PTag } from '@/components/Common/HTMLTags';
import Link from 'next/link';
import CaseStudyCard from '@/components/CaseStudyCard';
import CaseStudiesBanner from '@/components/Layout/case-studies-banner';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const industrySlug = resolvedParams.industry;
  return {
    title: `${industrySlug.replace(/-/g, ' ')} Case Studies`,
    description: `Case studies in the ${industrySlug.replace(/-/g, ' ')} industry`,
  };
}

function getCaseStudiesByIndustrySlug(data, industrySlug) {
  if (!data?.acf?.page_sections) return [];

  const caseStudies = [];

  for (const section of data.acf.page_sections) {
    if (section.acf_fc_layout === 'case_study_grid' && section.use_case_items) {
      for (const item of section.use_case_items) {
        if (item.industry) {
          const industryList = Array.isArray(item.industry)
            ? item.industry
            : typeof item.industry === 'string'
              ? item.industry.split(',').map(i => i.trim())
              : [];

          for (const industry of industryList) {
            // Get the display name
            let displayName = industry;
            if (industry.includes(':')) {
              displayName = industry.split(':')[1].trim();
            }

            // Compare with slug
            const industrySlugGenerated = displayName.toLowerCase().replace(/\s+/g, '-');
            if (industrySlugGenerated === industrySlug) {
              caseStudies.push({ ...item, section, originalIndustry: industry });
              break;
            }
          }
        }
      }
    }
  }

  return caseStudies;
}

export default async function IndustryPage({ params }) {
  const resolvedParams = await params;
  const industrySlug = resolvedParams.industry;

  try {
    const pageData = await fetchPageBySlug('case-studies');
    const caseStudies = getCaseStudiesByIndustrySlug(pageData, industrySlug);

    // Get banner section data
    const pageSections = pageData?.acf?.page_sections;
    const bannerSection = pageSections && Array.isArray(pageSections)
      ? pageSections.find(section => section.acf_fc_layout === 'banner_section')
      : null;

    if (!caseStudies || caseStudies.length === 0) {
      return (
        <DivTag style={{ padding: '60px 20px', textAlign: 'center' }}>
          <H1Tag>No Case Studies Found</H1Tag>
          <PTag>Sorry, there are no case studies for this industry.</PTag>
          <Link href="/case-studies">
            <DivTag style={{ color: '#0052CC', marginTop: '20px', cursor: 'pointer' }}>
              ← Back to Case Studies
            </DivTag>
          </Link>
        </DivTag>
      );
    }

    // Get the display name from the first case study's industry
    const displayName = caseStudies[0].originalIndustry
      ? caseStudies[0].originalIndustry.includes(':')
        ? caseStudies[0].originalIndustry.split(':')[1].trim()
        : caseStudies[0].originalIndustry
      : industrySlug.replace(/-/g, ' ');

    return (
      <>
        {/* Banner Section - Dynamic from WordPress */}
        <CaseStudiesBanner data={bannerSection} />

        <DivTag style={{ backgroundColor: '#fff' }}>
        {/* Back Link */}
        <DivTag style={{ padding: '20px 0', borderBottom: '1px solid #e0e0e0' }}>
          <DivTag style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
            <Link href="/case-studies">
              <DivTag style={{ color: '#0052CC', cursor: 'pointer', fontSize: '14px' }}>
                ← Back to Case Studies
              </DivTag>
            </Link>
          </DivTag>
        </DivTag>

        {/* Header */}
        <DivTag style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px' }}>
          <DivTag style={{ textAlign: 'center', marginBottom: '50px' }}>
            <DivTag
              style={{
                display: 'inline-block',
                backgroundColor: '#FFA500',
                color: '#fff',
                padding: '8px 20px',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: 'bold',
                marginBottom: '20px',
              }}
            >
              {displayName}
            </DivTag>
            <H1Tag
              style={{
                fontSize: '42px',
                fontWeight: 'bold',
                marginBottom: '15px',
                color: '#000',
              }}
            >
              {displayName} Case Studies
            </H1Tag>
            <PTag
              style={{
                fontSize: '16px',
                color: '#666',
                maxWidth: '700px',
                margin: '0 auto',
              }}
            >
              Explore how we&apos;ve helped businesses in the {displayName} industry achieve their goals.
            </PTag>
          </DivTag>
        </DivTag>

        {/* Case Studies Grid */}
        <DivTag style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px 60px' }}>
          <DivTag
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '40px',
            }}
          >
            {caseStudies.map((item, index) => (
              <CaseStudyCard key={index} item={item} />
            ))}
          </DivTag>
        </DivTag>
      </DivTag>
      </>
    );
  } catch (error) {
    console.error('Error loading industry case studies:', error);
    return (
      <DivTag style={{ padding: '60px 20px', textAlign: 'center' }}>
        <H1Tag>Error Loading Case Studies</H1Tag>
        <PTag>Sorry, there was an error loading case studies for this industry.</PTag>
        <Link href="/case-studies">
          <DivTag style={{ color: '#0052CC', marginTop: '20px', cursor: 'pointer' }}>
            ← Back to Case Studies
          </DivTag>
        </Link>
      </DivTag>
    );
  }
}
