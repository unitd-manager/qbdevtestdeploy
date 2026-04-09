'use client';
import DotGrid from '../Common/DotGrid';
import { DivTag, H3Tag, H5Tag, SectionTag } from '../Common/HTMLTags';
import Image from 'next/image';

export default function AboutCompanySection({ data }) {
    if (!data || typeof data !== 'object') return null;
    const {
        title,
        description,
        ethos_items = [],
        image,
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
        <SectionTag className={`our-company-info-detail ${class_name}`} id={id}>
            <DotGrid className="left-grid" />
            <DivTag className="container">
                            <DivTag className={`sub-section ${paddingClass}`}>
                <DivTag className="row">
                    {/* Left Content */}
                    <DivTag className="col-md-6">
                        <DivTag className="company-main-desc">
                            {title && <H3Tag className="main-title" dangerouslySetInnerHTML={{ __html: title }} />}
                            {description && <DivTag dangerouslySetInnerHTML={{ __html: description }} />}
                        </DivTag>
                        {ethos_items.length > 0 && (
                            <DivTag className="company-ser-inner-list">
                                {ethos_items.map((item, i) => (
                                    <DivTag className="company-list-itmes" key={i}>
                                        {item?.icon?.url && (
                                            <Image
                                                src={item.icon.url}
                                                alt={item.icon.alt || 'ethos icon'}
                                                width={48}
                                                height={48}
                                            />
                                        )}
                                        {item?.title && <H5Tag dangerouslySetInnerHTML={{ __html: item.title }} />}
                                        {item?.description && (
                                            <H5Tag dangerouslySetInnerHTML={{ __html: item.description }} />
                                        )}
                                    </DivTag>
                                ))}
                            </DivTag>
                        )}
                    </DivTag>
                    <DivTag className="col-md-6 pe-md-0">
                        {image?.url && (
                            <DivTag className="our-company-media">
                                <Image
                                    src={image.url}
                                    alt={image.alt || 'company image'}
                                    width={746}
                                    height={806}
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