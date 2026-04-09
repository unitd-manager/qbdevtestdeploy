import { SectionHeader } from "./SharedComponents";
import { capabilities } from "./constants";

export function CapabilitiesSection() {
  return (
    <section className="section" id="capabilities">
      <div className="pageContainer">
        <SectionHeader
          eyebrow="What qubi is"
          title="One platform. Modular capabilities."
          highlight="Enterprise control."
        />

        <div className="capabilityGrid">
          {capabilities.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="featureCard">
                <div className="featureIcon">
                  <Icon size={28} />
                </div>
                <h3 className="cardTitle">{item.title}</h3>
                <p className="cardDescription">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
