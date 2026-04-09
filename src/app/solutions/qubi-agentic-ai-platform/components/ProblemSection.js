import { SectionHeader } from "./SharedComponents";
import { problems } from "./constants";
 
export function ProblemSection() {
  return (
    <section className="section" id="problem">
      <div className="pageContainer">
        <SectionHeader
          title="Enterprise work is too fragmented to automate with bots alone"
          description="Most enterprises struggle with siloed tools, manual processes, and limited scalability — making true end-to-end automation impossible."
        />

        <div className="problemGrid">
          {problems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="iconCard iconCardCentered">
                <div className="iconTile">
                  <Icon size={24} />
                </div>
                <p className="iconCardLabel">{item.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
