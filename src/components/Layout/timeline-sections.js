'use client';
import Link from 'next/link';
import { DivTag, H2Tag, H4Tag, H5Tag, PTag, SectionTag } from '../Common/HTMLTags';
import Image from 'next/image';
import ChartFromWP from '../Common/Chart';

export default function TimelineSections({ data }) {
    if (!data || typeof data !== 'object') return null;

    const {
        main_title,
        sub_title,
        description,
        timelines = [],
        cta_button,
        class_name,
        id,
        padding = {}
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
        <SectionTag className={`timeline-section ${class_name}`} id={id}>
            <DivTag className="container">
                <DivTag className={`sub-section ${paddingClass}`}>
                    {/* Section Header */}
                    <DivTag className="main-content text-center">
                        {main_title && <H2Tag className="main-title" dangerouslySetInnerHTML={{ __html: main_title }} />}
                        {sub_title && <H4Tag className="sub-title" dangerouslySetInnerHTML={{ __html: sub_title }} />}
                        {description && <DivTag dangerouslySetInnerHTML={{ __html: description }} />}
                    </DivTag>

                    {/* Timeline Wrapper with spine */}
                    <DivTag className="timeline-wrapper">
                        {timelines.map((item, index) => {
                            const isEven = index % 2 === 0;
                            const uniqueChartId = `chart-${id}-${index}`;

                            // Render visual content (image or chart)
                            const visualContent = item.chart ? (
                                <ChartFromWP html={item.chart} uniqueId={uniqueChartId} />
                            ) : item.image?.url ? (
                                <DivTag className="timeline-img">
                                <Image
                                    src={item.image.url}
                                    alt={item.image.alt || "Timeline image"}
                                    width={450}
                                    height={290}
                                 
                                />
                                </DivTag>
                            ) : null;

                            // Render text content
                            const textContent = (
                                <>
                                    {item.title && <H5Tag className="timeline-title" dangerouslySetInnerHTML={{ __html: item.title }} />}
                                    {item.description && <DivTag dangerouslySetInnerHTML={{ __html: item.description }} />}
                                </>
                            );

                            return (
                                <DivTag className="row timeline-row align-items-center" key={index}>
                                    {/* Left Column */}
                                    <DivTag className={`col-md-6 timeline-col ${isEven ? "" : ""}`}>
                                        {isEven ? textContent : visualContent}
                                    </DivTag>

                                    {/* Right Column */}
                                    <DivTag className="col-md-6 timeline-col">
                                        {isEven ? visualContent : textContent}
                                    </DivTag>
                                </DivTag>
                            );
                        })}
                        {cta_button && (
                            <DivTag className="timeline-cta">
                                <Link href={cta_button.url} target={cta_button.target || '_self'} className='btn primary-btn'>
                                    {cta_button.title || 'Learn More'}
                                </Link>
                            </DivTag>
                        )}
                    </DivTag>
                </DivTag>
            </DivTag>
        </SectionTag>
    );
}