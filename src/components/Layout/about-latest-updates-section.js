'use client';
import { useEffect, useRef, useState } from 'react';
import { SectionTag, DivTag, H3Tag, PTag, H2Tag } from '../Common/HTMLTags';
import Link from 'next/link';
import { ArrowRight } from '../Common/Icons';

export default function AboutLatestUpdates({ data }) {
    const [isMobile, setIsMobile] = useState(false);
    const rowRef = useRef(null);
    const cardRefs = useRef([]);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Animate row
    useEffect(() => {
        if (!rowRef.current) return;

        const fallbackTimer = setTimeout(() => {
            if (!rowRef.current.classList.contains('animate-border')) {
                rowRef.current.classList.add('animate-border');
            }
        }, 1000);

        const observerOptions = isMobile
            ? { threshold: [0, 0.1, 0.2], rootMargin: '0px 0px -20% 0px' }
            : { threshold: 0.3, rootMargin: '0px 0px -10% 0px' };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const shouldAnimate = isMobile
                    ? entry.intersectionRatio > 0.1
                    : entry.isIntersecting;

                if (shouldAnimate) {
                    clearTimeout(fallbackTimer);
                    entry.target.classList.add('animate-border');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        observer.observe(rowRef.current);

        return () => {
            observer.disconnect();
            clearTimeout(fallbackTimer);
        };
    }, [isMobile]);

    // Animate each card individually
    useEffect(() => {
        if (!cardRefs.current.length) return;

        const observerOptions = isMobile
            ? { threshold: [0, 0.1, 0.2], rootMargin: '0px 0px -20% 0px' }
            : { threshold: 0.3, rootMargin: '0px 0px -10% 0px' };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const shouldAnimate = isMobile
                    ? entry.intersectionRatio > 0.1
                    : entry.isIntersecting;

                if (shouldAnimate) {
                    entry.target.classList.add('animate-border');
                    observer.unobserve(entry.target); // stop observing once animated
                }
            });
        }, observerOptions);

        cardRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, [isMobile, data]);

    if (!data || typeof data !== 'object') return null;
    const {
        title,
        items,
        class_name = '',
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
    return (
        <SectionTag className={`about-latest-updates-section ${class_name}`} id={id} >
            <DivTag className="container">
                <DivTag className={`sub-section ${paddingClass}`}>
                    <DivTag className="row">
                        <DivTag className="col-md-12">
                            <DivTag className="content-box" ref={rowRef}>
                                <DivTag className="heading">
                                    {title && <H2Tag dangerouslySetInnerHTML={{ __html: title }} className="main-title" />}
                                </DivTag>
                                {items.length > 0 && (
                                    <DivTag className="row list-info " ref={rowRef}>
                                        {items.map((item, i) => (
                                            <DivTag className="list-item col" key={i} ref={(el) => (cardRefs.current[i] = el)}>

                                                {item?.title && (
                                                    <H3Tag className="" dangerouslySetInnerHTML={{ __html: item.title }} />
                                                )}
                                                {item.description &&   <PTag className="" dangerouslySetInnerHTML={{ __html: item.description }} /> }
                                                {item?.cta_button?.url && item.cta_button.url.trim() !== '' && (
                                                    <Link
                                                        href={item.cta_button.url}
                                                        target={item.cta_button.target || '_self'}
                                                        rel="noopener noreferrer"
                                                        className="btn primary-btn"
                                                    >
                                                        {item.cta_button.title || 'Learn More'} <ArrowRight />
                                                    </Link>
                                                )}
                                            </DivTag>
                                        ))}
                                    </DivTag>)}
                            </DivTag>
                        </DivTag>
                    </DivTag>
                </DivTag>
            </DivTag>
        </SectionTag>
    );
}
