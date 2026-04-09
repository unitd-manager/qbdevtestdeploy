'use client';
import Link from 'next/link';
import { DivTag, H2Tag, H3Tag, PTag, SectionTag } from '../Common/HTMLTags';
import './industries-grid.css';

const DEFAULT_INDUSTRIES_DATA = [
  {
    id: 1,
    name: 'Fintech',
    slug: 'fintech',
    image: 'https://images.unsplash.com/photo-1526374965328-7f5ae4e8a62f?w=500&h=300&fit=crop',
    label: 'FINTECH',
    title: 'Modernizing Digital Banking for 2M+ Users',
  },
  {
    id: 2,
    name: 'Retail',
    slug: 'retail',
    image: 'https://images.unsplash.com/photo-1555636222-cdc9651fac04?w=500&h=300&fit=crop',
    label: 'RETAIL',
    title: 'Omnichannel Retail Platform Driving 40% Revenue Growth',
  },
  {
    id: 3,
    name: 'Education',
    slug: 'education',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&h=300&fit=crop',
    label: 'EDUCATION',
    title: 'AI-Powered Learning Platform for 500K Students',
  },
  {
    id: 4,
    name: 'Logistics',
    slug: 'logistics',
    image: 'https://images.unsplash.com/photo-1586528116207-f59663c94e31?w=500&h=300&fit=crop',
    label: 'LOGISTICS',
    title: 'Real-Time Supply Chain Visibility Across 12 Countries',
  },
  {
    id: 5,
    name: 'Cybersecurity',
    slug: 'cybersecurity',
    image: 'https://images.unsplash.com/photo-1526374965328-7f5ae4e8a62f?w=500&h=300&fit=crop',
    label: 'CYBERSECURITY',
    title: 'Enterprise Security Transformation Reducing Incidents by 94%',
  },
  {
    id: 6,
    name: 'Healthcare',
    slug: 'healthcare',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=300&fit=crop',
    label: 'HEALTHCARE',
    title: 'Patient Portal Serving 3 Hospital Networks',
  },
];

export default function IndustriesGrid({ data, title, description }) {
  // If data is provided, use it; otherwise use defaults
  const hasData = data && typeof data === 'object';
  const mainTitle = title || data?.main_title || 'Featured Industries';
  const mainDescription = description || data?.description || 'Each project represents a unique challenge solved with tailored technology strategy and execution.';
  
  // Extract industries items from data
  const industriesItems = data?.industries_items || [];
  const displayData = industriesItems.length > 0 ? industriesItems : DEFAULT_INDUSTRIES_DATA;

  // Transform industries data to match expected format
  const formattedIndustries = displayData.map((item, index) => ({
    id: item.id || item.ID || index + 1,
    name: item.name || item.title || '',
    slug: item.slug || item.post_name || '',
    image: item.image || item.featured_image || '',
    label: item.label || item.industry_label || (item.name || item.title)?.toUpperCase() || '',
    title: item.title || item.post_title || '',
  }));

  return (
    <SectionTag className="industries-grid-section">
      <DivTag className="container">
        {/* Section Header */}
        <DivTag className="industries-header">
          <H2Tag className="industries-title">{mainTitle}</H2Tag>
          {mainDescription && <PTag className="industries-description">{mainDescription}</PTag>}
        </DivTag>

        {/* Industries Grid or Fallback */}
        {formattedIndustries && formattedIndustries.length > 0 ? (
          <DivTag className="industries-grid">
            {formattedIndustries.map((industry, index) => (
              <DivTag key={industry.id || index} className="industry-card">
                {/* Image Container */}
                <DivTag className="industry-image-wrapper">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={industry.image}
                    alt={industry.name}
                    className="industry-image"
                  />
                </DivTag>

                {/* Content */}
                <DivTag className="industry-content">
                  <PTag className="industry-label">{industry.label}</PTag>
                  <H3Tag className="industry-card-title">{industry.title}</H3Tag>

                  {/* Button */}
                  <Link
                    href={`/case-studies/industry/${industry.slug}`}
                    className="industry-btn"
                  >
                    <span>Go to {industry.name}</span>
                    <span className="arrow">→</span>
                  </Link>
                </DivTag>
              </DivTag>
            ))}
          </DivTag>
        ) : (
          <DivTag className="d-flex flex-column justify-content-center align-items-center text-center min-vh-100">
            <H2Tag>Featured Industries</H2Tag>
            <PTag>Content is being updated. Please check back soon.</PTag>
          </DivTag>
        )}
      </DivTag>
    </SectionTag>
  );
}