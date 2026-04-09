'use client';
import DotGrid from '../Common/DotGrid';
import { DivTag, H3Tag, SectionTag } from '../Common/HTMLTags';
import Image from 'next/image';

export default function AboutPartnerSection({ data }) {
    if (!data || typeof data !== 'object') return null;
    const {
        title,
        description,
        logo,
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
        <SectionTag className={`cr-partner-info ${class_name}`} id={id}>
            <DotGrid className="left-grid" />
            <DivTag className="container-fluid">
                <DivTag className={`sub-section ${paddingClass}`}>
                    <DivTag className="row cr-partner-box-row">
                        <DivTag className="col-md-6">
                            <DivTag className="partner-info-desc">
                                {
                                    logo.url && (
                                        <Image
                                            src={logo.url}
                                            alt={logo.alt}
                                            width={425}
                                            height={81}
                                        />
                                    )
                                }
                                {title && <H3Tag className="tagName" dangerouslySetInnerHTML={{ __html: title }} />}
                                {description && <DivTag className="" dangerouslySetInnerHTML={{ __html: description }} />}
                            </DivTag>
                        </DivTag>
                        <DivTag className="col-md-6 pe-md-0">
                            <DivTag className="cr-media-info">
                                {
                                    image.url && (
                                        <Image
                                            src={image.url}
                                            alt={image.alt}
                                            width={957}
                                            height={400}
                                        />)
                                }
                            </DivTag>
                        </DivTag>
                    </DivTag>
                </DivTag>
            </DivTag>
        </SectionTag>
    );
}