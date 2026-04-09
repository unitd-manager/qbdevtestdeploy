'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { DivTag, H1Tag, H2Tag, H3Tag, PTag } from './Common/HTMLTags';

// Helper hook for responsive values
function useResponsive() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return { isMobile };
}

function CaseStudyHeroSection({ section }) {
  const { isMobile } = useResponsive();
  
  return (
    <DivTag
      style={{
        backgroundColor: '#FFA500',
        padding: isMobile ? '40px 20px' : '100px 40px',
        minHeight: isMobile ? 'auto' : '700px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <DivTag
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1fr',
          gap: isMobile ? '40px' : '80px',
          alignItems: 'center',
          paddingRight: isMobile ? '0' : '60px',
        }}
      >
        {/* Left Content Section */}
        <DivTag>
          {/* Case Study Label */}
          <PTag
            style={{
              fontSize: '12px',
              fontWeight: 'bold',
              color: '#fff',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              marginBottom: '24px',
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              display: 'inline-block',
              padding: '8px 16px',
              borderRadius: '20px',
            }}
          >
            Case Study
          </PTag>

          {/* Title */}
          {section.title && (
            <H1Tag
              style={{
                fontSize: isMobile ? '28px' : '56px',
                fontWeight: 'bold',
                marginBottom: '24px',
                color: '#fff',
                lineHeight: '1.2',
              }}
            >
              {section.title}
            </H1Tag>
          )}

          {/* Subtitle */}
          {section.subtitle && (
            <PTag
              style={{
                fontSize: isMobile ? '14px' : '18px',
                color: '#fff',
                marginBottom: '40px',
                lineHeight: '1.6',
                opacity: '0.95',
              }}
            >
              {section.subtitle}
            </PTag>
          )}

          {/* Metadata Section */}
          <DivTag
            style={{
              display: 'flex',
              gap: isMobile ? '20px' : '40px',
              flexWrap: 'wrap',
              marginTop: '40px',
              flexDirection: isMobile ? 'column' : 'row',
            }}
          >
            {section.client_name && (
              <DivTag style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <PTag
                  style={{
                    fontSize: '14px',
                    color: '#fff',
                    opacity: '0.8',
                  }}
                >
                  📍 {section.client_name}
                </PTag>
              </DivTag>
            )}

            {section.year && (
              <DivTag style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <PTag
                  style={{
                    fontSize: '14px',
                    color: '#fff',
                    opacity: '0.8',
                  }}
                >
                  📅 {section.year}
                </PTag>
              </DivTag>
            )}

            {section.duration && (
              <DivTag style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <PTag
                  style={{
                    fontSize: '14px',
                    color: '#fff',
                    opacity: '0.8',
                  }}
                >
                  ⏱️ {section.duration}
                </PTag>
              </DivTag>
            )}
          </DivTag>
        </DivTag>

        {/* Right Image Section */}
        {section.hero_image && (
          <DivTag
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              perspective: '1200px',
              height: isMobile ? '300px' : '500px',
              marginTop: isMobile ? '20px' : '0',
            }}
          >
            <DivTag
              style={{
                backgroundColor: '#fff',
                borderRadius: '24px',
                padding: '16px',
                boxShadow: '0 30px 80px rgba(0, 0, 0, 0.2)',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Image
                src={section.hero_image.url}
                alt={section.hero_image.alt || section.title}
                width={800}
                height={900}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '16px',
                  display: 'block',
                }}
              />
            </DivTag>
          </DivTag>
        )}
      </DivTag>
    </DivTag>
  );
}

// Stats Section Component
function StatsSection({ section }) {
  const { isMobile } = useResponsive();
  console.log('Stats Section Data:', section);
  
  const statsItems = section.stats_items || section.stats || [];
  
  return (
    <DivTag
      style={{
        backgroundColor: '#f9f9f9',
        padding: isMobile ? '40px 20px' : '80px 40px',
      }}
    >
      <DivTag
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <DivTag
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: isMobile ? '30px' : '60px',
            textAlign: 'center',
          }}
        >
          {statsItems && statsItems.length > 0 ? (
            statsItems.map((stat, index) => (
              <DivTag key={index}>
                <H2Tag
                  style={{
                    fontSize: isMobile ? '32px' : '48px',
                    fontWeight: 'bold',
                    color: '#FFA500',
                    marginBottom: '16px',
                  }}
                >
                  {stat.number}
                </H2Tag>
                <PTag
                  style={{
                    fontSize: '16px',
                    color: '#666',
                    fontWeight: '500',
                  }}
                >
                  {stat.label}
                </PTag>
              </DivTag>
            ))
          ) : (
            <PTag style={{ color: '#999', gridColumn: '1/-1' }}>No stats available</PTag>
          )}
        </DivTag>
      </DivTag>
    </DivTag>
  );
}

