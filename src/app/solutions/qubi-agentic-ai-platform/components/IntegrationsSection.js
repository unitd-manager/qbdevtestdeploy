import { SectionHeader } from "./SharedComponents";
import { integrations } from "./constants";

export function IntegrationsSection() {
  return (
    <section className="section sectionAlt" id="integrations">
      <div className="pageContainer">
        <SectionHeader
          eyebrow="Integrations"
          title="Works across your existing stack"
          description="Connect to the systems you already use — from enterprise ERPs to modern AI APIs — with pre-built connectors and extensible integration layers."
        />

        <div className="integrationGrid">
          {integrations.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="iconCard iconCardCentered iconCardSpacious">
                <div className="iconTile iconTileLarge">
                  <Icon size={30} />
                </div>
                <div className="integrationCopy">
                  <p className="integrationCount">{item.count}</p>
                  <p className="integrationLabel">{item.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
