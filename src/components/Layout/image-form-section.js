'use client';
import { useEffect, useRef, useState } from 'react';
import { DivTag, H3Tag, PTag, SectionTag, ATag, H4Tag, H5Tag, ULTag, LITag } from '../Common/HTMLTags';
import Image from 'next/image';
import Link from 'next/link';
import DotGrid from '../Common/DotGrid';
import { useEmbedScript } from '@/lib/useEmbedScript';

export default function ImageKeyPoints({ data }) {
    // Move all hooks to the top before any conditional returns
    const embedRef = useRef(null);
    const { loadEmbedContent } = useEmbedScript();
    const processedDescriptionRef = useRef('');
    const sectionRef = useRef(null);
    const rowRef = useRef(null);

    useEffect(() => {
        const form_embed_code = data?.form_embed_code;
        if (form_embed_code && embedRef.current) {
            const processedHtml = loadEmbedContent(form_embed_code, embedRef.current);
            processedDescriptionRef.current = processedHtml;
            if (embedRef.current) {
                embedRef.current.innerHTML = processedHtml;
            }
        }
    }, [data?.form_embed_code, loadEmbedContent]);

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

    // Now we can safely do the early return after all hooks have been called
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
        form_embed_code,
        cta_button,
        image,
        id = '',
        class_name = '',
        enable_animation,
        padding = {} // Provide default empty object
    } = data || {};

    const showTitle = display_options.includes('main_title');
    const showSubTitle = display_options.includes('sub_title');
    const showDescription = display_options.includes('description');
    const showImage = display_options.includes('image');
    const showCommonContent = display_options.includes('common_content');
    const showCTA = display_options.includes('cta_button');
    const showFormEmbedCode = display_options.includes('form_embed_code');
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
                        className="responsive-img"
                    />
                </DivTag>
            </DivTag>
        );
    };
    
    const isRight = image_position === 'right';
    
    const renderText = () => (
        <DivTag className={`${content_col} content-col`}>
            <DivTag className="content-box">
                {showFormEmbedCode && form_embed_code &&
                    <>
                        <DivTag ref={embedRef} className="form-embed" id="hubspot-form" />
                    </>
                }
            </DivTag>
        </DivTag>
    );
    
    return (
        <SectionTag ref={sectionRef} className={`acf-section image-form-section ${class_name}`} id={id}>
            {enable_animation == 'true' && (isRight ? <DotGrid className="left-grid" /> : <DotGrid className="right-grid" />)}
            <DivTag className="container">
                <DivTag className={`sub-section ${paddingClass}`}>
                    <DivTag className="row">
                        <DivTag className="col-md-12">
                            {showTitle && main_title && <H3Tag className="main-title" dangerouslySetInnerHTML={{ __html: main_title }} />}
                            {showSubTitle && sub_title && <H4Tag className="sub-title" dangerouslySetInnerHTML={{ __html: sub_title }} />}
                            {showDescription && description && <DivTag className="desc" dangerouslySetInnerHTML={{ __html: description }} />}
                        </DivTag>
                    </DivTag>
                    <DivTag
                        className={`row align-items-${verticalAlignClass} ${image_position === 'right' ? 'flex-row-reverse' : ''
                            }`}
                        ref={rowRef}
                    >
                        {renderImage()}
                        {renderText()}
                    </DivTag>
                    {showCTA && cta_button?.url && (
                        <DivTag className="row common-content-row justify-content-center">
                            <DivTag className="col-md-12">
                                <Link
                                    href={cta_button.url}
                                    target={cta_button.target || '_self'}
                                    className="btn primary-btn"
                                >
                                    {cta_button.title || 'Learn More'}
                                </Link>
                            </DivTag>
                        </DivTag>
                    )}
                </DivTag>
            </DivTag>
        </SectionTag>
    );
}