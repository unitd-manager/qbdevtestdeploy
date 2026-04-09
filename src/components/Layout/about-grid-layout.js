'use client';
import { useEffect, useRef, useState } from 'react';
import { DivTag, H2Tag, SectionTag } from '../Common/HTMLTags';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from '../Common/Icons';

export default function AboutGridLayout({ data }) {
    const [isMobile, setIsMobile] = useState(false);
    const rowRef = useRef(null);
    const cardRefs = useRef([]); // store all card refs

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

    if (!data) return null;
    const { title, description, image, grid_items = [], class_name, id, padding } = data;

    let paddingClass = '';
    if (padding?.padding_options) {
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
        <SectionTag className={`about-grid-layout ${class_name}`} id={id}>
            <DivTag className="container">
                <DivTag className={`sub-section ${paddingClass}`}>
                    { (image?.url || title || description) && 
                    <DivTag className='row top-section'>
                        <DivTag className="col-md-12 col">
                             {image?.url && (
                            <Image src={image.url} alt={image.alt} width={1349} height={305} className="img-fluid" />
                             )}
                             { (title || description) && 
                            <DivTag className="main-content">
                            {title && <H2Tag className="main-title" dangerouslySetInnerHTML={{ __html: title }} />}
                            {description && <DivTag className="description" dangerouslySetInnerHTML={{ __html: description }} />}
                            </DivTag>
                            }
                        </DivTag>
                    </DivTag>
                     }
                    <DivTag className="row grid-row" ref={rowRef}>
                        {grid_items.map((row, rowIndex) => {
                            const colClass = rowIndex % 2 === 0 ? 'odd-col' : 'even-col';
                            return (
                                <DivTag
                                    key={rowIndex}
                                    className={`col-md-6 card-col ${colClass}`} ref={(el) => (cardRefs.current[rowIndex] = el)} >
                                    {row.image?.url && (
                                        <DivTag className="img-div">
                                            <Image
                                                src={row.image.url}
                                                alt={row.image.alt || 'Image'}
                                                width={677}
                                                height={463}
                                                className="img-fluid"
                                            />
                                        </DivTag>
                                    )}

                                    <DivTag  className={`content-block ${row.background_color ? 'has-bg' : ''}`} style={{ background: row.background_color }} >
                                        {row.title && <H2Tag dangerouslySetInnerHTML={{ __html: row.title }} />}
                                        {row.description && (
                                            <DivTag dangerouslySetInnerHTML={{ __html: row.description }} />
                                        )}
                                        {row.cta_button?.url && (
                                            <Link
                                                href={row.cta_button.url}
                                                target={row.cta_button.target || '_self'}
                                                className="btn primary-btn"
                                            >
                                                {row.cta_button.title || 'Learn More'} <ArrowRight />
                                            </Link>
                                        )}
                                    </DivTag>
                                </DivTag>
                            );
                        })}
                    </DivTag>
                </DivTag>
            </DivTag>
        </SectionTag>
    );
}
