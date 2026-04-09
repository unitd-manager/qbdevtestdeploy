import { fetchPostBySlug, fetchRecentPost, fetchCategories, fetchPageBySlug } from '@/lib/wordpress';
import FaqSectionBlock from '@/components/Layout/faq-section-block';
import { DivTag, SectionTag } from '@/components/Common/HTMLTags';
import PostContentSection from '@/components/Layout/post-content-section';
import { generatePageMetadatas, getStructuredData } from '@/lib/rankmath-utils';
import Link from 'next/link';
import { ArrowRight } from '@/components/Common/Icons';
import StructuredData from '@/components/Common/StructuredData';

import {
  DynamicComponent,
  applyPaddingToLayouts,
  processLayoutData
} from '@/lib/page-layout-utils';
import { notFound } from 'next/navigation';

const parent_path = '';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  let data = await fetchPostBySlug(slug);
  let pageType = 'post';

  if (!data) {
    data = await fetchPageBySlug(slug);
    pageType = 'page';
  }

  return generatePageMetadatas(slug, pageType, parent_path, {});
}


export default async function SlugPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  let page_data = await fetchPostBySlug(slug);
  let pageType = 'post';
  if (!page_data || !page_data?.id) {
    page_data = await fetchPageBySlug(slug);
    pageType = 'page'
  }

  const metadata = await generatePageMetadatas(slug, pageType, parent_path, {});
  const structuredData = getStructuredData(metadata);

  if (!page_data) {
    return notFound()
  }

  const postType = page_data?.type || '';
  const layouts = page_data?.acf?.layouts ?? [];
  const categories = await fetchCategories();

  const postData = {
    content: page_data?.content?.rendered || '',
    excerpt_content: page_data?.excerpt?.rendered || '',
    title: page_data?.title?.rendered || '',
    date: page_data?.date || '',
    categories: categories
      .filter(cat => (page_data?.categories || []).includes(cat.id))
      .map(cat => cat.name),
  };

  const recentPosts = await fetchRecentPost({
    post_type: postType,
    post_per_page: 4
  });

  return (
    <DivTag className={`dynamic-page ${slug} ${postType}`}>
      {postType === 'post' ? (

        <DivTag className="single-post-page">
          <StructuredData data={structuredData} />
          <DivTag className="container content-flex two-col">
            <DivTag className="main-content-area">
              <PostContentSection data={postData} />
            </DivTag>
            <DivTag className="sidebar-area">
              <DivTag className="sidebar-inner">
                <DivTag className="sidebar-block sidebar-recent-post">
                  <h4 className="sidebar-title">Recent Posts</h4>
                  <ul className="sidebar-list">
                    {recentPosts.map((post) => (
                      <li key={post.id}>
                        <Link href={`/${post.slug}`} className="sidebar-link">
                          {post.title.rendered}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link href={`/blog`} className='btn secondary-btn'>Learn More <ArrowRight /></Link>
                </DivTag>
                <DivTag className="sidebar-block sidebar-category">
                  <h4 className="sidebar-title">Categories</h4>
                  <ul className="sidebar-list">
                    {categories.map((cat) => (
                      <li key={cat.id}>
                        <Link href={`/blog/category/${cat.slug}`} className="sidebar-link">
                          {cat.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </DivTag>
              </DivTag>
            </DivTag>
          </DivTag>
          {layouts.length > 0 &&
            layouts.map((layout, index) => {
              switch (layout.layout_type) {
                case 'faq_section_block':
                  return layout.faq_section_block ? (
                    <FaqSectionBlock
                      key={`faq-section-block-${index}`}
                      data={layout.faq_section_block}
                    />
                  ) : null;
                default:
                  return null;
              }
            })
          }
        </DivTag>
      ) : postType === 'page' && layouts.length > 0 ? (
        <DivTag className="page-layout-wrapper">
            <StructuredData data={structuredData} />
          {
            (await (async () => {
              let processedLayouts = applyPaddingToLayouts(layouts);
              const finalLayouts = await processLayoutData(processedLayouts);
              return finalLayouts.map(item => (
             
                <DynamicComponent
                  key={`${item.layout.layout_type}-${item.index}`}
                  layout={item.layout}
                  data={item.data}
                  hasCustomPadding={item.hasCustomPadding}
                />
             
              ));
            })())
          }
        </DivTag>
      ) : (
        <SectionTag className="single-usecase-section">
           <StructuredData data={structuredData} />
          <DivTag className="container">
            {postData.content && (
              <DivTag
                className="wp-content"
                dangerouslySetInnerHTML={{ __html: postData.content }}
              />
            )}
          </DivTag>
        </SectionTag>
      )}
    </DivTag>
  );
}
