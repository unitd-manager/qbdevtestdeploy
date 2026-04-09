'use client';

import { useEffect, useRef, useState } from 'react';
import { DivTag, H3Tag, PTag, SectionTag, ATag, H2Tag, ULTag, LITag } from '../Common/HTMLTags';
import Image from 'next/image';
import DotGrid from '../Common/DotGrid';
import Link from 'next/link';
import BoxGrid from '../Common/BoxGrid';

export default function PartnerHighlightSection({ data }) {
    if (!data) return null;

    const getVerticalAlignClass = (val) => {
        switch (val) {
            case 'top':
                return 'start';
            case 'middle':
                return 'center';
            case 'bottom':
            default:
                return 'end';
        }
    };

    const {
        display_options,
        image_position = 'right',
        vertical_align = 'center',
        text_alignment = 'left',
        main_title,
        sub_title,
        description,
        cta_button,
        partner_highlights,
        image,
        id = '',
        class_name = '',
        padding
    } = data || {};

    const verticalAlignClass = getVerticalAlignClass(vertical_align);
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
    const showTitle = display_options.includes('main_title');
    const showSubTitle = display_options.includes('sub_title');
    const showDescription = display_options.includes('description');
    const showImage = display_options.includes('image');
    const showHighlights = display_options.includes('partner_highlights');
    const showCTA = display_options.includes('cta_button');


    const renderImage = () => {
        if (!image?.url) return null;

        return (
            <DivTag className={`col-md-5 img-col`} >
                {showImage && (
                    <DivTag className={`img-wrapper`} >

                        <Image
                            src={image.url}
                            alt={image.alt || 'Section image'}
                            width={image.width || 517}
                            height={image.height || 149}
                            className="img-fluid"
                        />
                    </DivTag>
                )}
            </DivTag>
        );
    };

    const renderText = () => (
        <DivTag className={`col-md-7 text-${text_alignment}`}>
            <DivTag className="content-box">
                <DivTag className="section-head">
                    {showTitle && main_title && <H2Tag className="title" dangerouslySetInnerHTML={{ __html: main_title }} />}
                    {showSubTitle && sub_title && <H2Tag className="sub-title" dangerouslySetInnerHTML={{ __html: sub_title }} />}
                </DivTag>
                {showDescription && description && <DivTag dangerouslySetInnerHTML={{ __html: description }} />}
                {partner_highlights && partner_highlights.length > 0 && (
                    <ULTag className="highlight-list">
                        {partner_highlights.map((item, index) => (
                            <LITag key={index}>{item.name}</LITag>
                        ))}
                    </ULTag>
                )}
                {showCTA && cta_button?.url && (
                    <Link
                        href={cta_button.url}
                        target={cta_button.target || '_self'}
                        className="btn primary-btn"
                    >
                        {cta_button.title || 'Learn More'}
                    </Link>
                )}
            </DivTag>
        </DivTag>
    );

    return (
        <SectionTag className={`acf-section partner-hightlight-section ${class_name}`} id={id}>
            <BoxGrid position="right" />
            <BoxGrid position="left" />
            <DivTag className="container">
                <DivTag className={`sub-section ${paddingClass}`}>
                    <DivTag
                        className={`row align-items-${verticalAlignClass} ${image_position === 'right' ? 'flex-row-reverse' : ''
                            }`}
                    >
                        {renderImage()}
                        {renderText()}
                    </DivTag>
                </DivTag>
            </DivTag>
        </SectionTag>
    );
}
