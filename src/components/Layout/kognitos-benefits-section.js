'use client';
import DotGrid from '../Common/DotGrid';
import { DivTag, H2Tag, H3Tag, H5Tag, PTag, SectionTag, SpanTag } from '../Common/HTMLTags';
import Image from 'next/image';

export default function KognitosBenefitsSection({ data }) {
    if (!data || typeof data !== 'object') return null;
    const {
        title,
        benefits = [],
        image,
        padding = {},
        class_name,
        id
    } = data;
    console.log("benefits", benefits);
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
        <SectionTag className={`kognitos-benefits-section ${class_name}`} id={id}>
            <DivTag className="container">
                <DivTag className={`sub-section ${paddingClass}`}>
                    <DivTag className="row">
                        <DivTag className="col-md-6">
                            <DivTag className="">
                                {title && <H2Tag className="title" dangerouslySetInnerHTML={{ __html: title }} />}
                                {image?.url && (
                                    <DivTag className="our-company-media">
                                        <Image
                                            src={image.url}
                                            alt={image.alt || 'company image'}
                                            width={720}
                                            height={480}
                                            className='img-fluid'
                                        />
                                    </DivTag>
                                )}
                            </DivTag>
                        </DivTag>
                        <DivTag className="col-md-6">
                            {benefits.length > 0 && (
                                <DivTag className="company-ser-inner-list">
                                    {benefits.map((item, i) => (
                                        <DivTag className="company-list-item d-flex align-items-start" key={i}>
                                            {/* Icon Left */}
                                            {/* {item?.icon?.url && (
                                                <Image
                                                    src={item.icon.url}
                                                    alt={item.icon.alt || 'icon'}
                                                    width={50}
                                                    height={50}
                                                    className=""
                                                />
                                            )} */}
                                            {item.icon && (
                                                <DivTag className="flex-shrink-0">
                                                    <SpanTag dangerouslySetInnerHTML={{ __html: item.icon }} />
                                                </DivTag>
                                            )}

                                            {/* Text Right */}
                                            <div className="flex flex-col">
                                                {item?.heading && (
                                                    <H5Tag
                                                        className="font-semibold mb-1"
                                                        dangerouslySetInnerHTML={{ __html: item.heading }}
                                                    />
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
                </DivTag>
            </DivTag>
        </SectionTag>

    );
}