'use client';
import Link from 'next/link';
import { DivTag, H1Tag, SectionTag } from '../Common/HTMLTags';
import { ArrowRight } from '../Common/Icons';

export default function InnerBanner({ data }) {
  if (!data || typeof data !== 'object') return null;
  const {
    sub_title,
    main_title,
    description,
    button,
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
    <>
      <SectionTag className='inner-banner-section'>
        <DivTag className={`container ${paddingClass}`}>
          <DivTag className="row banner-content-box-row">
            <DivTag className="col-md-12">
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
                  <Link href={data.button.url} className="btn primary-btn" target={button.target || "_self"}>
                    {button.title} <ArrowRight className="right-arrow-icon" />
                  </Link>
                )}
              </DivTag>
            </DivTag>
          </DivTag>
        </DivTag>
      </SectionTag>
    </>
  )
}
