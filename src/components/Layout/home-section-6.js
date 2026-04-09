'use client';
import { DivTag, H2Tag, PTag, SectionTag } from '../Common/HTMLTags';
import Link from 'next/link';
import { ArrowRight, ArrowNavLeft, ArrowNavRight } from '../Common/Icons';
import Slider from 'react-slick';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import BoxGrid from '../Common/BoxGrid';

export default function SectionSix({ data }) {
  const [maxHeight, setMaxHeight] = useState(0);
  const cardRefs = useRef([]);

  useEffect(() => {
    const calculateMaxHeight = () => {
      let max = 0;
      cardRefs.current.forEach(card => {
        if (card && card.offsetHeight > max) {
          max = card.offsetHeight;
        }
      });
      setMaxHeight(max);
    };

    calculateMaxHeight();

    // Recalculate on window resize
    window.addEventListener('resize', calculateMaxHeight);
    return () => window.removeEventListener('resize', calculateMaxHeight);
  }, []);

  // Custom arrows
  const PrevArrow = (props) => {
    const { onClick } = props;
    return (
      <div className="custom-arrow prev" onClick={onClick}>
        <ArrowNavLeft />
      </div>
    );
  };

  const NextArrow = (props) => {
    const { onClick } = props;
    return (
      <div className="custom-arrow next" onClick={onClick}>
        <ArrowNavRight />
      </div>
    );
  };

  const [boxCount, setBoxCount] = useState(0);
  const sectionRef = useRef();
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect(); // Trigger once
        }
      },
      { threshold: 0.8 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateGridBoxCount = () => {
      if (sectionRef.current) {
        const sectionHeight = sectionRef.current.offsetHeight;
        const rowHeight = 31; // 30px + 1px gap
        const numRows = Math.ceil(sectionHeight / rowHeight);
        const totalBoxes = numRows * 9; // 8 columns
        setBoxCount(totalBoxes);
      }
    };

    updateGridBoxCount();

    window.addEventListener('resize', updateGridBoxCount);
    return () => window.removeEventListener('resize', updateGridBoxCount);
  }, []);
  const main_title = data?.main_title;
  const sub_title = data?.sub_title;
  const button = data?.button;
  const image = data?.image;
  const testimonials = data?.select_post_type || [];
  const order_by = data?.order_by;
  const padding = data?.padding;

  // Slider settings
  const settings = {
    dots: testimonials.length > 1,
    infinite: testimonials.length > 1,
    speed: 500,
    slidesToShow: Math.min(testimonials.length, 1),
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '0px',
    autoplay: testimonials.length > 1,
    arrows: false,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  };
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
    <SectionTag ref={sectionRef} className={`home-section-six  ${paddingClass}`}>
      <BoxGrid className="right" />
      <DivTag className="container-fluid ">
        <DivTag className={`sub-section`} >
          <DivTag className="row">
            <DivTag className="col-md-6 left-col">
              <DivTag className="section-head">
                {main_title && (
                  <H2Tag className="main-title" dangerouslySetInnerHTML={{ __html: main_title }} />
                )}
                {sub_title && (
                  <PTag dangerouslySetInnerHTML={{ __html: sub_title }} />
                )}
                {button?.url && (
                  <DivTag className="btn-div">
                    <Link href={button.url} className="btn secondary-btn">
                      {button.title} <ArrowRight className="right-arrow-icon" />
                    </Link>
                  </DivTag>
                )}
              </DivTag>
              <Slider {...settings} className="home-testi-slider">
                {testimonials &&
                  testimonials.map((item, index) => (
                    <DivTag key={index} className="testimonial-card">
                      <DivTag
                        ref={el => cardRefs.current[index] = el}
                        className="testimonial-content"
                        style={{ minHeight: maxHeight > 0 ? `${maxHeight}px` : 'auto' }}
                      > 
                        { item.description && 
                        <DivTag className="top-content">
                          <PTag className="testimonial-text">{item.description}</PTag>
                        </DivTag>
                        }
                        <DivTag className="bottom-content">
                           { item.name && 
                          <PTag className="testimonial-client">{item.name}</PTag>
                           }
                           { item.designation && 
                          <PTag className="testimonial-designation">{item.designation}</PTag>
                           }
                           { item.logo && 
                          <DivTag className="testimonial-logo">
                            <Image
                              src={item.logo || '/assets/images/logo-placeholder.webp'}
                              alt={`${item.name} logo`}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/assets/images/logo-placeholder.webp';
                              }}
                              width={130} height={98}
                            />
                          </DivTag>
                          }
                        </DivTag>
                      </DivTag>
                    </DivTag>
                  ))}
              </Slider>
            </DivTag>
            <DivTag className="col-md-6 right-col-0">
              <DivTag className="image-div">
                {image.url && (
                  <Image src={image?.url || ''} alt={main_title || ''} width={857} height={755} />
                )}
              </DivTag>
            </DivTag>
          </DivTag>
        </DivTag>
      </DivTag>
    </SectionTag>
  );
}