'use client';
import { DivTag, H2Tag, H3Tag, PTag, SectionTag } from '../Common/HTMLTags';
import Link from 'next/link';
import { ArrowRight } from '../Common/Icons';
import BoxGrid from '../Common/BoxGrid';

export default function CommonHeadingSection({ data }) {
    if (!data || typeof data !== 'object') return null;
    const {
        display_options = [],
        title,
        description,
        cta_button,
        padding
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
    const showTitle = display_options.includes('title');
    const showDescription = display_options.includes('description');
    const showCTA = display_options.includes('cta_button');
    return (
        <SectionTag className="common-heading-section common-border">
            <DivTag className="container slanted-slash ">
                <DivTag className={`sub-section ${paddingClass}`}>
                    <DivTag className="row">
                        <DivTag className="common-cta">
                            {showTitle && title && <H3Tag dangerouslySetInnerHTML={{ __html: title }} />}
                            {showDescription && description && <DivTag className="desc" dangerouslySetInnerHTML={{ __html: description }} />}
                            {showCTA && cta_button?.url && (
                                <Link href={cta_button.url}
                                    target={cta_button.target || '_self'} className="btn secondary-btn">
                                    {cta_button.title || 'Learn More'} <ArrowRight className="right-arrow-icon" />
                                </Link>
                            )}
                        </DivTag>
                    </DivTag>
                </DivTag>
            </DivTag>
        </SectionTag>
    );
}