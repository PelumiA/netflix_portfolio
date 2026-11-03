import { useState } from 'react';
import { videos } from '../content/videos';
import { api, useComments, type Comment } from '../lib/api';
import { timeAgo } from '../lib/format';
import { useMeta } from '../lib/useMeta';

/** Unlisted moderation page. Every action is checked server-side against ADMIN_TOKEN. */
export default function Admin() {
  useMeta('Moderation');
  const [token, setToken] = useState(() => sessionStorage.getItem('admin-token') ?? '');
  const [slug, setSlug] = useState('');
  const { comments, setComments } = useComments(slug || undefined);
  const [error, setError] = useState('');

  const act = async (c: Comment, patch: { pinned?: boolean; hearted?: boolean; hidden?: boolean }) => {
    setError('');
    try {
      await api.moderate(c.id, token, patch);
      setComments((all) =>
        patch.hidden ? (all ?? []).filter((x) => x.id !== c.id) : (all ?? []).map((x) => (x.id === c.id ? { ...x, ...patch } : x)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    }
  };

  return (
    <div className="page" style={{ maxWidth: 800 }}>
      <h1>Moderation</h1>
      <p style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input
          type="password"
          placeholder="Admin token"
          value={token}
          onChange={(e) => {
            setToken(e.target.value);
            sessionStorage.setItem('admin-token', e.target.value);
          }}
          style={{ padding: 8, flex: 1, minWidth: 200 }}
        />
        <select value={slug} onChange={(e) => setSlug(e.target.value)} style={{ padding: 8 }}>
          <option value="">Guestbook</option>
          {videos.map((v) => (
            <option key={v.slug} value={v.slug}>
              {v.title.slice(0, 60)}
            </option>
          ))}
        </select>
      </p>
      {error && <p style={{ color: '#ff6b6b' }}>{error}</p>}
      {comments?.length === 0 && <p className="muted">No comments.</p>}
      <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 12 }}>
        {comments?.map((c) => (
          <li key={c.id} style={{ padding: 12, borderRadius: 8, background: 'var(--bg-raised)' }}>
            <strong>{c.name}</strong> <span className="muted">· {timeAgo(c.created_at)}</span>
            <p style={{ whiteSpace: 'pre-wrap' }}>{c.body}</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button className="pill" onClick={() => act(c, { pinned: !c.pinned })}>{c.pinned ? 'Unpin' : 'Pin'}</button>
              <button className="pill" onClick={() => act(c, { hearted: !c.hearted })}>{c.hearted ? 'Unheart' : 'Heart'}</button>
              <button className="pill" onClick={() => confirm('Hide this comment?') && act(c, { hidden: true })}>Hide</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
