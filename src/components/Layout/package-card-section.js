'use client';
import { useEffect, useRef } from 'react';
import { DivTag, H2Tag, H3Tag, H4Tag, H5Tag, LITag, PTag, SectionTag, SpanTag, ULTag } from '../Common/HTMLTags';
import Link from 'next/link';
import { ArrowRight, LiIcon } from '../Common/Icons';
import Image from 'next/image';

export default function PackageCardSection({ data }) {
    const cardRefs = useRef([]);

    useEffect(() => {
        const observers = [];

        cardRefs.current.forEach((ref) => {
            if (!ref) return;

            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        ref.classList.add('animate-border');
                    }
                },
                { threshold: 0.5 }
            );

            observer.observe(ref);
            observers.push(observer);
        });

        return () => {
            observers.forEach((observer) => observer.disconnect());
        };
    }, []);


    if (!data) return null;

    const {
        main_title,
        description = "",
        button,
        package_cards = [],
        class_name,
        id,
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
    return (
        <SectionTag className={`industry-ai-usecases benefits-grid-layout document-process-sec ${class_name}`} id={id}>
            <DivTag className="container">
                <DivTag className={`sub-section ${paddingClass}`}>
                    <DivTag className="row">
                        <DivTag className="col-md-12">
                            <DivTag className='section-head'>
                                {main_title && <H2Tag className="package-card-main-title" dangerouslySetInnerHTML={{ __html: main_title }} />}
                            </DivTag>
                        </DivTag>
                    </DivTag>
                    {package_cards && (() => {
                        const rows = [];
                        let currentRow = [];
                        let rowWidth = 0;

                        package_cards.forEach((card, index) => {
                            const colClass = card.column || 'col-md-3';
                            const match = colClass.match(/col-md-(\d+)/);
                            const colSize = match ? parseInt(match[1]) : 3;

                            if (rowWidth + colSize > 12) {
                                rows.push(currentRow);
                                currentRow = [];
                                rowWidth = 0;
                            }

                            currentRow.push({ card, colSize, index });
                            rowWidth += colSize;
                        });

                        if (currentRow.length > 0) {
                            rows.push(currentRow);
                        }

                        return rows.map((row, rowIndex) => (
                            <DivTag className="row card-row justify-content-center document-process-list" key={`row-${rowIndex}`}>
                                {row.map((item, idx) => {
                                    const { card, colSize, index } = item;
                                    let right = "";
                                    let left = "";
                                    const colClass = card.column || 'col-md-4';
                                    const totalRowWidth = row.reduce((sum, item) => sum + item.colSize, 0);
                                    const isFirstInRow = (idx === 0 && totalRowWidth === 12);
                                    const isLastInRow = (idx === row.length - 1 && totalRowWidth === 12);

                                    const animations = [
                                        'left-top-right-to-right-top-left',
                                        'bottom-left-to-bottom-right'
                                    ];

                                    if (isFirstInRow) {
                                        left = "pl-0";
                                    } else {
                                        animations.push('left-top-to-left-bottom last-col');
                                    }

                                    if (isLastInRow) {
                                        right = "pr-0";
                                    } else {
                                        animations.push('right-top-to-bottom-right first-col');
                                    }

                                    return (
                                        <DivTag className={`${colClass} mt-3`} key={index}>
                                            <DivTag
                                                ref={(el) => (cardRefs.current[index] = el)}
                                                className={`card-col h-100 dashed-outline document-process-info ${animations.join(' ')} ${card.type}`}
                                            >
                                                <span className="border-span top-line"></span>
                                                <span className="border-span bottom-line"></span>
                                                <span className="border-span left-line"></span>
                                                <span className="border-span right-line"></span>
                                                

                                                <DivTag className="content-div">
                                                    <DivTag className="package-title-list">
                                                        {card.package_title && <H3Tag className="package-col-title">{card.package_title}</H3Tag> }
                                                        {card.package_subtitle &&  <H5Tag className="package-col-subtitle">{card.package_subtitle}</H5Tag> }
                                                    </DivTag>
                                                    <DivTag className="package-rate-list">
                                                        <DivTag className="package-rate">
                                                           { card.price_note && <PTag className="rate-start">{card.price_note}</PTag> }
                                                            { card.price &&   <H4Tag className="rate-col-title">{card.price}<span>{card.price_plan}</span></H4Tag> }
                                                        </DivTag>                                                    
                                                        {
                                                            card.features?.length > 0 && (
                                                                <ULTag className="icon-list feature-icon-list">
                                                                    {card.features.map((listItem, liIndex) => (
                                                                        <LITag key={liIndex} className="list-with-icon feature-list">
                                                                            <PTag ><SpanTag >{listItem.feature_item}</SpanTag><br />
                                                                            </PTag>
                                                                        </LITag>
                                                                    ))}
                                                                </ULTag>
                                                            )
                                                        }
                                                        <Link href={card.cta_button.url} className="btn primary-btn" target={card.cta_button.target || "_self"}>
                                                            {card.cta_button.title} <ArrowRight className="right-arrow-icon" />
                                                        </Link>
                                                    </DivTag>
                                                </DivTag>
                                            </DivTag>
                                        </DivTag>
                                    );
                                })}
                            </DivTag>
                        ));
                    })()}
                 
                </DivTag>
            </DivTag>
        </SectionTag>
    );
}
