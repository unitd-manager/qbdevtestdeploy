'use client';
import { useEffect, useRef, useState, useMemo, useCallback, memo } from 'react';
import { DivTag, H3Tag, PTag, SectionTag, ATag, H5Tag } from '../Common/HTMLTags';
import Image from 'next/image';

const ImageSection = memo(({ show_image, image, image_col_class }) => {
    if (!show_image || !image?.url) return null;
    return (
        <DivTag className={`${image_col_class}`}>
            <DivTag className="img-div">
                <Image
                    src={image.url}
                    alt={image.alt || 'Section image'}
                    width={442}
                    height={426}
                    quality={85}
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
            </DivTag>
        </DivTag>
    );
});

ImageSection.displayName = 'ImageSection';
const TextSection = memo(({ text_col_class, text_alignment, list }) => (
    <DivTag className={`${text_col_class} content-col text-${text_alignment}`}>
        <DivTag className="content-box">
            {list.length > 0 && (
                <DivTag className="technology-list">
                    {list.map((item, index) => (
                        <DivTag className="technology-desc" key={item.title || index}>
                            <H5Tag dangerouslySetInnerHTML={{ __html: item.title }} />
                            <DivTag dangerouslySetInnerHTML={{ __html: item.description }} />
                        </DivTag>
                    ))}
                </DivTag>)}
        </DivTag>
    </DivTag>
));

TextSection.displayName = 'TextSection';
export default memo(function TextImageCTASection({ data }) {
    const sectionRef = useRef(null);
    const rowRef = useRef(null);
    const [isInView, setIsInView] = useState(false);

    const getVerticalAlignClass = useCallback((val) => {
        switch (val) {
            case 'top':
                return 'start';
            case 'middle':
                return 'center';
            case 'bottom':
            default:
                return 'end';
        }
    }, []);

    const {
        container_type = 'container',
        show_image,
        image_position = 'right',
        image_col_class = 'col-md-6',
        text_col_class = 'col-md-6',
        vertical_align = 'center',
        text_alignment = 'left',
        main_title,
        description,
        button,
        list = [],
        image,
        id = '',
        class_name = '',
        padding
    } = data || {}; 

    const verticalAlignClass = useMemo(() => getVerticalAlignClass(vertical_align), [getVerticalAlignClass, vertical_align]);
    
    const paddingClass = useMemo(() => {
        if (!padding?.padding_options) return '';
        
        const {
            padding_position = [],
            desktop_padding = {},
            mobile_padding = {}
        } = padding;
        
        let classes = '';

        if (padding_position.includes('top')) {
            if (desktop_padding?.padding_top_desktop)
                classes += ` padding-top-desktop-${desktop_padding.padding_top_desktop}px`;
            if (mobile_padding?.padding_top_mobile)
                classes += ` padding-top-mobile-${mobile_padding.padding_top_mobile}px`;
        }

        if (padding_position.includes('bottom')) {
            if (desktop_padding?.padding_bottom_desktop)
                classes += ` padding-bottom-desktop-${desktop_padding.padding_bottom_desktop}px`;
            if (mobile_padding?.padding_bottom_mobile)
                classes += ` padding-bottom-mobile-${mobile_padding.padding_bottom_mobile}px`;
        }
        
        return classes;
    }, [padding]);

    useEffect(() => {
        const currentSection = sectionRef.current;
        const currentRow = rowRef.current;
        
        if (!currentSection) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    currentRow?.classList.add('animate-border');
                    observer.disconnect();
                }
            },
            { 
                threshold: 0.5,
                rootMargin: '0px 0px -50px 0px' 
            }
        );
        observer.observe(currentSection);
        return () => {
            observer.disconnect();
        };
    }, []); 

    const renderImage = useCallback(() => {
        return (
            <ImageSection 
                show_image={show_image}
                image={image}
                image_col_class={image_col_class}
            />
        );
    }, [show_image, image, image_col_class]);

    const renderText = useCallback(() => (
        <TextSection 
            text_col_class={text_col_class}
            text_alignment={text_alignment}
            list={list}
        />
    ), [text_col_class, text_alignment, list]);

    const rowClassName = useMemo(() => {
        return `row content-row align-items-${verticalAlignClass} ${
            image_position === 'right' ? 'flex-row-reverse' : ''
        }`;
    }, [verticalAlignClass, image_position]);
    
    if (!data) return null;

    return (
        <SectionTag ref={sectionRef} className={`ai-tech-overview ${class_name}`} id={id}>
            <DivTag className={container_type}>
                <DivTag className={`sub-section ${paddingClass}`}>
                    <DivTag className="row">
                        <DivTag className="col-md-12">
                            <DivTag className="heading-section">
                                {main_title && <H3Tag dangerouslySetInnerHTML={{ __html: main_title }} className="main-title" />}
                                {description && <DivTag dangerouslySetInnerHTML={{ __html: description }} />}
                            </DivTag>
                        </DivTag>
                    </DivTag>
                    <DivTag
                        className={rowClassName}
                        ref={rowRef}
                    >
                        {renderImage()}
                        {renderText()}
                    </DivTag>
                </DivTag>
            </DivTag>
        </SectionTag>
    );
});