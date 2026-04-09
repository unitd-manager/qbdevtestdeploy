import Link from "next/link";
import { ArrowRight } from "./Icons";

const normalizeUrl = (url) => {
  if (url.startsWith("http")) return url;  
  if (!url.startsWith("/")) return `/${url}`;
    if (!url.startsWith("")) return `/${url}`;
  return url; 
};


export function renderButton(button) {
  const url = normalizeUrl(button?.url);
  if (!url) return null;

  return (
    <Link
      href={url}
      target={button.target || "_self"}
      rel={button.target === "_blank" ? "noopener noreferrer" : undefined}
      className="btn secondary-btn"
    >
      {button.title || "Learn More"} <ArrowRight />
    </Link>
  );
}
