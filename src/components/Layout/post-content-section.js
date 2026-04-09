'use client';

import { DivTag, H1Tag, PTag, SectionTag } from '@/components/Common/HTMLTags';

export default function PostContentSection({ data }) {
  if (!data) return null;
  const {
    content = '',
    date = '',
    title = '',
    excert_content = '',
    categories = '',
  } = data;
  const formattedDate = date
  ? new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  : '';
  return (
    <SectionTag className="post-content-section">
      <DivTag className="container">
        <DivTag className="wp-content">
          <DivTag className="blog-info">
            {date && <PTag dangerouslySetInnerHTML={{ __html: formattedDate }} />}
            {categories && <PTag dangerouslySetInnerHTML={{ __html: categories }} />}
          </DivTag>
          {title && <H1Tag dangerouslySetInnerHTML={{ __html: title }} />}
          {content && <DivTag dangerouslySetInnerHTML={{ __html: content }} />}
        </DivTag>
      </DivTag>
    </SectionTag>
  );
}
