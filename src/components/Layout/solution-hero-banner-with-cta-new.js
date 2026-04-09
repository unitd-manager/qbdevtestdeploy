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
        background_color = "#FFFFFF",
        class_name,
        id,
        padding,
        enable_embossed_design = true,
        accent_color = "#FF7705",
    } = data;

    let paddingClass = '';
    if (padding?.padding_options && padding.padding_options === true) {
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

    const embossedClass = enable_embossed_design ? 'embossed-design' : '';

    return (
        <SectionTag 
            className={`solution-hero-banner-with-cta ${class_name} ${embossedClass}`} 
            style={{ 
                background: background_color,
                '--accent-color': accent_color,
            }} 
            id={id}
        >
            <DivTag className="container">
                <DivTag className={`sub-section ${paddingClass}`}>
                    <DivTag className="cta-content-wrapper">
                        {/* Left Content Section */}
                        <DivTag className="cta-left-section">
                            {/* Header with badge and title */}
                            <DivTag className="cta-header">
                                {tagline && (
                                    <SpanTag 
                                        className="embossed-badge" 
                                        dangerouslySetInnerHTML={{ __html: tagline }} 
                                    />
                                )}
                                {main_title && (
                                    <H2Tag 
                                        className="cta-main-title" 
                                        dangerouslySetInnerHTML={{ __html: main_title }} 
                                    />
                                )}
                            </DivTag>

                            {/* Description Section */}
                            {(description || sub_description) && (
                                <DivTag className="cta-description-section">
                                    {description && (
                                        <DivTag 
                                            className="cta-description" 
                                            dangerouslySetInnerHTML={{ __html: description }} 
                                        />
                                    )}
                                    {sub_description && (
                                        <PTag 
                                            className="cta-subtext" 
                                            dangerouslySetInnerHTML={{ __html: sub_description }} 
                                        />
                                    )}
                                </DivTag>
                            )}

                            {/* Premium Buttons */}
                            {buttons?.length > 0 && (
                                <DivTag className="embossed-button-group">
                                    {buttons.map((button, index) => (
                                        <DivTag key={index} className={`button-wrapper ${button.type || 'primary'}`}>
                                            <Link
                                                href={button.link.url}
                                                className={`btn btn-embossed ${button.type || 'primary'}`}
                                                target={button.link.target || "_self"}
                                                title={button.link.title}
                                            >
                                                <SpanTag className="btn-text">
                                                    {button.link.title} 
                                                </SpanTag>
                                                <ArrowRight className="right-arrow-icon" />
                                            </Link>
                                        </DivTag>
                                    ))}
                                </DivTag>
                            )}
                        </DivTag>

                        {/* Right Image Section */}
                        {background_image?.url && (
                            <DivTag className="cta-right-section">
                                <DivTag className="embossed-image">
                                    <DivTag className="image-overlay-effect"></DivTag>
                                    <Image
                                        src={background_image.url}
                                        alt={background_image.alt || 'Get Started'}
                                        width={600}
                                        height={500}
                                        className="img-fluid cta-image"
                                        priority={false}
                                        loading="lazy"
                                    />
                                </DivTag>
                            </DivTag>
                        )}
                    </DivTag>
                </DivTag>
            </DivTag>
        </SectionTag>
    );
}