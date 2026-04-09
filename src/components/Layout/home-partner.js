'use client';

import { useEffect, useRef } from 'react';
import { DivTag, H3Tag, LITag, PTag, SectionTag, SpanTag, ULTag } from '../Common/HTMLTags';
import Link from 'next/link';
import Image from 'next/image';
import SectionDivider from '../Common/SectionDivider';

export default function PartnerSection({ data }) {

    if (!data || typeof data !== 'object') return null;
    const {
        workflow_list,
        image,
        main_title,
        sub_title,
        button,
        description,
        class_name,
        id,
        padding
    } = data;

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
        <>
            <SectionDivider />
            <SectionTag className={`our-partner-info ${class_name}`} id={id}>
                <DivTag className="sub-section">
                    <DivTag className="container our-partner-cont">
                        <DivTag className={`sub-container ${paddingClass}`}>
                            <DivTag className="row">
                                <DivTag className="col-md-6 p-md-0">
                                    <DivTag className='our-partner-left-logo'>
                                        {image?.url && (
                                            <DivTag className='partner-media'>
                                                <Image src={image?.url || ''} alt={main_title || ''} width={300} height={98} className='img-fluid' />
                                            </DivTag>
                                        )}
                                    </DivTag>
                                </DivTag>
                                <DivTag className="col-md-6 p-md-0">
                                    <DivTag className="partner-list-info">
                                        {main_title && (
                                            <H3Tag
                                                dangerouslySetInnerHTML={{ __html: main_title }}
                                            />
                                        )}
                                        {sub_title && (
                                            <PTag dangerouslySetInnerHTML={{ __html: sub_title }} />
                                        )}
                                        {description && (
                                            <DivTag className="desc" dangerouslySetInnerHTML={{ __html: description }} />
                                        )}
                                        {workflow_list && workflow_list.length > 0 && (
                                            <ULTag className="work-list">
                                                {workflow_list.map((item, index) => (
                                                    <LITag key={index}>{item.name}</LITag>
                                                ))}
                                            </ULTag>
                                        )}
                                        {button?.url && (
                                            <Link href={button.url} className='btn primary-btn cat-knowmore'>
                                                {button.title}
                                                <SpanTag>
                                                    <svg viewBox="0 0 17 17" width="1em" height="1em" fill="none" className="right-arrow-icon" target={button.target || "_self"}>
                                                        <path d="M6.5 12.5333L10.5 8.53333L6.5 4.53332" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </SpanTag>
                                            </Link>
                                        )}
                                    </DivTag>
                                </DivTag>
                            </DivTag>
                        </DivTag>
                    </DivTag>
                </DivTag>
            </SectionTag>

        </>
    );
}
