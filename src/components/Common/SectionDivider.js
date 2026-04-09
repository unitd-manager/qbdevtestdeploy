'use client';

import { DivTag } from '../Common/HTMLTags';

export default function SectionDivider({ className = '' }) {
  return (
    <DivTag className={`divider-boder ${className}`}>
      <DivTag className="container">
      </DivTag>
    </DivTag>
  );
}
