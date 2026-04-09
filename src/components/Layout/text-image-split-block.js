'use client';
import Image from 'next/image';
import { DivTag, H2Tag, SectionTag } from '../Common/HTMLTags';

export default function TextImageSplitBlock({ data }) {
    if (!data) return null;
    const {
        title,
        image,
        padding,
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
        <>
            <SectionTag className='text-image-split-block-section'>
                <DivTag className="container">
                    <DivTag className={`sub-section ${paddingClass}`}>
                        <DivTag className="row banner-content-box-row">
                            <DivTag className="col">
                                <DivTag className="banner-content-box">
                                    {title && (
                                        <H2Tag dangerouslySetInnerHTML={{ __html: title }} />
                                    )}
                                </DivTag>
                            </DivTag>
                            <DivTag className="col">
                                {image?.url && (
                                    <DivTag className="img-div">
                                        <Image
                                            src={image.url}
                                            alt={image.alt || 'Image'}
                                            width={675}
                                            height={240}
                                        />
                                    </DivTag>
                                )}
                            </DivTag>
                        </DivTag>
                    </DivTag>
                </DivTag>
            </SectionTag>
        </>
    )
}
