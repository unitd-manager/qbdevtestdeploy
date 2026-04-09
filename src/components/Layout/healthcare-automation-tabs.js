'use client';
import { useState, useEffect, useRef } from 'react';
import { DivTag, H2Tag, H5Tag, LITag, PTag, SectionTag, SpanTag, ULTag } from '../Common/HTMLTags';
import Image from 'next/image';
import { ArrowDown } from '../Common/Icons';

export default function HealthcareAutomationSection({ data }) {

    const [activeIndex, setActiveIndex] = useState(0);
    const [inView, setInView] = useState(false);
    const sectionRef = useRef(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth <= 768); // treat <=768px as mobile
        };
        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);
        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);
    const [openIndex, setOpenIndex] = useState(null);

    const handleMobileToggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setInView(entry.isIntersecting),
            { threshold: 0.3 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);


    if (!data || typeof data !== 'object') return null;
    const {
        main_title,
        sub_title,
        description,
        image,
        overlay_text,
        tabs = [],
        padding,
        class_name = '',
        id = ''
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
        <>
            <SectionTag className={`health-care-automation-tabs ${class_name}`} id={id}>
                <DivTag className={`container health-care-data ${paddingClass}`}>
                    {/* Hero Section */}
                    <DivTag className="hero-section">
                        {main_title && (
                            <DivTag className="row">
                                <DivTag className="col-12">
                                    <DivTag className="hero-title-section">
                                        {main_title && (
                                            <H2Tag
                                                className="main-title"
                                                dangerouslySetInnerHTML={{ __html: main_title }}
                                            />
                                        )}
                                    </DivTag>
                                </DivTag>
                            </DivTag>
                        )}
                        <DivTag className="row hero-content-row top-dashed ">
                            <DivTag className="col-md-6 hero-left">
                                <DivTag className="hero-image-section">
                                    {image.url && (
                                        <Image
                                            src={image.url}
                                            alt="Healthcare Provider"
                                            width={600}
                                            height={400}
                                            className="hero-image"
                                        />
                                    )}
                                    {overlay_text && (
                                        <H2Tag
                                            className="hero-overlay-title"
                                            dangerouslySetInnerHTML={{ __html: overlay_text }}
                                        />
                                    )}
                                </DivTag>
                            </DivTag>

                            <DivTag className="col-md-6 hero-right">
                                <DivTag className="hero-right-content">
                                    {sub_title && (
                                        <H5Tag className="highlighted-text" dangerouslySetInnerHTML={{ __html: sub_title }} />
                                    )}
                                    {description && (
                                        <DivTag className="description-text" dangerouslySetInnerHTML={{ __html: description }} />
                                    )}

                                </DivTag>
                            </DivTag>
                        </DivTag>
                    </DivTag>

                    {/* Tabs Section */}
                    <DivTag className="tabs-main-section">

                        <DivTag className={`row list-of-service ${inView ? 'animated-border' : ''}`} ref={sectionRef}>
                            <DivTag className="col-12 tabs-nav-col">
                                <DivTag className="tabs-navigation">
                                    {tabs.map((tab, index) => (
                                        <DivTag
                                            key={index}
                                            className={`tab-nav-item ${(!isMobile && index === activeIndex) || (isMobile && openIndex === index) ? 'active' : ''}`}
                                            onClick={() => isMobile ? handleMobileToggle(index) : setActiveIndex(index)}
                                        >
                                            <SpanTag className="tab-nav-title">
                                                {tab.tab_tltle}
                                            </SpanTag>
                                            <SpanTag className="tab-nav-arrow">
                                                <ArrowDown />
                                            </SpanTag>
                                            {isMobile && openIndex === index && (
                                                <DivTag className="tabs-list-desc">
                                                    <DivTag className="tabs-list-desc-info">
                                                        {tab.tab_sub_title && <H5Tag dangerouslySetInnerHTML={{ __html: tab.tab_sub_title }} />}
                                                        <DivTag className="tabs-desc">
                                                            <DivTag className="description-text" dangerouslySetInnerHTML={{ __html: tab.tab_description }} />
                                                            <DivTag className="tabs-inner-li">
                                                                <PTag className="desc-sub-title" dangerouslySetInnerHTML={{ __html: tab.tab_sub_title }} />
                                                                <ULTag>
                                                                    {tab.tab_list?.map((tabList, tabListIndex) => (
                                                                        <LITag key={tabListIndex}>{tabList.name}</LITag>
                                                                    ))}
                                                                </ULTag>
                                                            </DivTag>
                                                        </DivTag>
                                                    </DivTag>
                                                </DivTag>
                                            )}
                                        </DivTag>
                                    ))}
                                </DivTag>

                                {!isMobile && (

                                    <DivTag className="tabs-content-section">
                                        {tabs.map((tab, index) => (
                                            <DivTag
                                                key={index}
                                                className={`tabs-list-item ${index === activeIndex ? 'active' : ''}`}
                                                style={{ display: index === activeIndex ? 'block' : 'none' }}
                                            >
                                                <DivTag className="tabs-list-desc">
                                                    <DivTag className="tabs-list-desc-info">
                                                        <DivTag className="tabs-desc-title">
                                                            {tab.tab_sub_title && (
                                                                <H5Tag dangerouslySetInnerHTML={{ __html: tab.tab_sub_title }} />
                                                            )}
                                                        </DivTag>
                                                        <DivTag className="tabs-desc">
                                                            <DivTag className="description-text" dangerouslySetInnerHTML={{ __html: tab.tab_description }} />
                                                            <DivTag className="tabs-inner-li">
                                                                <PTag className="desc-sub-title" dangerouslySetInnerHTML={{ __html: tab.tab_sub_title }} />
                                                                <ULTag>
                                                                    {tab.tab_list?.map((tabList, tabListIndex) => (
                                                                        <LITag key={tabListIndex}>
                                                                            {tabList.name}
                                                                        </LITag>
                                                                    ))}
                                                                </ULTag>
                                                            </DivTag>
                                                        </DivTag>
                                                    </DivTag>
                                                </DivTag>
                                            </DivTag>
                                        ))}
                                    </DivTag>
                                )}
                            </DivTag>
                        </DivTag>
                    </DivTag>
                </DivTag>
            </SectionTag>
        </>
    );
}
