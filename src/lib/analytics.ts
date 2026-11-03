declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export type AnalyticsEvent =
  | 'video_open'
  | 'preview_play'
  | 'video_play'
  | 'chapter_click'
  | 'like'
  | 'subscribe'
  | 'contact_open'
  | 'contact_submit'
  | 'comment_post'
  | 'share'
  | 'chip_filter'
  | 'search'
  | 'resume_download'
  | 'skip_ad'
  | 'short_view';

export function track(event: AnalyticsEvent, params: Record<string, string | number | boolean | undefined> = {}) {
  window.gtag?.('event', event, params);
}

export function trackPageView(path: string) {
  window.gtag?.('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}

/** Tag share links so GA attributes visits back to how they were shared. */
export function shareUrl(path: string, medium: string) {
  const url = new URL(path, window.location.origin);
  url.searchParams.set('utm_source', 'share');
  url.searchParams.set('utm_medium', medium);
  return url.toString();
}
