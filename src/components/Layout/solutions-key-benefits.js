'use client';

import { useState } from 'react';
import Image from 'next/image';
import { DivTag, H3Tag, PTag, SectionTag } from '../Common/HTMLTags';
import { ArrowDown, ArrowUp } from '../Common/Icons';
import Link from 'next/link';

export default function SolutionsKeyBenefits({ data }) {
 
    const [activeIndex, setActiveIndex] = useState(0);
  if (!data || typeof data !== 'object') return null;
   
    const toggleFAQ = (index) => {
        setActiveIndex(index === activeIndex ? null : index);
    };

    const {
        main_title,
        description,
        image,
        image_position = 'right',
        benefits,
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
            <DivTag className={`container-fluid ${paddingClass}`} >
                <DivTag className={`row '
                    }`}>
                        <DivTag className="col-md-4 p-0">
                            <DivTag className="">
                                <DivTag className="benefit-img">
                                    {image?.url && (
                                    <Image
                                        src={image.url}
                                        alt={image.alt || 'Section Image'}
                                        width={715}
                                        height={813}
                                        style={{ width: '100%' }}
                                    /> )}
                                </DivTag>
                            </DivTag>
                        </DivTag>
                    <DivTag className="col-md-8 solutions-benefits-bg">
                        <DivTag className="solutions-benefits-info">
                            <DivTag className=''>
                                {main_title && <H3Tag className="benefits-title" dangerouslySetInnerHTML={{ __html: main_title }} />}                            
                            </DivTag>
                            <DivTag className="">
                                {description && <DivTag className="benefits-content" dangerouslySetInnerHTML={{ __html: description }} />}                            
                            </DivTag>
                            <DivTag className="feature-left">
                                <DivTag className="accordion accordion-benifits">
                                    { benefits.length > 0 &&
                                    benefits.map((feature, index) => (
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
                            <DivTag className="text-left">
                                {cta_button?.url && (
                                    <Link href={cta_button.url} target={cta_button.target || '_self'} className='btn primary-btn'>
                                        {cta_button.title || 'Learn More'}
                                    </Link>
                                    )}
                            </DivTag>
                        </DivTag>
                    </DivTag>
                </DivTag>
            </DivTag>
        </SectionTag>
    );
}
