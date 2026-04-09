"use client";

import { HeroSection } from "./components/HeroSection";
import { ProblemSection } from "./components/ProblemSection";
import { CapabilitiesSection } from "./components/CapabilitiesSection";
import { OutcomesSection } from "./components/OutcomesSection";
import { HowItWorksSection } from "./components/HowItWorksSection";
import { UseCasesSection } from "./components/UseCasesSection";
import { IntegrationsSection } from "./components/IntegrationsSection";
import { HumanInLoopSection } from "./components/HumanInLoopSection";
import { AnalyticsSection } from "./components/AnalyticsSection";
import { CTASection } from "./components/CTASection";

function renderSection(section) {
  console.log('  🔄 renderSection called with:', section?.acf_fc_layout);
  // ACF flexible content uses 'acf_fc_layout' field
  const layoutType = section.acf_fc_layout;
  
  if (!layoutType) {
    console.warn('⚠️ Section missing acf_fc_layout:', section);
    return null;
  }
  
  switch (layoutType) {
    case 'qubi_banner_section':
      console.log('    ✓ Rendering HeroSection with data:', section);
      return <HeroSection key={`${layoutType}-0`} data={section} />;
    case 'problem_section':
      console.log('    ✓ Rendering ProblemSection');
      return <ProblemSection key={layoutType} />;
    case 'capabilities_section':
      console.log('    ✓ Rendering CapabilitiesSection');
      return <CapabilitiesSection key={layoutType} />;
    case 'outcomes_section':
      console.log('    ✓ Rendering OutcomesSection');
      return <OutcomesSection key={layoutType} />;
    case 'how_it_works_section':
      console.log('    ✓ Rendering HowItWorksSection');
      return <HowItWorksSection key={layoutType} />;
    case 'use_cases_section':
      console.log('    ✓ Rendering UseCasesSection');
      return <UseCasesSection key={layoutType} />;
    case 'integrations_section':
      console.log('    ✓ Rendering IntegrationsSection');
      return <IntegrationsSection key={layoutType} />;
    case 'human_in_loop_section':
      console.log('    ✓ Rendering HumanInLoopSection');
      return <HumanInLoopSection key={layoutType} />;
    case 'analytics_section':
      console.log('    ✓ Rendering AnalyticsSection');
      return <AnalyticsSection key={layoutType} />;
    case 'cta_section':
      console.log('    ✓ Rendering CTASection');
      return <CTASection key={layoutType} />;
    default:
      console.warn(`⚠️ Unknown layout type: ${layoutType}`);
      return null;
  }
}

export default function QubiNext15Client({ pageSections }) {
  console.log('\n===== QUBI_CLIENT START =====');
  console.log('📨 QubiNext15Client received pageSections:', pageSections);
  console.log('📊 Type:', Array.isArray(pageSections) ? 'Array' : typeof pageSections);
  console.log('📏 Length:', pageSections.length);
  
  if (pageSections.length > 0) {
    console.log('🎨 Rendering', pageSections.length, 'sections:');
    pageSections.forEach((section, index) => {
      console.log(`  [${index}]`, section?.acf_fc_layout);
    });
  } else {
    console.log('⚠️ No sections, rendering default components');
  }
  console.log('===== QUBI_CLIENT END =====\n');
  
  return (
    <div className="qubiNext15">
      <main id="top">
        {pageSections.length > 0 ? (
          pageSections.map((section, index) => renderSection(section))
        ) : (
          <>
            <HeroSection />
            <ProblemSection />
            <CapabilitiesSection />
            <OutcomesSection />
            <HowItWorksSection />
            <UseCasesSection />
            <IntegrationsSection />
            <HumanInLoopSection />
            <AnalyticsSection />
            <CTASection />
          </>
        )}
      </main>
    </div>
  );
}