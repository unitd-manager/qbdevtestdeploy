'use client';

import { useEffect, useRef } from 'react';
import { DivTag, H2Tag, SectionTag } from '../Common/HTMLTags';
import Image from 'next/image';

export default function AwardsSection({ data }) {
  const awardSectionRef = useRef(null);
  const awardListRef = useRef(null);
  useEffect(() => {
    const awardSection = awardSectionRef.current;
    const awardList = awardListRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === awardSection && awardList) {
            if (entry.isIntersecting) {
              awardList.classList.add('animate-award');
            } else {
              awardList.classList.remove('animate-award');
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    if (awardSection) observer.observe(awardSection);
    return () => {
      if (awardSection) observer.unobserve(awardSection);
    };
  }, []);

  const award_cert_list = data?.award_and_certificate_list || [];
  const main_title = data?.main_title;
  const padding = data?.padding;
  let paddingClass = '';
  if (padding.padding_options && padding.padding_options === true) {
    const {
      padding_position = [],
      desktop_padding = {},
      mobile_padding = {}
    } = padding;

    if (padding_position.includes('top')) {
      if (desktop_padding?.padding_top_desktop)
        paddingClass += ` padding-top-desktop-${desktop_padding.padding_top_desktop}px`;
      if (mobile_padding?.padding_top_mobile)
        paddingClass += ` padding-top-mobile-${mobile_padding.padding_top_mobile}px`;
    }

    if (padding_position.includes('bottom')) {
      if (desktop_padding?.padding_bottom_desktop)
        paddingClass += ` padding-bottom-desktop-${desktop_padding.padding_bottom_desktop}px`;
      if (mobile_padding?.padding_bottom_mobile)
        paddingClass += ` padding-bottom-mobile-${mobile_padding.padding_bottom_mobile}px`;
    }
  }
  return (
    <>
      <SectionTag className='our-award-info' ref={awardSectionRef}>
        <DivTag className="container our-award-info-data">
          <DivTag className={`sub-section ${paddingClass}`} >
            <DivTag className="row">
              <DivTag className="award-top-title">
                {main_title && (
                  <H2Tag
                    dangerouslySetInnerHTML={{ __html: main_title }}
                  />
                )}
              </DivTag>
              <DivTag className="our-award-list" ref={awardListRef}>
                {award_cert_list.length > 0 &&
                  award_cert_list.map((item, index) => (
                    <DivTag className="our-award-itmes" key={index}>
                      <DivTag className="img-div">
                        <Image src={item.image?.url || ''} alt={item.title || 'award'} fill />
                      </DivTag>
                    </DivTag>
                  ))
                }
              </DivTag>
            </DivTag>
          </DivTag>
        </DivTag>
      </SectionTag>
    </>
  );
}
