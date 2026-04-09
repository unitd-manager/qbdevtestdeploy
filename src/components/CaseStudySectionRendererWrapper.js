'use client';

import CaseStudySectionRenderer from './CaseStudySectionRenderer';

export default function CaseStudySectionRendererWrapper({ sections }) {
  return (
    <>
      {sections.map((section, index) => (
        <CaseStudySectionRenderer
          key={`${section.acf_fc_layout}-${index}`}
          section={section}
        />
      ))}
    </>
  );
}
