'use client';
import { SectionTag, DivTag, H4Tag, H3Tag } from '../Common/HTMLTags';
import Image from 'next/image';
import CommentForm from '../Common/CommentForm';
import Link from 'next/link';
import DotGrid from '../Common/DotGrid';

export default function FormWithcontact({ data }) {
    if (!data || typeof data !== 'object') return null;

    const {
        pageId,
        show_comment_form,
        comment_form_col = 'col-md-6',
        comment_form_title,
        comment_form_description,
        contact_details = [],
        contact_details_col = 'col-md-6',
        social_media_title,
        social_media_link = [],
        image,
        class_name = '',
        id = '',
        padding = {},
        background_color = '',
    } = data;

    // padding utility classes
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

    return (
        <SectionTag
            className={`form-with-contact-section ${class_name}`}
            id={id}
        >
            <DotGrid className="left-grid" />
            <DotGrid className="right-grid" />
            <DivTag className="container">
                <DivTag className={`sub-section  ${paddingClass}`}>
                    <DivTag className="row">
                        {/* Left: Comment Form */}
                        {show_comment_form && (
                           <DivTag className={`${comment_form_col} ${comment_form_col === 'col-md-12' ? 'full-form-col' : ''} comment-form-col`}>
                                <DivTag className="form-div">
                                    {comment_form_title && (
                                        <H3Tag dangerouslySetInnerHTML={{ __html: comment_form_title }} />
                                    )}
                                    {comment_form_description && (
                                        <DivTag
                                            className=""
                                            dangerouslySetInnerHTML={{ __html: comment_form_description }}
                                        />
                                    )}
                                    <CommentForm postId={data.pageId} />
                                </DivTag>
                            </DivTag>
                        )}
                          { (contact_details.length > 0 || image?.url || social_media_link?.length > 0 ) && (
                        <DivTag className={`${contact_details_col} contact-col`}>
                            {image?.url && (
                                <DivTag className="img-div">
                                    <Image
                                        src={image.url}
                                        alt={image.alt || ''}
                                        width={560}
                                        height={290}
                                        className="img-fluid"
                                    />
                                </DivTag>
                            )}
                            <DivTag className="contact-div">
                                { contact_details.length > 0 &&
                                contact_details?.map((item, i) => (
                                    <DivTag className={`contact-list ${item.type}`} key={i}>
                                        {item.heading && (
                                            <H4Tag dangerouslySetInnerHTML={{ __html: item.heading }} />
                                        )}
                                        {item.content && (
                                            <DivTag
                                                className="text"
                                                dangerouslySetInnerHTML={{ __html: item.content }}
                                            />
                                        )}
                                    </DivTag>
                                ))}

                                {/* Social Media Links */}
                                {social_media_link?.length > 0 && (
                                    <DivTag className="">
                                        {social_media_title && (
                                            <H4Tag className="social-media-title" dangerouslySetInnerHTML={{ __html: social_media_title }} />
                                        )}
                                        <DivTag className="social-media-links">
                                            {social_media_link?.map((item, idx) => (
                                                <Link
                                                    key={idx}
                                                    href={item?.link?.url || "#"}
                                                    target={item?.link?.target || "_self"}
                                                    rel="noopener noreferrer"
                                                >
                                                    <Image
                                                        src={item?.icon}
                                                        alt={item?.link?.title || "social-icon"}
                                                        width={20}
                                                        height={20}
                                                        className="img-fluid"
                                                    />
                                                </Link>
                                            ))}
                                        </DivTag>
                                    </DivTag>
                                )}
                            </DivTag>
                        </DivTag>
    )}
                    </DivTag>
                </DivTag>
            </DivTag>
        </SectionTag>
    );
}
