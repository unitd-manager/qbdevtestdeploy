import { useEffect, useRef } from 'react';

export default function EmbedCodeRenderer({ embedCodeFromACF }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    if (container) {
      // Find all <script> tags inside the rendered HTML
      const scripts = container.querySelectorAll('script');

      scripts.forEach((oldScript) => {
        const newScript = document.createElement('script');

        // Copy attributes (like src or type)
        Array.from(oldScript.attributes).forEach(attr => {
          newScript.setAttribute(attr.name, attr.value);
        });

        // Copy inline JS code
        newScript.text = oldScript.text;

        // Replace old <script> with the new one (so it executes)
        oldScript.parentNode.replaceChild(newScript, oldScript);
      });
    }
  }, [embedCodeFromACF]);

  return (
    <div ref={containerRef} dangerouslySetInnerHTML={{ __html: embedCodeFromACF }} />
  );
}
