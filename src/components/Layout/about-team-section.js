'use client';
import DotGrid from '../Common/DotGrid';
import { DivTag, H3Tag, H4Tag, H5Tag, SectionTag } from '../Common/HTMLTags';
import Image from 'next/image';

export default function AboutTeamSection({ data }) {
    if (!data || typeof data !== 'object') return null;
    const {
        main_title,
        main_description,
        sub_title,
        sub_description,
        team_members,
        padding = {},
        class_name,
        id
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

      <SectionTag className={`our-team-members ${class_name}`} id={id}>
        <DivTag className="container">
        <DivTag className={`sub-section ${paddingClass}`}>
          <DivTag className="row member-info">
            <DivTag className="member-top-title">
            {main_title && <H3Tag className="main-title" dangerouslySetInnerHTML={{ __html: main_title }} />}
            {main_description && <DivTag className="main-desc" dangerouslySetInnerHTML={{ __html: main_description }} />}
            </DivTag>
          </DivTag>

          <DivTag className="row leadership-info">
            <DivTag className="col-md-12 p-0 leadership-info-desc">
                {sub_title && (
                  <DivTag className="leadership-title">
                    <H4Tag className="main-title" dangerouslySetInnerHTML={{ __html: sub_title }} />
                  </DivTag>
                )}
                {sub_description && (
                  <DivTag className="leadership-desc" dangerouslySetInnerHTML={{ __html: sub_description }} />
                )}
            </DivTag>
          </DivTag>
        { team_members.member.length > 0 && (
          <DivTag className="row team-members-list-info">
            {team_members.member.map((member, i) => (
              <DivTag className="team-list-item col-md-4" key={i}>
                    {member?.profile_picture?.url && (
                    <Image
                      src={member.profile_picture.url}
                      alt={member.profile_picture.alt || 'profile'}
                      width={211}
                      height={211}
                    />
                  )}
                {member?.name && (
                    <H5Tag className="main-title" dangerouslySetInnerHTML={{ __html: member.name }} />
                  )}
                 {member.designation &&  <label >{member.designation}</label> }
                {member?.bio_url?.url && member.bio_url.url.trim() !== '' && (
                    <a
                      href={member.bio_url.url}
                      target={member.bio_url.target || '_self'}
                      rel="noopener noreferrer"
                      className="linkedin-icon"
                    >
                      <Image
                        src="/assets/images/linkedin-icon.svg"
                        alt="linkedin"
                        width={30}
                        height={30}
                      />
                    </a>
                  )}
              </DivTag>
            ))}
          </DivTag>)}
        </DivTag>

        </DivTag>
      </SectionTag>
    );
}