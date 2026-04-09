import { fetchRecentPost } from '@/lib/wordpress';

export default async function getBlogData(layout) {
  const home_blog_post = layout?.home_blog_post;
  let posts = [];

  if (!home_blog_post) return null;

  if (home_blog_post.post_type === 'recent_posts') {
    try {
      const fetchedPosts = await fetchRecentPost({
        post_type: home_blog_post.post_type,
        post_per_page: home_blog_post.post_per_page,
      });

      posts = fetchedPosts.map(post => ({
        title: post.title?.rendered ?? '',
        date: new Date(post.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        link: post.link,
      }));
    } catch (err) {
      console.error('Error fetching recent posts:', err);
    }
  } else if (home_blog_post.post_type === 'select_post') {
    posts = (home_blog_post.select_post ?? []).map(post => ({
      title: post?.post_title ?? '',
      date: new Date(post?.post_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      link: post?.guid || `/blog/${post?.post_name}`,
    }));
  }

  return {
    main_title: home_blog_post.main_title ?? '',
    description: home_blog_post.description ?? '',
    posts,
  };
}
