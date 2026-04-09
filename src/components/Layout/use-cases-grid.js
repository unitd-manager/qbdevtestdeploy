'use client';
import { useEffect, useRef, useState } from 'react';
import { SectionTag, DivTag, H5Tag, H2Tag } from '../Common/HTMLTags';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from '../Common/Icons';
import { renderButton } from '../Common/Button';

export default function UseCaseGrid({ data }) {
    const rowRef = useRef(null);
    const colRefs = useRef([]); // store refs for all columns
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
        use_case_items = [],
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

    const column = getColumnClass(use_case_items.length);
    const columnsPerRow = getColumnsPerRow(use_case_items.length);

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
        <SectionTag className={`use-cases-grid-section ${class_name}`} id={`${id}`}>
            <DivTag className="container">
                <DivTag className={`sub-section ${paddingClass}`}>
                    {(main_title || description) && (
                        <DivTag className="row">
                            <DivTag className="col-md-12">
                                <DivTag className="content-box">
                                    {main_title && (
                                        <H2Tag
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

                    {Array.isArray(use_case_items) && use_case_items.length > 0 && (
                        <DivTag className="row icon-box-row" ref={rowRef}>
                            {use_case_items.map((item, index) => {
                                const isLastInCompleteRow = (index + 1) % columnsPerRow === 0;
                                return (
                                    <DivTag
                                        className={`${column} icon-box-col ${isLastInCompleteRow ? 'last-in-row' : ''}`}
                                        key={`icon-box-${index}`}
                                        ref={(el) => (colRefs.current[index] = el)} // track each col
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
                </DivTag>
            </DivTag>
        </SectionTag>
    );
}
