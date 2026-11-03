import { useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MdThumbUpOffAlt, MdShare, MdSearch } from 'react-icons/md';
import SubscribeButton from '../components/SubscribeButton';
import { useChannel } from '../app/ChannelContext';
import { shorts, channel } from '../content/channel';
import { videos } from '../content/videos';
import { icons } from '../content/icons';
import { shareUrl, track } from '../lib/analytics';
import { useMeta } from '../lib/useMeta';
import './Shorts.css';

/** Full-height, snap-scrolling deck of skills. Swipe on phones, wheel or arrow keys on desktop. */
export default function Shorts() {
  const [params, setParams] = useSearchParams();
  const start = Number(params.get('i') ?? 0);
  const deck = useRef<HTMLDivElement>(null);
  const { notify } = useChannel();
  useMeta('Shorts', 'Skills and tools, one swipe at a time.');

  // Jump to the requested short on load, then keep ?i= in sync as the user swipes.
  useEffect(() => {
    const el = deck.current?.children[start] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'start' });
  }, []);

  useEffect(() => {
    if (!deck.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const i = Number((e.target as HTMLElement).dataset.index);
          track('short_view', { short: shorts[i].name });
          setParams({ i: String(i) }, { replace: true });
        }
      },
      { threshold: 0.7 },
    );
    Array.from(deck.current.children).forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, [setParams]);

  const share = async (i: number) => {
    const url = shareUrl(`/shorts?i=${i}`, 'copy');
    try {
      await navigator.clipboard.writeText(url);
      notify('Link copied to clipboard');
      track('share', { method: 'copy', short: shorts[i].name });
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="shorts" ref={deck}>
      {shorts.map((s, i) => {
        const Icon = icons[s.icon];
        const related = videos.filter((v) => v.tags.some((t) => t.toLowerCase().includes(s.name.toLowerCase()))).length;
        return (
          <section key={s.name} className="short" data-index={i} style={{ '--h': s.hue } as React.CSSProperties}>
            <div className="short__card">
              <Icon className="short__icon" />
              <div className="short__info">
                <span className="short__cat">#{s.category.replace(/[^a-z]/gi, '')}</span>
                <h2 className="short__name">{s.name}</h2>
                <p className="short__desc">{s.description}</p>
                <div className="short__channel">
                  <img className="avatar" src={channel.avatar} width={32} height={32} alt="" />
                  <span>{channel.handle}</span>
                  <SubscribeButton source="shorts" />
                </div>
              </div>
            </div>
            <div className="short__rail">
              <Link to={`/?q=${encodeURIComponent(s.name)}`} className="short__action" aria-label={`Videos about ${s.name}`}>
                <span>
                  <MdSearch />
                </span>
                {related || '—'}
              </Link>
              <button className="short__action" onClick={() => notify(`Glad you like ${s.name} too 👍`)} aria-label="Like">
                <span>
                  <MdThumbUpOffAlt />
                </span>
                Like
              </button>
              <button className="short__action" onClick={() => share(i)} aria-label="Share">
                <span>
                  <MdShare />
                </span>
                Share
              </button>
            </div>
          </section>
        );
      })}
    </div>
  );
}
