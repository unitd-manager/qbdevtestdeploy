'use client';

import { useEffect, useRef } from 'react';
import { DivTag, H2Tag, H3Tag, PTag, SectionTag } from '../Common/HTMLTags';
import Image from 'next/image';
import DotGrid from '../Common/DotGrid';

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

  useEffect(() => {
    const generateDots = (container) => {
      if (!container) return;

      container.innerHTML = '';
      const totalCols = 20;
      const rowHeight = 12;
      const totalRows = Math.floor(container.offsetHeight / rowHeight);
      let i = 0;

      for (let row = 0; row < totalRows; row++) {
        for (let col = 0; col < totalCols; col++) {
          const dot = document.createElement('span');
          dot.style.setProperty('--i', i);
          container.appendChild(dot);
          i++;
        }
      }
    };

    generateDots(document.querySelector('.left-grid'));
    generateDots(document.querySelector('.right-grid'));
  }, []);

  if (!data || typeof data !== 'object') return null;

  const {
    highlights_list = [],
    main_title,
    description,
    class_name,
    id,
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
    <SectionTag className={`our-Benefits-info ${class_name}`} id={id}>
      <DotGrid className='left-grid' />
      <DotGrid className='right-grid' />
      <DivTag className="container">
        <DivTag className={`sub-section ${paddingClass}`} >
          <DivTag className={`row`}>
            {(main_title || description) && (
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
            )}
            <DivTag className={`benefites-list`} ref={listRef}>
              {highlights_list &&
                highlights_list.map((item, index) => (
                  <DivTag className="benefites-list-itmes" key={index}>
                    <DivTag className="img-div">
                      <Image src={item.highlights_icon?.url || ''} alt={item.title} fill />
                    </DivTag>
                    <H3Tag>{item.title}</H3Tag>
                    <PTag>{item.description}</PTag>
                  </DivTag>
                ))}
            </DivTag>
          </DivTag>
        </DivTag>
      </DivTag>
    </SectionTag>
    </>
  );
}