// Challenge Section Component
function ChallengeSection({ section }) {
  const { isMobile } = useResponsive();
  console.log('Challenge Section Data:', section);
  
  const challenges = section.challenges || [];
  
  return (
    <DivTag
      style={{
        backgroundColor: '#FFF8E7',
        padding: isMobile ? '40px 20px' : '80px 40px',
      }}
    >
      <DivTag
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* Section Title */}
        {section.title && (
          <DivTag style={{ marginBottom: '50px' }}>
            <H2Tag
              style={{
                fontSize: isMobile ? '24px' : '32px',
                fontWeight: 'bold',
                color: '#000',
                marginBottom: '20px',
              }}
            >
              🟧 {section.title}
            </H2Tag>
            {section.description && (
              <PTag
                style={{
                  fontSize: '16px',
                  color: '#555',
                  lineHeight: '1.6',
                  maxWidth: '800px',
                }}
              >
                {section.description}
              </PTag>
            )}
          </DivTag>
        )}

        {/* Challenge Items */}
        <DivTag
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px',
          }}
        >
          {challenges && challenges.length > 0 ? (
            challenges.map((challenge, index) => (
              <DivTag
                key={index}
                style={{
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'flex-start',
                }}
              >
                <DivTag
                  style={{
                    minWidth: '24px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#FF6B6B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '4px',
                    flexShrink: 0,
                  }}
                >
                  <span style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>✓</span>
                </DivTag>
                <PTag
                  style={{
                    fontSize: '15px',
                    color: '#333',
                    lineHeight: '1.6',
                  }}
                >
                  {challenge.text}
                </PTag>
              </DivTag>
            ))
          ) : (
            <PTag style={{ color: '#999', gridColumn: '1/-1' }}>No challenges listed</PTag>
          )}
        </DivTag>
      </DivTag>
    </DivTag>
  );
}

// Approach Section Component
function ApproachSection({ section }) {
  const { isMobile } = useResponsive();
  console.log('Approach Section Data:', section);
  
  const points = section.points || [];
  
  return (
    <DivTag
      style={{
        backgroundColor: '#fff',
        padding: isMobile ? '40px 20px' : '80px 40px',
      }}
    >
      <DivTag
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* Section Title */}
        {section.title && (
          <DivTag style={{ marginBottom: '50px' }}>
            <H2Tag
              style={{
                fontSize: isMobile ? '24px' : '32px',
                fontWeight: 'bold',
                color: '#000',
                marginBottom: '20px',
              }}
            >
              🟩 {section.title}
            </H2Tag>
            {section.description && (
              <PTag
                style={{
                  fontSize: '16px',
                  color: '#555',
                  lineHeight: '1.6',
                  maxWidth: '800px',
                }}
              >
                {section.description}
              </PTag>
            )}
          </DivTag>
        )}

        {/* Approach Points */}
        <DivTag
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px',
          }}
        >
          {points && points.length > 0 ? (
            points.map((point, index) => (
              <DivTag
                key={index}
                style={{
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'flex-start',
                }}
              >
                <DivTag
                  style={{
                    minWidth: '24px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#4CAF50',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '4px',
                    flexShrink: 0,
                  }}
                >
                  <span style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>✓</span>
                </DivTag>
                <PTag
                  style={{
                    fontSize: '15px',
                    color: '#333',
                    lineHeight: '1.6',
                  }}
                >
                  {point.text}
                </PTag>
              </DivTag>
            ))
          ) : (
            <PTag style={{ color: '#999', gridColumn: '1/-1' }}>No approach points listed</PTag>
          )}
        </DivTag>
      </DivTag>
    </DivTag>
  );
}

