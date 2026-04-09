import { ArrowRight } from "lucide-react";
import { ActionButton } from "./SharedComponents";

export function HeroSection({ data, heroSrc = "/assets/images/hero-illustration.jpg" }) {
  console.log('\n🎨 HeroSection received data:', data);
  console.log('   data.title:', data?.title);
  console.log('   data.sub_title:', data?.sub_title);
  console.log('   data.description:', data?.description);
  console.log('   data.button:', data?.button);
  console.log('   data.image:', data?.image);
  
  // Use ACF data if available, otherwise fallback to defaults
  const title = data?.title || "Orchestrate AI Agents, Bots, Systems & People with <span class=\"gradientText\">qubi</span>";
  const subTitle = data?.sub_title || "A unified platform for designing, deploying, and managing intelligent workflows powered by AI agents, automation, human input, and enterprise integrations.";
  const description = data?.description || "";
  const button = data?.button;
  const image = data?.image?.url || heroSrc;
  
  
  return (
    <section className="heroSection">
      <div className="heroGlow" />
      <div className="pageContainer heroGrid">
        <div className="heroCopy">
          <div className="fadeUp">
            <span className="heroPill">
              <span className="heroPillDot" />
              {title}
            </span>
          </div>

          <h1 className="heroTitle fadeUp fadeUpDelay1" dangerouslySetInnerHTML={{ __html: subTitle }} />

         

          {description && (
            <p className="heroText fadeUp fadeUpDelay2" style={{ marginTop: '20px' }}>
              {description}
            </p>
          )}

          <div className="heroActions fadeUp fadeUpDelay3">
            {button ? (
              <ActionButton href={button.button_link || "#"}>
                {button.button_title || "Booka Demo"}
                <ArrowRight size={18} />
              </ActionButton>
            ) : (
              <ActionButton href="https://meetings.hubspot.com/automation-demo/scheduler">
                Book a Demo
                <ArrowRight size={18} />
              </ActionButton>
            )}
          </div>
        </div>

        <div className="heroVisual fadeUp fadeUpDelay2">
          <div className="heroFrame">
            <img src={image} alt="qubi platform orchestration diagram" className="heroImage" />
            <div className="heroFrameRing" />
          </div>
        </div>
      </div>
    </section>
  );
}
