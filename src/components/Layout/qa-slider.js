'use client';
import { useEffect, useRef, useState, useCallback } from "react";
import Slider from "react-slick";
import Link from "next/link";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ArrowRight } from "../Common/Icons";
import { DivTag, H2Tag, H3Tag, H4Tag, PTag, SectionTag, SpanTag } from "../Common/HTMLTags";
import Image from "next/image";

export default function QASlider({ data }) {
    const sectionRef = useRef(null);
    const sliderRef = useRef(null);
    const [animate, setAnimate] = useState(false);

    const settings = {
        dots: true,
        arrows: false,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            { breakpoint: 991, settings: { slidesToShow: 2 } },
            { breakpoint: 576, settings: { slidesToShow: 1 } },
        ],
        afterChange: () => {
            updateSlideBorders();
            setEqualHeight();
        },
    };

    const getItemsPerRow = useCallback(() => {
        const width = window.innerWidth;
        if (width < 576) return 1;
        if (width < 991) return 2;
        return 3;
    }, []);

const setEqualHeight = useCallback(() => {
    if (!sliderRef.current) return;

    // Reset heights first
    const allSlides = sliderRef.current.querySelectorAll('.slick-slide .slider-item');
    allSlides.forEach(slide => {
        slide.style.height = 'auto';
    });

    if (allSlides.length === 0) return;

    // Get max height among ALL slides
    let maxHeight = 0;
    allSlides.forEach(slide => {
        const height = slide.offsetHeight;
        if (height > maxHeight) {
            maxHeight = height;
        }
    });

    // Apply common height to ALL slides
    allSlides.forEach(slide => {
        slide.style.height = `${maxHeight}px`;
    });
}, []);


    const updateSlideBorders = useCallback(() => {
        if (!sliderRef.current) return;

        const slides = sliderRef.current.querySelectorAll(".slick-slide");
        slides.forEach((slide) => slide.classList.remove("no-line"));

        const visibleSlides = Array.from(slides).filter(
            (slide) =>
                slide.classList.contains("slick-active") &&
                !slide.classList.contains("slick-cloned")
        );

        const itemsPerRow = getItemsPerRow();
        visibleSlides.forEach((slide, index) => {
            if ((index + 1) % itemsPerRow === 0) {
                slide.classList.add("no-line");
            }
        });
    }, [getItemsPerRow]);

    const handleResize = useCallback(() => {
        updateSlideBorders();

        setTimeout(() => {
            setEqualHeight();
        }, 100);
    }, [updateSlideBorders, setEqualHeight]);

    useEffect(() => {

        const timer = setTimeout(() => {
            updateSlideBorders();
            setEqualHeight();
        }, 100);

        window.addEventListener("resize", handleResize);

        return () => {
            clearTimeout(timer);
            window.removeEventListener("resize", handleResize);
        };
    }, [updateSlideBorders, setEqualHeight, handleResize]);

    useEffect(() => {
        const currentSection = sectionRef.current; // Copy ref value to variable
        
        const observer = new IntersectionObserver(
            ([entry]) => {
                setAnimate(entry.isIntersecting);
                if (entry.isIntersecting) {
                    setTimeout(setEqualHeight, 300);
                }
            },
            { threshold: 0.3 }
        );
        
        if (currentSection) observer.observe(currentSection);
        
        return () => {
            if (currentSection) observer.unobserve(currentSection);
        };
    }, [setEqualHeight]);

    if (!data) return null;
    const {
        posts,
        main_title,
        common_description,
        show_feature_image,
        show_title,
        show_description,
        show_date,
        padding,
        class_name,
        id
    } = data;
    let paddingClass = "";
    if (padding?.padding_options) {
        const {
            padding_position = [],
            desktop_padding = {},
            mobile_padding = {},
        } = padding;

        if (padding_position.includes("top")) {
            if (desktop_padding?.padding_top_desktop)
                paddingClass += ` padding-top-desktop-${desktop_padding.padding_top_desktop}px`;
            if (mobile_padding?.padding_top_mobile)
                paddingClass += ` padding-top-mobile-${mobile_padding.padding_top_mobile}px`;
        }

        if (padding_position.includes("bottom")) {
            if (desktop_padding?.padding_bottom_desktop)
                paddingClass += ` padding-bottom-desktop-${desktop_padding.padding_bottom_desktop}px`;
            if (mobile_padding?.padding_bottom_mobile)
                paddingClass += ` padding-bottom-mobile-${mobile_padding.padding_bottom_mobile}px`;
        }
    }

    if (!posts.length) return null;

    return (
        <SectionTag
            ref={sectionRef}
            className={`common-posts-slider top-dashed bottom-dashed ${animate ? "animate" : ""}  ${class_name}`} id={id}
        >
            <DivTag className={`container`}>
                <DivTag className={`sub-section ${paddingClass}`} >
                    <DivTag className="row">
                        <DivTag className="slider-heading">
                            {main_title && (
                                <H2Tag
                                    className="main-title"
                                    dangerouslySetInnerHTML={{ __html: main_title }}
                                />
                            )}
                            {common_description && (
                                <DivTag
                                    className="section-desc"
                                    dangerouslySetInnerHTML={{ __html: common_description }}
                                />
                            )}
                        </DivTag>
                        <DivTag className="slider-list" ref={sliderRef}>
                            <Slider {...settings}>
                                {posts.map((post, index) => (
                                    <DivTag key={index}>
                                        <DivTag className="slider-item">
                                            {(show_feature_image == 'yes' && post.featuredImage) && (
                                                <DivTag className="img-div">
                                                    <Image
                                                        src={post.featuredImage}
                                                        alt={post.title}
                                                        className="post-image img-fluid"
                                                        width={390}
                                                        height={350}
                                                    />
                                                </DivTag>
                                            )}
                                            <DivTag className="post-content">
                                                {(show_date == 'yes' && post.date) && <SpanTag className="post-date">{post.date}</SpanTag>}
                                                {(show_title == 'yes' && post.title) && <H4Tag className="post-title" dangerouslySetInnerHTML={{ __html: post.title }} />}
                                                {(show_description == 'yes' && post.excerpt || post.description) && (
                                                    <DivTag
                                                        className="post-desc"
                                                        dangerouslySetInnerHTML={{ __html: post.excerpt || post.description }}
                                                    />
                                                )}
                                            </DivTag>
                                            <Link
                                                href={post.link}
                                                className="btn secondary-btn"
                                            >
                                                Read More <ArrowRight />
                                            </Link>
                                        </DivTag>
                                    </DivTag>
                                ))}
                            </Slider>
                        </DivTag>
                        <DivTag className="button-div">
                            {data.cta_button?.url && (
                                <Link
                                    href={data.cta_button.url}
                                    target={data.cta_button.target || '_self'}
                                    className="btn primary-btn cta-btn"
                                >
                                    {data.cta_button.title || 'Learn More'} <ArrowRight />
                                </Link>
                            )}
                        </DivTag>
                    </DivTag>
                </DivTag>
            </DivTag>
        </SectionTag>
    );
}