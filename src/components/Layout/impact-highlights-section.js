'use client';

import { useEffect, useRef } from 'react';
import { DivTag, H2Tag, H3Tag, PTag, SectionTag } from '../Common/HTMLTags';
import Image from 'next/image';
import DotGrid from '../Common/DotGrid';
import { normalizeUrl } from '@/utils/urlHelpers';
import Link from 'next/link';
import { ArrowRight } from '../Common/Icons';

export default function SectionTwo({ data }) {

  const listRef = useRef(null);

  useEffect(() => {
    const currentListRef = listRef.current;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          currentListRef?.classList.add('animate-border');
        }
      },
      { threshold: 0.5 }
    );

    if (currentListRef) observer.observe(currentListRef);
    
    return () => {
      observer.disconnect();
    };
  }, []);

  if (!data || typeof data !== 'object') return null;

  const {
    highlights = [],
    main_title,
    description,
    background_color,
    cta_button,
    class_name = '',
    id = '',
    padding = {} 
  } = data;
  
  let paddingClass = '';
  if (padding.padding_options && padding.padding_options === true) {
    const {
      padding_position = [],
      desktop_padding = {},
      mobile_padding = {}
    } = padding;

    if (padding_position.includes('top')) {
      if (desktop_padding?.padding_top_desktop)
        paddingClass += ` padding-top-desktop-${desktop_padding.padding_top_desktop}px`;
      if (mobile_padding?.padding_top_mobile)
        paddingClass += ` padding-top-mobile-${mobile_padding.padding_top_mobile}px`;
    }

    if (padding_position.includes('bottom')) {
      if (desktop_padding?.padding_bottom_desktop)
        paddingClass += ` padding-bottom-desktop-${desktop_padding.padding_bottom_desktop}px`;
      if (mobile_padding?.padding_bottom_mobile)
        paddingClass += ` padding-bottom-mobile-${mobile_padding.padding_bottom_mobile}px`;
    }
  }
  
  return (
    <>
      <SectionTag className={`impact-highlights-section ${class_name}`} id={id}>
        <DotGrid className='left-grid' />
        <DotGrid className='right-grid' />
        <DivTag className="container" style={{ background: background_color }}>
          <DivTag className={`sub-section ${paddingClass}`} >
            <DivTag className={`row`}>
              <DivTag className="top-title-info">
                {main_title && (
                  <H2Tag
                    className="main-title"
                    dangerouslySetInnerHTML={{ __html: main_title }}
                  />
                )}
                {description && (
                  <DivTag
                    className="desc"
                    dangerouslySetInnerHTML={{ __html: description }}
                  />
                )}
              </DivTag>
              <DivTag className={`highlight-list`} ref={listRef}>
                {highlights &&
                  highlights.map((item, index) => (
                    <DivTag className="highlight-list-itmes" key={index}>
                      {item.icon?.url &&
                        <DivTag className="img-div">
                          <Image src={item.icon?.url || ''} alt={item.title} height={32} width={100} className='img-fluid' />
                        </DivTag>
                      }
                      {item.title && <H3Tag>{item.title}</H3Tag>}
                      {item.description && <PTag>{item.description}</PTag>}
                    </DivTag>
                  ))}
              </DivTag>
              {cta_button?.url && (
                <Link
                  href={normalizeUrl(cta_button?.url)}
                  target={cta_button?.target || "_self"}
                  rel={
                    cta_button?.target === "_blank"
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="btn secondary-btn"
                >{cta_button?.title } <ArrowRight /></Link>
              )}
            </DivTag>
          </DivTag>
        </DivTag>
      </SectionTag>
    </>
  );
}