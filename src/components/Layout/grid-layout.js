'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { SectionTag, DivTag, H3Tag, PTag, ATag, H5Tag, H2Tag, H4Tag, LITag, ULTag } from '../Common/HTMLTags';
import Image from 'next/image';
import { ArrowRight, LiIcon } from '../Common/Icons';
import Link from 'next/link';

export default function GridLayout({ data }) {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Different observer settings for mobile vs desktop
    const observerOptions = isMobile ? {
      threshold: [0, 0.1, 0.2], // Multiple thresholds for mobile
      rootMargin: '0px 0px -15% 0px' // More aggressive margin for mobile
    } : {
      threshold: 0.3,
      rootMargin: '0px 0px -10% 0px'
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          // console.log(`Mobile: ${isMobile}, Intersecting: ${entry.isIntersecting}, Ratio: ${entry.intersectionRatio}`);
          
          // More lenient conditions for mobile
          const shouldAnimate = isMobile 
            ? entry.intersectionRatio > 0.1 
            : entry.isIntersecting;
            
          if (shouldAnimate) {
            entry.target.classList.add('animate-border');
            
            // Also animate the container if it's a grid row
            const gridContainer = entry.target.closest('.grid-item-container');
            if (gridContainer) {
              gridContainer.classList.add('animate-border');
            }
          }
        });
      },
      observerOptions
    );

    // Observe all icon-box-row elements
    if (containerRef.current) {
      const iconBoxRows = containerRef.current.querySelectorAll('.icon-box-row');
      iconBoxRows.forEach(row => {
        observer.observe(row);
      });
    }

    return () => observer.disconnect();
  }, [isMobile]);

  if (!data || typeof data !== 'object') return null;
  
  const {
    display_options = [],
    main_title,
    sub_title,
    description,
    cta_button,
    grid_items = {},
    class_name = '',
    common_content = '',
    image = '',
    background_color = '',
    id = '',
    padding
  } = data;
  
  const showTitle = display_options.includes('main_title');
  const showSubTitle = display_options.includes('sub_title');
  const showDescription = display_options.includes('description');
  const showImage = display_options.includes('image');
  const showIcons = display_options.includes('grid_items');
  const showCTA = display_options.includes('cta_button');
  const showCommDisc = display_options.includes('common_content');
  
  let paddingClass = '';
  if (padding?.padding_options === true) {
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
    <SectionTag className={`grid-layout-section ${class_name}`} id={`${id}`} ref={containerRef}>
      <DivTag className="container" style={{ background: background_color }}>
        <DivTag className={`sub-section ${paddingClass}`}>
          {(showTitle || showSubTitle || showDescription || image.url) && (
            <DivTag className="row">
              <DivTag className="col-md-12">
                <DivTag className="content-box">
                  {showTitle && main_title && <H2Tag dangerouslySetInnerHTML={{ __html: main_title }} className="main-title" />}
                  {showDescription && description && <DivTag className="grid-desc" dangerouslySetInnerHTML={{ __html: description }} />}
                  {showSubTitle && sub_title && <H4Tag dangerouslySetInnerHTML={{ __html: sub_title }} />}
                  {image?.url && (
                    <DivTag className="img-wrapper">
                      <Image
                        src={image.url}
                        alt={image.alt || 'Section Image'}
                        width={666}
                        height={433}
                      />
                    </DivTag>
                  )}
                </DivTag>
              </DivTag>
            </DivTag>
          )}
          
          {showIcons && Array.isArray(grid_items) && grid_items.length > 0 && (
            <>
              <DivTag className="grid-item-container">
                <DivTag className="top-border" />
                {grid_items.map((gridItem, gIndex) => {
                  const { icon_and_text_boxes } = gridItem || {};
                  const {
                    column,
                    list = [],
                  } = icon_and_text_boxes || {};

                  return (
                    <DivTag key={`grid-item-${gIndex}`}>
                      {gridItem.title && <H4Tag dangerouslySetInnerHTML={{ __html: gridItem.title }} className="text-center grid-item-title" />}
                      <DivTag>
                        <DivTag className="row icon-box-row">
                          {list.map((item, index) => (
                            <DivTag
                              className={`${column} icon-box-col`}
                              key={`icon-box-${gIndex}-${index}`}
                            >
                              <DivTag className="icon-box">
                                {item.icon?.url && (
                                  <DivTag
                                    className={`icon-div ${item.icon_position === 'center'
                                      ? 'text-center'
                                      : item.icon_position === 'right'
                                        ? 'text-right'
                                        : 'text-left'
                                      }`}
                                  >
                                    <Image
                                      src={item.icon.url}
                                      alt={item.icon.alt || 'Icon'}
                                      width={46}
                                      height={46}
                                      className="mb-3"
                                    />
                                  </DivTag>
                                )}
                                {item.title && (
                                  <ATag
                                    href={item.link?.url || '#'}
                                    target={item.link?.target || '_self'}
                                    className=""
                                  >
                                    <H5Tag dangerouslySetInnerHTML={{ __html: item.title }} />
                                  </ATag>
                                )}
                                {item.type === 'list' ? (
                                  item.list?.length > 0 && (
                                    <ULTag className="icon-list">
                                      {item.list.map((listItem, liIndex) => (
                                        <LITag key={liIndex} className="list-with-icon">
                                          <span className="icon"><LiIcon /></span>
                                          <span className="text">{listItem.name}</span>
                                        </LITag>
                                      ))}
                                    </ULTag>
                                  )
                                ) : (
                                  item.description && (
                                    <DivTag
                                      className={`${item.text_align === 'center'
                                        ? 'text-center'
                                        : item.text_align === 'justify'
                                          ? 'text-align-justify'
                                          : 'text-left'
                                        }`}
                                      dangerouslySetInnerHTML={{
                                        __html: item.description,
                                      }}
                                    />
                                  )
                                )}
                              </DivTag>
                            </DivTag>
                          ))}
                        </DivTag>
                      </DivTag>
                    </DivTag>
                  );
                })}
                <DivTag className="bottom-border" />
              </DivTag>
            </>
          )}
          
          {showCommDisc && common_content && <DivTag className="common-content" dangerouslySetInnerHTML={{ __html: common_content }} />}
          {showCTA && cta_button?.url && (
            <DivTag className="text-center">
              <Link
                href={cta_button.url}
                target={cta_button.target || '_self'}
                className="btn primary-btn"
              >
                {cta_button.title || 'Learn More'} <ArrowRight />
              </Link>
            </DivTag>
          )}
        </DivTag>
      </DivTag>
    </SectionTag>
  );
}