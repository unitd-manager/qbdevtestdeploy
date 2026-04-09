import { SectionHeader } from "./SharedComponents";
import { steps } from "./constants";

export function HowItWorksSection() {
  return (
    <section className="section sectionAlt" id="how-it-works">
      <div className="pageContainer">
        <SectionHeader eyebrow="How it works" title="From discovery to scale in four steps" />

        <div className="stepsGrid">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className="stepCard">
                {index < steps.length - 1 ? <div className="stepConnector" aria-hidden="true" /> : null}
                <div className="stepIconWrap">
                  <Icon size={32} />
                </div>
                <span className="stepNumber">{item.step}</span>
                <h3 className="cardTitle stepTitle">{item.title}</h3>
                <p className="cardDescription stepDescription">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
