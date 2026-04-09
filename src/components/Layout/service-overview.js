'use client';

import { useState } from 'react';
import Image from 'next/image';
import { DivTag, H3Tag, PTag, SectionTag } from '../Common/HTMLTags';
import { ArrowDown, ArrowRight, ArrowUp } from '../Common/Icons';
import Link from 'next/link';

export default function SolutionsOverview({ data }) {
 
    const [activeIndex, setActiveIndex] = useState(0);
  if (!data || typeof data !== 'object') return null;
   
    const toggleFAQ = (index) => {
        setActiveIndex(index === activeIndex ? null : index);
    };

    const {
        title,
        sub_title,
        description,
        image,
        image_position = 'right',
        overview_list,
        cta_button,
        class_name = '',
        id = '',
        padding
    } = data;
        let paddingClass = '';
    const isRight = image_position === 'right';
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
        <SectionTag className={`service-overview-section ${class_name}`} id={id} >
            <DivTag className={`container ${paddingClass}`} >
                <DivTag className="row">
                    <DivTag className="col-md-12">
                        <DivTag className='section-head'>
                            {title && <H3Tag className="title" dangerouslySetInnerHTML={{ __html: title }} />}
                            {sub_title && <DivTag className="sub-title" dangerouslySetInnerHTML={{ __html: sub_title }} />}
                        </DivTag>
                    </DivTag>
                </DivTag>
                <DivTag className={`feature-container d-flex flex-wrap ${isRight ? 'flex-row' : 'flex-row-reverse'
                    }`}>
                    <DivTag className="feature-left">

                        <DivTag className="accordion">
                            { overview_list.length > 0 &&
                            overview_list.map((feature, index) => (
                                <DivTag key={index} className={`accordion-item ${activeIndex === index ? 'active' : ''}`}>
                                    <button className="accordion-header" onClick={() => toggleFAQ(index)}>
                                        {feature.title}
                                        {activeIndex === index ? <ArrowUp /> : <ArrowDown />}
                                    </button>
                                    {activeIndex === index && (
                                        <DivTag className="accordion-content">
                                            <DivTag dangerouslySetInnerHTML={{ __html: feature.description }} />
                                        </DivTag>
                                    )}
                                </DivTag>
                            ))}
                        </DivTag>
                    </DivTag>

                    <DivTag className="feature-right">
                        <DivTag className="feature-sticky">
                            {image?.url && (
                            <Image
                                src={image.url}
                                alt={image.alt || 'Section Image'}
                                width={666}
                                height={433}
                                style={{ width: '100%' }}
                            /> )}
                        </DivTag>
                    </DivTag>
                </DivTag>
                {(description || cta_button?.url) && (
                <DivTag className="row align-items-center bottom-content">
                    <DivTag className="col-md-12">
                        {description && <DivTag className="common-content" dangerouslySetInnerHTML={{ __html: description }} />}
                        <DivTag className="text-center">
                            {cta_button?.url && (
                                <Link
                                    href={cta_button.url}
                                    target={cta_button.target || '_self'}
                                    className='btn primary-btn'
                                >
                                    {cta_button.title || 'Learn More'} <ArrowRight />
                                </Link>
                            )}
                        </DivTag>
                    </DivTag>
                </DivTag> )}
            </DivTag>
        </SectionTag>
    );
}
