'use client';
import { DivTag, H2Tag, PTag, SectionTag } from '../Common/HTMLTags';
import Link from 'next/link';
import { ArrowRight, ArrowNavLeft, ArrowNavRight } from '../Common/Icons';
import Slider from 'react-slick';
import { useEffect, useRef, useState } from 'react';
import BoxGrid from '../Common/BoxGrid';

export default function FooterCommonCTA({ data }) {
  if (!data || typeof data !== 'object') return null;
  const {
    display_options = [],
    main_title,
    description,
    cta_button
  } = data;

  const showTitle = display_options.includes('main_title');
  const showDescription = display_options.includes('description');
  const showCTA = display_options.includes('cta_button');

  return (
    <SectionTag className="footer-common-cta">
      <BoxGrid position="left" />
      <BoxGrid position="right" />
      <DivTag className="container">
        <DivTag className="row">
          <DivTag className="footer-common-cta-header">
            {showTitle && main_title && <H2Tag className="main-title" dangerouslySetInnerHTML={{ __html: main_title }} />}
            {showDescription && description && <DivTag dangerouslySetInnerHTML={{ __html: description }} />}
            {showCTA && cta_button?.url && (
              <Link href={cta_button.url}
                target={cta_button.target || '_self'} className="btn primary-btn">
                {cta_button.title || 'Learn More'} <ArrowRight className="right-arrow-icon" />
              </Link>
            )}
          </DivTag>
        </DivTag>
      </DivTag>
    </SectionTag>
  );
}