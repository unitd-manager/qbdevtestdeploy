'use client';
import { DivTag, H1Tag, H4Tag, SectionTag } from '../Common/HTMLTags';
import Image from 'next/image';

export default function AboutBannerLayout({ data }) {
  if (!data || typeof data !== 'object') return null;
  const {
    title,
    sub_title,
    description,
    image,
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
    <SectionTag className={`about-page-banner-section ${class_name}`} id={id}>
      <DivTag className="container">
        <DivTag className={`sub-section ${paddingClass}`}>
          <DivTag className="row about-content-box-row">
            <DivTag className="col-md-6">
              <DivTag className="ab-banner-desc">
                {title && <H1Tag className="main-title" dangerouslySetInnerHTML={{ __html: title }} />}
                {sub_title && <H4Tag className="sub-title" dangerouslySetInnerHTML={{ __html: sub_title }} />}
                {description && <H4Tag dangerouslySetInnerHTML={{ __html: description }} />}
              </DivTag>
            </DivTag>
            <DivTag className="col-md-6">
              <DivTag className="ab-banner-media">
                { image.url && (
                  <Image
                  src={image.url}
                  alt={image.alt}
                  width={629}
                  height={368}
                />
                )}
              </DivTag>
            </DivTag>
          </DivTag>
        </DivTag>
      </DivTag>
    </SectionTag>
  );
}