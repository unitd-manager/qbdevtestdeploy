'use client';

import { useState } from 'react';
import { DivTag, H2Tag, H3Tag, PTag, SectionTag } from '../Common/HTMLTags';
import { ArrowDown, ArrowRight, ArrowUp } from '../Common/Icons';

export default function FaqSectionBlock({ data }) {

  const [activeIndex, setActiveIndex] = useState(0);

  if (!data || typeof data !== 'object') return null;


  const {
    display_options = [],
    main_title,
    description,
    faq_question_and_answer = [],
    padding
  } = data;

  const toggleFAQ = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  const showTitle = display_options.includes('main_title');
  const showItem = display_options.includes('faq_question_and_answer_list');
  const showDescription = display_options.includes('description');

  let paddingClass = '';
  if (padding && padding.padding_options && padding.padding_options === true) {
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
    <SectionTag className="faq-section-block">
      <DivTag className="container">
        <DivTag className={`sub-section ${paddingClass}`}>
          {(showTitle || showDescription) && (
            <DivTag className="section-header">
              {showTitle && main_title && <H3Tag dangerouslySetInnerHTML={{ __html: main_title }} />}
              {showDescription && description && <PTag dangerouslySetInnerHTML={{ __html: description }} />}
            </DivTag>
          )}
          {showItem && (
            <DivTag className="accordion">
              {faq_question_and_answer.map((faq, index) => (
                <DivTag key={index} className={`accordion-item ${activeIndex === index ? 'active' : ''}`}>
                  <button className="accordion-header" onClick={() => toggleFAQ(index)}>
                    {faq.question}
                    {activeIndex === index ? <ArrowUp /> : <ArrowDown />}
                  </button>
                  {activeIndex === index && (
                    <DivTag className="accordion-content">
                      <DivTag dangerouslySetInnerHTML={{ __html: faq.answer }} />
                    </DivTag>
                  )}
                </DivTag>
              ))}
            </DivTag>
          )}
        </DivTag>
      </DivTag>
    </SectionTag>
  );
}
