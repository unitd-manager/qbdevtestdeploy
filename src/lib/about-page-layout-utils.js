import { Suspense, lazy, memo } from 'react';
import { fetchByTestimonialsWithFetch, fetchPostsPagesWithQuery, fetchPostsWithQuery, fetchRecentPost, fetchRelatedPosts } from '@/lib/wordpress';

export const componentMap = {
    'about_banner_layout': lazy(() => import('@/components/Layout/about-banner-layout').catch(() => ({ default: () => <div>Failed to load</div> }))),
    'about_awards_section': lazy(() => import('@/components/Layout/about-awards-section').catch(() => ({ default: () => <div>Failed to load</div> }))),
    'about_partner_section': lazy(() => import('@/components/Layout/about-partner-section').catch(() => ({ default: () => <div>Failed to load</div> }))),
    'about_client_logo_section': lazy(() => import('@/components/Layout/about-client-logo-section').catch(() => ({ default: () => <div>Failed to load</div> }))),
    'about_team_section': lazy(() => import('@/components/Layout/about-team-section').catch(() => ({ default: () => <div>Failed to load</div> }))),
    'about_company_ethos_section': lazy(() => import('@/components/Layout/about-company-ethos-section').catch(() => ({ default: () => <div>Failed to load</div> }))),
    'about_grid_layout': lazy(() => import('@/components/Layout/about-grid-layout').catch(() => ({ default: () => <div>Failed to load</div> }))),
    'about_diversity_section': lazy(() => import('@/components/Layout/about-diversity-section').catch(() => ({ default: () => <div>Failed to load</div> }))),
    'about_training_section': lazy(() => import('@/components/Layout/about-training-section').catch(() => ({ default: () => <div>Failed to load</div> }))),
    'about_strategic_highlights_section': lazy(() => import('@/components/Layout/about-strategic-highlights-section').catch(() => ({ default: () => <div>Failed to load</div> }))),
    'about_latest_updates_section': lazy(() => import('@/components/Layout/about-latest-updates-section').catch(() => ({ default: () => <div>Failed to load</div> }))),
    'about_location_section': lazy(() => import('@/components/Layout/about-location-section').catch(() => ({ default: () => <div>Failed to load</div> }))),
};

export const DynamicComponent = memo(({ layout, data, hasCustomPadding = false }) => {
    const Component = componentMap[layout.layout_type];

    if (!Component) {
        console.warn(`Component not found for layout type: ${layout.layout_type}`);
        return <div className="error-component">Unknown component: {layout.layout_type}</div>;
    }

    const containerStyle = hasCustomPadding && data?.padding ? {
        paddingTop: data.padding.padding_top || 0,
        paddingBottom: data.padding.padding_bottom || 0,
        paddingLeft: data.padding.padding_left || 0,
        paddingRight: data.padding.padding_right || 0,
    } : {};

    const containerClasses = hasCustomPadding && data?.padding ?
        `dynamic-section ${data.padding.css_classes || ''}` :
        'dynamic-section';

    return (
        <div style={containerStyle} className={containerClasses}>
            <Suspense fallback={<div className="animate-pulse bg-gray-100 h-32 rounded flex items-center justify-center"></div>}>
                <Component data={data} />
            </Suspense>
        </div>
    );
});

DynamicComponent.displayName = 'DynamicComponent';

export const applyPaddingToLayouts = (about_page_layouts) => {
    let pendingPadding = null;
    return about_page_layouts.map((layout, index) => {
        const layoutType = layout.layout_type;

        // Handle spacing/padding layouts
        if (layout.section_space_padding) {
            pendingPadding = layout.section_space_padding;
            if (!layout[layoutType]) return null;
        }

        let processedData = layout[layoutType];
        let hasCustomPadding = false;

        // Apply pending padding to next layout
        if (pendingPadding) {
            processedData = {
                ...processedData,
                padding: pendingPadding,
            };
            hasCustomPadding = true;
            pendingPadding = null;
        }

        return {
            layout,
            data: processedData,
            index,
            hasCustomPadding
        };
    }).filter(Boolean);
};

// Main processing function with better error handling and logging
export const processLayoutData = async (processedLayouts) => {
    if (!Array.isArray(processedLayouts)) {
        console.warn('processLayoutData received invalid layouts:', processedLayouts);
        return [];
    }

    const regularLayouts = [];

    // Categorize layouts
    processedLayouts.forEach((item) => {
        if (!item?.layout?.layout_type) {
            console.warn('Invalid layout item:', item);
            return;
        }

        const layoutType = item.layout.layout_type;
        switch (layoutType) {
            default:
                regularLayouts.push(item);
        }
    });

    try {
        // Process testimonials and blogs in parallel
        // const [processedTestimonials, processedBlogs, processedCommonSliders, processedClassicSliders, processedWhitePaperPosts] = await Promise.all([
        //     Promise.all(testimonialLayouts.map(async (item) => {
        //         try {
        //             const processedData = await processTestimonials(item.data);
        //             return { ...item, data: processedData };
        //         } catch (error) {
        //             console.error('Failed to process testimonial layout:', error);
        //             return { ...item, data: { ...item.data, _error: true } };
        //         }
        //     })),
        //     Promise.all(blogLayouts.map(async (item) => {
        //         try {
        //             const processedData = await processBlogPosts(item.data);
        //             return { ...item, data: processedData };
        //         } catch (error) {
        //             console.error('Failed to process blog layout:', error);
        //             return { ...item, data: { ...item.data, _error: true } };
        //         }
        //     })),
        //     Promise.all(commonPostsLayouts.map(async (item) => {
        //         try {
        //             const processedData = await processCommonPostsSlider(item.data);
        //             return { ...item, data: processedData };
        //         } catch (error) {
        //             console.error('Failed to process common posts slider layout:', error);
        //             return { ...item, data: { ...item.data, _error: true } };
        //         }
        //     })),
        //     Promise.all(classicPostsLayouts.map(async (item) => {
        //         try {
        //             const processedData = await processClassicPostQuerySettings(item.data);
        //             return { ...item, data: processedData };
        //         } catch (error) {
        //             console.error('Failed to process common posts slider layout:', error);
        //             return { ...item, data: { ...item.data, _error: true } };
        //         }
        //     })),
        //     Promise.all(whitePapersLayouts.map(async (item) => {
        //         try {
        //             const processedData = await processWhitePaperQuerySettings(item.data);
        //             return { ...item, data: processedData };
        //         } catch (error) {
        //             console.error('Failed to process common posts slider layout:', error);
        //             return { ...item, data: { ...item.data, _error: true } };
        //         }
        //     }))
        // ]);

        const allLayouts = [
            ...regularLayouts
        ];
        return allLayouts.sort((a, b) => (a.index || 0) - (b.index || 0));

    } catch (error) {
        console.error('Failed to process layout data:', error);
        // Return original layouts if processing fails
        return processedLayouts;
    }
};

// Helper function to validate layout data
export const validateLayoutData = (about_page_layouts) => {
    if (!Array.isArray(about_page_layouts)) {
        return { isValid: false, errors: ['Layouts must be an array'] };
    }

    const errors = [];
    about_page_layouts.forEach((layout, index) => {
        if (!about_page_layouts?.layout_type) {
            errors.push(`Layout at index ${index} missing layout_type`);
        }
        if (!componentMap[layout?.layout_type]) {
            errors.push(`Unknown component type: ${layout?.layout_type} at index ${index}`);
        }
    });

    return {
        isValid: errors.length === 0,
        errors
    };
};