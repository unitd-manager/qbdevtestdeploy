'use client';
import { useEffect } from 'react';
import { DivTag, H2Tag, LITag, PTag, SectionTag, SpanTag, ULTag } from '../Common/HTMLTags';
import Image from 'next/image';
import { ArrowRight } from '../Common/Icons';

export default function HowitworksSection({ data }) {
    if (!data || typeof data !== 'object') return null;
    const {
        title,
        description,
        steps = [],
        image,
        background_color,
        padding = {},
        class_name,
        id
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
        <SectionTag className={`how-it-works-section ${class_name}`} id={id}  style={{ background: background_color }}>
            <DivTag className="container">
                <DivTag className={`sub-section ${paddingClass}`}>
                    <DivTag className="row">
                        <DivTag className="col-md-12">
                            {title && (
                                <>
                                    <H2Tag className="title" dangerouslySetInnerHTML={{ __html: title }} />
                                </>
                            )}
                        </DivTag>
                        <DivTag className="col-md-6">
                            <DivTag className="company-col">
                                {description && <DivTag className="description" dangerouslySetInnerHTML={{ __html: description }} />}
                                {steps.length > 0 && (
                                    <DivTag className="steps-item">
                                        {steps.map((item, i) => (
                                            <ULTag className="list-item" key={i}>
                                                {item?.heading && (
                                                    <DivTag className="list-row">
                                                        <SpanTag className="list-icon">
                                                            <ArrowRight className="arrow-icon" />
                                                        </SpanTag>
                                                        <LITag
                                                            className="list-text"
                                                            dangerouslySetInnerHTML={{ __html: item.heading }}
                                                        />
                                                    </DivTag>
                                                )}
                                            </ULTag>
                                        ))}
                                    </DivTag>
                                )}
                            </DivTag>
                        </DivTag>
                        <DivTag className="col-md-6">
                            {image?.url && (
                                <DivTag className="company-media">
                                    <Image
                                        src={image.url}
                                        alt={image.alt || 'company image'}
                                        width={768}
                                        height={544}
                                        className='img-fluid'
                                    />
                                </DivTag>
                            )}
                        </DivTag>
                    </DivTag>
                </DivTag>
            </DivTag>
        </SectionTag>
    );
}
