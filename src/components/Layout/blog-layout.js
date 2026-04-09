import BlogCard from '@/components/Blog/BlogCard';
import BlogPagination from '@/components/Blog/BlogPagination';
import { DivTag, SectionTag } from '../Common/HTMLTags';

export default function BlogLayout({ data, basePath }) {
  const posts = data?.posts || [];
  const currentPage = data?.currentPage || 1;
  const totalPages = data?.totalPages || 1;
  return (
    <SectionTag className="blog-listing" id="blog-list-section">
      <DivTag className="container">
        {posts?.length > 0 && (
          <BlogCard posts={posts} />
        )}
        <BlogPagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath={basePath || "/blog/page"}
        />
      </DivTag>
    </SectionTag>
  );
}