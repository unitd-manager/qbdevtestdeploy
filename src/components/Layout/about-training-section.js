'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { SectionTag, DivTag, H3Tag, PTag, ATag, H5Tag, H2Tag, H4Tag } from '../Common/HTMLTags';
import { ArrowRight } from '../Common/Icons';
import BoxGrid from '../Common/BoxGrid';

export default function AbouTraining({ data }) {
    if (!data || typeof data !== 'object') return null;
    const {
        title,
        description,
        class_name = '',
        id = '',
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
        <SectionTag className={`about-training-section ${class_name}`} id={id} >
             <BoxGrid position="left" />
              <BoxGrid position="right" />
            <DivTag className="container">
                <DivTag className={`sub-section ${paddingClass}`}>
                    <DivTag className="row">
                        <DivTag className="col-md-5">
                            <DivTag className="heading-box">
                                {title && <H2Tag dangerouslySetInnerHTML={{ __html: title }} className="main-title" />}
                            </DivTag>
                        </DivTag>
                        <DivTag className="col-md-7">
                            <DivTag className="content-box">
                                {description && <DivTag dangerouslySetInnerHTML={{ __html: description }} />}
                            </DivTag>
                        </DivTag>
                    </DivTag>
                </DivTag>
            </DivTag>
        </SectionTag>
    );
}
