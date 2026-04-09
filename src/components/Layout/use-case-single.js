'use client';
import Link from 'next/link';
import { DivTag, H1Tag, H2Tag, H4Tag, LITag, PTag, SpanTag, ULTag } from '../Common/HTMLTags';
import { normalizeUrl } from "@/utils/urlHelpers";
import Image from 'next/image';
export default function UseCaseSingle({ data }) {


  if (!data || typeof data !== 'object') return null;

  const {
    main_title,
    category_name,
    image,
    use_case_items = [],
    sidebar_items = [],
    class_name,
    id,
    padding
  } = data;

  const sidebarData = sidebar_items[0]; 
  let paddingClass = '';
  if (padding?.padding_options && padding.padding_options === true) {
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
    <DivTag className={`use-case-single ${class_name}`} id={id}>
      <DivTag className="container content-flex two-col">
        <DivTag className="main-content-area">
          { (category_name || image.url || category_name) && (
          <DivTag className=" row banner-content-box-row">
            <DivTag className="col">
              <DivTag className="banner-content-box">
                {category_name && (
                  <PTag className="category-name" dangerouslySetInnerHTML={{ __html: category_name }} />
                )}
                {main_title && (
                  <H1Tag className="main-title" dangerouslySetInnerHTML={{ __html: main_title }} />
                )}
              </DivTag>
            </DivTag>
            <DivTag className="col">
              {image?.url && (
                <DivTag className="img-div">
                  <Image
                    src={image.url}
                    alt={image.alt || 'Image'}
                    width={540}
                    height={290}
                    className='img-fluid'
                  />
                </DivTag>
              )}
            </DivTag>
          </DivTag>
           ) }
          {use_case_items.map((post, idx) => (
            <DivTag className="post-content-section" key={idx}>
              <DivTag className="">
                {post.title && <H2Tag dangerouslySetInnerHTML={{ __html: post.title }} />}
                {post.description && (
                  <DivTag dangerouslySetInnerHTML={{ __html: post.description }} />
                )}
                {post.highlight_description && (
                  <DivTag className="highlight-desc" dangerouslySetInnerHTML={{ __html: post.highlight_description }} />
                )}
              </DivTag>
            </DivTag>
          ))}
        </DivTag>
        <DivTag className="sidebar-area">
          <DivTag className="sidebar-inner">
            {sidebar_items?.length > 0 &&
              sidebar_items.map((sidebarBlock, blockIdx) => (
                <DivTag className="sidebar-block" key={blockIdx}>
                  {sidebarBlock?.items?.length > 0 && (
                    <DivTag className="sidebar-content">
                      {sidebarBlock.title && (
                        <H4Tag
                          className="sidebar-title"
                          dangerouslySetInnerHTML={{ __html: sidebarBlock.title }}
                        />
                      )}
                      <ULTag className="sidebar-list">
                        {sidebarBlock.items.map(({ name_and_link }) => (
                          <LITag
                            key={name_and_link?.ID || name_and_link?.title || Math.random()}
                          >
                            <Link
                              href={normalizeUrl(name_and_link?.url)}
                              target={name_and_link?.target || "_self"}
                              rel={
                                name_and_link?.target === "_blank"
                                  ? "noopener noreferrer"
                                  : undefined
                              }
                              className="sidebar-link"
                            >
                              <SpanTag
                                dangerouslySetInnerHTML={{
                                  __html: name_and_link?.title,
                                }}
                              />
                            </Link>
                          </LITag>
                        ))}
                      </ULTag>
                    </DivTag>
                  )}
                </DivTag>
              ))}
          </DivTag>
        </DivTag>

      </DivTag>
    </DivTag>
  );
}