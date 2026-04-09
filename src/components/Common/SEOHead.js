'use client';

import { useEffect } from 'react';

export default function SEOHead({ metaHTML }) {
  useEffect(() => {
    if (!metaHTML) return;

    const container = document.createElement('div');
    container.innerHTML = metaHTML;

    const headTags = Array.from(container.children);

    headTags.forEach((tag) => {
      const existing = document.head.querySelector(
        `${tag.tagName.toLowerCase()}[name="${tag.getAttribute('name')}"],` +
        `${tag.tagName.toLowerCase()}[property="${tag.getAttribute('property')}"],` +
        `${tag.tagName.toLowerCase()}[rel="${tag.getAttribute('rel')}"]`
      );
      if (existing) existing.remove();

      document.head.appendChild(tag);
    });

   
  }, [metaHTML]);

  return null;
}
