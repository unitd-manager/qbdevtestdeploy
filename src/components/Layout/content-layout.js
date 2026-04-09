'use client';
import { useEffect, useRef, useState } from 'react';
import { SectionTag, DivTag, H2Tag } from '../Common/HTMLTags';
import { ArrowRight } from '../Common/Icons';
import Link from 'next/link';

export default function ContentLayout({ data }) {
    const listRef = useRef(null);
    const parentRef = useRef(null);
    const sectionRef = useRef(null);
    const rowRef = useRef(null);
    const videoRef = useRef(null);

    const [isInView, setIsInView] = useState(false);
    const [videoLoaded, setVideoLoaded] = useState(false);

    // Function to find and control iframe video
    const controlVideo = (action) => {
        if (!videoRef.current) return;

        const iframe = videoRef.current.querySelector('iframe');
        if (!iframe) return;

        try {
            // For YouTube videos
            if (iframe.src.includes('youtube.com') || iframe.src.includes('youtu.be')) {
                iframe.contentWindow.postMessage(
                    `{"event":"command","func":"${action === 'pause' ? 'pauseVideo' : 'playVideo'}","args":""}`,
                    '*'
                );
            }
            // For Vimeo videos
            else if (iframe.src.includes('vimeo.com')) {
                iframe.contentWindow.postMessage(
                    JSON.stringify({ method: action === 'pause' ? 'pause' : 'play' }),
                    '*'
                );
            }
            // For HTML5 videos
            else {
                const video = iframe.contentDocument?.querySelector('video');
                if (video) {
                    action === 'pause' ? video.pause() : video.play();
                }
            }
        } catch (error) {
            console.log('Video control not available:', error);
        }
    };

    // Initial animation observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    listRef.current?.classList.add('animate-border');
                    parentRef.current?.classList.add('animate-border');
                }
            },
            { threshold: 0.5 }
        );

        const listEl = listRef.current;
        const parentEl = parentRef.current;

        if (listEl) observer.observe(listEl);
        if (parentEl) observer.observe(parentEl);

        return () => {
            if (listEl) observer.unobserve(listEl);
            if (parentEl) observer.unobserve(parentEl);
            observer.disconnect();
        };
    }, []);

    // Video visibility and control observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    rowRef.current?.classList.add('animate-border');

                    if (videoLoaded) {
                        setTimeout(() => controlVideo('play'), 1000);
                    }
                } else {
                    if (videoLoaded) {
                        controlVideo('pause');
                    }
                }
            },
            {
                threshold: 0.3,
                rootMargin: '0px 0px -20% 0px'
            }
        );

        const sectionEl = sectionRef.current;
        if (sectionEl) observer.observe(sectionEl);

        return () => {
            if (sectionEl) observer.unobserve(sectionEl);
            observer.disconnect();
        };
    }, [videoLoaded]);

    // Set up video loaded state and enable API
    useEffect(() => {
        if (isInView && data?.video_iframe && videoRef.current && !videoLoaded) {
            setVideoLoaded(true);

            // Enable YouTube API
            const iframe = videoRef.current.querySelector('iframe');
            if (iframe && (iframe.src.includes('youtube.com') || iframe.src.includes('youtu.be'))) {
                const currentSrc = iframe.src;
                if (!currentSrc.includes('enablejsapi=1')) {
                    const separator = currentSrc.includes('?') ? '&' : '?';
                    iframe.src = `${currentSrc}${separator}enablejsapi=1&origin=${window.location.origin}`;
                }
            }
        }
    }, [isInView, data?.video_iframe, videoLoaded]);

    // 🟢 Early return AFTER hooks
    if (!data || typeof data !== 'object') return null;

    const {
        display_options = [],
        main_title,
        sub_title,
        description,
        cta_button,
        video_iframe,
        background_type = 'full',
        background_color = '',
        class_name = '',
        id = '',
        padding = {}
    } = data;

    // Display conditions
    const showTitle = display_options.includes('main_title');
    const showSubTitle = display_options.includes('sub_title');
    const showDescription = display_options.includes('description');
    const showFrame = display_options.includes('video_iframe');
    const showCTA = display_options.includes('cta_button');

    // Optional padding styles (safer than custom classes)
    let paddingClass = '';
    const paddingStyle = {};
    if (padding.padding_options === true) {
        const {
            padding_position = [],
            desktop_padding = {},
            mobile_padding = {}
        } = padding;

        if (padding_position.includes('top')) {
            if (desktop_padding?.padding_top_desktop) {
                paddingStyle.paddingTop = `${desktop_padding.padding_top_desktop}px`;
            }
            if (mobile_padding?.padding_top_mobile) {
                paddingStyle.paddingTop = `${mobile_padding.padding_top_mobile}px`;
            }
        }

        if (padding_position.includes('bottom')) {
            if (desktop_padding?.padding_bottom_desktop) {
                paddingStyle.paddingBottom = `${desktop_padding.padding_bottom_desktop}px`;
            }
            if (mobile_padding?.padding_bottom_mobile) {
                paddingStyle.paddingBottom = `${mobile_padding.padding_bottom_mobile}px`;
            }
        }
    }

    return (
        <SectionTag className={`content-layout-section ${class_name}`} id={id} ref={sectionRef} style={background_type === 'full' ? { background: background_color } : {}}>
            <DivTag className="container" style={background_type === 'container' ? { background: background_color } : {}}>
                <DivTag className={`sub-section ${paddingClass}`} style={paddingStyle}>
                    <DivTag className="row" ref={rowRef}>
                        <DivTag className="col-md-12">
                            <DivTag className="content-box" ref={listRef}>
                                {showTitle && main_title && (
                                    <H2Tag
                                        dangerouslySetInnerHTML={{ __html: main_title }}
                                        className="main-title"
                                    />
                                )}
                                {showSubTitle && sub_title && (
                                    <H2Tag
                                        className="sub-title"
                                        dangerouslySetInnerHTML={{ __html: sub_title }}
                                    />
                                )}
                                {showDescription && description && (
                                    <DivTag
                                        className="desc"
                                        dangerouslySetInnerHTML={{ __html: description }}
                                    />
                                )}
                                <DivTag className="video-box" ref={parentRef}>
                                    {showFrame && isInView && video_iframe && (
                                        <DivTag
                                            ref={videoRef}
                                            dangerouslySetInnerHTML={{ __html: video_iframe }}
                                        />
                                    )}
                                </DivTag>
                                {showCTA && cta_button?.url && (
                                    <DivTag className="text-center">
                                        <Link
                                            href={cta_button.url}
                                            target={cta_button.target || '_self'}
                                            className="btn primary-btn"
                                        >
                                            {cta_button.title || 'Learn More'} <ArrowRight />
                                        </Link>
                                    </DivTag>
                                )}
                            </DivTag>
                        </DivTag>
                    </DivTag>
                </DivTag>
            </DivTag>
        </SectionTag>
    );
}
