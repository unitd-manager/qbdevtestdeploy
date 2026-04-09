"use client";
import { useEffect } from "react";

export default function ChartFromWP({ html, uniqueId }) {
  useEffect(() => {
    const container = document.getElementById(uniqueId);
    if (!container) return;

    const scripts = container.querySelectorAll("script");
    scripts.forEach((oldScript) => {
      const newScript = document.createElement("script");
      if (oldScript.src) {
        newScript.src = oldScript.src;
      } else {
        newScript.textContent = oldScript.textContent;
      }
      document.body.appendChild(newScript);
    });
  }, [uniqueId, html]);

  return (
    <div
      id={uniqueId}
      suppressHydrationWarning={true}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
