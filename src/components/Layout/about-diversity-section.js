'use client';
import { SectionTag, DivTag, PTag, H5Tag, H2Tag } from '../Common/HTMLTags';

export default function AboutDiversity({ data }) {
    if (!data || typeof data !== 'object') return null;
    const {
        title,
        name,
        description,
        designation,
        class_name = '',
        id = '',
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
        <SectionTag className={`about-diversity-section ${class_name}`} id={id} >
            <DivTag className="container">
                <DivTag className={`sub-section ${paddingClass}`}>
                    <DivTag className="row">
                        <DivTag className="col-md-12">
                            <DivTag className="content-box">
                                {title && <H2Tag dangerouslySetInnerHTML={{ __html: title }} className="main-title" />}
                                {description && <DivTag dangerouslySetInnerHTML={{ __html: description }} />}
                                {name && <H5Tag className="name" dangerouslySetInnerHTML={{ __html: name }} />}
                                {designation && <PTag className="designation" dangerouslySetInnerHTML={{ __html: designation }} />}
                            </DivTag>
                        </DivTag>
                    </DivTag>
                </DivTag>
            </DivTag>
        </SectionTag>
    );
}
