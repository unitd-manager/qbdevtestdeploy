'use client';
import { useEffect, useRef, useState } from 'react';
import { DivTag, H2Tag, H3Tag, H4Tag, H5Tag, LITag, PTag, SectionTag, ULTag } from '../Common/HTMLTags';
import Link from 'next/link';
import { ArrowRight } from '../Common/Icons';
import Image from 'next/image';

export default function SectionsFeatureBlock({ data }) {

    if (!data) return null;
    const {
        main_title,
        description,
        highlighted_subtitle,
        highlighted_description,
        features,
        common_content,
        cta_button,
        background_color,
        id = '',
        class_name = '',
        padding
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
        <>

            <SectionTag className={`solutions-feature-block ${class_name}`} id={id} style={{ background: background_color }}>
                <DivTag className="container top-dashed">
                    <DivTag className={`sub-section ${paddingClass}`}>
                        {(main_title || description) && (
                            <DivTag className="row main-row">
                                <DivTag className="col-md-6">
                                    <DivTag className="heading-box">
                                        {main_title && <H2Tag dangerouslySetInnerHTML={{ __html: main_title }} />}
                                    </DivTag>
                                </DivTag>
                                <DivTag className="col-md-6">
                                    <DivTag className="content-box">
                                        {description && <DivTag dangerouslySetInnerHTML={{ __html: description }} />}

                                    </DivTag>
                                </DivTag>
                            </DivTag>
                        )}
                        <DivTag className="middle-section">
                        {(highlighted_subtitle || highlighted_description) && (
                            <DivTag className="row highlighted-row  bottom-dashed">
                                <DivTag className="col-md-12">
                                    {highlighted_subtitle && <DivTag className="highlighted-heading"> <H4Tag dangerouslySetInnerHTML={{ __html: highlighted_subtitle }} />  </DivTag>}
                                    {highlighted_description && <DivTag className="highlighted-desc" dangerouslySetInnerHTML={{ __html: highlighted_description }} />}
                                </DivTag>
                            </DivTag>
                        )}
                        {features && (
                            <DivTag className="row feature-row">
                                <DivTag className="col-md-7">
                                    {features.feature_title && <H5Tag className="feature-title" dangerouslySetInnerHTML={{ __html: features.feature_title }} />}
                                    {features.feature_list?.length > 0 && (
                                        <ULTag className="icon-list">
                                            {features.feature_list.map((item, index) => (
                                                <LITag key={index} className="list-with-icon"  ><DivTag dangerouslySetInnerHTML={{ __html: item.name }} /></LITag>
                                            ))}
                                        </ULTag>
                                    )}
                                </DivTag>
                                <DivTag className="col-md-5">
                                    {features.feature_image.url &&
                                        <DivTag className="img-div">
                                            <Image
                                                src={features.feature_image.url}
                                                alt={features.feature_image.alt || 'Section Image'}
                                                width={535}
                                                height={384}
                                                className='img-fluid'
                                            />
                                        </DivTag>
                                    }
                                </DivTag>
                            </DivTag>
                        )}
                        </DivTag>
                        {(common_content || cta_button) && (
                            <DivTag className="row common-content-row top-dashed bottom-dashed">
                                <DivTag className="col-md-12">
                                    <DivTag className="content-div">
                                        {common_content && <DivTag dangerouslySetInnerHTML={{ __html: common_content }} />}
                                        {cta_button?.url && (
                                            <Link
                                                href={cta_button.url}
                                                target={cta_button.target || '_self'}
                                                className="btn primary-btn"
                                            >
                                                {cta_button.title || 'Learn More'} <ArrowRight />
                                            </Link>
                                        )}
                                    </DivTag>
                                </DivTag>
                            </DivTag>
                        )}
                    </DivTag>
                </DivTag>
            </SectionTag>
        </>
    );
}
