'use client';
import { DivTag, H2Tag, SectionTag } from '../Common/HTMLTags';
import Image from 'next/image';

export default function TeamHighlight({ data }) {
  if (!data || typeof data !== 'object') return null;

  const {
    title,
    description,
    image,
    background_color,
    class_name = '',
    id = '',
    padding = {} 
  } = data;
  
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
      <SectionTag className={`team-highlight-section ${class_name}`} id={id}>
        <DivTag className="container" style={{ background: background_color }}>
          <DivTag className={`sub-section ${paddingClass}`} >
            <DivTag className={`row`}>  
                <DivTag className="col-md-12">
              <DivTag className="content-col">
                {title && (
                  <H2Tag
                    className="main-title"
                    dangerouslySetInnerHTML={{ __html: title }}
                  />
                )}
                {description && (
                  <DivTag
                    className="desc"
                    dangerouslySetInnerHTML={{ __html: description }}
                  />
                )}
              </DivTag>
                </DivTag>
<DivTag className="col-md-12 img-col">
           
                                                {image?.url && (
                                                    <DivTag className="img-div">
                                                        <Image
                                                            src={image.url}
                                                            alt={image.alt || 'Image'}
                                                            width={1350}
                                                            height={272}
                                                            className='img-fluid'
                                                        />
                                                    </DivTag>
                                                )}
              
</DivTag>

            </DivTag>
          </DivTag>
        </DivTag>
      </SectionTag>
    </>
  );
}