'use client';

import { useEffect, useState } from 'react';
import { DivTag } from './HTMLTags';
import Link from 'next/link';

export default function TopHeader({ promoText, promoLabel, promoLink }) {
  const [showPromo, setShowPromo] = useState(true);
  const [scrollDir, setScrollDir] = useState('up'); // ✅ fixed
  const [lastY, setLastY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      if (y > lastY && y > 60) {
        setScrollDir('down');
        setShowPromo(false);
      } else if (y < lastY) {
        setScrollDir('up');
        setShowPromo(true);
      }
      setLastY(y);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastY]);

  useEffect(() => {
    const header = document.querySelector('.primary-menu');
    if (header) {
      if (scrollDir === 'down') header.classList.add('scrolled-down');
      else header.classList.remove('scrolled-down');

      if (scrollDir === 'up') header.classList.add('scrolled-up');
      else header.classList.remove('scrolled-up');
    }
  }, [scrollDir]);

  return (
    <DivTag className={`top-header promotion-header ${!showPromo ? 'hidden' : ''}`}>
      {promoText && <span className="font-medium">{promoText}</span>} 
      {promoLink && promoLabel && (
          <Link
            href={promoLink}
            className="promo-link underline font-semibold text-blue-600 hover:text-blue-800 transition-colors font-medium"
          >
            {promoLabel}
          </Link>
        )}
    </DivTag>
  );
}
