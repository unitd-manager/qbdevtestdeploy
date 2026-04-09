'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import Slider from 'react-slick';
import { DivTag, H2Tag, H3Tag, H4Tag, PTag, SectionTag, SpanTag } from '../Common/HTMLTags';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from 'next/link';
import { ArrowRight } from '../Common/Icons';

export default function BlogpotSlider({ data }) {
  const sectionRef = useRef(null);
  const [bloganimate, setAnimate] = useState(false);
  const blogPosts = data?.posts || [];
  const padding = data?.padding;
  const settings = {
    dots: true,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 991, settings: { slidesToShow: 2 } },
      { breakpoint: 576, settings: { slidesToShow: 1 } }
    ],
    afterChange: () => updateSlideBorders()
  };

  const getItemsPerRow = useCallback(() => {
    const width = window.innerWidth;
    if (width < 576) return 1;
    if (width < 991) return 2;
    return 3;
  }, []);

  const updateSlideBorders = useCallback(() => {
    const slides = document.querySelectorAll('.our-upcoming-bloglist .slick-slide');
    slides.forEach(slide => slide.classList.remove('no-line'));
    const visibleSlides = Array.from(slides).filter(
      slide => slide.classList.contains('slick-active') && !slide.classList.contains('slick-cloned')
    );
    const itemsPerRow = getItemsPerRow();
    visibleSlides.forEach((slide, index) => {
      if ((index + 1) % itemsPerRow === 0) {
        slide.classList.add('no-line');
      }
    });
  }, [getItemsPerRow]);

  useEffect(() => {
    setTimeout(updateSlideBorders, 100);
    window.addEventListener('resize', updateSlideBorders);
    return () => window.removeEventListener('resize', updateSlideBorders);
  }, [updateSlideBorders]);

  useEffect(() => {
    const currentSection = sectionRef.current; // Copy ref value to variable
    
    const observer = new IntersectionObserver(
      ([entry]) => setAnimate(entry.isIntersecting),
      { threshold: 0.3 }
    );
    
    if (currentSection) observer.observe(currentSection);
    
    return () => {
      if (currentSection) observer.unobserve(currentSection);
    };
  }, []);
  
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
    <SectionTag ref={sectionRef} className={`our-blog-post-info ${bloganimate ? 'bloganimate' : ''}`}>
      <DivTag className={`container our-blog-post-inner ${paddingClass}`}>
        <DivTag className='row'>
          <DivTag className='our-blog-post-heading'>
            {data?.main_title && <H3Tag className="main-title" dangerouslySetInnerHTML={{ __html: data.main_title }} />}
            {data?.description && <PTag dangerouslySetInnerHTML={{ __html: data.description }} />}
          </DivTag>

          <DivTag className='our-upcoming-bloglist'>
            <Slider {...settings}>
              {blogPosts.map((post, index) => (
                <DivTag key={index} className="upcoming-bloglist-itmes">
                  <DivTag className="blog-list-info">
                    <SpanTag className="post-date">{post.date}</SpanTag>
                  </DivTag>
                  <DivTag className="bloglist-title-info">
                    <H4Tag dangerouslySetInnerHTML={{ __html: post.title }} />
                    <Link href={post.link} className="btn primary-btn post-cta" target="_blank" rel="noopener noreferrer">
                      READ more{' '}
                      <SpanTag>
                        <ArrowRight />
                      </SpanTag>
                    </Link>
                  </DivTag>
                </DivTag>
              ))}
            </Slider>
          </DivTag>
        </DivTag>
      </DivTag>
    </SectionTag>
  );
}