'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { SectionTag, DivTag, H3Tag, PTag, ATag, H5Tag, H2Tag, H4Tag } from '../Common/HTMLTags';
import Image from 'next/image';
import { ArrowRight } from '../Common/Icons';

export default function InfoCTABoxLayout({ data }) {
    const listRef = useRef(null);
    const parentRef = useRef(null);
    
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    listRef.current?.classList.add('animate-border');
                    parentRef.current?.classList.add('animate-border');
                }
            },
            { threshold: 0.5 }
        );

        if (listRef.current) observer.observe(listRef.current);
        if (parentRef.current) observer.observe(parentRef.current);
        return () => observer.disconnect();
    }, []);

    if (!data || typeof data !== 'object') return null;
    const {
        display_options = [],
        main_title,
        sub_title,
        description,
        cta_button,
        class_name = '',
        id='',
        padding
    } = data;

    const showTitle = display_options.includes('main_title');
    const showSubTitle = display_options.includes('sub_title');
    const showDescription = display_options.includes('description');
    const showCTA = display_options.includes('cta_button');
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
        <SectionTag className={`info-cta-box-section ${class_name}`} id={id} >
            <DivTag className="container">
                <DivTag className={`sub-section ${paddingClass}`}>
                    <DivTag className="row">
                        <DivTag className="col-md-12">
                            <DivTag className="content-box">
                                {showTitle && main_title && <H2Tag dangerouslySetInnerHTML={{ __html: main_title }} className="main-title" />}
                                {showDescription && description && <DivTag dangerouslySetInnerHTML={{ __html: description }} />}
                                {showSubTitle && sub_title && <DivTag className="sub-title" dangerouslySetInnerHTML={{ __html: sub_title }} />}
                                {showCTA && cta_button?.url && (
                                    <DivTag className="text-center">
                                        <ATag
                                            href={cta_button.url}
                                            target={cta_button.target || '_self'}
                                            className="btn primary-btn"
                                        >
                                            {cta_button.title || 'Learn More'} <ArrowRight />
                                        </ATag>
                                    </DivTag>
                                )}
                            </DivTag>
                        </DivTag>
                    </DivTag>
                </DivTag>
            </DivTag>
        </SectionTag>
    );
}
