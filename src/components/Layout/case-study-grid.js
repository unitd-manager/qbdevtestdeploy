'use client';
import { useEffect, useRef, useState } from 'react';
import { SectionTag, DivTag, H5Tag, H2Tag } from '../Common/HTMLTags';
import Image from 'next/image';
import { renderButton } from '../Common/Button';

export default function CaseStudyGrid({ data }) {
    const rowRef = useRef(null);
    const colRefs = useRef([]);
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Row animation
    useEffect(() => {
        if (!rowRef.current) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-border');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: isMobile ? 0.1 : 0.3 });

        observer.observe(rowRef.current);
        return () => observer.disconnect();
    }, [isMobile]);

    // Column animation
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-border');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: isMobile ? 0.1 : 0.3 });

        colRefs.current.forEach((ref) => ref && observer.observe(ref));
        return () => observer.disconnect();
    }, [isMobile, data]);

    if (!data) return null;

    const {
        main_title,
        description,
        use_case_items = [],
        class_name = '',
        id = '',
    } = data;

    // Responsive column logic
    const getColumnClass = (len) => {
        if (len === 1) return 'col-md-12';
        if (len === 2) return 'col-md-6';
        return 'col-md-4';
    };

    const column = getColumnClass(use_case_items.length);

    return (
        <SectionTag className={`case-study-section ${class_name}`} id={id}>
            <DivTag className="container">

                {/* Header */}
                {(main_title || description) && (
                    <DivTag className="row">
                        <DivTag className="col-md-12 text-center">
                            {main_title && (
                                <H2Tag
                                    className="main-title"
                                    dangerouslySetInnerHTML={{ __html: main_title }}
                                />
                            )}
                            {description && (
                                <DivTag
                                    className="section-desc"
                                    dangerouslySetInnerHTML={{ __html: description }}
                                />
                            )}
                        </DivTag>
                    </DivTag>
                )}

                {/* Grid */}
                {use_case_items.length > 0 && (
                    <DivTag className="row case-study-row" ref={rowRef}>
                        {use_case_items.map((item, index) => (
                            <DivTag
                                key={index}
                                className={`${column} case-study-col`}
                                ref={(el) => (colRefs.current[index] = el)}
                            >
                                <DivTag className="case-card">

                                    {/* Image */}
                                    {item.image?.url && (
                                        <DivTag className="image-wrapper">
                                            <Image
                                                src={item.image.url}
                                                alt={item.image.alt || item.title || 'case-study'}
                                                width={400}
                                                height={300}
                                                className="img-fluid"
                                            />
                                        </DivTag>
                                    )}

                                    {/* Optional Icon */}
                                    {item.icon?.url && (
                                        <DivTag className="icon-wrapper">
                                            <Image
                                                src={item.icon.url}
                                                alt="icon"
                                                width={40}
                                                height={40}
                                            />
                                        </DivTag>
                                    )}

                                    {/* Content */}
                                    <DivTag className="content">
                                        {item.title && (
                                            <H5Tag
                                                dangerouslySetInnerHTML={{ __html: item.title }}
                                            />
                                        )}

                                        {item.description && (
                                            <DivTag
                                                className="desc"
                                                dangerouslySetInnerHTML={{ __html: item.description }}
                                            />
                                        )}

                                        {/* Button */}
                                        {item.button?.url && renderButton(item.button)}
                                    </DivTag>

                                </DivTag>
                            </DivTag>
                        ))}
                    </DivTag>
                )}
            </DivTag>
        </SectionTag>
    );
}