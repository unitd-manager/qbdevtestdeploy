'use client';
import Link from 'next/link';
import { DivTag, H4Tag, LITag, SectionTag, SpanTag, ULTag } from '../Common/HTMLTags';
import { normalizeUrl } from "@/utils/urlHelpers";
export default function UseCaseIndustryFilter({ data }) {
    if (!data || typeof data !== 'object') return null;
    const {
        main_title,
        categories = [],
        class_name,
        id,
        padding
    } = data;

    const currentCategory = 'active-category';
    let paddingClass = '';
    if (padding?.padding_options && padding.padding_options === true) {
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
        <SectionTag className={`blog-categories ${class_name}`} id={id}>
            <DivTag className="container">
                <DivTag className="sub-section">
                    <DivTag className="row">
                        <DivTag className="col-md-12">
                            { main_title &&  <H4Tag dangerouslySetInnerHTML={{ __html: main_title }} /> }
                            <ULTag className="list-group list-group-horizontal">
                                {categories.length > 0 && 
                                         categories.map((category, index) => (
                                            <li
                                                key={category.id ?? index}
                                                className={`${category.is_active ? 'active-category' : ''}`}
                                            >  
                                                <Link
                                                    href={normalizeUrl(category.category_label_and_link?.url)}
                                                    className="text-decoration-none"
                                                >
                                                    <span>{category.category_label_and_link.title}</span>
                                                </Link>
                                            </li>
                                        ))
                                }
                            </ULTag>
                        </DivTag>
                    </DivTag>
                </DivTag>
            </DivTag>
        </SectionTag>
    );
}