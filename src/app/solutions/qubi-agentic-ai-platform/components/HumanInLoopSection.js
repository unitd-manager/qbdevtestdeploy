import { ArrowRight, Bot, UserCheck } from "lucide-react";
import { ActionButton } from "./SharedComponents";

export function HumanInLoopSection() {
  return (
    <section className="section" id="human-in-loop">
      <div className="pageContainer humanLoopGrid">
        <div className="orbitWrap">
          <div className="orbitShell">
            <div className="orbitRing orbitRingOuter" />
            <div className="orbitRing orbitRingInner" />
            <div className="orbitCenter">
              <ArrowRight size={40} />
            </div>
            <div className="orbitNode orbitNodeTop">
              <Bot size={28} />
            </div>
            <div className="orbitNode orbitNodeBottom">
              <UserCheck size={28} />
            </div>
          </div>
        </div>

        <div>
          <span className="sectionEyebrow">Human-in-the-Loop</span>
          <h2 className="sectionTitle humanLoopTitle">
            Automation where it makes sense. <span className="gradientText">Human judgment where it matters.</span>
          </h2>
          <p className="humanLoopText">
            qubi seamlessly routes tasks between AI agents and human operators. When a workflow
            requires approval, exception handling, or expert judgment, the right person is brought
            into the loop — with full context and zero friction.
          </p>

          <div className="pillRow">
            {[
              "Attended automation",
              "Smart routing",
              "Approval workflows",
            ].map((item) => (
              <div key={item} className="miniPill">
                <span className="miniPillDot" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="humanLoopAction">
            <ActionButton href="https://meetings.hubspot.com/automation-demo/scheduler">
              Learn More
              <ArrowRight size={18} />
            </ActionButton>
          </div>
        </div>
      </div>
    </section>
  );
}
