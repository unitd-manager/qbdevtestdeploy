'use client';
import { DivTag, H3Tag, SectionTag } from '../Common/HTMLTags';
import Image from 'next/image';

export default function AboutAwardsSection({ data }) {
    if (!data || typeof data !== 'object') return null;
    const {
        title,
        awards = [],
        certifications = [],
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

        <SectionTag className={`about-awards-info ${class_name}`}  id={id}>
            <DivTag className="container">
                <DivTag className={`sub-section ${paddingClass}`}>
                    <DivTag className="row about-awards-box-row">
                        <DivTag className="about-awards-top">
                            <DivTag className="awards-left-content">
                                {title && <H3Tag className="tagName" dangerouslySetInnerHTML={{ __html: title }} />}
                            </DivTag>
                            {awards.length > 0 && (
                                <DivTag className="awards-media">
                                    {awards.map((item, i) =>
                                        item?.image?.url ? (
                                            <Image
                                                key={i}
                                                src={item.image.url}
                                                alt={item.image.alt || `award-${i}`}
                                                width={213}
                                                height={218}
                                            />
                                        ) : null
                                    )}
                                </DivTag>
                            )}
                        </DivTag>

                        {certifications.length > 0 && (
                            <DivTag className="about-awards-medialist">
                                {certifications.map((item, i) =>
                                    item?.image?.url ? (
                                        <DivTag className="ab-certified-item" key={i}>
                                            <Image
                                                src={item.image.url}
                                                alt={item.image.alt || `certification-${i}`}
                                                width={241}
                                                height={241}
                                            />
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