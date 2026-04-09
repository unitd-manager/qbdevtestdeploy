'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { DivTag, H2Tag, H4Tag, LITag, SpanTag, ULTag } from '../Common/HTMLTags';
import { normalizeUrl } from "@/utils/urlHelpers";
import { useEmbedScript } from '@/lib/useEmbedScript';

export default function UseCaseSingle({ data }) {
    const embedRef = useRef(null);
    const { loadEmbedContent } = useEmbedScript();

    useEffect(() => {
        if (data?.form_embed_code && embedRef.current) {
            const processedHtml = loadEmbedContent(data.form_embed_code, embedRef.current);
            if (processedHtml) {
                embedRef.current.innerHTML = processedHtml;
            }
        }
    }, [data?.form_embed_code, loadEmbedContent]);

    if (!data || typeof data !== 'object') return null;

    const {
        main_title,
        sub_title,
        posts = [],
        description,
        form_title,
        form_embed_code,
        related_white_papers = [],
        class_name = '',
        id,
        padding
    } = data;

    console.log("datas",data);

    const sidebarData = related_white_papers[0];

    // Build padding class once
    const paddingClass = (() => {
        if (!(padding?.padding_options)) return '';
        const { padding_position = [], desktop_padding = {}, mobile_padding = {} } = padding;
        let cls = '';

        if (padding_position.includes('top')) {
            if (desktop_padding?.padding_top_desktop)
                cls += ` padding-top-desktop-${desktop_padding.padding_top_desktop}px`;
            if (mobile_padding?.padding_top_mobile)
                cls += ` padding-top-mobile-${mobile_padding.padding_top_mobile}px`;
        }

        if (padding_position.includes('bottom')) {
            if (desktop_padding?.padding_bottom_desktop)
                cls += ` padding-bottom-desktop-${desktop_padding.padding_bottom_desktop}px`;
            if (mobile_padding?.padding_bottom_mobile)
                cls += ` padding-bottom-mobile-${mobile_padding.padding_bottom_mobile}px`;
        }

        return cls;
    })();

    return (
        <DivTag className={`white-paper-single ${class_name} ${paddingClass}`} id={id}>
            <DivTag className="container content-flex two-col">
                <DivTag className="main-content-area">
                    <DivTag className="post-content-section">
                        <DivTag>
                            {main_title && <H2Tag dangerouslySetInnerHTML={{ __html: main_title }} />}
                            {sub_title && <H2Tag dangerouslySetInnerHTML={{ __html: sub_title }} />}
                            {description && <DivTag dangerouslySetInnerHTML={{ __html: description }} />}
                        </DivTag>
                    </DivTag>
                </DivTag>

                <DivTag className="sidebar-area">
                    <DivTag className="sidebar-inner">
                        {form_title && 
                   <H2Tag className="form-title" dangerouslySetInnerHTML={{ __html: form_title }} />
                       }
                        {form_embed_code && (
                            <DivTag className="form-embedded">
                                <DivTag ref={embedRef} className="form-embed" id="hubspot-form" />
                            </DivTag>
                        )}

                        {sidebarData && (
                            <DivTag className="sidebar-block">
                                {sidebarData.title && (
                                    <H4Tag
                                        className="sidebar-title"
                                        dangerouslySetInnerHTML={{ __html: sidebarData.title }}
                                    />
                                )}
                                <ULTag className="sidebar-list">
                                    {posts.map((post, index) => (
                                        <LITag key={index}>
                                            <Link
                                                href={normalizeUrl(post.link)}
                                                target="_self"
                                                className="sidebar-link"
                                            >
                                                <SpanTag
                                                    dangerouslySetInnerHTML={{
                                                        __html: post.title,
                                                    }}
                                                />
                                            </Link>
                                        </LITag>
                                    ))}
                                </ULTag>
                            </DivTag>
                        )}
                    </DivTag>
                </DivTag>
            </DivTag>
        </DivTag>
    );
}
