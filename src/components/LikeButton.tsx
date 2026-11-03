import { useState } from 'react';
import { MdThumbUp, MdThumbUpOffAlt, MdThumbDownOffAlt } from 'react-icons/md';
import { useChannel } from '../app/ChannelContext';
import { api, useCounters } from '../lib/api';
import { compact } from '../lib/format';
import { track } from '../lib/analytics';
import { load, save } from '../lib/storage';
import './LikeButton.css';

export default function LikeButton({ slug }: { slug: string }) {
  const { notify, openContact } = useChannel();
  const [counters, setCounters] = useCounters([`likes:${slug}`]);
  const [liked, setLiked] = useState(() => load<string[]>('liked', []).includes(slug));
  const [burst, setBurst] = useState(0);
  const count = counters?.[`likes:${slug}`];

  const toggle = () => {
    const next = !liked;
    const delta = next ? 1 : -1;
    setLiked(next);
    const all = load<string[]>('liked', []).filter((s) => s !== slug);
    save('liked', next ? [...all, slug] : all);
    setCounters((c) => (c ? { ...c, [`likes:${slug}`]: Math.max(0, (c[`likes:${slug}`] ?? 0) + delta) } : c));
    api.bump(`likes:${slug}`, delta).catch(() => {});
    if (next) {
      setBurst((b) => b + 1);
      track('like', { slug });
    }
  };

  const dislike = () => {
    notify('Dislikes go straight to my inbox 😉');
    window.setTimeout(() => openContact('dislike'), 600);
  };

  return (
    <div className="like">
      <button className="like__btn" onClick={toggle} aria-pressed={liked} aria-label={liked ? 'Unlike' : 'Like'}>
        <span className={`like__icon ${burst ? 'like__icon--pop' : ''}`} key={burst}>
          {liked ? <MdThumbUp /> : <MdThumbUpOffAlt />}
        </span>
        {count !== undefined && <span>{compact(count)}</span>}
      </button>
      <span className="like__sep" />
      <button className="like__btn" onClick={dislike} aria-label="Dislike">
        <MdThumbDownOffAlt />
      </button>
    </div>
  );
}
