'use client';
import { useEffect } from 'react';

export default function StructuredData({ data }) {
  useEffect(() => {
    if (!data) return;

    const nextjsUrl = process.env.NEXT_PUBLIC_SITE_URL;
    const wpDomain = process.env.NEXT_PUBLIC_WP_URL;
    
    // Escape regex special chars in domain string
    const escapedDomain = wpDomain.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const domainRegex = new RegExp(escapedDomain, 'g');

    const jsonLdData = Array.isArray(data) ? data : [data];

    // Remove existing JSON-LD scripts
    document.querySelectorAll('script[data-json-ld]').forEach(el => el.remove());

    jsonLdData.forEach((item) => {
      const replaceUrls = (obj) => {
        if (typeof obj === 'string') {
          return obj.replace(domainRegex, nextjsUrl);
        }
        if (Array.isArray(obj)) {
          return obj.map(replaceUrls);
        }
        if (obj && typeof obj === 'object') {
          const newObj = {};
          for (const key in obj) {
            newObj[key] = replaceUrls(obj[key]);
          }
          return newObj;
        }
        return obj;
      };

      const updatedItem = replaceUrls(item);

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.dataset.jsonLd = true;
      script.text = JSON.stringify(updatedItem);
      document.head.appendChild(script);
    });
  }, [data]);

  return null;
}
