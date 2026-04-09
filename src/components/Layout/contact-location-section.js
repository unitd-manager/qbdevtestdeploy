'use client';
import DotGrid from '../Common/DotGrid';
import { DivTag, H2Tag, H3Tag, SectionTag } from '../Common/HTMLTags';
import Image from 'next/image';

export default function ContactLocationSection({ data }) {
    if (!data || typeof data !== 'object') return null;
    const {
        title,
        locations = [],
        padding = {},
        class_name = '',
        id = ''
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
        <SectionTag className={`about-location-section contact-location-section ${class_name}`} id={id}>
            <DotGrid className="left-grid" />
            <DotGrid className="right-grid" />
            <DivTag className="container">
                <DivTag className={`sub-section ${paddingClass}`}>
                    <DivTag className="row">
                        <DivTag className="content">
                            {title && (
                                <H2Tag
                                    className="main-title"
                                    dangerouslySetInnerHTML={{ __html: title }}
                                />
                            )}
                        </DivTag>
                        {locations.length > 0 && (
                            <DivTag className="locations">
                                {locations.map((item, i) =>
                                    item?.image?.url ? (
                                        <DivTag className="location-box" key={i}>
                                            <Image
                                                src={item.image.url}
                                                alt={item.image.alt || `location-${i}`}
                                                width={415}
                                                height={275}
                                                className="location-img"
                                            />
                                            {item.name && <span className="label">{item.name}</span>}
                                        </DivTag>
                                    ) : null
                                )}
                            </DivTag>
                        )}
                    </DivTag>
                </DivTag>
            </DivTag>
        </SectionTag>
    );
}
