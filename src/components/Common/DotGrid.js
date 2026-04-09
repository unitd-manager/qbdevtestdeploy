'use client';

import { useEffect, useRef } from 'react';
import { DivTag } from '../Common/HTMLTags';

export default function DotGrid({ className = '' }) {
  const gridRef = useRef(null);

  useEffect(() => {
    const generateDots = (container) => {
      if (!container) return;
      container.innerHTML = '';
      const totalCols = 20;
      const rowHeight = 12;
      const totalRows = Math.floor(container.offsetHeight / rowHeight);
      let i = 0;

      for (let row = 0; row < totalRows; row++) {
        for (let col = 0; col < totalCols; col++) {
          const dot = document.createElement('span');
          dot.style.setProperty('--i', i);
          container.appendChild(dot);
          i++;
        }
      }
    };

    generateDots(gridRef.current);
  }, []);

  return <DivTag ref={gridRef} className={`dot-grid ${className}`} />;
}
