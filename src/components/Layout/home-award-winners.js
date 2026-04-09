'use client';

import { useEffect, useRef } from 'react';
import { DivTag, H3Tag, SectionTag } from '../Common/HTMLTags';
import Image from 'next/image';
import Link from 'next/link';

export default function AwardWinnersSection({ data }) {
    const winnerSectionRef = useRef(null);
    const winnerContentRef = useRef(null);
    useEffect(() => {
        const winnerSection = winnerSectionRef.current;
        const winnerContent = winnerContentRef.current;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {

                    if (entry.target === winnerSection && winnerContent) {
                        if (entry.isIntersecting) {
                            winnerContent.classList.add('animate-winner');
                        } else {
                            winnerContent.classList.remove('animate-winner');
                        }
                    }
                });
            },
            { threshold: 0.3 }
        );

        if (winnerSection) observer.observe(winnerSection);

        return () => {
            if (winnerSection) observer.unobserve(winnerSection);
        };
    }, []);

    const award_list = data?.award_winner_list || [];
    const main_title = data?.main_title;
    const padding = data?.padding;
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
            <SectionTag className="our-winner-info" ref={winnerSectionRef}>
                <DivTag className="container our-winner-data">
                    <DivTag className={`sub-section ${paddingClass}`} >
                        <DivTag className="row">
                            <DivTag className="col-md-6">
                                <DivTag className='winner-logo-info'>
                                    {main_title && (
                                        <H3Tag
                                            dangerouslySetInnerHTML={{ __html: main_title }}
                                        />
                                    )}
                                </DivTag>
                            </DivTag>
                            <DivTag className="col-md-6 winner-cont-info" ref={winnerContentRef}>
                                {award_list.length > 0 &&
                                    award_list.map((item, index) => (
                                        <DivTag className='winner-media' key={index}>
                                            <Link href={item.link.url} target={item.link.target || "_self"} ><Image src={item.image?.url || ''} alt={item.title || 'award'} fill /></Link>
                                        </DivTag>
                                    ))
                                }
                            </DivTag>
                        </DivTag>
                    </DivTag>
                </DivTag>
            </SectionTag>
        </>
    );
}
