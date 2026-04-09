'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DivTag, H2Tag } from './Common/HTMLTags';
import Image from 'next/image';

export default function CaseStudyCard({ item }) {
  const [isHovered, setIsHovered] = useState(false);

  // Generate slug from item - prioritize case_study_link, then slug, post_name, or title
  let slug = 'case-study';
  
  if (item.case_study_link) {
    // If case_study_link is a Post Object, extract post_name or slug
    if (typeof item.case_study_link === 'object') {
      slug = item.case_study_link.post_name || item.case_study_link.slug || item.case_study_link.ID || 'case-study';
    } else if (typeof item.case_study_link === 'string') {
      slug = item.case_study_link;
    }
  } else if (item.slug) {
    slug = item.slug;
  } else if (item.post_name) {
    slug = item.post_name;
  } else if (item.title) {
    slug = item.title.toLowerCase().replace(/\s+/g, '-');
  }
  
  const detailLink = `/case-studies/${slug}`;

  return (
    <Link href={detailLink} style={{ textDecoration: 'none' }}>
      <DivTag
        style={{
          backgroundColor: '#fff',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          boxShadow: isHovered ? '0 8px 20px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.08)',
          transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
          cursor: 'pointer',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image */}
        {item.image?.url && (
          <DivTag
            style={{
              width: '100%',
              height: '240px',
              overflow: 'hidden',
              backgroundColor: '#f5f5f5',
            }}
          >
            <Image
              src={item.image.url}
              alt={item.image.alt || item.title || 'Case Study'}
              width={400}
              height={240}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </DivTag>
        )}

        {/* Content */}
        <DivTag style={{ padding: '25px' }}>
          {/* Title */}
          {item.title && (
            <H2Tag
              style={{
                fontSize: '20px',
                fontWeight: 'bold',
                marginBottom: '12px',
                color: '#000',
              }}
              dangerouslySetInnerHTML={{ __html: item.title }}
            />
          )}

          {/* Description */}
          {item.description && (
            <DivTag
              style={{
                fontSize: '14px',
                color: '#666',
                lineHeight: '1.6',
                marginBottom: '20px',
              }}
              dangerouslySetInnerHTML={{ __html: item.description }}
            />
          )}

          {/* Learn More Link */}
          <DivTag
            style={{
              color: '#0052CC',
              fontWeight: 'bold',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            Learn More →
          </DivTag>
        </DivTag>
      </DivTag>
    </Link>
  );
}
