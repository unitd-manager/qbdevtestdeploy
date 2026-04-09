'use client';
import { useEffect, useRef } from 'react';
import { DivTag, H2Tag, H4Tag, PTag, SectionTag } from '../Common/HTMLTags';
import DotGrid from '../Common/DotGrid';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from '../Common/Icons';

export default function LatestWebinars({ data }) {
    const listRef = useRef(null);
    const parentRef = useRef(null);

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

        if (listRef.current) observer.observe(listRef.current);
        if (parentRef.current) observer.observe(parentRef.current);
        return () => observer.disconnect();
    }, []);
    if (!data) return null;
    const {
        main_title,
        webinars = [],
        class_name,
        id,
        padding
    } = data;

    let paddingClass = '';
    if (padding?.padding_options) {
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

    return (
        <SectionTag className={`latest-webinars ${class_name}`} id={id}>
            <DotGrid className="right-grid" />  <DotGrid className="left-grid" />
            <DivTag className="container">
                <DivTag className={`sub-section ${paddingClass}`} >
                    <DivTag className="row">
                        <DivTag className="col-md-12">
                            {main_title && <H2Tag className="text-center" dangerouslySetInnerHTML={{ __html: main_title }} />}
                        </DivTag>
                    </DivTag>
                    <DivTag className="row grid-row" ref={listRef}>
                        {webinars.map((row, rowIndex) => {
                            const colClass = rowIndex % 2 === 0 ? "odd-col" : "even-col";
                            return (
                                <DivTag key={rowIndex} className={`col-md-6 ${colClass}`} ref={listRef}>
                                    <div className="content-block">
                                        {row.title && <H4Tag className="" dangerouslySetInnerHTML={{ __html: row.title }} />}
                                        {row.video_thumbnail?.url && (
                                            <DivTag className="img-div">
                                                <Link
                                                    href={row.video_link.url}
                                                    target={row.video_link.target || '_self'}

                                                >
                                                    <Image
                                                        src={row.video_thumbnail.url}
                                                        alt={row.video_thumbnail.alt || 'Image'}
                                                        width={675}
                                                        height={240}
                                                        className='img-fluid'
                                                    />
                                                    <span className="play-overlay">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="60"
                                                            height="60"
                                                            viewBox="0 0 60 60"
                                                            fill="none"
                                                        >
                                                            <path
                                                                d="M46.4062 6.56248C46.4812 6.61529 46.5562 6.66811 46.6335 6.72252C47.9071 7.62439 49.0403 8.63781 50.1562 9.72654C50.2698 9.83554 50.3835 9.9445 50.4972 10.0534C51.1837 10.7218 51.7908 11.4349 52.3828 12.1875C52.4755 12.3017 52.5683 12.4159 52.6638 12.5335C57.3396 18.404 59.2289 26.1351 58.4014 33.5272C57.76 38.7048 55.6974 43.7726 52.3828 47.8125C52.3315 47.8756 52.2803 47.9387 52.2275 48.0038C50.8858 49.6494 49.3929 51.219 47.6953 52.5C47.6335 52.5478 47.5718 52.5957 47.5082 52.645C41.4367 57.3495 33.7249 59.3087 26.1328 58.3594C20.0339 57.4866 14.5063 54.7685 10.0781 50.5078C10.0104 50.4433 9.94264 50.3787 9.87287 50.3123C8.86693 49.35 7.97549 48.3456 7.14838 47.2265C7.09889 47.1607 7.04939 47.0949 6.9984 47.0271C2.4555 40.9763 0.653892 33.2615 1.68634 25.8021C2.4433 20.8012 4.49254 16.1514 7.61713 12.1875C7.66732 12.1234 7.71751 12.0593 7.76922 11.9933C9.15392 10.2425 10.7728 8.60166 12.5803 7.28889C12.7756 7.14683 12.9681 7.00163 13.1606 6.8559C22.2059 0.100905 34.6739 -0.221006 46.4062 6.56248ZM12.3046 11.9531C12.1936 12.0579 12.0826 12.1628 11.9682 12.2708C11.1318 13.0799 10.4216 13.9535 9.7265 14.8828C9.6765 14.9485 9.6265 15.0142 9.57498 15.0819C5.60283 20.3144 4.10079 27.0544 4.92181 33.5156C5.68847 38.8184 8.06163 43.679 11.7858 47.5225C11.9484 47.6905 12.1092 47.8604 12.2698 48.0304C13.0176 48.8044 13.8166 49.4746 14.6761 50.1183C14.8725 50.2657 15.0669 50.4155 15.2613 50.5655C20.4126 54.4635 27.1822 55.8884 33.5156 55.0781C40.0053 54.1207 46.1357 50.6472 50.0863 45.3661C54.2197 39.7593 56.0095 33.0457 55.0265 26.1208C54.1778 20.8106 51.7436 16.161 48.0468 12.3047C47.942 12.1936 47.8371 12.0826 47.7291 11.9682C46.9201 11.1319 46.0464 10.4217 45.1171 9.72654C45.0514 9.67654 44.9857 9.62654 44.9181 9.57502C36.0179 2.81866 22.8316 3.14418 12.3046 11.9531Z"
                                                                fill="white"
                                                            />
                                                            <path
                                                                d="M22.8182 16.5456C23.188 16.7356 23.5511 16.9349 23.9136 17.1386C24.048 17.2125 24.1824 17.2865 24.3209 17.3627C24.7308 17.5886 25.139 17.8174 25.5469 18.0468C25.7201 18.1441 25.7201 18.1441 25.8969 18.2433C26.3319 18.488 26.7666 18.7336 27.2005 18.9803C28.1003 19.492 29.0053 19.9939 29.9121 20.4931C30.2017 20.6525 30.4914 20.812 30.781 20.9714C30.8527 21.0109 30.9244 21.0504 30.9983 21.0911C32.1381 21.7189 33.2748 22.3522 34.4119 22.9847C34.8089 23.2054 35.2059 23.4258 35.603 23.6462C37.0007 24.4218 38.3974 25.199 39.7909 25.9819C40.4429 26.3479 41.0965 26.7108 41.7522 27.0702C41.9669 27.1882 42.1815 27.3063 42.3962 27.4244C42.5986 27.5355 42.8014 27.6457 43.0042 27.756C44.7761 28.7311 44.7761 28.7311 45.1831 29.3334C45.2806 29.9323 45.2718 30.4823 44.917 30.989C44.6346 31.3044 44.3928 31.4686 44.0218 31.6689C43.8968 31.7373 43.7719 31.8057 43.6432 31.8761C43.5084 31.9482 43.3737 32.0203 43.2349 32.0946C43.0929 32.1719 42.951 32.2492 42.8092 32.3267C42.5146 32.4876 42.2196 32.6478 41.9244 32.8077C41.2425 33.1775 40.5653 33.5556 39.8877 33.933C39.6237 34.0797 39.3598 34.2263 39.0958 34.3729C38.3482 34.7887 37.6017 35.2066 36.8555 35.6249C35.4477 36.4142 34.0371 37.1983 32.6259 37.9814C31.9653 38.3481 31.3049 38.715 30.6446 39.0819C30.3809 39.2284 30.1172 39.3749 29.8535 39.5214C29.723 39.5939 29.5925 39.6664 29.458 39.7411C28.8648 40.0707 28.8648 40.0707 28.2715 40.4003C28.1408 40.4729 28.0101 40.5456 27.8754 40.6204C27.6138 40.7657 27.3522 40.9109 27.0906 41.0561C26.473 41.399 25.8556 41.7424 25.2391 42.0873C24.948 42.2501 24.6568 42.4127 24.3656 42.5753C24.1602 42.69 23.9551 42.8052 23.7499 42.9203C23.6254 42.9898 23.5008 43.0593 23.3725 43.1309C23.2632 43.1921 23.1538 43.2533 23.0412 43.3164C22.4868 43.6057 22.0915 43.7726 21.4531 43.6733C21.0157 43.5294 20.6876 43.2366 20.3906 42.8905C20.2408 42.4411 20.2561 42.0177 20.2562 41.5494C20.2558 41.4472 20.2553 41.3449 20.2549 41.2396C20.2536 40.8958 20.2532 40.552 20.2527 40.2081C20.252 39.9621 20.2512 39.7162 20.2504 39.4702C20.2483 38.8009 20.2471 38.1317 20.2461 37.4625C20.2455 37.0446 20.2448 36.6267 20.2441 36.2087C20.2419 34.9018 20.2402 33.5948 20.2392 32.2878C20.2381 30.778 20.235 29.2683 20.2302 27.7585C20.2267 26.5922 20.225 25.4259 20.2246 24.2596C20.2243 23.5626 20.2233 22.8657 20.2203 22.1688C20.2176 21.5133 20.2171 20.8578 20.2183 20.2023C20.2184 19.9617 20.2176 19.721 20.216 19.4804C20.2139 19.1519 20.2148 18.8236 20.2163 18.4951C20.215 18.3998 20.2137 18.3045 20.2124 18.2063C20.2194 17.5916 20.3403 17.2484 20.7422 16.7577C21.3944 16.1846 22.0502 16.2091 22.8182 16.5456Z"
                                                                fill="white"
                                                            />
                                                        </svg>
                                                    </span>
                                                </Link>
                                            </DivTag>

                                        )}

                                        {row.description && <DivTag className="" dangerouslySetInnerHTML={{ __html: row.description }} />}
                                    </div>
                                    {row.cta_button?.url && (
                                        <Link
                                            href={row.cta_button.url}
                                            target={row.cta_button.target || '_self'}
                                            className="btn primary-btn"
                                        >
                                            {row.cta_button.title || 'Learn More'} <ArrowRight />
                                        </Link>
                                    )}
                                </DivTag>
                            );
                        })}
                    </DivTag>
                </DivTag>
            </DivTag>
        </SectionTag>
    );
}
