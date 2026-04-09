'use client';
import { useEffect, useRef, useState } from 'react';
import { DivTag, H3Tag, PTag, SectionTag, ATag, H4Tag, H5Tag, ULTag, LITag } from '../Common/HTMLTags';
import Image from 'next/image';
import Link from 'next/link';
import DotGrid from '../Common/DotGrid';
import { ArrowRight } from '../Common/Icons';

export default function ImageKeyPoints({ data }) {

    const sectionRef = useRef(null);
    const rowRef = useRef(null);
 
    useEffect(() => {
        const currentSection = sectionRef.current;
        
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    rowRef.current?.classList.add('animate-border');
                    observer.disconnect();
                }
            },
            { threshold: 0.5 }
        );

        if (currentSection) observer.observe(currentSection);
        
        return () => {
            observer.disconnect();
        };
    }, []);

    if (!data) return null;

    const getVerticalAlignClass = (val) => {
        switch (val) {
            case 'top':
                return 'start';
            case 'middle':
                return 'center';
            case 'bottom':
            default:
                return 'end';
        }
    };

    const {
        display_options = [],
        image_position = 'right',
        image_col = 'col-md-6',
        content_col = 'col-md-6',
        vertical_align = 'center',
        main_title,
        sub_title,
        description,
        key_point_title,
        key_points = [],
        cta_button,
        common_content,
        image,
        background_color = '',
        id = '',
        class_name = '',
        enable_animation,
        padding = {} 
    } = data || {};
    
    const showTitle = display_options.includes('main_title');
    const showSubTitle = display_options.includes('sub_title');
    const showDescription = display_options.includes('description');
    const showImage = display_options.includes('image');
    const showCommonContent = display_options.includes('common_content');
    const showCTA = display_options.includes('cta_button');
    const showKeyPoints = display_options.includes('key_points');
    const verticalAlignClass = getVerticalAlignClass(vertical_align);
    
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

    const renderImage = () => {
        if (!showImage || !image?.url) return null;
        return (
            <DivTag className={`${image_col} img-col`}>
                <DivTag className="img-wrapper">
                    <Image
                        src={image.url}
                        alt={image.alt || 'Section image'}
                        width={image.width || 550}
                        height={image.height || 450}
                        className="responsive-img "
                    />
                </DivTag>
            </DivTag>
        );
    };
    
    const isRight = image_position === 'right';
    
    const renderText = () => (
        <DivTag className={`${content_col} content-col`}>
            <DivTag className="content-box">
                {showTitle && main_title && <H3Tag className="main-title" dangerouslySetInnerHTML={{ __html: main_title }} />}
                {showSubTitle && sub_title && <H4Tag className="sub-title" dangerouslySetInnerHTML={{ __html: sub_title }} />}
                {showDescription && description && <DivTag className="desc" dangerouslySetInnerHTML={{ __html: description }} />}
                {showKeyPoints && key_points.length > 0 && (
                    <>
                        <DivTag className="key-title" dangerouslySetInnerHTML={{ __html: key_point_title }} />
                        <ULTag className="content-ul">
                            {key_points.map((row, index) => (
                                <LITag  className="content-li" key={index}>
                                    { row.title && <H4Tag dangerouslySetInnerHTML={{ __html: row.title }} /> }
                                    { row.description && <DivTag dangerouslySetInnerHTML={{ __html: row.description }} /> }
                                </LITag>
                            ))}
                        </ULTag>
                    </>
                )}
                {showCTA && cta_button?.url && (
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
    );
    
    return (
        <SectionTag ref={sectionRef} className={`acf-section image-with-keypoints ${class_name}`} id={id} style={{ background: background_color }}>
             {enable_animation == 'true' && (isRight ? <DotGrid className="left-grid" /> : <DotGrid className="right-grid" />)}
            <DivTag className="container">
                <DivTag className={`sub-section ${paddingClass}`}>
                    <DivTag
                        className={`row align-items-${verticalAlignClass} ${image_position === 'right' ? 'flex-row-reverse' : ''
                            }`}
                        ref={rowRef}
                    >
                        {renderImage()}
                        {renderText()}
                    </DivTag>
                     { showCommonContent && 
                    <DivTag className="row common-content-row">
                              <DivTag dangerouslySetInnerHTML={{__html: common_content }} />
                    </DivTag>
                     } 
                </DivTag>
            </DivTag>
        </SectionTag>
    );
}