'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { SectionTag, DivTag, H2Tag, H4Tag, PTag, H3Tag } from '../Common/HTMLTags';
import BoxGrid from '../Common/BoxGrid';

export default function HiringProcessSteps({ data }) {
    if (!data || typeof data !== 'object') return null;

    const {
        main_title,
        description,
        steps = [],
        background_color,
        class_name = '',
        id = '',
        padding
    } = data;

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
        <SectionTag className={`hiring-process-steps-layout ${class_name}`} id={id} style={{ background: background_color }}>
            <BoxGrid position="left" />
            <BoxGrid position="right" />
            <DivTag className="container">
                <DivTag className={`sub-section ${paddingClass}`}>
                    <DivTag className="row">
                        <DivTag className="col-md-12">
                            <DivTag className="content-box">
                                {main_title && <H2Tag dangerouslySetInnerHTML={{ __html: main_title }} className="main-title" />}
                                {description && <DivTag dangerouslySetInnerHTML={{ __html: description }} />}
                            </DivTag>
                            {
                                                    steps.length > 0 && 
                            steps.map((item, i) => (
                                <DivTag className="step-item d-flex align-items-center" key={i}>
                                    {/* Column 1: Step Content */}
                                    <DivTag className="step-content flex-shrink-0">
                                        <H3Tag>
                                            <span className="step-number">{i + 1}.</span>{' '}
                                            <span dangerouslySetInnerHTML={{ __html: item.step_title }} />
                                        </H3Tag>
                                        <DivTag dangerouslySetInnerHTML={{ __html: item.step_description }} />
                                    </DivTag>

                                    {/* Column 2: Step Image */}
                                    {item?.step_image?.url && (
                                        <DivTag className="step-image flex-shrink-0">
                                            <Image
                                                src={item.step_image.url}
                                                alt={item.step_image.alt || `step-${i}`}
                                                width={444}
                                                height={216}

                                            />
                                        </DivTag>
                                    )}
                                </DivTag>
                            ))}
                        </DivTag>
                    </DivTag>
                </DivTag>
            </DivTag>
        </SectionTag>
    );
}
