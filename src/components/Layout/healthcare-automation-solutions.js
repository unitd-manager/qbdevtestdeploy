'use client';

import { SectionTag, DivTag, H3Tag, PTag, ATag, H2Tag, H4Tag } from '../Common/HTMLTags';
import Image from 'next/image';
import DotGrid from '../Common/DotGrid';
import { ArrowRight } from '../Common/Icons';
import Link from 'next/link';
export default function ContentHighlight({ data }) {
  if (!data || typeof data !== 'object') return null;

  const {
    display_options,
    title,
    description,
    sub_title,
    solutions,
    image,
    text_alignment,
    image_position = 'right',
    button,
    common_content,
    class_name = '',
    enable_animation = 'true',
    id = '',
    padding
  } = data;
  const showTitle = display_options.includes('title');
  const showSubTitle = display_options.includes('sub_title');
  const showDescription = display_options.includes('description');
  const showImage = display_options.includes('show_image');
  const showSolutions = display_options.includes('solutions');
  const showCTA = display_options.includes('button');
  const showCommDisc = display_options.includes('common_content');
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
    <SectionTag className={`acf-section healthcare-automation-solutions ${isRight ? 'content-highlight-block-right' : 'content-highlight-block-left'} ${class_name}`} id={id}>
      {enable_animation == 'true' && (isRight ? <DotGrid className="left-grid" /> : <DotGrid className="right-grid" />)}
      <DivTag className="container-fluid ">
        <DivTag className={`sub-section ${paddingClass}`}>
          
          <DivTag className={`row align-items-center ${isRight ? 'flex-row-reverse' : ''}`}>
            { showImage && image?.url && (
              <DivTag className="col-md-6 img-col">
                <DivTag className="img-wrapper">
                  <Image
                    src={image.url}
                    alt={image.alt || 'Section Image'}
                    width={847}
                    height={659}
                    className="img-fluid"
                  />
                </DivTag>
              </DivTag>
            )}
            <DivTag className="col-md-6">
              <DivTag className={`content-box text-${text_alignment}`}>
                {showTitle && title && <H2Tag className="main-title" dangerouslySetInnerHTML={{ __html: title }} />}
                {showDescription && description && <DivTag dangerouslySetInnerHTML={{ __html: description }} />}
                {showSubTitle && sub_title && <H4Tag className="sub-title" dangerouslySetInnerHTML={{ __html: sub_title }} />}
                {showSolutions && solutions && (
                  <DivTag className={`solutions-list`}>
                    {solutions.map((item, index) => (
                      <DivTag className="solutions-list-itmes" key={index}>
                        { item.icon?.url && 
                        <DivTag className="img-div">
                          <Image src={item.icon?.url || ''} alt={item.title} height={44} width={44} className='img-fluid'  loading="lazy" />
                        </DivTag>
                        }
                        { item.title && 
                        <PTag>{item.title}</PTag>
                        }
                      </DivTag>
                    ))}
                  </DivTag>
                )}
                {showCommDisc && common_content && <DivTag className="common-content" dangerouslySetInnerHTML={{ __html: common_content }} />}
                {showCTA && button?.url && (
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
