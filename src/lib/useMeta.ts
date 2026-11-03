import { useEffect } from 'react';

const SITE = 'Pelumi Adenikinju';

export function useMeta(title?: string, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} – ${SITE}` : SITE;
    if (description) {
      document.querySelector('meta[name="description"]')?.setAttribute('content', description);
      document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
    }
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', document.title);
  }, [title, description]);
}
