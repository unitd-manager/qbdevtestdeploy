'use client';
import { useEffect } from 'react';
import BlogSearchForm from '../Common/BlogSearchForm';
import { DivTag, H1Tag, H2Tag, PTag, SectionTag } from '../Common/HTMLTags';

export default function BlogSearchSection() {
 useEffect(() => {
    const blogListElement = document.getElementById('blog-search-section');
    if (blogListElement) {
      blogListElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <SectionTag className="blog-search-section" id="blog-search-section">
      <DivTag className="container">
        <DivTag className="sub-section">
        <DivTag className="row">
            <DivTag className="content-box">
            <H1Tag className="main-title">Blog</H1Tag>
            <BlogSearchForm />
            </DivTag>
        </DivTag>
      </DivTag>
      </DivTag>
    </SectionTag>
  );
}