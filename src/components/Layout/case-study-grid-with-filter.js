'use client';

import Link from 'next/link';
import { SectionTag, DivTag, H2Tag, H3Tag, PTag } from '../Common/HTMLTags';
import './case-study-grid-with-filter.css';

export default function CaseStudyGridWithFilter({ data }) {
  if (!data || typeof data !== 'object') return null;

  const {
    main_title,
    description,
    use_case_items = [],
    class_name = '',
    id = '',
  } = data;

  if (!Array.isArray(use_case_items) || use_case_items.length === 0) {
    return null;
  }

  // Create a map of unique industries and get one representative case study per industry
  const industryMap = new Map();
  use_case_items.forEach((item) => {
    if (item.industry) {
      const industryText = item.industry;
      const industryDisplay = Array.isArray(industryText) 
        ? industryText[0] 
        : (typeof industryText === 'string' ? industryText.split(':').pop().trim() : '');
      
      // Only add if this industry hasn't been seen yet
      if (industryDisplay && !industryMap.has(industryDisplay)) {
        industryMap.set(industryDisplay, item);
      }
    }
  });

  // Transform unique case studies to match expected format
  const formattedCaseStudies = Array.from(industryMap.entries()).map(([industry, item], index) => {
    const slug = (item.post_name || industry).toLowerCase().replace(/\s+/g, '-');

    return {
      id: item.ID || index + 1,
      title: item.post_title || item.title || '',
      label: industry || 'CASE STUDY',
      slug: slug,
      image: item.image?.url || item.featured_image || '',
      description: item.description || '',
    };
  });

  return (
    <SectionTag 
      className={`case-study-grid-section ${class_name}`} 
      id={id}
    >
      <DivTag className="container">
        {/* Section Header */}
        {(main_title || description) && (
          <DivTag className="case-study-header">
            {main_title && (
              <H2Tag className="case-study-title">
                {typeof main_title === 'string' && main_title.includes('<') 
                  ? <DivTag dangerouslySetInnerHTML={{ __html: main_title }} />
                  : main_title
                }
              </H2Tag>
            )}
            {description && (
              <PTag className="case-study-description">
                {typeof description === 'string' && description.includes('<') 
                  ? <DivTag dangerouslySetInnerHTML={{ __html: description }} />
                  : description
                }
              </PTag>
            )}
          </DivTag>
        )}

        {/* Case Studies Grid */}
        {formattedCaseStudies && formattedCaseStudies.length > 0 ? (
          <DivTag className="case-study-grid">
            {formattedCaseStudies.map((caseStudy, index) => (
              <DivTag key={caseStudy.id || index} className="case-study-card">
                {/* Image Container */}
                <DivTag className="case-study-image-wrapper">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={caseStudy.image}
                    alt={caseStudy.title}
                    className="case-study-image"
                  />
                </DivTag>

                {/* Content */}
                <DivTag className="case-study-content">
                  <PTag className="case-study-label">{caseStudy.label}</PTag>
                  <H3Tag className="case-study-card-title">{caseStudy.title}</H3Tag>

                  {/* Button */}
                  <Link
                    href={`/case-studies/industry/${caseStudy.slug}`}
                    className="case-study-btn"
                  >
                    <span>View Case Study</span>
                    <span className="arrow">→</span>
                  </Link>
                </DivTag>
              </DivTag>
            ))}
          </DivTag>
        ) : (
          <DivTag className="d-flex flex-column justify-content-center align-items-center text-center min-vh-100">
            <H2Tag>Featured Case Studies</H2Tag>
            <PTag>Content is being updated. Please check back soon.</PTag>
          </DivTag>
        )}
      </DivTag>
    </SectionTag>
  );
}
