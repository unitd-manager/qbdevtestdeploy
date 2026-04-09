'use client';

import { DivTag, H1Tag, PTag } from './Common/HTMLTags';
import CaseStudySectionRendererWrapper from './CaseStudySectionRendererWrapper';

export default function CaseStudySectionClient({ sections }) {
  if (!sections || sections.length === 0) {
    return (
      <DivTag className="d-flex flex-column justify-content-center align-items-center text-center min-vh-100">
        <H1Tag>No Content Available</H1Tag>
        <PTag>This case study doesnt have any sections yet.</PTag>
      </DivTag>
    );
  }

  return <CaseStudySectionRendererWrapper sections={sections} />;
}
