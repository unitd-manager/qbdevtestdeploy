'use client';
import { DivTag, H2Tag, PTag, SectionTag } from '../Common/HTMLTags';
import Link from 'next/link';
import { ArrowRight } from '../Common/Icons';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export default function FooterMBG({ data }) {
  const cardRefs = useRef([]);
  const [maxHeight, setMaxHeight] = useState(0); // Add this missing state

  useEffect(() => {
    const calculateMaxHeight = () => {
      let max = 0;
      cardRefs.current.forEach(card => {
        if (card && card.offsetHeight > max) {
          max = card.offsetHeight;
        }
      });
      setMaxHeight(max);
    };

    calculateMaxHeight();

    // Add resize event listener
    const handleResize = () => calculateMaxHeight();
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [isInView, setIsInView] = useState(false);
  const [boxCount, setBoxCount] = useState(0);
  const sectionRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect(); // Trigger once
        }
      },
      { threshold: 0.8 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateGridBoxCount = () => {
      if (sectionRef.current) {
        const sectionHeight = sectionRef.current.offsetHeight;
        const rowHeight = 31; // 30px + 1px gap
        const numRows = Math.ceil(sectionHeight / rowHeight);
        const totalBoxes = numRows * 9; // 9 columns (was commented as 8 but code says 9)
        setBoxCount(totalBoxes);
      }
    };

    updateGridBoxCount();
    window.addEventListener('resize', updateGridBoxCount);
    return () => window.removeEventListener('resize', updateGridBoxCount);
  }, []);

  const title = data?.title;
  const description = data?.description;
  const button = data?.button;
  const image = data?.image;

  return (
    <SectionTag ref={sectionRef} className="footer-mbg-info">
      <DivTag className={`grid-overlay-box right ${isInView ? 'animate' : ''}`}>
        {Array.from({ length: boxCount }).map((_, i) => (
          <span key={`right-${i}`} className="grid-box" style={{ animationDelay: `${i * 0.01}s` }} />
        ))}
      </DivTag>
      <DivTag className="container-fluid">
        <DivTag className="row">
          <DivTag className="col-md-6 left-col-0">
            {image?.url &&
              <DivTag className="img-div">
                <Image src={image?.url || ''} alt={title || ''} fill />
              </DivTag>
            }
          </DivTag>
          <DivTag className="col-md-6 right-col">
            <DivTag className='footer-mbg-top-header'>
              {title && <H2Tag className="main-title" dangerouslySetInnerHTML={{ __html: title }} />}
              {description && <PTag dangerouslySetInnerHTML={{ __html: description }} />}
              {button?.url && (
                <Link href={button?.url} className="btn primary-btn" target={button.target || '_self'}>
                  {button?.title} <ArrowRight className="right-arrow-icon" />
                </Link>
              )}
            </DivTag>
          </DivTag>
        </DivTag>
      </DivTag>
    </SectionTag>
  );
}