'use client';

import { useEffect, useRef, useState } from 'react';
import { DivTag, H3Tag, PTag, SectionTag, ATag } from '../Common/HTMLTags';
import Image from 'next/image';
import DotGrid from '../Common/DotGrid';
import Link from 'next/link';
import { ArrowRight } from '../Common/Icons';

export default function TextImageCTASection({ data }) {
    const sectionRef = useRef(null);
    const rowRef = useRef(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const currentSection = sectionRef.current;
        
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
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

    const verticalAlignClass = getVerticalAlignClass(data.vertical_align);
    const {
        container_type = 'container',
        show_image,
        image_position = 'right',
        image_col_class = 'col-md-6',
        text_col_class = 'col-md-6',
        vertical_align = 'center',
        text_alignment = 'left',
        title,
        description,
        button,
        image,
        enable_animation = 'true',
        id = '',
        class_name = '',
        padding = {} // Provide default empty object
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

    const renderImage = () => {
        if (!show_image || !image?.url) return null;
        return (
            <DivTag className={`${image_col_class}`}>
                <DivTag className="img-wrapper">
                    <Image
                        src={image.url}
                        alt={image.alt || 'Section image'}
                        width={image.width || 550}
                        height={image.height || 450}
                        className="img-fluid"
                    />
                </DivTag>
            </DivTag>
        );
    };

    const renderText = () => (
        <DivTag className={`${text_col_class} text-${text_alignment}`}>
            <DivTag className="content-box">
                {title && <H3Tag dangerouslySetInnerHTML={{ __html: title }} />}
                {description && <DivTag dangerouslySetInnerHTML={{ __html: description }} />}
                {button?.url && (
                    <Link
                        href={button.url}
                        target={button.target || '_self'}
                        className="btn primary-btn"
                    >
                        {button.title || 'Learn More'} <ArrowRight />
                    </Link>
                )}
            </DivTag>
        </DivTag>
    );

    return (
        <SectionTag ref={sectionRef} className={`acf-section image-text-block ${class_name}`} id={id}>
            {enable_animation == 'true' && <DotGrid className="left-grid" />}
            <DivTag className={container_type}>
                <DivTag className={`sub-section ${paddingClass}`}>
                    <DivTag
                        className={`row align-items-${verticalAlignClass} ${image_position === 'right' ? 'flex-row-reverse' : ''
                            }`}
                        ref={rowRef}
                    >
                        {renderImage()}
                        {renderText()}
                    </DivTag>
                </DivTag>
            </DivTag>
        </SectionTag>
    );
}