// Results Section Component
function ResultsSection({ section }) {
  const { isMobile } = useResponsive();
  console.log('Results Section Data:', section);
  
  const resultsItems = section.results_items || section.result_list || [];
  
  return (
    <DivTag
      style={{
        backgroundColor: '#FFF8E7',
        padding: isMobile ? '40px 20px' : '80px 40px',
      }}
    >
      <DivTag
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* Section Title */}
        {section.title && (
          <DivTag style={{ marginBottom: '50px' }}>
            <H2Tag
              style={{
                fontSize: isMobile ? '24px' : '32px',
                fontWeight: 'bold',
                color: '#000',
                marginBottom: '20px',
              }}
            >
              🟦 {section.title}
            </H2Tag>
            {section.description && (
              <PTag
                style={{
                  fontSize: '16px',
                  color: '#555',
                  lineHeight: '1.6',
                  maxWidth: '800px',
                }}
              >
                {section.description}
              </PTag>
            )}
          </DivTag>
        )}

        {/* Results Items */}
        <DivTag
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px',
          }}
        >
          {resultsItems && resultsItems.length > 0 ? (
            resultsItems.map((result, index) => (
              <DivTag
                key={index}
                style={{
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'flex-start',
                }}
              >
                <DivTag
                  style={{
                    minWidth: '24px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#00BCD4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '4px',
                    flexShrink: 0,
                  }}
                >
                  <span style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>✓</span>
                </DivTag>
                <PTag
                  style={{
                    fontSize: '15px',
                    color: '#333',
                    lineHeight: '1.6',
                  }}
                >
                  {result.text}
                </PTag>
              </DivTag>
            ))
          ) : (
            <PTag style={{ color: '#999', gridColumn: '1/-1' }}>No results listed</PTag>
          )}
        </DivTag>
      </DivTag>
    </DivTag>
  );
}

// Testimonial Section Component
function TestimonialSection({ section }) {
  const { isMobile } = useResponsive();
  console.log('Testimonial Section Data:', section);
  
  return (
    <DivTag
      style={{
        backgroundColor: '#fff',
        padding: isMobile ? '40px 20px' : '80px 40px',
      }}
    >
      <DivTag
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        {/* Quote */}
        {section.quote && (
        <PTag
  style={{
    fontSize: isMobile ? '18px' : '24px',
    fontStyle: 'italic',
    color: '#333',
    lineHeight: '1.8',
    marginBottom: '40px',
  }}
>
  {'"'}
  {section.quote}
  {'"'}
</PTag>
        )}

        {/* Author Info */}
        <DivTag>
          {section.name && (
            <H3Tag
              style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#000',
                marginBottom: '8px',
              }}
            >
              {section.name}
            </H3Tag>
          )}
          {section.designation && (
            <PTag
              style={{
                fontSize: '14px',
                color: '#999',
              }}
            >
              {section.designation}
            </PTag>
          )}
        </DivTag>
      </DivTag>
    </DivTag>
  );
}

// Technologies Section Component
function TechnologiesSection({ section }) {
  const { isMobile } = useResponsive();
  console.log('Technologies Section Data:', section);
  
  const techList = section.tech_list || [];
  
  return (
    <DivTag
      style={{
        backgroundColor: '#f9f9f9',
        padding: isMobile ? '40px 20px' : '80px 40px',
      }}
    >
      <DivTag
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <H2Tag
          style={{
            fontSize: isMobile ? '24px' : '32px',
            fontWeight: 'bold',
            color: '#000',
            marginBottom: '50px',
            textAlign: 'center',
          }}
        >
          Technologies Used
        </H2Tag>
        
        <DivTag
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: isMobile ? '15px' : '30px',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {techList && techList.length > 0 ? (
            techList.map((tech, index) => {
              // Handle different possible property names
              const techName = tech?.tech_name || tech?.name || tech?.text || (typeof tech === 'string' ? tech : null);
              
              if (!techName) return null;
              
              return (
                <DivTag
                  key={index}
                  style={{
                    backgroundColor: '#fff',
                    padding: '16px 24px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#333',
                  }}
                >
                  {techName}
                </DivTag>
              );
            })
          ) : (
            <PTag style={{ color: '#999' }}>No technologies listed</PTag>
          )}
        </DivTag>
      </DivTag>
    </DivTag>
  );
}

