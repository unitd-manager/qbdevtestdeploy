'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { DivTag, H1Tag, PTag } from '../Common/HTMLTags';
import { ArrowRight } from '../Common/Icons';

export default function HomeBannerSlider({ data }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const {
    main_title,
    sub_title,
    description,
    button,
    banner_two_images = []
  } = data || {};

  // Memoize slides to prevent useEffect warning
  const slides = useMemo(() => {
    return banner_two_images.length > 0 ? banner_two_images : [];
  }, [banner_two_images]);

  useEffect(() => {
    if (slides.length === 0) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  if (slides.length === 0) return null;

  return (
    <DivTag>
      <DivTag className="row banner-content-box-row">
        <DivTag className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
          <DivTag className="banner-content-box">
            {sub_title && (
              <Link href="#" className="btn banner-btn">
                {sub_title}
              </Link>
            )}
            {main_title && (
              <H1Tag className="main-title" dangerouslySetInnerHTML={{ __html: main_title }} />
            )}
            {description && (
              <DivTag dangerouslySetInnerHTML={{ __html: description }} />
            )}
            {button?.url && (
              <Link 
                href={button.url} 
                className="btn primary-btn" 
                target={button.target || "_self"}
              >
                {button.title} <ArrowRight className="right-arrow-icon" />
              </Link>
            )}
          </DivTag>
        </DivTag>
        
        <DivTag className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
          <DivTag className="hero-image-slider">
            {slides.map((slide, index) => (
              <DivTag 
                key={index}
                className={`slide-item ${index === activeIndex ? 'slide-active' : ''}`}
              >
                <DivTag className="main-image-wrapper">
                  {slide.main_image?.url && (
                    <Image
                      src={slide.main_image.url}
                      width={600}
                      height={624}
                      className='img-fluid'
                      alt={slide.main_image.alt || 'Slide image'}
                      priority={index === 0}
                    />
                  )}
                </DivTag>
                
                <DivTag className="stat-image-wrapper anim-slide-down">
                  {slide.secondary_image?.url && (
                    <Image
                      src={slide.secondary_image.url}
                      width={624}
                      height={175}
                      className='img-fluid'
                      alt={slide.secondary_image.alt || 'Stats'}
                    />
                  )}
                </DivTag>
              </DivTag>
            ))}
          </DivTag>
        </DivTag>
      </DivTag>
    </DivTag>
  );
}