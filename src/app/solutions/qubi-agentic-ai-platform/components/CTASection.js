import { ArrowRight, MessageSquare } from "lucide-react";
import { ActionButton } from "./SharedComponents";

export function CTASection() {
  return (
    <section className="section ctaSection" id="final-cta">
      <div className="heroGlow ctaGlow" />
      <div className="pageContainer ctaInner">
        <h2 className="ctaTitle">
          See what <span className="gradientText">qubi</span> can automate in your enterprise
        </h2>
        <p className="ctaDescription">
          Ready to move from fragmented processes to intelligent, orchestrated workflows? Let&apos;s talk.
        </p>
        <div className="heroActions ctaActions">
          <ActionButton href="https://meetings.hubspot.com/automation-demo/scheduler">
            Book a Demo
            <ArrowRight size={18} />
          </ActionButton>
          <ActionButton href="https://meetings.hubspot.com/automation-demo/scheduler" variant="outline">
            <MessageSquare size={16} />
            Talk to an Expert
          </ActionButton>
        </div>
      </div>
    </section>
  );
}
