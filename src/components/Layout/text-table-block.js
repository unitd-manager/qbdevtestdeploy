'use client';
import { useEffect, useRef } from 'react';
import { DivTag, H2Tag, PTag, SectionTag } from '../Common/HTMLTags';
import DotGrid from '../Common/DotGrid';

export default function TextTableBlock({ data }) {
    const listRef = useRef(null);
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


    if (!data || !data.table?.table_row?.length) return null;

    const title = data.main_title;
    const description = data.description;
    const padding = data.padding || {};

    const rows = data.table.table_row;

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
        <SectionTag className="text-table-block-section">
             <DotGrid className="right-grid" />   <DotGrid className="left-grid" />
            <DivTag className="container">
                <DivTag className={`sub-section ${paddingClass}`} ref={parentRef}>
                    <DivTag className="row">


                        {title && <H2Tag className="text-center" dangerouslySetInnerHTML={{ __html: title }} />}
                        {description && <DivTag className="table-desc text-center" dangerouslySetInnerHTML={{ __html: description }} />}
                        <DivTag className="table-wrapper table-responsive">
                            <table className="comparison-table">
                                <tbody>
                                    {rows.map((row, rowIndex) => {
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
                        </DivTag>  </DivTag>
                </DivTag>
            </DivTag>
        </SectionTag>
    );
}
