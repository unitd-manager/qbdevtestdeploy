'use client';

import { SectionTag, DivTag, H3Tag, PTag, ATag, H2Tag } from '../Common/HTMLTags';
import Image from 'next/image';
import DotGrid from '../Common/DotGrid';
import { ArrowRight } from '../Common/Icons';
import Link from 'next/link';
export default function ContentHighlight({ data }) {
  if (!data || typeof data !== 'object') return null;

  const {
    title,
    description,
    image,
    text_alignment,
    image_position = 'right',
    button,
    class_name = '',
    enable_animation = 'true',
    id = '',
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
  const isRight = image_position === 'right';
  return (
    <SectionTag className={`acf-section content-highlight-block ${isRight ? 'content-highlight-block-right' : 'content-highlight-block-left'} ${class_name}`} id={id}>
      {enable_animation == 'true' && (isRight ? <DotGrid className="left-grid" /> : <DotGrid className="right-grid" />)}
      <DivTag className="container">
        <DivTag className={`sub-section ${paddingClass}`}>
          <DivTag className={`row align-items-center ${isRight ? 'flex-row-reverse' : ''}`}>
            {image?.url && (
              <DivTag className="col-md-6 img-col">
                <DivTag className="img-wrapper">
                  <Image
                    src={image.url}
                    alt={image.alt || 'Section Image'}
                    width={666}
                    height={433}
                    quality={100}
                  />
                </DivTag>
              </DivTag>
            )}
            <DivTag className="col-md-6">
              <DivTag className={`content-box text-${text_alignment}`}>
                {title && <H2Tag className="main-title" dangerouslySetInnerHTML={{ __html: title }} />}
                {description && <DivTag dangerouslySetInnerHTML={{ __html: description }} />}
                {button?.url && (
                  <Link
                    href={button.url}
                    target={button.target || '_self'}
                    className="btn primary-btn"
                  >
                    {button.title || 'Learn More'} <ArrowRight />
                  </Link>
                )}
              </DivTag>
            </DivTag>
          </DivTag>
        </DivTag>
      </DivTag>
    </SectionTag>
  );
}
