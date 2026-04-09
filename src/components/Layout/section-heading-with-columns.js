'use client';
import { DivTag, SectionTag } from '../Common/HTMLTags';
import Link from 'next/link';
import { ArrowRight } from '../Common/Icons';
import React from 'react';

export default function HeadingColumns({ data }) {
    if (!data) return null;

    const {
        heading_text,
        heading_tag = 'h2',
        heading_column = 'col-md-6',
        heading_position,
        description,
        description_column = 'col-md-6',
        background_color,
        cta_button,
        id = '',
        class_name = '',
        padding = {}
    } = data || {};

    let paddingClass = '';
    if (padding?.padding_options) {
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

    const isRight = heading_position === 'right';

    return (
        <SectionTag
            className={`section-heading-with-columns ${class_name}`}
            id={id}
            style={{ background: background_color }}
        >
            <DivTag className="container">
                <DivTag className={`sub-section ${paddingClass}`}>
                    <DivTag className={`row align-items-center ${isRight ? 'flex-row-reverse' : ''}`}>
                        <DivTag className={heading_column}>
                            <DivTag className="heading-box">
                                {heading_text &&
                                    React.createElement(heading_tag, {
                                        dangerouslySetInnerHTML: { __html: heading_text }
                                    })}
                            </DivTag>
                        </DivTag>
                        <DivTag className={description_column}>
                            <DivTag className="content-box">
                                {description && (
                                    <DivTag
                                        className="desc"
                                        dangerouslySetInnerHTML={{ __html: description }}
                                    />
                                )}
                            </DivTag>
                        </DivTag>
                    </DivTag>
                    <DivTag className="row">
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