import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MdShare, MdDescription, MdVerified, MdOpenInNew } from 'react-icons/md';
import Player, { chapterLabels, chapterTimes, type PlayerHandle } from '../components/Player';
import Thumbnail from '../components/Thumbnail';
import VideoCard, { kindLabel } from '../components/VideoCard';
import SubscribeButton from '../components/SubscribeButton';
import LikeButton from '../components/LikeButton';
import Comments from '../components/Comments';
import NotFound from './NotFound';
import { useChannel } from '../app/ChannelContext';
import { videoBySlug, videos } from '../content/videos';
import { channel, playlists } from '../content/channel';
import { api, useCounters, type CounterKey } from '../lib/api';
import { clock, compact, yearsAgo } from '../lib/format';
import { shareUrl, track } from '../lib/analytics';
import { useMeta } from '../lib/useMeta';
import './Watch.css';

export default function Watch() {
  const { slug = '' } = useParams();
  const video = videoBySlug.get(slug);
  if (!video) return <NotFound />;
  return <WatchVideo key={slug} slug={slug} />;
}

function WatchVideo({ slug }: { slug: string }) {
  const video = videoBySlug.get(slug)!;
  const { subscribers, notify } = useChannel();
  const player = useRef<PlayerHandle>(null);
  const [chapter, setChapter] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [counters, setCounters] = useCounters([`views:${slug}`]);
  useMeta(video.title, video.summary);

  // Count the view once per page visit.
  useEffect(() => {
    api
      .bump(`views:${slug}`, 1)
      .then(({ value }) => setCounters((c) => ({ ...c, [`views:${slug}`]: value })))
      .catch(() => {});
  }, [slug, setCounters]);

  // Keyboard shortcuts: k = play/pause, j/l = previous/next chapter.
  const labels = chapterLabels(video);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName) || e.metaKey || e.ctrlKey) return;
      if (e.key === 'k') player.current?.togglePlay();
      if (e.key === 'j') player.current?.seek(Math.max(0, chapter - 1));
      if (e.key === 'l') player.current?.seek(Math.min(labels.length - 1, chapter + 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [chapter, labels.length]);

  const onChapterChange = useCallback((i: number) => setChapter(i), []);

  const share = async () => {
    const native = typeof navigator.share === 'function';
    const url = shareUrl(`/watch/${slug}`, native ? 'native' : 'copy');
    try {
      if (native) await navigator.share({ title: video.title, url });
      else {
        await navigator.clipboard.writeText(url);
        notify('Link copied to clipboard');
      }
      track('share', { slug, method: native ? 'native' : 'copy' });
    } catch {
      /* share sheet dismissed */
    }
  };

  const upNext = useMemo(() => {
    const same = videos.filter((v) => v.playlist === video.playlist && v.slug !== slug);
    const rest = videos.filter((v) => v.playlist !== video.playlist);
    return [...same, ...rest];
  }, [video.playlist, slug]);
  const nextKeys = useMemo(() => upNext.map((v) => `views:${v.slug}` as CounterKey), [upNext]);
  const [nextViews] = useCounters(nextKeys);

  const views = counters?.[`views:${slug}`];
  const times = chapterTimes(video);

  return (
    <div className="watch">
      <div className="watch__primary">
        <div className="watch__player">
          <div className="watch__ambient" style={{ '--h': video.hue } as React.CSSProperties} aria-hidden="true" />
          <Player ref={player} video={video} onChapterChange={onChapterChange} />
        </div>

        <div className="watch__body">
          <h1 className="watch__title">{video.title}</h1>

          <div className="watch__row">
            <div className="watch__channel">
              <Link to="/channel">
                <img className="avatar" src={channel.avatar} width={40} height={40} alt="" />
              </Link>
              <div className="watch__channel-text">
                <Link to="/channel" className="watch__channel-name">
                  {channel.name} <MdVerified />
                </Link>
                <span className="muted">{subscribers ? `${compact(subscribers)} subscriber${subscribers === 1 ? '' : 's'}` : channel.title}</span>
              </div>
              <SubscribeButton source="watch" />
            </div>
            <div className="watch__actions">
              <LikeButton slug={slug} />
              <button className="pill" onClick={share}>
                <MdShare /> Share
              </button>
              <a className="pill" href={channel.resume} target="_blank" rel="noreferrer" onClick={() => track('resume_download', { source: 'watch' })}>
                <MdDescription /> Résumé
              </a>
            </div>
          </div>

          <div
            className={`desc ${expanded ? 'desc--open' : ''}`}
            onClick={() => !expanded && setExpanded(true)}
            role={expanded ? undefined : 'button'}
            tabIndex={expanded ? undefined : 0}
            onKeyDown={(e) => !expanded && e.key === 'Enter' && setExpanded(true)}
          >
            <p className="desc__meta">
              {views !== undefined && <>{views.toLocaleString()} views&nbsp;&nbsp;</>}
              {yearsAgo(video.year)}&nbsp;&nbsp;
              <span className="desc__tags">
                {video.tags.slice(0, expanded ? undefined : 3).map((t) => (
                  <Link key={t} to={`/?q=${encodeURIComponent(t)}`} onClick={(e) => e.stopPropagation()}>
                    #{t.replace(/[^a-z0-9]/gi, '')}
                  </Link>
                ))}
              </span>
            </p>
            <p className="desc__summary">
              <strong>{kindLabel[video.kind]}</strong>
              {video.org && <> · {video.org}</>} — {video.summary}
            </p>
            <ul className="desc__bullets">
              {video.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>

            {expanded && (
              <>
                <h2 className="desc__h">Chapters</h2>
                <ol className="chapters">
                  {labels.map((label, i) => (
                    <li key={label}>
                      <button
                        className={`chapter ${i === chapter ? 'chapter--active' : ''}`}
                        onClick={() => {
                          player.current?.seek(i);
                          track('chapter_click', { slug, chapter: i });
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >
                        <Thumbnail slug={slug} hue={video.hue} icon={video.icon} text={String(i + 1)} size="small" />
                        <span>
                          <strong>{label}</strong>
                          <span className="chapter__time">{clock(times[i])}</span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ol>

                {video.links && (
                  <>
                    <h2 className="desc__h">Links</h2>
                    <ul className="desc__links">
                      {video.links.map((l) => (
                        <li key={l.url}>
                          <a href={l.url} target="_blank" rel="noreferrer">
                            {l.label} <MdOpenInNew />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                <p className="desc__playlist">
                  From the playlist <Link to={`/playlist/${video.playlist}`}>{playlists[video.playlist].title}</Link>
                </p>
                <button className="desc__toggle" onClick={() => setExpanded(false)}>
                  Show less
                </button>
              </>
            )}
            {!expanded && <span className="desc__toggle">…more</span>}
          </div>

          <Comments slug={slug} collapsible />
        </div>
      </div>

      <aside className="watch__secondary" aria-label="Up next">
        {upNext.map((v) => (
          <VideoCard key={v.slug} video={v} layout="row" views={nextViews?.[`views:${v.slug}`]} from="up_next" />
        ))}
      </aside>
    </div>
  );
}