// Related Case Studies Section Component
function RelatedCaseStudySection({ section }) {
  const { isMobile } = useResponsive();
  console.log('Related Case Study Section Data:', section);
  
  // Use case_item from the repeater field
  const caseStudies = section.case_item || section.case_studies || [];
  
  return (
    <DivTag
      style={{
        backgroundColor: '#fff',
        padding: isMobile ? '40px 20px' : '80px 40px',
      }}
    >
      <DivTag
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {section.title && (
          <H2Tag
            style={{
              fontSize: isMobile ? '24px' : '32px',
              fontWeight: 'bold',
              color: '#000',
              marginBottom: '50px',
              textAlign: 'center',
            }}
          >
            {section.title}
          </H2Tag>
        )}
        
        <DivTag
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: isMobile ? '20px' : '30px',
          }}
        >
          {caseStudies && caseStudies.length > 0 ? (
            caseStudies.slice(0, 3).map((caseStudy, index) => (
              <DivTag
                key={index}
                style={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.3s ease',
                  backgroundColor: '#fff',
                }}
              >
                {caseStudy.image && (
                  <Image
                    src={caseStudy.image.url || caseStudy.image}
                    alt={caseStudy.title || 'Case Study'}
                    width={400}
                    height={300}
                    style={{
                      width: '100%',
                      height: '250px',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                )}
                <DivTag style={{ padding: '20px', backgroundColor: '#fff' }}>
                  {caseStudy.title && (
                    <H3Tag
                      style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#000',
                        marginBottom: '12px',
                      }}
                    >
                      {caseStudy.title}
                    </H3Tag>
                  )}
                </DivTag>
              </DivTag>
            ))
          ) : (
            <PTag style={{ color: '#999', gridColumn: '1/-1', textAlign: 'center' }}>No related case studies available</PTag>
          )}
        </DivTag>
      </DivTag>
    </DivTag>
  );
}

// CTA Section Component
function CTASection({ section }) {
  const { isMobile } = useResponsive();
  console.log('CTA Section Data:', section);
  
  return (
    <DivTag
      style={{
        backgroundColor: '#FFA500',
        padding: isMobile ? '40px 20px' : '80px 40px',
      }}
    >
      <DivTag
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        {section.title && (
          <H2Tag
            style={{
              fontSize: isMobile ? '28px' : '42px',
              fontWeight: 'bold',
              color: '#fff',
              marginBottom: '20px',
              lineHeight: '1.3',
            }}
          >
            {section.title}
          </H2Tag>
        )}
        
        {section.subtitle && (
          <PTag
            style={{
              fontSize: isMobile ? '14px' : '18px',
              color: '#fff',
              marginBottom: '40px',
              lineHeight: '1.6',
              opacity: '0.95',
            }}
          >
            {section.subtitle}
          </PTag>
        )}
        
        {section.button_text && section.button_link && (
          <a
            href={section.button_link}
            style={{
              display: 'inline-block',
              backgroundColor: '#fff',
              color: '#FFA500',
              padding: isMobile ? '12px 32px' : '14px 40px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: isMobile ? '14px' : '16px',
              transition: 'transform 0.3s ease',
            }}
          >
            {section.button_text}
          </a>
        )}
      </DivTag>
    </DivTag>
  );
}

export default function CaseStudySectionRenderer({ section }) {
  if (!section) return null;

  const { acf_fc_layout } = section;
  
  console.log('Rendering section with layout:', acf_fc_layout, 'Data:', section);

  // Render case study hero section
  if (acf_fc_layout === 'case_study_hero') {
    return <CaseStudyHeroSection section={section} />;
  }

  // Render stats section
  if (acf_fc_layout === 'stats') {
    return <StatsSection section={section} />;
  }

  // Render challenge section
  if (acf_fc_layout === 'challenge') {
    return <ChallengeSection section={section} />;
  }

  // Render approach section
  if (acf_fc_layout === 'approach') {
    return <ApproachSection section={section} />;
  }

  // Render results section
  if (acf_fc_layout === 'results') {
    return <ResultsSection section={section} />;
  }

  // Render testimonial section
  if (acf_fc_layout === 'testimonial') {
    return <TestimonialSection section={section} />;
  }

  // Render technologies section
  if (acf_fc_layout === 'technologies') {
    return <TechnologiesSection section={section} />;
  }

  // Render related case study section
  if (acf_fc_layout === 'rekated_case_study' || acf_fc_layout === 'related_case_study') {
    return <RelatedCaseStudySection section={section} />;
  }

  // Render CTA section
  if (acf_fc_layout === 'cta') {
    return <CTASection section={section} />;
  }

  // Add more section type handlers here as needed
  console.warn('Unknown section layout:', acf_fc_layout);

  return null;
}
