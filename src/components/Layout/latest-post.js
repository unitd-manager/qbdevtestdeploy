'use client';

import { SectionTag, DivTag, H3Tag, PTag, ATag } from '../Common/HTMLTags';
import Image from 'next/image';
import DotGrid from '../Common/DotGrid';
import Link from 'next/link';
import { ArrowRight } from '../Common/Icons';
export default function LatestPost({ data }) {
  if (!data || typeof data !== 'object') return null;
  const {
    title,
    excerpt,
    _embedded,
    date,
    slug
  } = data;
  const featuredImg = _embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    : '';
  const categories = _embedded?.['wp:term']?.[0] || [];
  const categoryNames = categories.map(cat => cat.name).join(', ');

  return (
    <SectionTag className="acf-section content-highlight-block content-highlight-block-left latest-post-section">
      <DotGrid className="right-grid" />
      <DivTag className="container">
        <DivTag className="sub-section">
          <DivTag className={`row align-items-center `}>
            {featuredImg && (
              <DivTag className="col-md-6 img-col">
                <DivTag className="img-wrapper">
                  <Image
                    src={featuredImg}
                     alt={title.rendered}
                    width={666}
                    height={433}
                  />
                </DivTag>
              </DivTag>
            )}
            <DivTag className="col-md-6">
              <DivTag className={`content-box text-left`}>
                 {categoryNames && <PTag dangerouslySetInnerHTML={{ __html: categoryNames }} />}
                {title && <H3Tag dangerouslySetInnerHTML={{ __html: title.rendered }} />}
                  {formattedDate &&  <PTag dangerouslySetInnerHTML={{ __html: formattedDate }} /> }
                {excerpt.rendered && <DivTag dangerouslySetInnerHTML={{ __html: excerpt.rendered }} />}
                {slug && (
                  <Link
                    href={slug}
                    target='_self'
                    className="btn secondary-btn mt-3"
                  >
                    Read More <ArrowRight />
                  </Link>
                )}
              </DivTag>
            </DivTag>
          </DivTag>
        </DivTag>
      </DivTag>
    </SectionTag>
  );
}
