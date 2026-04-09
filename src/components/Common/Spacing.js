'use client';
import { useEffect, useState } from 'react';
import { DivTag, SectionTag } from '@/components/Common/HTMLTags';

export default function SpacingSection({ data = {} }) {
  const {
    space_height_mobile = 0,
    space_height_desktop = 0,
    background_color = 'transparent',
  } = data;

  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 767);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const paddingValue = isMobile ? space_height_mobile : space_height_desktop;
  return (
    <SectionTag className="spacing-section" style={{
      backgroundColor: background_color,
    }}>
      <DivTag className="container">
        <DivTag
          className="spacing-section"
          style={{
            paddingTop: `${paddingValue}px`,
            paddingBottom: `${paddingValue}px`,
          }}
        />
      </DivTag>
    </SectionTag>
  );
}
