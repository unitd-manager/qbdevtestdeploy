'use client';
import Link from 'next/link';
import { DivTag, H1Tag, H3Tag, PTag, SectionTag } from '../Common/HTMLTags';
import { ArrowRight } from '../Common/Icons';
import Image from 'next/image';
import DotGrid from '../Common/DotGrid';
export default function SideImageInfoBlocks({ data }) {
    if (!data || typeof data !== 'object') return null;
    const {
        image,
        info_list = [],
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
        <>
            <SectionTag className='service-ai-workflow-section'>
                <DotGrid className="right-grid" />
                <DivTag className={`container-fluid ${paddingClass}`}>
                    <DivTag className="dot-grid right-grid" />
                    <DivTag className="row">
                        <DivTag className="col-md-7 left-col">
                            <DivTag className="img-div">
                                {image?.url && (
                                    <Image src={image.url} alt={image.alt || 'Section Image'} fill />
                                )}
                            </DivTag>
                        </DivTag>
                        <DivTag className="col-md-5 right-col">
                            <DivTag className="content-box ">
                                {info_list?.map((item, idx) => (
                                    <DivTag key={idx} className="item-list">
                                        <DivTag className="icon">
                                            <Image
                                                src={item.icon?.url}
                                                alt={item.icon?.alt || item.title}
                                                width={46}
                                                height={46}
                                            />
                                        </DivTag>
                                        <H3Tag className="icon-h3">{item.title}</H3Tag>
                                        <PTag>{item.description}</PTag>
                                    </DivTag>
                                ))}
                            </DivTag>
                        </DivTag>
                    </DivTag>
                </DivTag>
            </SectionTag>
        </>
    )
}
