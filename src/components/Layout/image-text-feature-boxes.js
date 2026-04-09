'use client';
import { useEffect, useRef, useState } from 'react';
import { SectionTag, DivTag, H2Tag, PTag, H5Tag } from '../Common/HTMLTags';
import Image from 'next/image';
export default function HealthcareAutomationSection({data}) {
    const sectionRef = useRef(null);
    const [animate, setAnimate] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setAnimate(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.3 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);
    if (!data) return null;
    const {
        main_title,
        description,
        image,
        features = [],
        id = '',
        class_name = '',
        padding
    } = data || {};
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
        <SectionTag
            ref={sectionRef}
            className="image-text-feature-boxes bottom-dashed top-dashed"
        >
            <DivTag className="container">
                <DivTag className={`sub-section ${paddingClass}`}>
                    <DivTag className="row custom-flex-row">
                        <DivTag className="left-column">
                            <DivTag className="img-div">
                                {image.url && (
                                    <Image
                                        src={image.url}
                                        alt={image.alt || 'Section image'}
                                        width={image.width || 701}
                                        height={image.height || 922}
                                        className="img-fluid"
                                    />
                                )}
                            </DivTag>
                            {main_title && <H2Tag className="section-title main-title" dangerouslySetInnerHTML={{ __html: main_title }} />}
                        </DivTag>

                        {/* Right Column */}
                        <DivTag className="right-column">
                            {description && <DivTag className="section-description" dangerouslySetInnerHTML={{ __html: description }} />}
                            { features?.length > 0 && 
                            features.map((item, index) => (
                            <DivTag
                                key={index}
                                className={`feature-box ${animate ? 'animate' : ''}`}
                            >
                                <DivTag className="step-title-wrapper">
                                    <DivTag className="icon-wrap">
                                        <DivTag className="img-div">
                                        <Image src={item.icon.url} alt={item.title} width={50} height={44} className='img-fluid'/>
                                        </DivTag>
                                    </DivTag>
                                    <H5Tag className="feature-title">{item.title}</H5Tag>
                                </DivTag>
                                <DivTag className="text-left">
                                    <PTag dangerouslySetInnerHTML={{ __html: item.description }} />
                                </DivTag>
                            </DivTag>
                            ))}
                        </DivTag>
                    </DivTag>
                </DivTag>
            </DivTag>
        </SectionTag>
    );
}
