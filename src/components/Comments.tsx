import { useState, type FormEvent } from 'react';
import { MdPushPin, MdFavorite, MdUnfoldMore } from 'react-icons/md';
import Sheet from './Sheet';
import { channel } from '../content/channel';
import { api, useComments, type Comment } from '../lib/api';
import { timeAgo } from '../lib/format';
import { track } from '../lib/analytics';
import { load, save } from '../lib/storage';
import { useMedia } from '../lib/useMedia';
import './Comments.css';

interface Props {
  /** Omit for the channel guestbook. */
  slug?: string;
  title?: string;
  placeholder?: string;
  /** On phones, show a one-line teaser that opens the full thread in a sheet. */
  collapsible?: boolean;
}

export default function Comments({ slug, title = 'Comments', placeholder = 'Add a comment…', collapsible }: Props) {
  const { comments, setComments, error } = useComments(slug);
  const mobile = useMedia('(max-width: 767px)');
  const [sheet, setSheet] = useState(false);
  const sorted = comments ? [...comments].sort((a, b) => Number(b.pinned) - Number(a.pinned)) : null;
  const count = comments?.length ?? 0;

  const thread = (
    <>
      <CommentForm slug={slug} placeholder={placeholder} onPosted={(c) => setComments((all) => [c, ...(all ?? [])])} />
      {error && <p className="muted">Comments are taking a nap. Try again in a bit.</p>}
      {sorted === null ? (
        <p className="muted">Loading…</p>
      ) : sorted.length === 0 && !error ? (
        <p className="muted">No comments yet. Be the first to say hi 👋</p>
      ) : (
        <ul className="comments__list">
          {sorted.map((c) => (
            <CommentItem key={c.id} c={c} />
          ))}
        </ul>
      )}
    </>
  );

  if (collapsible && mobile) {
    const top = sorted?.[0];
    return (
      <section className="comments">
        <button className="comments__teaser" onClick={() => setSheet(true)}>
          <span className="comments__teaser-head">
            <strong>{title}</strong> <span className="muted">{count}</span> <MdUnfoldMore />
          </span>
          {top ? (
            <span className="comments__teaser-body">
              <Initial name={top.name} size={24} /> <span>{top.body}</span>
            </span>
          ) : (
            <span className="muted">Be the first to comment</span>
          )}
        </button>
        <Sheet open={sheet} onClose={() => setSheet(false)} title={`${title} · ${count}`}>
          {thread}
        </Sheet>
      </section>
    );
  }

  return (
    <section className="comments">
      <h2 className="comments__title">
        {count} {title}
      </h2>
      {thread}
    </section>
  );
}

function CommentForm({ slug, placeholder, onPosted }: { slug?: string; placeholder: string; onPosted: (c: Comment) => void }) {
  const [name, setName] = useState(() => load('comment-name', ''));
  const [body, setBody] = useState('');
  const [focused, setFocused] = useState(false);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');

  const reset = () => {
    setBody('');
    setFocused(false);
    setError('');
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const website = String(new FormData(e.currentTarget).get('website') ?? '');
    setPosting(true);
    setError('');
    try {
      const { comment } = await api.postComment({ slug, name: name.trim(), body: body.trim(), website });
      onPosted(comment);
      save('comment-name', name.trim());
      reset();
      track('comment_post', { slug: slug ?? 'guestbook' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not post.');
    } finally {
      setPosting(false);
    }
  };

  return (
    <form className="cform" id={slug ? undefined : 'sign'} onSubmit={submit}>
      <Initial name={name || '?'} size={40} />
      <div className="cform__fields">
        <textarea
          className="cform__body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder={placeholder}
          rows={focused ? 2 : 1}
          maxLength={500}
          required
          aria-label={placeholder}
        />
        {(focused || body) && (
          <>
            <input
              className="cform__name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name (shown publicly)"
              maxLength={40}
              required
              autoComplete="name"
            />
            {/* Honeypot: hidden from people, irresistible to bots */}
            <input name="website" className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            {error && <p className="cform__error">{error}</p>}
            <div className="cform__actions">
              <span className="muted cform__count">{body.length}/500</span>
              <button type="button" className="pill" onClick={reset}>
                Cancel
              </button>
              <button className="pill pill--accent" disabled={posting || !body.trim() || !name.trim()}>
                {posting ? 'Posting…' : 'Comment'}
              </button>
            </div>
          </>
        )}
      </div>
    </form>
  );
}

function CommentItem({ c }: { c: Comment }) {
  return (
    <li className="citem">
      <Initial name={c.name} size={40} />
      <div className="citem__main">
        {c.pinned && (
          <span className="citem__pinned">
            <MdPushPin /> Pinned by {channel.name}
          </span>
        )}
        <div className="citem__head">
          <strong>@{c.name.replace(/\s+/g, '').toLowerCase()}</strong>
          <span className="muted">{timeAgo(c.created_at)}</span>
        </div>
        <p className="citem__body">{c.body}</p>
        {c.hearted && (
          <span className="citem__heart" title={`Loved by ${channel.name}`}>
            <img className="avatar" src={channel.avatar} width={18} height={18} alt="" />
            <MdFavorite />
          </span>
        )}
      </div>
    </li>
  );
}

function Initial({ name, size }: { name: string; size: number }) {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) % 360;
  return (
    <span
      className="initial"
      style={{ width: size, height: size, fontSize: size * 0.45, background: `hsl(${hash} 55% 45%)` }}
      aria-hidden="true"
    >
      {name.trim().charAt(0).toUpperCase() || '?'}
    </span>
  );
}
