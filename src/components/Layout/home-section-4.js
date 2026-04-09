'use client';

import { useEffect, useRef } from 'react';
import { DivTag, H2Tag, H4Tag, H5Tag, PTag, SectionTag } from '../Common/HTMLTags';
import Link from 'next/link';
import { ArrowRight } from '../Common/Icons';
import Image from 'next/image';

export default function SectionFour({ data }) {
  const cardRefs = useRef([]);

  useEffect(() => {
    cardRefs.current.forEach((ref) => {
      if (!ref) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            ref.classList.add('animate-border');
          }
        },
        { threshold: 0.5 }
      );
      observer.observe(ref);
      return () => observer.disconnect();
    });
  }, []);

  if (!data) return null;

  // Layout mapping based on index (safe and scalable)
  const layoutMap = [
    { colClass: 'col-md-6 ps-0', animations: ['right-top-to-bottom-right', 'left-top-right-to-right-top-left', 'bottom-left-to-bottom-right'] },
    { colClass: 'col-md-3', animations: ['left-top-to-left-bottom', 'right-top-to-bottom-right', 'left-top-right-to-right-top-left', 'bottom-left-to-bottom-right'] },
    { colClass: 'col-md-3 pe-0', animations: ['left-top-to-left-bottom', 'left-top-right-to-right-top-left', 'bottom-left-to-bottom-right'] },
    { colClass: 'col-md-3 ps-0', animations: ['right-top-to-bottom-right', 'left-top-right-to-right-top-left', 'bottom-left-to-bottom-right'] },
    { colClass: 'col-md-3', animations: ['left-top-to-left-bottom', 'right-top-to-bottom-right', 'left-top-right-to-right-top-left', 'bottom-left-to-bottom-right'] },
    { colClass: 'col-md-6 pe-0', animations: ['left-top-to-left-bottom', 'left-top-right-to-right-top-left', 'bottom-left-to-bottom-right'] },
  ];
  const main_title = data?.main_title;
  const description = data?.description;
  const main_solutions = data?.main_solutions || [];
  const padding = data?.padding;
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
    <SectionTag className="home-section-four">
      <DivTag className="container">
        <DivTag className={`sub-section ${paddingClass}`} >
          <DivTag className="row">
            <DivTag className="col-md-12">
              <DivTag className='section-head'>
                {main_title && <H2Tag className="main-title" dangerouslySetInnerHTML={{ __html: main_title }} />}
                {description && <PTag className="para" dangerouslySetInnerHTML={{ __html: description }} />}
              </DivTag>
            </DivTag>
          </DivTag>

          <DivTag className="row g-4 card-row">
            {main_solutions &&
              main_solutions.map((solution, i) => (
                <DivTag className="card-container" key={i}>
                  <H4Tag>{solution.title}</H4Tag>

                  <DivTag className="row g-4 card-row">
                    {solution.solutions_list &&
                      solution.solutions_list.map((card, j) => {
                        const layout = layoutMap[j] || {
                          colClass: 'col-md-4',
                          animations: [],
                        };

                        return (
                          <DivTag className={layout.colClass} key={j}>
                            <DivTag
                              ref={(el) => (cardRefs.current[j] = el)}
                              className={`p-4 card-col h-100 dashed-outline ${layout.animations.join(
                                ' '
                              )} ${card.type}`}
                            >
                              {/* Border Spans */}
                              <span className="border-span top-line"></span>
                              <span className="border-span bottom-line"></span>
                              <span className="border-span left-line"></span>
                              <span className="border-span right-line"></span>

                              {card.type === 'is_image' ? (
                                <DivTag className="image-div">
                                  {card.image?.url && (
                                    card.link?.url ? (
                                      <Link href={card.link.url} target={card.link.target || "_self"}>
                                        <Image
                                          src={card.image.url}
                                          alt={card.title || 'Image'}
                                          fill
                                        />
                                        <h4>{card.title}</h4>
                                      </Link>
                                    ) : (
                                      <>
                                        <Image
                                          src={card.image.url}
                                          alt={card.title || 'Image'}
                                          fill
                                        />
                                        <h4>{card.title}</h4>
                                      </>
                                    )
                                  )}
                                </DivTag>
                              ) : card.type === 'is_content' ? (
                                <DivTag className="content-div">
                                  {card.link?.url ? (
                                    <Link href={card.link.url} target={card.link.target || "_self"}>
                                      <H5Tag className="card-col-title">{card.title}</H5Tag>
                                      <PTag className="mb-0">{card.description}</PTag>
                                    </Link>
                                  ) : (
                                    <>
                                      <H5Tag className="card-col-title">{card.title}</H5Tag>
                                      <PTag className="mb-0">{card.description}</PTag>
                                    </>
                                  )}
                                </DivTag>
                              ) : null}

                            </DivTag>
                          </DivTag>
                        );
                      })}
                  </DivTag>
                </DivTag>
              ))}
            {data.button?.url && (
              <DivTag className="btn-div">
                <Link href={data.button.url} className="btn primary-btn" target={data.button.target || "_self"}>
                  {data.button.title} <ArrowRight className="right-arrow-icon" />
                </Link>
              </DivTag>
            )}
          </DivTag>
        </DivTag>
      </DivTag>
    </SectionTag>
  );
}
