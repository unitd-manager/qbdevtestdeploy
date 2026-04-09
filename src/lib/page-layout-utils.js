import { Suspense, lazy, memo } from 'react';
import { fetchByTestimonialsWithFetch, fetchPostsPagesWithQuery, fetchPostsWithQuery, fetchRecentPost, fetchRelatedPosts } from '@/lib/wordpress';

export const componentMap = {
    'banner_layout': lazy(() => import('@/components/Layout/banner-layout').catch(() => ({ default: () => <div>Failed to load banner</div> }))),
    // 'home_search': lazy(() => import('@/components/Layout/home-search').catch(() => ({ default: () => <div>Failed to load search</div> }))),
    'home_key_highlights': lazy(() => import('@/components/Layout/home-key-highlights').catch(() => ({ default: () => <div>Failed to load highlights</div> }))),
    'home_automation_edge': lazy(() => import('@/components/Layout/home-section-3').catch(() => ({ default: () => <div>Failed to load automation</div> }))),
    'home_industry_automation_solutions': lazy(() => import('@/components/Layout/home-section-4').catch(() => ({ default: () => <div>Failed to load solutions</div> }))),
    'home_featured_case_study': lazy(() => import('@/components/Layout/home-section-5').catch(() => ({ default: () => <div>Failed to load case study</div> }))),
    'home_testimonial_highlight': lazy(() => import('@/components/Layout/home-section-6').catch(() => ({ default: () => <div>Failed to load testimonials</div> }))),
    'home_client_logo': lazy(() => import('@/components/Layout/home-client-logo-section').catch(() => ({ default: () => <div>Failed to load client logos</div> }))),
    'home_awards_and_certificates': lazy(() => import('@/components/Layout/home-awards').catch(() => ({ default: () => <div>Failed to load awards</div> }))),
    'home_award_winner': lazy(() => import('@/components/Layout/home-award-winners').catch(() => ({ default: () => <div>Failed to load award winners</div> }))),
    'home_partner': lazy(() => import('@/components/Layout/home-partner').catch(() => ({ default: () => <div>Failed to load partners</div> }))),
    'home_blog_post': lazy(() => import('@/components/Layout/home-blog-post').catch(() => ({ default: () => <div>Failed to load blog posts</div> }))),
    'blog_layout': lazy(() => import('@/components/Layout/blog-layout').catch(() => ({ default: () => <div>Failed to load blog layout</div> }))),
    'common_cta': lazy(() => import('@/components/Common/FooterMBG').catch(() => ({ default: () => <div>Failed to load CTA</div> }))),
    'footer_common_cta': lazy(() => import('@/components/Layout/footer-common-cta').catch(() => ({ default: () => <div>Failed to load CTA</div> }))),
    'text_image_cta_section': lazy(() => import('@/components/Layout/text-image-cta-section').catch(() => ({ default: () => <div>Failed to load content blocks</div> }))),
    'grid_layout': lazy(() => import('@/components/Layout/grid-layout').catch(() => ({ default: () => <div>Failed to load grid</div> }))),
    'content_highlight_block': lazy(() => import('@/components/Layout/content-highlight-block').catch(() => ({ default: () => <div>Failed to load content highlight</div> }))),
    'info_cta_box': lazy(() => import('@/components/Layout/info-cta-box').catch(() => ({ default: () => <div>Failed to load info CTA</div> }))),
    'faq_section_block': lazy(() => import('@/components/Layout/faq-section-block').catch(() => ({ default: () => <div>Failed to load FAQ</div> }))),
    'side_image_info_blocks': lazy(() => import('@/components/Layout/side-image-info-blocks').catch(() => ({ default: () => <div>Failed to load side image blocks</div> }))),
    'service_overview': lazy(() => import('@/components/Layout/service-overview').catch(() => ({ default: () => <div>Failed to load service overview</div> }))),
    'latest_post': lazy(() => import('@/components/Layout/latest-post').catch(() => ({ default: () => <div>Failed to load latest posts</div> }))),
    'industry_highlight_block': lazy(() => import('@/components/Layout/industry-highlight-block').catch(() => ({ default: () => <div>Failed to load  highlight</div> }))),
    'text_image_split_block': lazy(() => import('@/components/Layout/text-image-split-block').catch(() => ({ default: () => <div>Failed to load  highlight</div> }))),
    'ai_tech_overview': lazy(() => import('@/components/Layout/ai-tech-overview').catch(() => ({ default: () => <div>Failed to load  highlight</div> }))),
    'text_table_block': lazy(() => import('@/components/Layout/text-table-block').catch(() => ({ default: () => <div>Failed to load  highlight</div> }))),
    'industry_ai_use_cases': lazy(() => import('@/components/Layout/industry-ai-use-cases').catch(() => ({ default: () => <div>Failed to load  highlight</div> }))),
    'benefits_grid_layout': lazy(() => import('@/components/Layout/benefits-grid-layout').catch(() => ({ default: () => <div>Failed to load  highlight</div> }))),
    'image_with_keypoints': lazy(() => import('@/components/Layout/image-with-keypoints').catch(() => ({ default: () => <div>Failed to load  highlight</div> }))),
    'image_form_section': lazy(() => import('@/components/Layout/image-form-section').catch(() => ({ default: () => <div>Failed to load  highlight</div> }))),
    'step_cards_section': lazy(() => import('@/components/Layout/step-cards-section').catch(() => ({ default: () => <div>Failed to load  highlight</div> }))),
    'common_slider': lazy(() => import('@/components/Layout/common-slider').catch(() => ({ default: () => <div>Failed to load  highlight</div> }))),
    'solution_hero_banner_with_cta': lazy(() => import('@/components/Layout/solution-hero-banner-with-cta').catch(() => ({ default: () => <div>Failed to load  highlight</div> }))),
    'general_cta_section': lazy(() => import('@/components/Layout/general-cta-section').catch(() => ({ default: () => <div>Failed to load  highlight</div> }))),
    'two_column_text_cta': lazy(() => import('@/components/Layout/two-column-text-cta').catch(() => ({ default: () => <div>Failed to load  highlight</div> }))),
    'image_text_feature_boxes': lazy(() => import('@/components/Layout/image-text-feature-boxes').catch(() => ({ default: () => <div>Failed to load  highlight</div> }))),
    'impact_highlights_section': lazy(() => import('@/components/Layout/impact-highlights-section').catch(() => ({ default: () => <div>Failed to load  highlight</div> }))),
    'solutions_feature_block': lazy(() => import('@/components/Layout/solutions-feature-block').catch(() => ({ default: () => <div>Failed to load  highlight</div> }))),
    'latest_webinars': lazy(() => import('@/components/Layout/latest-webinars').catch(() => ({ default: () => <div>Failed to load  highlight</div> }))),
    'featured_webinars_media': lazy(() => import('@/components/Layout/featured-webinars-media').catch(() => ({ default: () => <div>Failed to load  highlight</div> }))),
    'healthcare_automation_solutions': lazy(() => import('@/components/Layout/healthcare-automation-solutions').catch(() => ({ default: () => <div>Failed to load  highlight</div> }))),
    'collaborations_section': lazy(() => import('@/components/Layout/collaborations-section').catch(() => ({ default: () => <div>Failed to load  highlight</div> }))),
    'partner_highlight_section': lazy(() => import('@/components/Layout/partner-highlight-section').catch(() => ({ default: () => <div>Failed to load  highlight</div> }))),
    'healthcare_automation_tabs': lazy(() => import('@/components/Layout/healthcare-automation-tabs').catch(() => ({ default: () => <div>Failed to load  highlight</div> }))),
    'common_posts_slider': lazy(() => import('@/components/Layout/common-posts-slider').catch(() => ({ default: () => <div>Failed to load common post slider</div> }))),
    'classic_post_slider': lazy(() => import('@/components/Layout/classic-post-slider').catch(() => ({ default: () => <div>Failed to load common post slider</div> }))),
    'resource_grid_layout': lazy(() => import('@/components/Layout/resource-grid-layout').catch(() => ({ default: () => <div>Failed to load common post slider</div> }))),
    'use_cases_grid': lazy(() => import('@/components/Layout/use-cases-grid').catch(() => ({ default: () => <div>Failed to load common post slider</div> }))),
    'automation_cta_block': lazy(() => import('@/components/Layout/automation-cta-block').catch(() => ({ default: () => <div>Failed to load common post slider</div> }))),
    'package_card_section': lazy(() => import('@/components/Layout/package-card-section').catch(() => ({ default: () => <div>Failed to load common post slider</div> }))),
    'solutions_key_benefits': lazy(() => import('@/components/Layout/solutions-key-benefits').catch(() => ({ default: () => <div>Failed to load common post slider</div> }))),
    'use_case_single': lazy(() => import('@/components/Layout/use-case-single').catch(() => ({ default: () => <div>Failed to load common post slider</div> }))),
    'white_paper_single': lazy(() => import('@/components/Layout/white-paper-single').catch(() => ({ default: () => <div>Failed to load common post slider</div> }))),
    'usecase_industry_filter': lazy(() => import('@/components/Layout/usecase-industry-filter').catch(() => ({ default: () => <div>Failed to load common post slider</div> }))),
    'usecase_highlight_block': lazy(() => import('@/components/Layout/usecase-highlight-block').catch(() => ({ default: () => <div>Failed to load common post slider</div> }))),
    'content_layout': lazy(() => import('@/components/Layout/content-layout').catch(() => ({ default: () => <div>Failed to load common post slider</div> }))),
    'section_heading_with_columns': lazy(() => import('@/components/Layout/section-heading-with-columns').catch(() => ({ default: () => <div>Failed to load common post slider</div> }))),
    'content_image_split_block': lazy(() => import('@/components/Layout/content-image-split-block').catch(() => ({ default: () => <div>Failed to load common post slider</div> }))),
    'feature_highlight_block': lazy(() => import('@/components/Layout/feature-highlight-block').catch(() => ({ default: () => <div>Failed to load common post slider</div> }))),
    'partner_showcase_block': lazy(() => import('@/components/Layout/partner-showcase-block').catch(() => ({ default: () => <div>Failed to load common post slider</div> }))),
    'team_highlight_block': lazy(() => import('@/components/Layout/team-highlight-block').catch(() => ({ default: () => <div>Failed to load common post slider</div> }))),
    'hiring_process_steps_layout': lazy(() => import('@/components/Layout/hiring-process-steps-layout').catch(() => ({ default: () => <div>Failed to load common post slider</div> }))),
    'career_openings_section': lazy(() => import('@/components/Layout/career-openings-section').catch(() => ({ default: () => <div>Failed to load common post slider</div> }))),
    'form_with_contact_info': lazy(() => import('@/components/Layout/form-with-contact-info').catch(() => ({ default: () => <div>Failed to load common post slider</div> }))),
    'contact_location_section': lazy(() => import('@/components/Layout/contact-location-section').catch(() => ({ default: () => <div>Failed to load common post slider</div> }))),
    'kognitos_benefits_section': lazy(() => import('@/components/Layout/kognitos-benefits-section').catch(() => ({ default: () => <div>Failed to load common post slider</div> }))),
    'why_kognitos_section': lazy(() => import('@/components/Layout/why-kognitos-section').catch(() => ({ default: () => <div>Failed to load common post slider</div> }))),
    'how_it_works_section': lazy(() => import('@/components/Layout/how-it-works-section').catch(() => ({ default: () => <div>Failed to load common post slider</div> }))),
    'our_capabilities_section': lazy(() => import('@/components/Layout/our-capabilities-section').catch(() => ({ default: () => <div>Failed to load common post slider</div> }))),
    'timeline_sections': lazy(() => import('@/components/Layout/timeline-sections').catch(() => ({ default: () => <div>Failed to load common post slider</div> }))),
    'session_item_sections': lazy(() => import('@/components/Layout/session-item-sections').catch(() => ({ default: () => <div>Failed to load common post slider</div> }))),
    'roundtable_sessions_sections': lazy(() => import('@/components/Layout/roundtable-sessions-sections').catch(() => ({ default: () => <div>Failed to load common post slider</div> }))),
    'spacing': lazy(() => import('@/components/Common/Spacing').catch(() => ({ default: () => <div>Failed to load spacing</div> }))),
    'common_heading_section': lazy(() => import('@/components/Layout/common-heading-section').catch(() => ({ default: () => <div>Failed to load heading section</div> }))),
'common_cta_section': lazy(() => import('@/components/Layout/common-cta').catch(() => ({ default: () => <div>Component failed to load</div> }))),
'use_case_new': lazy(() =>
  import('@/components/Layout/use-case-new')
    .catch(() => ({ default: () => <div>Failed to load</div> }))
),
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

export const applyPaddingToLayouts = (layouts) => {
    let pendingPadding = null;
    return layouts.map((layout, index) => {
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

export const insertSearchSection = (layouts) => {
    const hasSearchSection = layouts.some(layout => layout.layout.layout_type === 'home_search');

    if (!hasSearchSection) {
        const bannerIndex = layouts.findIndex(layout => layout.layout.layout_type === 'banner_layout');

        if (bannerIndex !== -1) {
            const searchSection = {
                layout: { layout_type: 'home_search' },
                data: {},
                index: bannerIndex + 0.5,
                hasCustomPadding: false
            };

            layouts.splice(bannerIndex + 1, 0, searchSection);

            // Reindex subsequent layouts
            layouts.forEach((item, idx) => {
                if (idx > bannerIndex + 1) {
                    item.index = idx;
                }
            });
        }
    }

    return layouts;
};

// Improved testimonials processing with better error handling
const processTestimonials = async (testimonialData) => {
    if (!testimonialData?.select_post_type?.length) {
        return testimonialData;
    }

    try {
        // Process testimonials in parallel with individual error handling
        const testimonialPromises = testimonialData.select_post_type.map(async (post) => {
            try {
                if (!post?.ID) {
                    console.warn('Testimonial post missing ID:', post);
                    return null;
                }

                const testimonial = await fetchByTestimonialsWithFetch(post.ID);

                if (!testimonial) {
                    console.warn(`No testimonial data found for ID: ${post.ID}`);
                    return null;
                }

                return {
                    id: post.ID,
                    post_title: testimonial.title?.rendered || 'Untitled Testimonial',
                    description: testimonial.acf?.description || '',
                    designation: testimonial.acf?.designation || '',
                    logo: testimonial.acf?.company_logo?.url || '',
                    name: testimonial.acf?.name || '',
                };
            } catch (error) {
                console.error(`Failed to fetch testimonial ${post?.ID}:`, error);
                return null;
            }
        });

        const enrichedTestimonials = await Promise.all(testimonialPromises);
        const validTestimonials = enrichedTestimonials.filter(Boolean);

        if (validTestimonials.length === 0) {
            console.warn('No valid testimonials processed');
        }

        return {
            ...testimonialData,
            select_post_type: validTestimonials,
            _processed: true,
            _originalCount: testimonialData.select_post_type.length,
            _processedCount: validTestimonials.length
        };
    } catch (error) {
        console.error('Failed to process testimonials:', error);
        return {
            ...testimonialData,
            select_post_type: [],
            _error: true
        };
    }
};

// Improved blog posts processing
const processBlogPosts = async (blogData) => {
    const defaultReturn = {
        main_title: blogData?.main_title || '',
        description: blogData?.description || '',
        posts: [],
        _processed: true,
        padding: blogData?.padding || null,
    };

    if (!blogData) {
        return defaultReturn;
    }

    try {
        let blogPosts = [];

        if (blogData.post_type === 'recent_posts') {
            const posts = await fetchRecentPost({
                post_type: 'post', // Use 'post' instead of 'recent_posts'
                post_per_page: blogData.post_per_page || 3
            });

            if (posts && Array.isArray(posts)) {
                blogPosts = posts.map(post => ({
                    id: post.id,
                    title: post.title?.rendered || 'Untitled Post',
                    date: post.date ? new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    }) : '',
                    link: post.link || `/blog/${post.slug}`,
                    slug: post.slug,
                }));
            }
        } else if (blogData.post_type === 'select_post' && blogData.select_post) {
            blogPosts = blogData.select_post
                .filter(post => post && post.post_title) // Filter out invalid posts
                .map(post => ({
                    id: post.ID || post.id,
                    title: post.post_title,
                    date: post.post_date ? new Date(post.post_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    }) : '',
                    link: post.guid || `/blog/${post.post_name}`,
                    slug: post.post_name
                }));
        }

        return {
            ...defaultReturn,
            posts: blogPosts,
            _originalCount: Array.isArray(blogData.select_post) ? blogData.select_post.length : 0,
            _processedCount: blogPosts.length
        };
    } catch (error) {
        console.error('Failed to process blog posts:', error);
        return {
            ...defaultReturn,
            _error: true
        };
    }
};

// Improved common posts slider processing
const processCommonPostsSlider = async (sliderData) => {
    const defaultReturn = {
        main_title: sliderData?.main_title || '',
        common_description: sliderData?.common_description || '',
        posts: [],
        _processed: true,
        cta_button: sliderData?.cta_button || null,
        padding: sliderData?.padding || null,
        show_feature_image: sliderData?.show_feature_image || 'yes',
        show_title: sliderData?.show_title || 'yes',
        show_description: sliderData?.show_description || 'yes',
        show_date: sliderData?.show_date || 'yes',
        class_name: sliderData?.class_name || '',
        id: sliderData?.id || ''
    };

    if (!sliderData) {
        return defaultReturn;
    }

    try {
        let posts = [];
        if (Array.isArray(sliderData.selected_items)) {
            posts = sliderData.selected_items
                .filter(item => item && (item.post_title || item.post_name))
                .map(item => {
                    // description (excerpt -> content)
                    const rawDesc =
                        item.post_excerpt ||
                        item.post_content ||
                        "";

                    const desc = rawDesc
                        .replace(/(<([^>]+)>)/gi, "")
                        .split(" ")
                        .slice(0, 20)
                        .join(" ") + (rawDesc.split(" ").length > 20 ? "..." : "");

                    const featuredImage = item.featured_image || null;
                    let slug = item.post_name;
                    if (item.link) {
                        try {
                            const url = new URL(item.link);
                            slug = url.pathname.replace(/^\/|\/$/g, ''); // Remove leading/trailing slashes
                        } catch (e) {
                            // If URL parsing fails, use post_name
                            slug = item.post_name;
                        }
                    }
                    return {
                        id: item.ID || item.id,
                        title: item.post_title || "Untitled",
                        date: item.post_date
                            ? new Date(item.post_date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })
                            : "",
                        link: `/${slug}` || `/${item.post_name}`,
                        slug: slug,
                        type: sliderData.post_type,
                        description: desc,
                        featuredImage,
                        _rawDate: item.post_date || null,
                    };
                });


            // 👉 Apply ORDER BY
            if (sliderData.order_by) {
                switch (sliderData.order_by) {
                    case "date":
                        posts.sort((a, b) => new Date(b._rawDate) - new Date(a._rawDate));
                        break;
                    case "title":
                        posts.sort((a, b) => a.title.localeCompare(b.title));
                        break;
                    case "menu_order":
                        posts.sort((a, b) => (a.menu_order || 0) - (b.menu_order || 0));
                        break;
                    default:
                        break;
                }
            }

            // 👉 Apply POST PER PAGE limit
            if (sliderData.post_per_page && Number(sliderData.post_per_page) > 0) {
                posts = posts.slice(0, Number(sliderData.post_per_page));
            }
        }

        return {
            ...defaultReturn,
            posts,
            _originalCount: sliderData.selected_items?.length || 0,
            _processedCount: posts.length,
        };
    } catch (error) {
        console.error("Failed to process common posts slider:", error);
        return {
            ...defaultReturn,
            _error: true,
        };
    }
};

