'use client';

import { useEffect, useRef } from 'react';
import { DivTag, H2Tag, H3Tag, SectionTag } from '../Common/HTMLTags';
import Image from 'next/image';
import Slider from 'react-slick';

export default function PartnerShowcase({ data }) {
    const logoSliderSettings = {
        dots: false,
        infinite: true,
        speed: 5000,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 0,
        cssEase: 'linear',
        arrows: false,
        pauseOnHover: true,
        responsive: [
            { breakpoint: 1200, settings: { slidesToShow: 2.5 } },
            { breakpoint: 992, settings: { slidesToShow: 2 } },
            { breakpoint: 768, settings: { slidesToShow: 2 } },
            { breakpoint: 576, settings: { slidesToShow: 1.5 } },
            { breakpoint: 400, settings: { slidesToShow: 1.5 } }
        ]
    };
    const winnerSectionRef = useRef(null);
    const winnerContentRef = useRef(null);
    useEffect(() => {
        const winnerSection = winnerSectionRef.current;
        const winnerContent = winnerContentRef.current;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {

                    if (entry.target === winnerSection && winnerContent) {
                        if (entry.isIntersecting) {
                            winnerContent.classList.add('animate-winner');
                        } else {
                            winnerContent.classList.remove('animate-winner');
                        }
                    }
                });
            },
            { threshold: 0.3 }
        );

        if (winnerSection) observer.observe(winnerSection);

        return () => {
            if (winnerSection) observer.unobserve(winnerSection);
        };
    }, []);

    if (!data || typeof data !== 'object') return null;
    const {
        main_title,
        partner_logos = [],
        class_name = '',
        id = '',
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
        <>
            <SectionTag className={`partner-showcase-section ${class_name}`} id={id} ref={winnerSectionRef}>
                <DivTag className="container">
                    <DivTag className={`sub-section ${paddingClass}`}>
                        <DivTag className="row align-items-center">
                            <DivTag className="col-md-4 left-col">
                                <DivTag className='title'>
                                    {main_title && (
                                        <H2Tag
                                            dangerouslySetInnerHTML={{ __html: main_title }}
                                        />
                                    )}
                                </DivTag>
                            </DivTag>
                            <DivTag className="col-md-8 logo-col" ref={winnerContentRef}>
                                <DivTag className="logo-slider-wrapper">
                                    <Slider {...logoSliderSettings} className="client-logo-slider">
                                        {
                                            partner_logos.length > 0 &&
                                            partner_logos.map((item, idx) => {
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
                                                                width={250} height={80} className='img-fluid'
                                                            />
                                                        </DivTag>
                                                    </DivTag>
                                                );
                                            })}
                                    </Slider>
                                </DivTag>
                            </DivTag>
                        </DivTag>
                    </DivTag>
                </DivTag>
            </SectionTag>
        </>
    );
}
