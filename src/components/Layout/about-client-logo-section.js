'use client';
import Slider from 'react-slick';
import { DivTag, H3Tag, SectionTag } from '../Common/HTMLTags';
import Image from 'next/image';

export default function AboutClientSection({ data }) {
    const marqueeSettings = {
    dots: false,
    infinite: true,
    speed: 5000,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: 'linear',
    arrows: false,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 6 } },
      { breakpoint: 992, settings: { slidesToShow: 5 } },
      { breakpoint: 768, settings: { slidesToShow: 4 } },
      { breakpoint: 576, settings: { slidesToShow: 2 } },
      { breakpoint: 400, settings: { slidesToShow: 2 } }
    ]
  };
    if (!data || typeof data !== 'object') return null;
    const {
        title,
        client_logos = [],
        padding = {},
        class_name,
        id
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
        <SectionTag className={`leading-companies-info ${class_name}`} id={id}>
        <DivTag className="container-fluid">
            <DivTag className={`sub-section ${paddingClass}`}>
          <DivTag className="row">
            <DivTag className="cop-top-title">
           {title && <H3Tag dangerouslySetInnerHTML={{ __html: title }} />}
            </DivTag>
          </DivTag>
          <DivTag className="row">
            <DivTag className="companies-list ">
              <Slider {...marqueeSettings}>
                {client_logos.map((item, i) => (
                  <DivTag className="companies-list-items" key={i}>
                    <Image
                      src={item.image.url}
                      alt={item.image.alt}
                      width={300}
                      height={150}
                    />
                  </DivTag>
                ))}
              </Slider>
              </DivTag>
            </DivTag>
          </DivTag>
        </DivTag>
      </SectionTag>
        </>
    );
}