const processClassicPostQuerySettings = async (queryData) => {
    const defaultReturn = {
        posts: [],
        _processed: true,
        main_title: queryData?.main_title || '',
        description: queryData?.description || '',
        source: queryData?.source || 'posts',
        postsToShow: queryData?.posts_to_show || 'latest_published',
        postsLimit: queryData?.posts_limit || 6,
        filterByCategory: queryData?.filter_by_category || [],
        filterByTag: queryData?.filter_by_tag || [],
        filterByPostFormat: queryData?.filter_by_post_format || 'all',
        show_feature_image: queryData?.show_feature_image || 'yes',
        show_title: queryData?.show_title || 'yes',
        show_description: queryData?.show_description || 'yes',
        show_date: queryData?.show_date || 'yes',
        padding: queryData?.padding || '',
        class_name: queryData?.class_name || '',
        id: queryData?.id || '',
    };

    if (!queryData) {
        return defaultReturn;
    }

    try {
        let posts = [];

        if (queryData.source === 'posts') {
            // Build query parameters
            const queryParams = {
                per_page: queryData.posts_limit === -1 ? 100 : queryData.posts_limit || 6,
                status: 'publish',
                _embed: true,
            };

            switch (queryData.posts_to_show) {
                case 'latest_published':
                    queryParams.orderby = 'date';
                    queryParams.order = 'desc';
                    break;
                case 'oldest_published':
                    queryParams.orderby = 'date';
                    queryParams.order = 'asc';
                    break;
                case 'latest_modified':
                    queryParams.orderby = 'modified';
                    queryParams.order = 'desc';
                    break;
                case 'oldest_modified':
                    queryParams.orderby = 'modified';
                    queryParams.order = 'asc';
                    break;
                case 'title_asc':
                    queryParams.orderby = 'title';
                    queryParams.order = 'asc';
                    break;
                case 'title_desc':
                    queryParams.orderby = 'title';
                    queryParams.order = 'desc';
                    break;
                case 'most_commented':
                    queryParams.orderby = 'comment_count';
                    queryParams.order = 'desc';
                    break;
                case 'random':
                    queryParams.orderby = 'rand';
                    break;
                case 'custom':
                    queryParams.orderby = 'menu_order';
                    queryParams.order = 'asc';
                    break;
                default:
                    queryParams.orderby = 'date';
                    queryParams.order = 'desc';
            }

            if (queryData.filter_by_category && queryData.filter_by_category.length > 0) {
                queryParams.categories = queryData.filter_by_category.join(',');
            }

            if (queryData.filter_by_tag && queryData.filter_by_tag.length > 0) {
                queryParams.tags = queryData.filter_by_tag.join(',');
            }

            if (queryData.filter_by_post_format && queryData.filter_by_post_format !== 'all') {
                queryParams.meta_query = [
                    {
                        key: '_post_format',
                        value: `post-format-${queryData.filter_by_post_format}`,
                        compare: '='
                    }
                ];
            }

            // Fetch posts using your existing function
            const fetchedPosts = await fetchPostsWithQuery(queryParams);
            if (fetchedPosts && Array.isArray(fetchedPosts)) {
                posts = fetchedPosts.map(post => {
                    const rawDesc =
                        post.excerpt?.rendered ||
                        post.content?.rendered ||
                        "";

                    const desc = rawDesc
                        .replace(/(<([^>]+)>)/gi, "") // strip HTML
                        .split(" ")
                        .slice(0, 20)
                        .join(" ") + (rawDesc.split(" ").length > 20 ? "..." : "");

                    return {
                        id: post.id,
                        title: post.title?.rendered || 'Untitled Post',
                        date: post.date
                            ? new Date(post.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })
                            : '',
                        modified: post.modified
                            ? new Date(post.modified).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })
                            : '',
                        link: `/${post.slug}`,
                        slug: post.slug,
                        excerpt: desc || "", // fallback to our generated short desc
                        featuredImage: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
                        categories: post._embedded?.['wp:term']?.[0] || [],
                        tags: post._embedded?.['wp:term']?.[1] || [],
                        commentCount: post.comment_count || 0,
                        format: post.format || 'standard',
                        _rawDate: post.date,
                        _rawModified: post.modified,
                    };
                });
            }

        } else if (queryData.source === 'related') {
            posts = await fetchRelatedPosts(queryData);
        }

        return {
            ...defaultReturn,
            posts,
            _originalCount: posts.length,
            _processedCount: posts.length
        };
    } catch (error) {
        console.error('Failed to process post query settings:', error);
        return {
            ...defaultReturn,
            _error: true
        };
    }
};

