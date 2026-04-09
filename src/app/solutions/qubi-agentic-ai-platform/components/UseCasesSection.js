import { SectionHeader } from "./SharedComponents";
import { useCases } from "./constants";

export function UseCasesSection() {
  return (
    <section className="section" id="use-cases">
      <div className="pageContainer">
        <SectionHeader eyebrow="Use cases" title="Automation that fits your business" />

        <div className="capabilityGrid">
          {useCases.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="featureCard useCaseCard">
                <div className="featureIcon featureIconSmall">
                  <Icon size={24} />
                </div>
                <h3 className="cardTitle cardTitleSmall">{item.title}</h3>
                <p className="cardDescription cardDescriptionSmall">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
