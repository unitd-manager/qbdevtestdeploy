'use client';
import { useEffect, useRef, useState } from 'react';
import { DivTag, H2Tag, H3Tag, PTag, SectionTag } from '../Common/HTMLTags';
import Link from 'next/link';
import { ArrowRight } from '../Common/Icons';

export default function SectionFive({ data }) {
      const sectionRef = useRef(null);
  const rowRef = useRef(null);

  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
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

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);
    if (!data) return null;
    const {
        main_title,
        description,
        cta_button,
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
        
        <SectionTag ref={sectionRef}  className={`two-column-text-cta ${class_name}`} id={id}>
            <DivTag className="container bottom-dashed top-dashed">
                <DivTag className={`sub-section ${paddingClass}`}>
                    <DivTag className="row"  ref={rowRef}>
                        <DivTag className="col-md-6">
                            <DivTag className="heading-box">
                                {main_title && <H2Tag dangerouslySetInnerHTML={{ __html: main_title }} />}
                            </DivTag>
                        </DivTag>
                        <DivTag className="col-md-6">
                            <DivTag className="content-box">
                                {description && <DivTag className="desc" dangerouslySetInnerHTML={{ __html: description }} />}
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
                </DivTag>
            </DivTag>
        </SectionTag>
        </>
    );
}
