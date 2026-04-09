import Script from 'next/script';
import { useEffect, useState } from 'react';

export default function HubSpotForm({ portalId, formId, region = "na1" }) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    if (isScriptLoaded && typeof window !== 'undefined' && window.hbspt) {
      window.hbspt.forms.create({
        region,
        portalId,
        formId,
        target: `#hubspot-form-${formId}`
      });
    }
  }, [isScriptLoaded, portalId, formId, region]);

  return (
    <>
      <Script
        src="//js.hsforms.net/forms/embed/v2.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('HubSpot script loaded');
          setIsScriptLoaded(true);
        }}
      />
      <div id={`hubspot-form-${formId}`} />
    </>
  );
}
