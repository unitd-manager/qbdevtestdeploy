import { SectionHeader } from "./SharedComponents";
import { outcomes } from "./constants";

export function OutcomesSection() {
  return (
    <section className="section" id="outcomes">
      <div className="pageContainer">
        <SectionHeader eyebrow="Platform outcomes" title="Built for measurable operational impact" />

        <div className="outcomeGrid">
          {outcomes.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="outcomeItem">
                <div className="outcomeIcon">
                  <Icon size={24} />
                </div>
                <div>
                  <h3 className="outcomeTitle">{item.title}</h3>
                  <p className="outcomeDescription">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
