import { useCallback, useEffect, useRef, useState } from 'react';

export interface Comment {
  id: number;
  slug: string | null;
  name: string;
  body: string;
  created_at: string;
  pinned: boolean;
  hearted: boolean;
}

export type CounterKey = `views:${string}` | `likes:${string}` | 'subs';

export class ApiError extends Error {}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data.error ?? 'Something went wrong. Try again in a moment.');
  return data as T;
}

export const api = {
  /** No slug = the channel guestbook. */
  comments: (slug?: string) =>
    request<{ comments: Comment[] }>(`/api/comments${slug ? `?slug=${encodeURIComponent(slug)}` : ''}`),
  postComment: (body: { slug?: string; name: string; body: string; website: string }) =>
    request<{ comment: Comment }>('/api/comments', { method: 'POST', body: JSON.stringify(body) }),
  counters: (keys: CounterKey[]) =>
    request<{ counters: Record<string, number> }>(`/api/counters?keys=${encodeURIComponent(keys.join(','))}`),
  bump: (key: CounterKey, delta: 1 | -1) =>
    request<{ value: number }>('/api/counters', { method: 'POST', body: JSON.stringify({ key, delta }) }),
  contact: (body: { name: string; email: string; message: string; website: string }) =>
    request<{ ok: true }>('/api/contact', { method: 'POST', body: JSON.stringify(body) }),
  moderate: (id: number, token: string, patch: { pinned?: boolean; hearted?: boolean; hidden?: boolean }) =>
    request<{ ok: true }>(`/api/comments?id=${id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(patch),
    }),
};

/** Fetch counters once; returns null values until loaded (or if the API is unavailable). */
export function useCounters(keys: CounterKey[]) {
  const [values, setValues] = useState<Record<string, number> | null>(null);
  const joined = keys.join(',');
  useEffect(() => {
    let live = true;
    api
      .counters(joined.split(',') as CounterKey[])
      .then((r) => live && setValues(r.counters))
      .catch(() => live && setValues(null));
    return () => {
      live = false;
    };
  }, [joined]);
  return [values, setValues] as const;
}

/** Comments that refresh every 20s and when the tab regains focus, so the feed feels live. */
export function useComments(slug?: string) {
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [error, setError] = useState(false);
  const slugRef = useRef(slug);
  slugRef.current = slug;

  const refresh = useCallback(async () => {
    try {
      const r = await api.comments(slugRef.current);
      setComments(r.comments);
      setError(false);
    } catch {
      setError(true);
      setComments((c) => c ?? []);
    }
  }, []);

  useEffect(() => {
    setComments(null);
    refresh();
    const id = window.setInterval(() => document.visibilityState === 'visible' && refresh(), 20000);
    window.addEventListener('focus', refresh);
    return () => {
      window.clearInterval(id);
      window.removeEventListener('focus', refresh);
    };
  }, [slug, refresh]);

  return { comments, setComments, error, refresh };
}
