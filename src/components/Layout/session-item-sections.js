'use client';
import { useState, useEffect, useRef } from 'react';
import { DivTag, H2Tag, H5Tag, PTag, SectionTag, SpanTag } from '../Common/HTMLTags';
import Image from 'next/image';
import { ArrowDown } from '../Common/Icons';

export default function SessionItemSections({ data }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [inView, setInView] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [openIndex, setOpenIndex] = useState(null);
    const sectionRef = useRef(null);

    useEffect(() => {
        const checkScreenSize = () => setIsMobile(window.innerWidth <= 768);
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

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
        session_tabs = [],
        padding = {},
        class_name = '',
        id = ''
    } = data;

    // helper to get image url from ACF image object safely
    const getImageUrl = (img) => {
        if (!img) return null;
        if (typeof img === 'string') return img;
        return img.url || img.src || (img.sizes && (img.sizes.medium || img.sizes.thumbnail || Object.values(img.sizes)[0])?.url) || null;
    };

    // Handle padding logic (kept from your original)
    let paddingClass = '';
    if (padding?.padding_options === true) {
        const { padding_position = [], desktop_padding = {}, mobile_padding = {} } = padding;

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

    const handleMobileToggle = (index) => setOpenIndex(openIndex === index ? null : index);

    return (
        <SectionTag className={`session-item-sections ${class_name}`} id={id}>
            <DivTag className={`container ${paddingClass}`}>
                {/* Main Title */}
                {main_title && (
                    <DivTag className="hero-title-section text-center mb-6">
                        <H2Tag className="main-title" dangerouslySetInnerHTML={{ __html: main_title }} />
                    </DivTag>
                )}

                {/* Tabs Navigation + Content */}
                <DivTag className={`tabs-main-section ${inView ? 'animated-border' : ''}`} ref={sectionRef}>
                    <DivTag className="tabs-navigation d-flex justify-center flex-wrap">
                        {session_tabs.map((tab, index) => (
                            <DivTag
                                key={index}
                                className={`tab-nav-item ${(!isMobile && index === activeIndex) || (isMobile && openIndex === index) ? 'active' : ''}`}
                                onClick={() => (isMobile ? handleMobileToggle(index) : setActiveIndex(index))}
                            >
                                <SpanTag className="tab-nav-title">{tab.tab_title}</SpanTag>
                                <SpanTag className="tab-nav-arrow"><ArrowDown /></SpanTag>

                                {/* Mobile expanded content for this tab */}
                                {isMobile && openIndex === index && tab.sessions && (
                                    <DivTag className="tabs-list-desc mobile-desc">
                                        {tab.sessions.map((session, sIndex) => {
                                            const imgUrl = getImageUrl(session.speaker_image);
                                            return (
                                                <DivTag className="tabs-list-desc"  key={sIndex}>
                                                <DivTag className="tabs-list-desc-info">
                                                    {session.session_date_day_label && <PTag className="session-day">{session.session_date_day_label}</PTag>}
                                                    {session.session_time && <PTag className="session-time">{session.session_time}</PTag>}
                                                    {session.session_title && <H5Tag dangerouslySetInnerHTML={{ __html: session.session_title }} />}
                                                    {session.session_description && (
                                                        <DivTag className="tabs-desc">
                                                            <DivTag className="description-text" dangerouslySetInnerHTML={{ __html: session.session_description }} />
                                                        </DivTag>
                                                    )}

                                                    {/* Speaker block */}
                                                    {(imgUrl || session.speaker_name || session.speaker_title || session.speaker_company || session.speaker_role_label) && (
                                                        <DivTag className="speaker-block d-flex align-items-start">
                                                            {imgUrl && (
                                                                <DivTag className="speaker-image">
                                                                    <Image
                                                                        src={imgUrl}
                                                                        alt={session.speaker_name || 'speaker image'}
                                                                        width={72}
                                                                        height={72}
                                                                        style={{ borderRadius: '50%' }}
                                                                    />
                                                                </DivTag>
                                                            )}

                                                            <DivTag className="speaker-meta">
                                                                {session.speaker_name && <PTag className="speaker-name" dangerouslySetInnerHTML={{ __html: session.speaker_name }} />}
                                                                {(session.speaker_title || session.speaker_company) && (
                                                                    <PTag className="speaker-title">
                                                                        {session.speaker_title ? session.speaker_title : ''}
                                                                        {session.speaker_title && session.speaker_company ? ', ' : ''}
                                                                        {session.speaker_company ? session.speaker_company : ''}
                                                                    </PTag>
                                                                )}
                                                                {session.speaker_role_label && <PTag className="speaker-role">{session.speaker_role_label}</PTag>}
                                                            </DivTag>
                                                        </DivTag>
                                                    )}
                                                </DivTag>
                                                </DivTag>
                                            );
                                        })}
                                    </DivTag>
                                )}
                            </DivTag>
                        ))}
                    </DivTag>

                    {/* Desktop content area */}
                    {!isMobile && (
                        <DivTag className="tabs-content-section">
                            {session_tabs.map((tab, index) => (
                                <DivTag
                                    key={index}
                                    className={`tabs-list-item ${index === activeIndex ? 'active' : ''}`}
                                    style={{ display: index === activeIndex ? 'block' : 'none' }}
                                >
                                    {tab.sessions && tab.sessions.map((session, sIndex) => {
                                        const imgUrl = getImageUrl(session.speaker_image);
                                        return (
                                             <DivTag className="tabs-list-desc"  key={sIndex}>
                                            <DivTag className="tabs-list-desc-info">
                                                {session.session_date_day_label && <PTag className="session-day">{session.session_date_day_label}</PTag>}
                                                {session.session_time && <PTag className="session-time">{session.session_time}</PTag>}
                                                {session.session_title && <H5Tag dangerouslySetInnerHTML={{ __html: session.session_title }} />}
                                                {session.session_description && (
                                                    <DivTag className="tabs-desc">
                                                        <DivTag className="description-text" dangerouslySetInnerHTML={{ __html: session.session_description }} />
                                                    </DivTag>
                                                )}

                                                {/* Speaker */}
                                                {(imgUrl || session.speaker_name || session.speaker_title || session.speaker_company || session.speaker_role_label) && (
                                                    <DivTag className="speaker-block d-flex align-items-start">
                                                        {imgUrl && (
                                                            <DivTag className="speaker-image">
                                                                <Image
                                                                    src={imgUrl}
                                                                    alt={session.speaker_name || 'speaker image'}
                                                                    width={80}
                                                                    height={80}
                                                                    style={{ borderRadius: '50%' }}
                                                                />
                                                            </DivTag>
                                                        )}

                                                        <DivTag className="speaker-meta">
                                                            {session.speaker_name && <PTag className="speaker-name" dangerouslySetInnerHTML={{ __html: session.speaker_name }} />}
                                                            {(session.speaker_title || session.speaker_company) && (
                                                                <PTag className="speaker-title">
                                                                    {session.speaker_title ? session.speaker_title : ''}
                                                                    {session.speaker_title && session.speaker_company ? ', ' : ''}
                                                                    {session.speaker_company ? session.speaker_company : ''}
                                                                </PTag>
                                                            )}
                                                            {session.speaker_role_label && <PTag className="speaker-role">{session.speaker_role_label}</PTag>}
                                                        </DivTag>
                                                    </DivTag>
                                                )}
                                            </DivTag>
                                            </DivTag>
                                        );
                                    })}
                                </DivTag>
                            ))}
                        </DivTag>
                    )}
                </DivTag>
            </DivTag>
        </SectionTag>
    );
}
