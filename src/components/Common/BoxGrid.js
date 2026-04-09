'use client';

import { useEffect, useRef, useState } from 'react';
import { DivTag } from '../Common/HTMLTags';

export default function BoxGrid({ position = 'left' }) {
  const sectionRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const [boxCount, setBoxCount] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.8 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Only calculate box count when in view
    if (!isInView) return;
    
    const updateGridBoxCount = () => {
      if (sectionRef.current) {
        const sectionHeight = sectionRef.current.offsetHeight;
        const rowHeight = 31;
        const numRows = Math.ceil(sectionHeight / rowHeight);
        setBoxCount(numRows * 17);
      }
    };

    updateGridBoxCount();
    window.addEventListener('resize', updateGridBoxCount);
    return () => window.removeEventListener('resize', updateGridBoxCount);
  }, [isInView]);

  return (
    <DivTag 
      ref={sectionRef} 
      className={`grid-overlay-box ${position} ${isInView ? 'animate' : ''}`}
    >
      {/* Only render boxes when in view */}
      {isInView && Array.from({ length: boxCount }).map((_, i) => (
        <span 
          key={`${position}-${i}`} 
          className="grid-box" 
          style={{ animationDelay: `${i * 0.01}s` }} 
        />
      ))}
    </DivTag>
  );
}