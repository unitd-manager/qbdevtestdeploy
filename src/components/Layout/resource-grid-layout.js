'use client';
import { useEffect, useRef, useState } from 'react';
import { SectionTag, DivTag, H5Tag, H2Tag, H3Tag } from '../Common/HTMLTags';
import Image from 'next/image';
import { renderButton } from '../Common/Button';
import Link from 'next/link';
import { ArrowRight } from '../Common/Icons';

export default function ResourceGrid({ data }) {
    const rowRef = useRef(null);
    const colRefs = useRef([]);
    const [isMobile, setIsMobile] = useState(false);

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

    // Animate each column individually
    useEffect(() => {
        if (!colRefs.current.length) return;

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
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        colRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, [isMobile, data]);

    if (!data || typeof data !== 'object') return null;

    const {
        main_title,
        description,
        items = [],
        cta_button,
        background_color = '',
        class_name = '',
        id = '',
        padding = {},
    } = data;

    // Column sizing
    const getColumnClass = (itemsLength) => {
        if (itemsLength <= 1) return 'col-md-12';
        if (itemsLength === 2) return 'col-md-6';
        if (itemsLength === 3) return 'col-md-4';
        if (itemsLength === 4) return 'col-md-4';
        return 'col-md-4';
    };

    const getColumnsPerRow = (itemsLength) => {
        if (itemsLength <= 1) return 1;
        if (itemsLength === 2) return 2;
        if (itemsLength === 3) return 3;
        if (itemsLength === 4) return 3;
        return 3;
    };

    const column = getColumnClass(items.length);
    const columnsPerRow = getColumnsPerRow(items.length);

    let paddingClass = '';
    if (padding?.padding_options === true) {
        const { padding_position = [], desktop_padding = {}, mobile_padding = {} } = padding;

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
        <SectionTag className={`resource-grid-section ${class_name} ${paddingClass}`} id={`${id}`} style={{ background: background_color }}>
            <DivTag className="container">
                <DivTag className={`sub-section`}>
                    {(main_title || description) && (
                        <DivTag className="row">
                            <DivTag className="col-md-12">
                                <DivTag className="content-box">
                                    {main_title && (
                                        <H3Tag
                                            dangerouslySetInnerHTML={{ __html: main_title }}
                                            className="main-title"
                                        />
                                    )}
                                    {description && (
                                        <DivTag
                                            className="grid-desc"
                                            dangerouslySetInnerHTML={{ __html: description }}
                                        />
                                    )}
                                </DivTag>
                            </DivTag>
                        </DivTag>
                    )}
                    {Array.isArray(items) && items.length > 0 && (
                        <DivTag className="row icon-box-row" ref={rowRef}>
                            {items.map((item, index) => {
                                const isLastInCompleteRow = (index + 1) % columnsPerRow === 0;
                                return (
                                    <DivTag
                                        className={`${column} icon-box-col ${isLastInCompleteRow ? 'last-in-row' : ''}`}
                                        key={`icon-box-${index}`}
                                        ref={(el) => (colRefs.current[index] = el)}
                                    >
                                        <DivTag className="icon-box">
                                            {item.image?.url && (
                                                <DivTag className="icon-div">
                                                    <Image
                                                        src={item.image.url}
                                                        alt={item.image.alt || 'Icon'}
                                                        width={390}
                                                        height={310}
                                                        className="img-fluid"
                                                    />
                                                </DivTag>
                                            )}
                                            {item.title && <H5Tag dangerouslySetInnerHTML={{ __html: item.title }} />}
                                            {item.description && (
                                                <DivTag
                                                    className="desc"
                                                    dangerouslySetInnerHTML={{ __html: item.description }}
                                                />
                                            )}
                                            {item.button?.url && renderButton(item.button)}
                                        </DivTag>
                                    </DivTag>
                                );
                            })}
                        </DivTag>
                    )}
                    <DivTag className="row text-center">
                        <DivTag className="col-md-12">
                            {cta_button?.url && (
                                <Link
                                    href={cta_button.url}
                                    target={cta_button.target || '_self'}
                                    className="btn primary-btn"
                                >
                                    {cta_button.title || 'Learn More'} <ArrowRight />
                                </Link>
                            )}
                        </DivTag>
                    </DivTag>
                </DivTag>
            </DivTag>
        </SectionTag>
    );
}
