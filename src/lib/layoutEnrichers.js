import { fetchByTestimonialsWithFetch, fetchRecentPost } from './wordpress';

export const layoutEnrichers = {
  home_testimonial_highlight: async (layout) => {
    const raw = layout.home_testimonial_highlight;
    const enriched = await Promise.all(
      (raw?.select_post_type || []).map(async (post) => {
        const testimonial = await fetchByTestimonialsWithFetch(post.ID);
        return {
          post_title: testimonial.title?.rendered ?? '',
          description: testimonial.acf?.description ?? '',
          designation: testimonial.acf?.designation ?? '',
          logo: testimonial.acf?.company_logo?.url ?? '',
          name: testimonial.acf?.name ?? '',
        };
      })
    );
    return {
      ...layout,
      home_testimonial_highlight: {
        ...raw,
        select_post_type: enriched,
      },
    };
  },

  home_blog_post: async (layout) => {
    const raw = layout.home_blog_post;
    let blogPosts = [];

    if (raw?.post_type === 'recent_posts') {
      const posts = await fetchRecentPost({
        post_type: 'posts', // not "recent_posts"
        post_per_page: raw?.post_per_page,
      });

      blogPosts = posts.map((post) => ({
        title: post.title?.rendered ?? '',
        date: new Date(post.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        link: post.link,
      }));
    } else if (raw?.post_type === 'select_post') {
      blogPosts = raw?.select_post?.map((post) => ({
        title: post?.post_title ?? '',
        date: new Date(post?.post_date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        link: post?.guid || `/blog/${post?.post_name}`,
      })) || [];
    }

    return {
      ...layout,
      home_blog_post: {
        ...raw,
        posts: blogPosts,
      },
    };
  },
};
