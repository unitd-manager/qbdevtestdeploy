'use client';
import { DivTag, H3Tag, SectionTag } from '../Common/HTMLTags';
import Slider from 'react-slick';
import Image from 'next/image';

export default function ClientLogoSection({ data }) {
  const logoSliderSettings = {
    dots: false,
    infinite: true,
    speed: 3000,
    slidesToShow: 8,
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
      { breakpoint: 576, settings: { slidesToShow: 3 } },
      { breakpoint: 400, settings: { slidesToShow: 2 } }
    ]
  };

  const logo_list = data?.logo_list || [];
  const main_title = data?.main_title;
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
    <SectionTag className="home-client-logo-section">
      <DivTag className="container">
        <DivTag className="row">
          <DivTag className="col-md-12 text-center">
            <DivTag className="section-head">
              {main_title && (
                <H3Tag dangerouslySetInnerHTML={{ __html: main_title }} />
              )}
            </DivTag>
          </DivTag>
        </DivTag>
      </DivTag>

      {/* Full width logo slider */}
      <DivTag className="logo-slider-wrapper">
        <Slider {...logoSliderSettings} className="client-logo-slider">
          {
            logo_list.length > 0 &&
            logo_list.map((item, idx) => {
              const img = item.image;
              const imgUrl = img?.url || '/assets/images/logo-placeholder.webp';
              const alt = img?.alt || `Client ${idx + 1}`;
              return (
                <DivTag key={img?.id || idx} className="logo-slide">
                  <DivTag className="logo-container">
                    <Image
                      src={imgUrl}
                      alt={alt}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/assets/images/logo-placeholder.png';
                      }}
                      width={150} height={100}
                    />
                  </DivTag>
                </DivTag>
              );
            })}
        </Slider>
      </DivTag>
    </SectionTag>
  );
}
