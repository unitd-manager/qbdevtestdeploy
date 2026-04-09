'use client';
import { useState, useEffect, useRef } from 'react';
import { DivTag, H2Tag, H4Tag, SectionTag } from '../Common/HTMLTags';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowNavRight, ArrowRight } from '../Common/Icons';

export default function IndustryHighLightBlock({ data }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [inView, setInView] = useState(false);
    const sectionRef = useRef(null);
    const videoRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setInView(entry.isIntersecting),
            { threshold: 0.3 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            inView ? video.play() : video.pause();
        }
    }, [inView]);

    const {
        main_title,
        description,
        list = [],
        cta_button,
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
        <SectionTag className="our-searvice-info industry-highlight-block">
            <DivTag className={`container our-searvice-data`}>
                <DivTag className={`sub-section  ${paddingClass}`} >
                <DivTag className="row">
                    <DivTag className="top-title-info">
                        {main_title && (
                            <H2Tag
                                className="main-title"
                                dangerouslySetInnerHTML={{ __html: main_title }}
                            />
                        )}
                        {description && (
                            <DivTag
                                className="desc"
                                dangerouslySetInnerHTML={{ __html: description }}
                            />
                        )}
                    </DivTag>
                </DivTag>
                <DivTag className={`row list-of-service ${inView ? 'animated-border' : ''}`} ref={sectionRef}>
                    <DivTag className="col-md-6 serv-left-info">
                        <DivTag className="serv-list-info">
                            {list &&
                                list.map((service, index) => (
                                    <DivTag
                                        key={index}
                                        className={`serv-list-item ${index === activeIndex ? 'active' : ''}`}
                                        onClick={() => setActiveIndex(index)}
                                    >
                                        <DivTag className="serv-list-heading">
                                            {service.icon?.url && (
                                                <span className="serv-iocn">
                                                    <Image src={service.icon?.url || ''} alt={`icon${index + 1}`} fill />
                                                </span>
                                            )}
                                            {service.title && (
                                                <H4Tag dangerouslySetInnerHTML={{ __html: service.title }} />
                                            )}
                                            <span className="right-arrow-iocn">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                                                    <path d="M5.98047 11L9.48047 7.5L5.98047 4" stroke="black" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </span>
                                        </DivTag>
                                        <DivTag className="serv-list-desc" style={{ display: index === activeIndex ? 'block' : 'none' }}>
                                            <DivTag className="serv-list-desc-info">
                                                <DivTag className="serv-desc-title">
                                                    <H4Tag dangerouslySetInnerHTML={{ __html: service.title }} />
                                                    {service.button?.url && (
                                                        <Link
                                                            href={service.button.url}
                                                            className="btn primary-btn cat-knowmore hide-for-small"
                                                            target={service.button.target || '_self'}
                                                        >
                                                            {service.button.title}
                                                            <span className="right-arrow-iocn">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                                                                    <path d="M5.98047 11L9.48047 7.5L5.98047 4" stroke="black" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round" />
                                                                </svg>
                                                            </span>
                                                        </Link>
                                                    )}
                                                </DivTag>

                                                <DivTag className="serv-desc">
                                                    <DivTag dangerouslySetInnerHTML={{ __html: service.description }} />

                                                    {service.button?.url && (
                                                        <Link
                                                            href={service.button.url}
                                                            className="btn primary-btn cat-knowmore show-for-small"
                                                            target={service.button.target || '_self'}
                                                        >
                                                            {service.button.title}
                                                            <span>
                                                                <svg viewBox="0 0 17 17" width="1em" height="1em" fill="none" className="right-arrow-icon">
                                                                    <path d="M6.5 12.5333L10.5 8.53333L6.5 4.53332" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                                                </svg>
                                                            </span>
                                                        </Link>
                                                    )}
                                                </DivTag>

                                                <DivTag className="show-for-small">
                                                    <DivTag className="serv-media-right-info">
                                                        {service.image?.url && (
                                                            <Image
                                                                src={service.image.url}
                                                                alt={service.title || ''}
                                                                fill
                                                            />
                                                        )}
                                                    </DivTag>
                                                </DivTag>
                                            </DivTag>
                                        </DivTag>
                                    </DivTag>
                                ))}
                        </DivTag>
                    </DivTag>
                    <DivTag className="col-md-6 serv-right-info hide-for-small">
                        <DivTag className="serv-media-right-info" >
                            {list[activeIndex]?.image?.url && (
                                <Image src={list[activeIndex].image.url} alt={list[activeIndex].title || ''} fill />
                            )}
                        </DivTag>
                    </DivTag>
                </DivTag>
                {cta_button?.url && (
                    <DivTag className="text-center">
                    <Link
                        href={cta_button.url}
                        target={cta_button.target || '_self'}
                        className="btn primary-btn"
                    >
                        {cta_button.title || 'Learn More'} <ArrowRight />
                    </Link>
                    </DivTag>
                )}
                </DivTag>
            </DivTag>
        </SectionTag>
    );
}
