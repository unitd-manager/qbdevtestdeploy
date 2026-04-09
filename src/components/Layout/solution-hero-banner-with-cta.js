'use client';
import { DivTag, H2Tag, H3Tag, PTag, SectionTag, SpanTag } from '../Common/HTMLTags';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from '../Common/Icons';

export default function SolutionHeroBannerCTA({ data }) {
    if (!data) return null;
    const {
        tagline,
        main_title,
        description,
        sub_description,
        background_image,
        buttons,
        background_color = "",
        class_name,
        id,
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
        <SectionTag className={`solution-hero-banner-with-cta ${class_name}`} style={{ background: background_color }} id={id} >
            <DivTag className="container">
                <DivTag className={`sub-section ${paddingClass}`} >
                    <DivTag className="row-group">
                    <DivTag className="row">
                        <DivTag className="col-md-12">
                            <DivTag className="image-wrapper">
                                {background_image?.url && (
                                    <DivTag className="img-div">
                                        <Image
                                            src={background_image.url}
                                            alt={background_image.alt || 'Image'}
                                            width={1170}
                                            height={480} className="img-fluid"
                                        />
                                    </DivTag>
                                )}
                                <DivTag className="hero-overlay">
                                      <DivTag className="hero-background"></DivTag>
                                    {tagline && <SpanTag className="category-badge" dangerouslySetInnerHTML={{ __html: tagline }} />}
                                    {main_title && <H2Tag className="hero-title" dangerouslySetInnerHTML={{ __html: main_title }} />}
                                </DivTag>
                            </DivTag>
                        </DivTag>
                    </DivTag>
                    <DivTag className="row">
                        <DivTag className="col-md-12">
                            <DivTag className="text-content">
                                {description && <DivTag className="hero-description" dangerouslySetInnerHTML={{ __html: description }} />}
                                {sub_description && <PTag className="hero-subtext" dangerouslySetInnerHTML={{ __html: sub_description }} />}
                                {buttons?.length > 0 && (
                                    <DivTag className="button-group">
                                        {buttons.map((button, index) => (
                                            <DivTag key={index} className="button">
                                                <Link
                                                    href={button.link.url}
                                                    className={`btn ${button.type}`}
                                                    target={button.link.target || "_self"}
                                                >
                                                    {button.link.title} <ArrowRight className="right-arrow-icon" />
                                                </Link>
                                            </DivTag>
                                        ))}
                                    </DivTag>
                                )}
                            </DivTag>
                        </DivTag>
                    </DivTag>
                    </DivTag>
                </DivTag>
            </DivTag>
        </SectionTag>
    );
}