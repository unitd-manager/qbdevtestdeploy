'use client';
import Link from 'next/link';
import { DivTag, H1Tag, PTag, SectionTag } from '../Common/HTMLTags';
import './case-studies-banner.css';

const DEFAULT_BANNER_DATA = {
  title: 'Technology Solutions',
  description: "Explore how we've helped industry leaders transform their operations.",
  button_text: 'Explore Our Work',
  button_link: '#industries',
  image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=700&h=400&fit=crop',
  image_alt: 'Dashboard showcase',
};

export default function CaseStudiesBanner({ data }) {
  if (!data || typeof data !== 'object') {
    data = {};
  }

  // Extract fields from data - handle ACF field names and various formats
  const title = data?.title || DEFAULT_BANNER_DATA.title;
  const description = data?.description || DEFAULT_BANNER_DATA.description;
  
  // Handle button field - ACF stores it as an object with title and url
  let button_text = DEFAULT_BANNER_DATA.button_text;
  let button_link = DEFAULT_BANNER_DATA.button_link;
  
  if (data?.button) {
    if (typeof data.button === 'object') {
      button_text = data.button?.title || data.button?.text || DEFAULT_BANNER_DATA.button_text;
      button_link = data.button?.url || data.button?.link || DEFAULT_BANNER_DATA.button_link;
    } else if (typeof data.button === 'string') {
      button_text = data.button;
    }
  }
  
  // Handle image - could be URL string, object with url property, or WordPress image object
  let imageUrl = DEFAULT_BANNER_DATA.image;
  let imageAlt = DEFAULT_BANNER_DATA.image_alt;
  
  if (data?.image) {
    if (typeof data.image === 'string') {
      imageUrl = data.image;
    } else if (data.image?.url) {
      imageUrl = data.image.url;
      imageAlt = data.image?.alt || data.image?.image?.alt || imageAlt;
    } else if (data.image?.src) {
      imageUrl = data.image.src;
      imageAlt = data.image?.alt_text || imageAlt;
    }
  }

  return (
    <SectionTag className="case-studies-banner">
      <DivTag className="banner-container">
        <DivTag className="banner-content">
          <H1Tag className="banner-title">
            {typeof title === 'string' && title.includes('<')
              ? <DivTag dangerouslySetInnerHTML={{ __html: title }} />
              : title
            }
          </H1Tag>
          <PTag className="banner-description">
            {typeof description === 'string' && description.includes('<')
              ? <DivTag dangerouslySetInnerHTML={{ __html: description }} />
              : description
            }
          </PTag>
          {button_link && (
            <Link href={button_link} className="banner-cta-btn">
              <span>{button_text}</span>
              <span className="btn-arrow">→</span>
            </Link>
          )}
        </DivTag>

        {imageUrl && (
          <DivTag className="banner-image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={imageAlt}
              className="banner-img"
            />
          </DivTag>
        )}
      </DivTag>
    </SectionTag>
  );
}
