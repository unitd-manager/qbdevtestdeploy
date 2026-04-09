'use client';

import { useState, useRef, useEffect } from 'react';
import { ATag, DivTag, H2Tag, H3Tag, H4Tag, H5Tag, PTag, SectionTag, SpanTag } from '../Common/HTMLTags';
import { ArrowDown, ArrowRight, ArrowUp } from '../Common/Icons';
import Link from 'next/link';

export default function CareerOpeningSection({ data }) {
    const [activeIndex, setActiveIndex] = useState(null);
    const itemRefs = useRef([]); // store refs for each accordion item

    if (!data || typeof data !== 'object') return null;

    const {
        main_title,
        description,
        job_openings = [],
        class_name,
        id,
        padding
    } = data;

    const toggleFAQ = (index) => {
        const newIndex = index === activeIndex ? null : index;
        setActiveIndex(newIndex);

        // Scroll into view only when expanding
        if (newIndex !== null && itemRefs.current[newIndex]) {
            setTimeout(() => {
                itemRefs.current[newIndex].scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100); // small delay so content renders first
        }
    };

    let paddingClass = '';
    if (padding && padding.padding_options && padding.padding_options === true) {
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
        <SectionTag className={`career-opening-section ${class_name}`} id={id}>
            <DivTag className="container">
                <DivTag className={`sub-section ${paddingClass}`}>
                    {(main_title || description) && (
                        <DivTag className="row">
                            <DivTag className="col-md-12">
                                <DivTag className="section-header">
                                    {main_title && <H2Tag className="main-title" dangerouslySetInnerHTML={{ __html: main_title }} />}
                                    {description && <DivTag dangerouslySetInnerHTML={{ __html: description }} />}
                                </DivTag>
                            </DivTag>
                        </DivTag>
                    )}

                    <DivTag className="accordion">
                        {job_openings.map((item, index) => (
                            <DivTag
                                key={index}
                                ref={(el) => (itemRefs.current[index] = el)} // attach ref
                                className={`accordion-item ${activeIndex === index ? 'active' : ''}`}
                            >
                                {/* Accordion Header */}
                                <button className="accordion-header" onClick={() => toggleFAQ(index)}>
                                    {item.job_title}
                                    {activeIndex === index ? <ArrowUp /> : <ArrowDown />}
                                </button>

                                {/* Accordion Body */}
                                {activeIndex === index && (
                                    <DivTag className="accordion-content">
                                        <DivTag className="job-meta">
                                            {item.job_type && (
                                                <SpanTag
                                                    className="job-type"
                                                    dangerouslySetInnerHTML={{ __html: item.job_type }}
                                                />
                                            )}
                                            {item.job_location && (
                                                <>
                                                    <SpanTag>,&nbsp;</SpanTag>
                                                    <SpanTag
                                                        className="job-location"
                                                        dangerouslySetInnerHTML={{ __html: item.job_location }}
                                                    />
                                                </>
                                            )}
                                        </DivTag>
                                        <DivTag className="d-flex general-div">
                                            <DivTag className="">
                                                {item.general_title && (
                                                    <H5Tag className="general-title" dangerouslySetInnerHTML={{ __html: item.general_title }} />
                                                )}
                                            </DivTag>
                                            {item.job_link && (
                                                <Link
                                                    href={item.job_link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn primary-btn"
                                                >
                                                    Apply Now <ArrowRight />
                                                </Link>
                                            )}
                                        </DivTag>
                                        {item.general_description && <DivTag dangerouslySetInnerHTML={{ __html: item.general_description }} />}
                                        {item.job_section?.length > 0 &&
                                            item.job_section.map((section, sIndex) => (
                                                <DivTag key={sIndex} className="job-section">
                                                    {section.section_title && (
                                                        <H5Tag className="section-title">{section.section_title}</H5Tag>
                                                    )}
                                                    {section.section_content && (
                                                        <DivTag
                                                            className="section-content"
                                                            dangerouslySetInnerHTML={{
                                                                __html: section.section_content,
                                                            }}
                                                        />
                                                    )}
                                                    {section.section_items?.length > 0 && (
                                                        <ul className="section-items">
                                                            {section.section_items.map((item, iIndex) => (
                                                                <li key={iIndex}>{item.item_text}</li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </DivTag>
                                            ))}
                                    </DivTag>
                                )}
                            </DivTag>
                        ))}
                    </DivTag>
                </DivTag>
            </DivTag>
        </SectionTag>
    );
}
