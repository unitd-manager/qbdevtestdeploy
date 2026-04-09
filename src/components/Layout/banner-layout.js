import Link from 'next/link';
import { DivTag, H1Tag, H2Tag, H3Tag, PTag, SectionTag } from '../Common/HTMLTags';
import { ArrowRight } from '../Common/Icons';
import Image from 'next/image';
import HomeBannerSlider from '../Common/HomeBannerSlider';
export default function HomeBanner({ data }) {
  if (!data) return null;
  const {
    page_type,
    sub_title,
    main_title,
    description,
    button,
    secondary_button,
    inner_video,
    mobile_inner_video,
    logo,
    padding,
    image,
    banner_image,
    background_image,
    banner_two_images
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
    page_type === "home" ? (
      <SectionTag className='home-banner-section'>
        <DivTag className="container">
          <DivTag className={`${paddingClass}`} >
            <DivTag className="row banner-content-box-row">
              <DivTag className="col-md-5">
                <DivTag className="banner-content-box">
                  {sub_title && (
                    <Link href="#" className="btn banner-btn">
                      {sub_title}
                    </Link>
                  )}
                  {main_title && (
                    <H1Tag className="main-title" dangerouslySetInnerHTML={{ __html: main_title }} />
                  )}
                  {description && (
                    <DivTag dangerouslySetInnerHTML={{ __html: description }} />
                  )}
                  {(button?.url || secondary_button?.url) && (
                    <DivTag className="button-group">
                      {button?.url && (
                        <Link href={data.button.url} className="btn primary-btn" target={button.target || "_self"}>
                          {button.title} <ArrowRight className="right-arrow-icon" />
                        </Link>
                      )}
                      {secondary_button?.url && (
                        <Link href={secondary_button.url} className="btn primary-btn ms-3" target={secondary_button.target || "_self"} rel={secondary_button.target === "_blank" ? "noopener noreferrer" : undefined}>
                          {secondary_button.title} <ArrowRight className="right-arrow-icon" />
                        </Link>
                      )}
                    </DivTag>
                  )}
                </DivTag>
              </DivTag>
              <DivTag className="col-md-7 banner-video-col">
                {inner_video && (
                  <DivTag className="banner-video-box desktop-inner-video">
                    <video autoPlay muted loop playsInline>
                      <source src={data.inner_video?.url || ''} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </DivTag>
                )}
                {mobile_inner_video && (
                  <DivTag className="banner-video-box mobile-inner-video">
                    <video autoPlay muted loop playsInline>
                      <source src={data.mobile_inner_video?.url || ''} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </DivTag>
                )}
              </DivTag>
            </DivTag>
          </DivTag>
        </DivTag>
        </SectionTag>) : page_type === "home_two" ? (
        <SectionTag className='home-two-banner-section'>
          <DivTag className="container">
            <DivTag className="sub-section">
            <HomeBannerSlider data={data} />
            </DivTag>
          </DivTag>
        </SectionTag>
      ) : page_type === "platform" ? (
        <SectionTag className='platform-page-banner-section' >
          <DivTag className="container" style={{ backgroundImage: `url(${background_image?.url})` }}>
            <DivTag className={`${paddingClass}`} >
              <DivTag className="row banner-content-box-row">
                <DivTag className="col-md-12 content-col">
                  <DivTag className="banner-content-box">
                    {main_title && (
                      <H1Tag className="" dangerouslySetInnerHTML={{ __html: main_title }} />
                    )}
                    {image?.url && (
                      <DivTag className="img-div">
                        <Image src={image.url} alt={image.alt || 'Image'} width={150} height={150} />
                      </DivTag>
                    )}
                    {sub_title && (
                      <H2Tag className="sub-title" dangerouslySetInnerHTML={{ __html: sub_title }} />
                    )}
                    {description && (
                      <DivTag dangerouslySetInnerHTML={{ __html: description }} />
                    )}
                    {(button?.url || secondary_button?.url) && (
                      <DivTag className="button-group">
                        {button?.url && (
                          <Link href={button.url} className="btn primary-btn" target={button.target || "_self"} rel={button.target === "_blank" ? "noopener noreferrer" : undefined} >
                            {button.title} <ArrowRight className="right-arrow-icon" />
                          </Link>
                        )}
                        {secondary_button?.url && (
                          <Link href={secondary_button.url} className="btn secondary-btn" target={secondary_button.target || "_self"} rel={secondary_button.target === "_blank" ? "noopener noreferrer" : undefined} >
                            {secondary_button.title} <ArrowRight className="right-arrow-icon" />
                          </Link>
                        )}
                      </DivTag>
                    )}
                  </DivTag>
                </DivTag>

              </DivTag>
            </DivTag>
          </DivTag>
        </SectionTag>
      ) : page_type === "service" ? (
        <SectionTag className='inner-banner-section service-banner'>
          <DivTag className={`container ${paddingClass}`}>
            <DivTag className="sub-service-banner-section">
              <DivTag className="row banner-content-box-row">
                <DivTag className="col-md-12">
                  <DivTag className="banner-content-box">
                    {sub_title && (
                      <Link href="#" className="btn banner-btn">
                        {sub_title}
                      </Link>
                    )}
                    {main_title && (
                      <H1Tag className="main-title" dangerouslySetInnerHTML={{ __html: main_title }} />
                    )}
                    {description && (
                      <DivTag dangerouslySetInnerHTML={{ __html: description }} />
                    )}
                    {button?.url && (
                      <Link href={button.url} className="btn primary-btn" target={button.target || "_self"}>
                        {button.title} <ArrowRight className="right-arrow-icon" />
                      </Link>
                    )}
                  </DivTag>
                </DivTag>
              </DivTag>
            </DivTag>
          </DivTag>
        </SectionTag>
      ) : page_type === "resources" ? (
        <SectionTag className='inner-banner-section resources-banner'>
          <DivTag className={`container ${paddingClass}`}>
            <DivTag className="row banner-content-box-row">
              <DivTag className="col-md-12">
                <DivTag className="banner-content-box">
                  {sub_title && (
                    <Link href="#" className="btn banner-btn">
                      {sub_title}
                    </Link>
                  )}
                  {main_title && (
                    <H1Tag className="main-title" dangerouslySetInnerHTML={{ __html: main_title }} />
                  )}
                  {description && (
                    <DivTag dangerouslySetInnerHTML={{ __html: description }} />
                  )}
                  {button?.url && (
                    <Link href={button.url} className="btn primary-btn" target={button.target || "_self"}>
                      {button.title} <ArrowRight className="right-arrow-icon" />
                    </Link>
                  )}
                </DivTag>
              </DivTag>
            </DivTag>
          </DivTag>
        </SectionTag>
      ) : page_type === "partner" ? (
        <SectionTag className='partner-banner-section'>
          <DivTag className={`container ${paddingClass}`}>
            <DivTag className="row">
              <DivTag className="col-md-12 img-col">
                <DivTag className="banner-bg-img">
                  {banner_image?.url && (
                    <DivTag className="img-div">
                      <Image
                        src={banner_image.url}
                        alt={banner_image.alt || 'Image'}
                        width={1350}
                        height={230}
                        className='img-fluid'
                      />
                    </DivTag>
                  )}
                </DivTag>
              </DivTag>
            </DivTag>
            <DivTag className="row banner-content-box-row">
              <DivTag className="col-md-12">
                <DivTag className="banner-content-box">
                  {main_title && (
                    <H1Tag className="main-title" dangerouslySetInnerHTML={{ __html: main_title }} />
                  )}
                  {sub_title && (
                  <H3Tag className="sub-title" dangerouslySetInnerHTML={{ __html: sub_title }} />
                  )}
                </DivTag>
              </DivTag>
            </DivTag>
          </DivTag>
        </SectionTag>
      ) : page_type === "kognitos" ? (
        <SectionTag className='kognitos-page-banner-section' style={{ backgroundImage: `url(${background_image?.url})` }}>
          <DivTag className="container-fluid" >
            <DivTag className={`${paddingClass}`} >
              <DivTag className="row banner-content-box-row">
                <DivTag className="col-md-12 content-col">
                  <DivTag className="banner-content-box">
                    {main_title && (
                      <H1Tag className="" dangerouslySetInnerHTML={{ __html: main_title }} />
                    )}
                    {image?.url && (
                      <DivTag className="img-div">
                        <Image src={image.url} alt={image.alt || 'Image'} width={150} height={150} />
                      </DivTag>
                    )}
                    {sub_title && (
                      <H2Tag className="sub-title" dangerouslySetInnerHTML={{ __html: sub_title }} />
                    )}
                    {description && (
                      <DivTag dangerouslySetInnerHTML={{ __html: description }} />
                    )}
                    {(button?.url || secondary_button?.url) && (
                      <DivTag className="button-group">
                        {button?.url && (
                          <Link href={button.url} className="btn primary-btn" target={button.target || "_self"} rel={button.target === "_blank" ? "noopener noreferrer" : undefined} >
                            {button.title} <ArrowRight className="right-arrow-icon" />
                          </Link>
                        )}
                        {secondary_button?.url && (
                          <Link href={secondary_button.url} className="btn secondary-btn" target={secondary_button.target || "_self"} rel={secondary_button.target === "_blank" ? "noopener noreferrer" : undefined} >
                            {secondary_button.title} <ArrowRight className="right-arrow-icon" />
                          </Link>
                        )}
                      </DivTag>
                    )}
                  </DivTag>
                </DivTag>

              </DivTag>
            </DivTag>
          </DivTag>
        </SectionTag>
      ) : page_type === "use_case" ? (
        <SectionTag className='usecase-banner-section' >
          <DivTag className={`${paddingClass} container`} style={{ backgroundImage: `url(${background_image?.url})` }}>
            <DivTag className="row banner-content-box-row">
              <DivTag className="col-md-12 content-col">
                <DivTag className="banner-content-box">
                  {main_title ? (
                    <H1Tag className="" dangerouslySetInnerHTML={{ __html: main_title }} />
                  ) : (
                    logo?.url && (
                      <DivTag className="logo-div">
                        <Image
                          src={logo.url}
                          alt={logo.alt || 'Logo'}
                          width={290}
                          height={100}
                          className='img-fluid'
                        />
                      </DivTag>
                    )
                  )}

                </DivTag>
              </DivTag>
              <DivTag className="col-md-5 img-col">

              </DivTag>
            </DivTag>
          </DivTag>
        </SectionTag>
      ) : page_type === "solution_banner" ? (
        <SectionTag className='solution-page-banner-section'>
          <DivTag className="container">
            <DivTag className={`${paddingClass}`} >
              <DivTag className="row banner-content-box-row">
                <DivTag className="col-md-7 content-col">
                  <DivTag className="banner-content-box">
                    {main_title && (
                      <H1Tag className="" dangerouslySetInnerHTML={{ __html: main_title }} />
                    )}
                    {sub_title && (
                      <PTag className="sub-title">
                        {sub_title}
                      </PTag>
                    )}
                    {description && (
                      <DivTag className="desc" dangerouslySetInnerHTML={{ __html: description }} />
                    )}
                    {button?.url && (
                      <Link href={data.button.url} className="btn primary-btn" target={button.target || "_self"}>
                        {button.title} <ArrowRight className="right-arrow-icon" />
                      </Link>
                    )}
                  </DivTag>
                </DivTag>
                <DivTag className="col-md-5 img-col">
                  <DivTag className="banner-img-box">
                    {image?.url && (
                      <DivTag className="img-div">
                        <Image
                          src={image.url}
                          alt={image.alt || 'Image'}
                          width={550}
                          height={485}
                        />
                      </DivTag>
                    )}

                  </DivTag>
                </DivTag>
              </DivTag>
            </DivTag>
          </DivTag>
        </SectionTag>
      ) : page_type === "best_uipath_partner" ? (
        <SectionTag className='bestuipath-page-banner-section'>
          <DivTag className="container">
            <DivTag className={`${paddingClass}`} >
              <DivTag className="row banner-content-box-row">
                <DivTag className="col-md-12 img-col">
                  <DivTag className="banner-img-box">
                    {banner_image?.url && (
                      <DivTag className="img-div">
                        <Image
                          src={banner_image.url}
                          alt={banner_image.alt || 'Image'}
                          width={1350}
                          height={785}
                          className='img-fluid'
                        />
                      </DivTag>
                    )}

                  </DivTag>
                </DivTag>
              </DivTag>
            </DivTag>
          </DivTag>
        </SectionTag>
      ) : (
      <SectionTag className='inner-page-banner-section'>
        <DivTag className="container">
          <DivTag className={`${paddingClass}`} >
            <DivTag className="row banner-content-box-row">
              <DivTag className="col-md-7 content-col">
                <DivTag className="banner-content-box">
                  {main_title && (
                    <H1Tag className="" dangerouslySetInnerHTML={{ __html: main_title }} />
                  )}
                  {description && (
                    <DivTag className="desc" dangerouslySetInnerHTML={{ __html: description }} />
                  )}
                  {button?.url && (
                    <Link href={data.button.url} className="btn primary-btn" target={button.target || "_self"}>
                      {button.title} <ArrowRight className="right-arrow-icon" />
                    </Link>
                  )}
                </DivTag>
              </DivTag>
              <DivTag className="col-md-5 img-col">
                <DivTag className="banner-img-box">
                  {image?.url && (
                    <DivTag className="img-div">
                      <Image
                        src={image.url}
                        alt={image.alt || 'Image'}
                        width={150}
                        height={150}
                      />
                    </DivTag>
                  )}
                  {logo?.url && (
                    <DivTag className="logo-div">
                      <Image
                        src={logo.url}
                        alt={logo.alt || 'Logo'}
                        width={150}
                        height={75}
                      />
                    </DivTag>
                  )}
                  {sub_title && (
                    <PTag className="sub-title">
                      {sub_title}
                    </PTag>
                  )}
                </DivTag>
              </DivTag>
            </DivTag>
          </DivTag>
        </DivTag>
      </SectionTag>
    )
  );
}
