'use client';
import { DivTag, H2Tag, PTag, SectionTag } from '../Common/HTMLTags';
import { useState, useEffect } from 'react';

export default function OurCapabilitiesSection({ data }) {
    // Hooks must always run
    const [capabilities, setCapabilities] = useState([]);

    const {
        our_capabilities = [],
        class_name,
        id,
        padding = {},
    } = data || {}; // safe destructure

    // Build padding classes
    let paddingClass = '';
    if (padding?.padding_options) {
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

    useEffect(() => {
        if (Array.isArray(our_capabilities)) {
            setCapabilities(our_capabilities);
        }
    }, [our_capabilities]);

    // Conditional render happens here (not before hooks)
    if (!data || typeof data !== 'object') {
        return null;
    }

    return (
        <SectionTag className={`our-capabilities-section ${class_name || ''}`} id={id || ''}>
            <DivTag className={`sub-section ${paddingClass}`}>
                <DivTag className="capabilities-row">
                    {capabilities.map((item, index) => {
                        const bgType = item.background_type || 'color';
                        const bgColor = item.background_color || '#000';
                        const bgImage = item.background_image?.url || '';

                        const style = {};
                        if (bgType === 'color') {
                            style.backgroundColor = bgColor;
                        } else if (bgType === 'image') {
                            style.backgroundImage = `url(${bgImage})`;
                        }

                        const itemClass =
                            bgType === 'image' ? 'capability-item bg-img-available' : 'capability-item bg-color-available';

                        return (
                            <DivTag key={index} className={itemClass} style={style}>
                                <DivTag className="capability-content">
                                    {item.title && (
                                        <H2Tag
                                            className="capability-title"
                                            dangerouslySetInnerHTML={{ __html: item.title }}
                                        />
                                    )}
                                    {item.description && (
                                        <PTag
                                            className="capability-description"
                                            dangerouslySetInnerHTML={{ __html: item.description }}
                                        />
                                    )}
                                </DivTag>
                            </DivTag>
                        );
                    })}
                </DivTag>
            </DivTag>
        </SectionTag>
    );
}
