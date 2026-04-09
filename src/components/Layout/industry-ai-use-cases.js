'use client';
import { useEffect, useRef } from 'react';
import { DivTag, H2Tag, H4Tag, H5Tag, LITag, PTag, SectionTag, SpanTag, ULTag } from '../Common/HTMLTags';
import Link from 'next/link';
import { ArrowRight, LiIcon } from '../Common/Icons';
import Image from 'next/image';

export default function IndustryAiUseCases({ data }) {
  const cardRefs = useRef([]);

  useEffect(() => {
    const observers = [];

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
      observers.push(observer);
    });

    // Proper cleanup
    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);


  if (!data) return null;

  const {
    main_title,
    description,
    padding
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
    <SectionTag className="industry-ai-usecases">
      <DivTag className="container">
        <DivTag className={`sub-section ${paddingClass}`}>
          <DivTag className="row">
            <DivTag className="col-md-12">
              <DivTag className='section-head'>
                {main_title && <H2Tag className="main-title" dangerouslySetInnerHTML={{ __html: main_title }} />}
                {description && <DivTag className="para" dangerouslySetInnerHTML={{ __html: description }} />}
              </DivTag>
            </DivTag>
          </DivTag>

          {data.use_cases && (() => {
            const rows = [];
            let currentRow = [];
            let rowWidth = 0;

            data.use_cases.forEach((card, index) => {
              const colClass = card.column || 'col-md-3';
              const match = colClass.match(/col-md-(\d+)/);
              const colSize = match ? parseInt(match[1]) : 3;

              if (rowWidth + colSize > 12) {
                rows.push(currentRow);
                currentRow = [];
                rowWidth = 0;
              }

              currentRow.push({ card, colSize, index });
              rowWidth += colSize;
            });

            if (currentRow.length > 0) {
              rows.push(currentRow);
            }

            return rows.map((row, rowIndex) => (
              <DivTag className="row card-row" key={`row-${rowIndex}`}>
                {row.map((item, idx) => {
                  const { card, colSize, index } = item;
                  let right = "";
                  let left = "";
                  const colClass = card.column || 'col-md-4';
                  const totalRowWidth = row.reduce((sum, item) => sum + item.colSize, 0);
                  const isFirstInRow = idx === 0;
                  const isLastInRow = (idx === row.length - 1 && totalRowWidth === 12);

                  const animations = [
                    'left-top-right-to-right-top-left',
                    'bottom-left-to-bottom-right'
                  ];

                  if (isFirstInRow) {
                    left = "pl-0";
                  } else {
                    animations.push('left-top-to-left-bottom last-col');
                  }

                  if (isLastInRow) {
                    right = "pr-0";
                  } else {
                    animations.push('right-top-to-bottom-right first-col');
                  }

                  return (
                    <DivTag className={`${colClass} ${left} ${right} card-cols`} key={index}>
                      <DivTag
                        ref={(el) => (cardRefs.current[index] = el)}
                        className={`card-col h-100 dashed-outline mbl-left-top-to-left-bottom mbl-right-top-to-bottom-right ${animations.join(' ')} ${card.type}`}
                      >
                        <span className="border-span top-line"></span>
                        <span className="border-span bottom-line"></span>
                        <span className="border-span left-line"></span>
                        <span className="border-span right-line"></span>
                        <DivTag className="image-div">
                          {card.image?.url && (
                            <Image src={card.image.url} alt={card.title || 'Image'} className='img-fluid' width={402} height={275} />
                          )}
                        </DivTag>
                        <DivTag className="content-div">
                          <H4Tag className="card-col-title">{card.title}</H4Tag>
                          {card.type === 'list' ? (
                            card.list?.length > 0 && (
                              <ULTag className="icon-list">
                                {card.list.map((listItem, liIndex) => (
                                  <LITag key={liIndex} className="list-with-icon">
                                    <PTag ><SpanTag className="li-title" >{listItem.title}</SpanTag><br />
                                      <SpanTag className="">{listItem.description}</SpanTag>
                                    </PTag>
                                  </LITag>
                                ))}
                              </ULTag>
                            )
                          ) : (
                            card.description && (
                              <DivTag
                                className={`${card.text_align === 'center'
                                  ? 'text-center'
                                  : card.text_align === 'justify'
                                    ? 'text-align-justify'
                                    : 'text-left'
                                  }`}
                                dangerouslySetInnerHTML={{
                                  __html: card.description,
                                }}
                              />
                            )
                          )}
                        </DivTag>
                      </DivTag>
                    </DivTag>
                  );
                })}
              </DivTag>
            ));
          })()}
          {data.button?.url && (
            <DivTag className="btn-div">
              <Link href={data.button.url} className="btn primary-btn" target={data.button.target || "_self"}>
                {data.button.title} <ArrowRight className="right-arrow-icon" />
              </Link>
            </DivTag>
          )}
        </DivTag>
      </DivTag>
    </SectionTag>
  );
}
