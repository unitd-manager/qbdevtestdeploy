'use client';

import { SectionTag, DivTag, H3Tag, PTag, ATag, H2Tag, H5Tag } from '../Common/HTMLTags';
import Image from 'next/image';
import DotGrid from '../Common/DotGrid';
export default function AboutHighlights({ data }) {
    if (!data || typeof data !== 'object') return null;

    const {
        title,
        sub_title,
        description,
        image,
        text_alignment,
        image_position = 'right',
        class_name = '',
        enable_animation = 'true',
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
    const isRight = image_position === 'right';
    return (
        <SectionTag className={`acf-section feature-highlight-block  ${isRight ? 'feature-highlight-block-right' : 'feature-highlight-block-left'} ${class_name}`} id={id}>
         
            <DivTag className="container">
                <DivTag className={`sub-section ${paddingClass}`}>
                    <DivTag className={`row align-items-center`}>
                           {enable_animation == 'true' && (isRight ? <DotGrid className="left-grid" /> : <DotGrid className="right-grid" />)}
                        {image?.url && (
                            <DivTag className="col-md-12">
                                <DivTag className={`img-content d-flex ${isRight ? 'flex-row-reverse' : ''}`}>
                                <DivTag className="img-col">    
                                <DivTag className="img-wrapper">
                                    <Image
                                        src={image.url}
                                        alt={image.alt}
                                        width={337}
                                        height={90}
                                        className='img-fluid'
                                    />
                                </DivTag>
                                </DivTag>
                                <DivTag className={`content-box text-${text_alignment}`}>
                                    {title && <H2Tag className="main-title" dangerouslySetInnerHTML={{ __html: title }} />}
                                    {sub_title && <H5Tag className="sub-title" dangerouslySetInnerHTML={{ __html: sub_title }} />}
                                    {description && <DivTag dangerouslySetInnerHTML={{ __html: description }} />}
                                </DivTag>
                            </DivTag>
                            </DivTag>
                        )}
                    </DivTag>
                </DivTag>
            </DivTag>
        </SectionTag>
    );
}
