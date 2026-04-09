'use client';
import { useEffect, useRef } from 'react';
import { useState } from 'react';
import Image from 'next/image';
import { DivTag, H2Tag, H3Tag, PTag, SectionTag } from '../Common/HTMLTags';
import { ArrowDown, ArrowUp } from '../Common/Icons';

export default function RoundtableSessionsSections({ data }) {
     const [activeIndex, setActiveIndex] = useState(0);
    const parentRef = useRef(null);

    useEffect(() => {
        const rows = document.querySelectorAll('.comparison-table .table-row');

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    rows.forEach((row) => {
                        row.classList.add('animate-border');
                    });
                }
            },
            { threshold: 0.5 }
        );

        if (parentRef.current) observer.observe(parentRef.current);

        return () => observer.disconnect();
    }, []);

    if (!data || typeof data !== 'object') return null;
   
    const {
        main_title,
        description,
        roundtables = [],
        padding,
        class_name = '',
        id = ''
    } = data;

    const toggleAccordion = (index) => {
        setActiveIndex(index === activeIndex ? null : index);
    };

    // Padding class builder
    let paddingClass = '';
    if (padding?.padding_options === true) {
        const {
            padding_position = [],
            desktop_padding = {},
            mobile_padding = {}
        } = padding;

        if (padding_position.includes('top')) {
            if (desktop_padding.padding_top_desktop)
                paddingClass += ` padding-top-desktop-${desktop_padding.padding_top_desktop}px`;
            if (mobile_padding.padding_top_mobile)
                paddingClass += ` padding-top-mobile-${mobile_padding.padding_top_mobile}px`;
        }

        if (padding_position.includes('bottom')) {
            if (desktop_padding.padding_bottom_desktop)
                paddingClass += ` padding-bottom-desktop-${desktop_padding.padding_bottom_desktop}px`;
            if (mobile_padding.padding_bottom_mobile)
                paddingClass += ` padding-bottom-mobile-${mobile_padding.padding_bottom_mobile}px`;
        }
    }

    return (
        <SectionTag className={`roundtable-sessions-sections ${class_name}`} id={id}>
            <DivTag className="container">
                <DivTag className={`sub-section ${paddingClass}`}>
                    {(main_title || description) && (
                        <DivTag className="section-header text-center">
                            {main_title && <H2Tag className="main-title" dangerouslySetInnerHTML={{ __html: main_title }} />}
                            {description && <DivTag className="main-desc" dangerouslySetInnerHTML={{ __html: description }} />}
                        </DivTag>
                    )}
                    {roundtables.length > 0 && (
                        <DivTag className="accordion">
                            {roundtables.map((item, index) => {
                                const {
                                    roundtable_title,
                                    table,
                                    speaker_image,
                                    speaker_name,
                                    speaker_title,
                                    speaker_company,
                                    speaker_role_label
                                } = item;

                                const imgUrl = speaker_image?.url || '';

                                return (
                                    <DivTag key={index} className={`accordion-item ${activeIndex === index ? 'active' : ''}`}>
                                        <button className="accordion-header" onClick={() => toggleAccordion(index)}>
                                            {roundtable_title}
                                            {activeIndex === index ? <ArrowUp /> : <ArrowDown />}
                                        </button>

                                        {activeIndex === index && ( 
                                            <DivTag className="accordion-content">
                                                <DivTag className="table-wrapper table-responsive">
                                                    <table className="comparison-table">
                                                        <tbody>
                                                            {
                                                            table.table_row.map((row, rowIndex) => {
                                                                const isHeader = row.type === 'th';
                                                                const Tag = isHeader ? 'th' : 'td';
                                                                return (
                                                                    <tr key={rowIndex} className="table-row">
                                                                        {row.name_or_value?.map((cell, colIndex) => (
                                                                            <Tag className="table-col" key={colIndex}>
                                                                                <DivTag className="desc" dangerouslySetInnerHTML={{ __html: cell.name }} />
                                                                            </Tag>
                                                                        ))}
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </DivTag>

                                                {(imgUrl || speaker_name || speaker_title || speaker_company || speaker_role_label) && (
                                                    <DivTag className="speaker-block d-flex align-items-start mt-3">
                                                        {imgUrl && (
                                                            <DivTag className="speaker-image me-3">
                                                                <Image
                                                                    src={imgUrl}
                                                                    alt={speaker_name || 'speaker image'}
                                                                    width={72}
                                                                    height={72}
                                                                    style={{ borderRadius: '50%' }}
                                                                />
                                                            </DivTag>
                                                        )}
                                                        <DivTag className="speaker-meta">
                                                            {speaker_name && <PTag className="speaker-name fw-bold" dangerouslySetInnerHTML={{ __html: speaker_name }} />}
                                                            {(speaker_title || speaker_company) && (
                                                                <PTag className="speaker-title">
                                                                    {speaker_title}
                                                                    {speaker_title && speaker_company ? ', ' : ''}
                                                                    {speaker_company}
                                                                </PTag>
                                                            )}
                                                            {speaker_role_label && <PTag className="speaker-role text-muted">{speaker_role_label}</PTag>}
                                                        </DivTag>
                                                    </DivTag>
                                                )}
                                            </DivTag>
                                        )}
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
