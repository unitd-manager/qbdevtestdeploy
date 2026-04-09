import { ArrowRight } from "lucide-react";

export function ActionButton({ href, variant = "primary", children, onClick }) {
  return (
    <a href={href} className={`qubiButton ${variant === "outline" ? "qubiButtonOutline" : "qubiButtonPrimary"}`} onClick={onClick}>
      {children}
    </a>
  );
}

export function SectionHeader({ eyebrow, title, highlight, description }) {
  return (
    <div className="sectionHeader">
      {eyebrow ? <span className="sectionEyebrow">{eyebrow}</span> : null}
      <h2 className="sectionTitle">
        {title}
        {highlight ? (
          <>
            {" "}
            <span className="gradientText">{highlight}</span>
          </>
        ) : null}
      </h2>
      {description ? <p className="sectionDescription">{description}</p> : null}
    </div>
  );
}
