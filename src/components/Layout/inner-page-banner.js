import Link from 'next/link';
import { DivTag, H1Tag, PTag, SectionTag } from '../Common/HTMLTags';
import { ArrowRight } from '../Common/Icons';
import Image from 'next/image';

export default function InnerPageBanner({ data }) {
    if (!data || typeof data !== 'object') return null;
    const {
        sub_title,
        main_title,
        description,
        button,
        logo,
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
        <SectionTag className='inner-page-banner-section'>
            <DivTag className={`container ${paddingClass}`}>
                <DivTag className="row banner-content-box-row">
                    <DivTag className="col-md-7 left-col">
                        <DivTag className="banner-content-box">
                            {main_title && (
                                <H1Tag className="main-title" dangerouslySetInnerHTML={{ __html: main_title }} />
                            )}
                            {description && (
                                <PTag dangerouslySetInnerHTML={{ __html: description }} />
                            )}
                            {button?.url && (
                                <Link href={data.button.url} className="btn primary-btn" target={button.target || "_self"}>
                                    {button.title} <ArrowRight className="right-arrow-icon" />
                                </Link>
                            )}
                        </DivTag>
                    </DivTag>
                    <DivTag className="col-md-5 right-col">
                        {sub_title && (
                            <Link href="#" className="btn banner-btn">
                                {sub_title}
                            </Link>
                        )}
                        {logo?.url && (
                            <DivTag className="logo-img">
                                <Image
                                    src={image.url}
                                    alt={image.alt || 'Logo'}
                                    width={150}
                                    height={75}
                                />
                            </DivTag>
                        )}
                        {image?.url && (
                            <DivTag className="logo-img">
                                <Image
                                    src={image.url}
                                    alt={image.alt || 'Image'}
                                    width={150}
                                    height={150}
                                />
                            </DivTag>
                        )}
                    </DivTag>
                </DivTag>
            </DivTag>
        </SectionTag>
    );
}