const processWhitePaperQuerySettings = async (queryData) => {

    const defaultReturn = {
        posts: [],
        _processed: true,
        main_title: queryData?.main_title || '',
        sub_title: queryData?.sub_title || '',
        description: queryData?.description || '',
        related_white_papers: queryData?.related_white_papers || '',
        form_title: queryData?.form_title || '',
        form_embed_code: queryData?.form_embed_code || '',
        source: queryData?.related_white_papers[0].source || 'posts',
        postsToShow: queryData?.related_white_papers[0].posts_to_show || 'latest_published',
        postsLimit: queryData?.related_white_papers[0].posts_limit || 6,
        padding: queryData?.padding || '',
        class_name: queryData?.class_name || '',
        id: queryData?.id || '',
    };

    if (!queryData) {
        return defaultReturn;
    }

    try {
        let posts = [];
        const source = queryData.related_white_papers[0].source;
        if (source === 'posts' || source === 'pages') {
            // Build query parameters
            const queryParams = {
                per_page:
                    queryData.related_white_papers[0].posts_limit === -1
                        ? 100
                        : queryData.related_white_papers[0].posts_limit || 6,
                status: 'publish',
                _embed: true,
            };

            switch (queryData.related_white_papers[0].posts_to_show) {
                case 'latest_published':
                    queryParams.orderby = 'date';
                    queryParams.order = 'desc';
                    break;
                case 'oldest_published':
                    queryParams.orderby = 'date';
                    queryParams.order = 'asc';
                    break;
                case 'latest_modified':
                    queryParams.orderby = 'modified';
                    queryParams.order = 'desc';
                    break;
                case 'oldest_modified':
                    queryParams.orderby = 'modified';
                    queryParams.order = 'asc';
                    break;
                case 'title_asc':
                    queryParams.orderby = 'title';
                    queryParams.order = 'asc';
                    break;
                case 'title_desc':
                    queryParams.orderby = 'title';
                    queryParams.order = 'desc';
                    break;
                case 'most_commented':
                    queryParams.orderby = 'comment_count';
                    queryParams.order = 'desc';
                    break;
                case 'random':
                    queryParams.orderby = 'rand';
                    break;
                case 'custom':
                    queryParams.orderby = 'menu_order';
                    queryParams.order = 'asc';
                    break;
                default:
                    queryParams.orderby = 'date';
                    queryParams.order = 'desc';
            }

            // Fetch posts or pages depending on source
            const fetchedItems = await fetchPostsPagesWithQuery(queryParams, source);

            if (fetchedItems && Array.isArray(fetchedItems)) {
                posts = fetchedItems.map(item => {
                    const rawDesc =
                        item.excerpt?.rendered || item.content?.rendered || "";

                    const desc =
                        rawDesc.replace(/(<([^>]+)>)/gi, "") // strip HTML
                            .split(" ")
                            .slice(0, 20)
                            .join(" ") +
                        (rawDesc.split(" ").length > 20 ? "..." : "");

                    return {
                        id: item.id,
                        title: item.title?.rendered || (source === "pages" ? "Untitled Page" : "Untitled Post"),
                        date: item.date
                            ? new Date(item.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })
                            : "",
                        modified: item.modified
                            ? new Date(item.modified).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })
                            : "",
                        link: `/${item.slug}`,
                        slug: item.slug,
                        format: item.format || "standard",
                        _rawDate: item.date,
                        _rawModified: item.modified,
                        desc,
                    };
                });
            }
        }

        return {
            ...defaultReturn,
            posts,
            _originalCount: posts.length,
            _processedCount: posts.length
        };
    } catch (error) {
        console.error('Failed to process post query settings:', error);
        return {
            ...defaultReturn,
            _error: true
        };
    }
};
// Main processing function with better error handling and logging
export const processLayoutData = async (processedLayouts) => {
    if (!Array.isArray(processedLayouts)) {
        console.warn('processLayoutData received invalid layouts:', processedLayouts);
        return [];
    }

    const testimonialLayouts = [];
    const blogLayouts = [];
    const regularLayouts = [];
    const commonPostsLayouts = [];
    const classicPostsLayouts = [];
    const whitePapersLayouts = [];

    // Categorize layouts
    processedLayouts.forEach((item) => {
        if (!item?.layout?.layout_type) {
            console.warn('Invalid layout item:', item);
            return;
        }

        const layoutType = item.layout.layout_type;
        switch (layoutType) {
            case 'home_testimonial_highlight':
                testimonialLayouts.push(item);
                break;
            case 'home_blog_post':
                blogLayouts.push(item);
                break;
            case 'common_posts_slider':
                commonPostsLayouts.push(item);
                break;
            case 'classic_post_slider':
                classicPostsLayouts.push(item);
                break;
            case 'white_paper_single':
                whitePapersLayouts.push(item);
                break;
            default:
                regularLayouts.push(item);
        }
    });

    try {
        // Process testimonials and blogs in parallel
        const [processedTestimonials, processedBlogs, processedCommonSliders, processedClassicSliders, processedWhitePaperPosts] = await Promise.all([
            Promise.all(testimonialLayouts.map(async (item) => {
                try {
                    const processedData = await processTestimonials(item.data);
                    return { ...item, data: processedData };
                } catch (error) {
                    console.error('Failed to process testimonial layout:', error);
                    return { ...item, data: { ...item.data, _error: true } };
                }
            })),
            Promise.all(blogLayouts.map(async (item) => {
                try {
                    const processedData = await processBlogPosts(item.data);
                    return { ...item, data: processedData };
                } catch (error) {
                    console.error('Failed to process blog layout:', error);
                    return { ...item, data: { ...item.data, _error: true } };
                }
            })),
            Promise.all(commonPostsLayouts.map(async (item) => {
                try {
                    const processedData = await processCommonPostsSlider(item.data);
                    return { ...item, data: processedData };
                } catch (error) {
                    console.error('Failed to process common posts slider layout:', error);
                    return { ...item, data: { ...item.data, _error: true } };
                }
            })),
            Promise.all(classicPostsLayouts.map(async (item) => {
                try {
                    const processedData = await processClassicPostQuerySettings(item.data);
                    return { ...item, data: processedData };
                } catch (error) {
                    console.error('Failed to process common posts slider layout:', error);
                    return { ...item, data: { ...item.data, _error: true } };
                }
            })),
            Promise.all(whitePapersLayouts.map(async (item) => {
                try {
                    const processedData = await processWhitePaperQuerySettings(item.data);
                    return { ...item, data: processedData };
                } catch (error) {
                    console.error('Failed to process common posts slider layout:', error);
                    return { ...item, data: { ...item.data, _error: true } };
                }
            }))
        ]);

        const allLayouts = [
            ...processedTestimonials,
            ...processedBlogs,
            ...processedCommonSliders,
            ...processedClassicSliders,
            ...processedWhitePaperPosts,
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
export const validateLayoutData = (layouts) => {
    if (!Array.isArray(layouts)) {
        return { isValid: false, errors: ['Layouts must be an array'] };
    }

    const errors = [];
    layouts.forEach((layout, index) => {
        if (!layout?.layout_type) {
            errors.push(`Layout at index ${index} missing layout_type`);
        } else if (!componentMap[layout.layout_type]) {
            errors.push(`Unknown layout_type "${layout.layout_type}" at index ${index}`);
        }
    });

    return {
        isValid: errors.length === 0,
        errors,
    };
};
