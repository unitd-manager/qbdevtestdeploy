'use client';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { DivTag, H2Tag, H5Tag, PTag, SectionTag } from '../Common/HTMLTags';
import Image from 'next/image';

export default function WhyKognitosSection({ data }) {
    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });
    }, []);

    if (!data || typeof data !== 'object') return null;
    const {
        title,
        description,
        benefits = [],
        partner_logo,
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
        <SectionTag className={`why-kognitos-section ${class_name}`} id={id}>
            <DivTag className="container">
                <DivTag className={`sub-section ${paddingClass}`}>
                    <DivTag className="row">
                        <DivTag className="col-md-6">
                            <DivTag className="company-col">
                                {title && (
                                    <>
                                        <H2Tag className="title" dangerouslySetInnerHTML={{ __html: title }} />
                                    </>
                                )}
                                {description && <PTag className="description" dangerouslySetInnerHTML={{ __html: description }} />}
                                {benefits.length > 0 && (
                                    <DivTag className="company-ser-inner-list">
                                        {benefits.map((item, i) => (
                                            <DivTag
                                                className="company-list-item d-flex align-items-start"
                                                key={i}
                                                data-aos="fade-up" // <-- Added AOS animation
                                                data-aos-delay={i * 100} // <-- Staggered delay
                                            >
                                                {item.icon && (
                                                    <DivTag className="service-img-border" >
                                                        <Image
                                                            src={item.icon.url}
                                                            alt={item.icon.alt || 'Icon'}
                                                            width={65}
                                                            height={65}
                                                        />
                                                    </DivTag>
                                                )}
                                                {/* Text Right */}
                                                <div className="flex flex-col">
                                                    {item?.heading && (
                                                        <>
                                                            <H5Tag
                                                                className="font-semibold mb-1"
                                                                dangerouslySetInnerHTML={{ __html: item.heading }}
                                                            />
                                                            <DivTag className="service-border"> </DivTag>
                                                        </>
                                                    )}
                                                    {item?.description && (
                                                        <PTag
                                                            className="text-sm text-gray-600"
                                                            dangerouslySetInnerHTML={{ __html: item.description }}
                                                        />
                                                    )}
                                                </div>
                                            </DivTag>

                                        ))}
                                    </DivTag>
                                )}

                            </DivTag>
                        </DivTag>
                        <DivTag className="col-md-6">
                            {partner_logo?.url && (
                                <DivTag className="company-media">
                                    <Image
                                        src={partner_logo.url}
                                        alt={partner_logo.alt || 'company image'}
                                        width={1280}
                                        height={720}
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
