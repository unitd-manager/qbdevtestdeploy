'use client';
import Link from 'next/link';
import { DivTag, H3Tag, SectionTag } from '../Common/HTMLTags';
import Image from 'next/image';
import { ArrowRight } from '../Common/Icons';
export default function ContentImageSplit({ data }) {

    if (!data) return null;
    const {
        image_position = 'right',
        main_title,
        description,
        image,
        cta_button,
        background_color = '',
        id = '',
        class_name = '',
        padding = {}
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
        <SectionTag className={`content-image-split-section ${class_name}`} id={id} >
            <DivTag className="container" style={{ background: background_color }}>
                <DivTag className={`sub-section ${paddingClass}`}>
                    <DivTag className={`row align-items-center ${image_position === 'right' ? 'flex-row-reverse right-col' : 'left-col'}`} >
                        <DivTag className="col-md-6 cols">
                            {image.url && (
                                <DivTag className="img-wrapper">
                                    <Image
                                        src={image.url}
                                        alt={image.alt}
                                        width={530}
                                        height={350}
                                        className="img-fluid"
                                    />
                                </DivTag>
                            )}
                        </DivTag>
                        <DivTag className="col-md-6 cols text-left d-flex align-items-center">
                            <DivTag className="content-box">
                                {main_title && <H3Tag className="main-title" dangerouslySetInnerHTML={{ __html: main_title }} />}
                                {description && <DivTag dangerouslySetInnerHTML={{ __html: description }} />}
                                {cta_button?.url && (
                                    <Link href={cta_button?.url} className="btn primary-btn" target={cta_button.target || '_self'}>
                                        {cta_button?.title} <ArrowRight className="right-arrow-icon" />
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
