import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MdMail, MdChevronRight, MdLocationOn, MdCalendarToday, MdPlaylistPlay, MdDescription } from 'react-icons/md';
import { FaLinkedin } from 'react-icons/fa';
import SubscribeButton from '../components/SubscribeButton';
import VideoCard from '../components/VideoCard';
import ShortCard from '../components/ShortCard';
import Thumbnail from '../components/Thumbnail';
import Comments from '../components/Comments';
import { useChannel } from '../app/ChannelContext';
import { channel, playlists, shorts } from '../content/channel';
import { videos } from '../content/videos';
import type { PlaylistId } from '../content/types';
import { useCounters, type CounterKey } from '../lib/api';
import { compact } from '../lib/format';
import { track } from '../lib/analytics';
import { useMeta } from '../lib/useMeta';
import './Channel.css';

const tabs = ['home', 'videos', 'shorts', 'playlists', 'community', 'about'] as const;
type Tab = (typeof tabs)[number];

export default function Channel() {
  const [params, setParams] = useSearchParams();
  const tab = (tabs as readonly string[]).includes(params.get('tab') ?? '') ? (params.get('tab') as Tab) : 'home';
  const { subscribers, openContact } = useChannel();
  useMeta(tab === 'community' ? 'Guestbook' : 'Channel', channel.about);

  const viewKeys = useMemo(() => videos.map((v) => `views:${v.slug}` as CounterKey), []);
  const [counters] = useCounters(viewKeys);
  const views = (slug: string) => counters?.[`views:${slug}`];

  return (
    <div className="channel">
      <div className="channel__banner">
        <span>{channel.tagline}</span>
      </div>

      <header className="channel__head">
        <img className="avatar channel__avatar" src={channel.avatar} alt={channel.fullName} />
        <div className="channel__meta">
          <h1>{channel.name}</h1>
          <p className="muted">
            <strong>{channel.handle}</strong>
            {!!subscribers && <> · {compact(subscribers)} subscriber{subscribers === 1 ? '' : 's'}</>} · {videos.length} videos
          </p>
          <button className="channel__about-link muted" onClick={() => setParams({ tab: 'about' })}>
            {channel.title}. {channel.tagline} <MdChevronRight />
          </button>
          <div className="channel__links">
            <a href={channel.linkedin} target="_blank" rel="noreferrer">
              linkedin.com/in/pelumiade
            </a>
            <span className="muted"> and 1 more link</span>
          </div>
          <div className="channel__buttons">
            <SubscribeButton source="channel" />
            <button className="pill" onClick={() => openContact('channel')}>
              <MdMail /> Contact
            </button>
          </div>
        </div>
      </header>

      <nav className="channel__tabs" aria-label="Channel sections">
        {tabs.map((t) => (
          <button key={t} className={`channel__tab ${tab === t ? 'channel__tab--active' : ''}`} onClick={() => setParams({ tab: t })}>
            {t === 'community' ? 'Guestbook' : t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </nav>

      <div className="channel__content">
        {tab === 'home' && <HomeTab views={views} />}
        {tab === 'videos' && <VideosTab views={views} />}
        {tab === 'shorts' && (
          <div className="channel__shorts">
            {shorts.map((s, i) => (
              <ShortCard key={s.name} short={s} index={i} />
            ))}
          </div>
        )}
        {tab === 'playlists' && <PlaylistsTab />}
        {tab === 'community' && (
          <div className="channel__community">
            <p className="channel__community-intro">
              👋 This is my guestbook. Say hi, leave a tip, tell me where you found the site. Be kind: posts show up instantly for everyone.
            </p>
            <Comments title="Guestbook entries" placeholder="Sign the guestbook…" />
          </div>
        )}
        {tab === 'about' && <AboutTab />}
      </div>
    </div>
  );
}

function HomeTab({ views }: { views: (slug: string) => number | undefined }) {
  const work = videos.filter((v) => v.playlist === 'work');
  const trailer = work[0];
  return (
    <>
      <section className="trailer">
        <Link to={`/watch/${trailer.slug}`} className="trailer__thumb" onClick={() => track('video_open', { slug: trailer.slug, from: 'channel_trailer' })}>
          <Thumbnail slug={trailer.slug} hue={trailer.hue} icon={trailer.icon} text={trailer.thumbText} badge={trailer.durationLabel} />
        </Link>
        <div>
          <h2 className="trailer__title">Hi, I'm Pelumi 👋</h2>
          <p className="trailer__text">{channel.about}</p>
          <div className="stats">
            {channel.stats.map((s) => (
              <div key={s.label} className="stat">
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      {(['work', 'certs', 'side-projects'] as PlaylistId[]).map((id) => (
        <section key={id} className="channel__shelf">
          <h2>
            <Link to={`/playlist/${id}`}>
              {playlists[id].title} <MdPlaylistPlay />
            </Link>
          </h2>
          <div className="channel__row">
            {videos
              .filter((v) => v.playlist === id)
              .map((v) => (
                <VideoCard key={v.slug} video={v} views={views(v.slug)} from="channel_home" />
              ))}
          </div>
        </section>
      ))}
    </>
  );
}

function VideosTab({ views }: { views: (slug: string) => number | undefined }) {
  const [sort, setSort] = useState<'Latest' | 'Popular' | 'Oldest'>('Latest');
  const list = [...videos].sort((a, b) =>
    sort === 'Latest' ? b.year - a.year : sort === 'Oldest' ? a.year - b.year : (views(b.slug) ?? 0) - (views(a.slug) ?? 0),
  );
  return (
    <>
      <div className="channel__sort">
        {(['Latest', 'Popular', 'Oldest'] as const).map((s) => (
          <button key={s} className={`chip ${sort === s ? 'chip--active' : ''}`} onClick={() => setSort(s)}>
            {s}
          </button>
        ))}
      </div>
      <div className="grid">
        {list.map((v) => (
          <VideoCard key={v.slug} video={v} views={views(v.slug)} from="channel_videos" />
        ))}
      </div>
    </>
  );
}

function PlaylistsTab() {
  return (
    <div className="grid">
      {(Object.keys(playlists) as PlaylistId[]).map((id) => {
        const items = videos.filter((v) => v.playlist === id);
        const first = items[0];
        return (
          <Link key={id} to={`/playlist/${id}`} className="pcard">
            <div className="pcard__stack">
              <Thumbnail slug={first.slug} hue={first.hue} icon={first.icon} text={first.thumbText} />
              <span className="pcard__count">
                <MdPlaylistPlay /> {items.length} videos
              </span>
            </div>
            <h3>{playlists[id].title}</h3>
            <span className="muted">View full playlist</span>
          </Link>
        );
      })}
    </div>
  );
}

function AboutTab() {
  return (
    <div className="about">
      <section>
        <h2>Description</h2>
        <p>{channel.about}</p>
      </section>
      <section>
        <h2>Links</h2>
        <ul className="about__links">
          <li>
            <FaLinkedin /> <a href={channel.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          </li>
          <li>
            <MdDescription /> <a href={channel.resume} target="_blank" rel="noreferrer" onClick={() => track('resume_download', { source: 'about' })}>Résumé</a>
          </li>
          <li>
            <MdMail /> <a href={`mailto:${channel.email}`}>{channel.email}</a>
          </li>
        </ul>
      </section>
      <section>
        <h2>Stats</h2>
        <ul className="about__links">
          <li>
            <MdLocationOn /> {channel.location}
          </li>
          <li>
            <MdCalendarToday /> Building things since {channel.joined}
          </li>
          {channel.stats.map((s) => (
            <li key={s.label}>
              <strong>{s.value}</strong>&nbsp;{s.label}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
