import { SectionHeader } from "./SharedComponents";
import { analyticsFeatures } from "./constants";

export function AnalyticsSection() {
  return (
    <section className="section sectionAlt" id="analytics">
      <div className="pageContainer">
        <SectionHeader
          eyebrow="Analytics & Trust"
          title="Visibility, performance, and accountability"
          highlight="built in"
        />

        <div className="analyticsGrid">
          {analyticsFeatures.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="analyticsCard">
                <div className="analyticsCardHeader">
                  <div className="analyticsIcon">
                    <Icon size={20} />
                  </div>
                  <h3 className="analyticsTitle">{item.title}</h3>
                </div>
                <p className="analyticsDescription">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
