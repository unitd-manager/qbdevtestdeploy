'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { DivTag, H5Tag, PTag, SpanTag } from '../Common/HTMLTags';

export default function BlogCard({ posts }) {
  const listRef = useRef(null);
  const parentRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          listRef.current?.classList.add('animate-border');
          parentRef.current?.classList.add('animate-border');
        }
      },
      { threshold: 0.5 }
    );

    if (listRef.current) observer.observe(listRef.current);
    if (parentRef.current) observer.observe(parentRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <DivTag className="row card-row" ref={parentRef}>
      {posts?.length > 0 ? (
        posts.map((post, index) => {
          const featuredImg = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
          const formattedDate = post.date
            ? new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
            : '';
          const categories = post._embedded?.['wp:term']?.[0] || [];
          const categoryNames = categories.map(cat => cat.name).join(', ');
          const fullTitle = post.title.rendered || '';
          const [titleBefore, titleAfter] = fullTitle.split(':');
          return (
            <DivTag className="col-md-4 card-col" key={`card-col-${index}`} ref={index === 0 ? listRef : null}>
              <DivTag className="card">
                <DivTag className="img-div">
                  { featuredImg && (
                  <Image
                    src={featuredImg}
                    className="card-img-top"
                    alt={post.title.rendered}
                    width={390}
                    height={310}
                  />
                   )}
                </DivTag>
                <DivTag className="card-body">
                  <DivTag className="blog-info">
                    {post.date && <PTag dangerouslySetInnerHTML={{ __html: formattedDate }} />}
                    {categoryNames && <PTag>{categoryNames}</PTag>}

                  </DivTag>
                  <H5Tag className="card-title">
                    <SpanTag className="title-before">
                      {titleBefore?.trim()}
                      {titleAfter && ':'}
                    </SpanTag>
                    {titleAfter && (
                      <SpanTag className="title-after">
                        {titleAfter?.trim()}
                      </SpanTag>
                    )}
                  </H5Tag>
                   <DivTag className="read-more-wrapper">
                  <Link href={`/${post.slug}`} className="btn secondary-btn">
                    Read More
                  </Link>
                </DivTag>
                </DivTag>
              </DivTag>
            </DivTag>
          );
        })
      ) : (
        <DivTag className="col-md-12">
          <PTag>No blog posts found.</PTag>
        </DivTag>
      )}
    </DivTag>
  );
}
