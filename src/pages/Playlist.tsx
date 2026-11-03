import { Link, useParams } from 'react-router-dom';
import { MdPlayArrow } from 'react-icons/md';
import Thumbnail from '../components/Thumbnail';
import VideoCard from '../components/VideoCard';
import NotFound from './NotFound';
import { channel, playlists } from '../content/channel';
import { videos } from '../content/videos';
import type { PlaylistId } from '../content/types';
import { useMeta } from '../lib/useMeta';
import './Playlist.css';

export default function Playlist() {
  const { id = '' } = useParams();
  const meta = playlists[id as PlaylistId];
  useMeta(meta?.title, meta?.description);
  if (!meta) return <NotFound />;
  const items = videos.filter((v) => v.playlist === id);
  const first = items[0];

  return (
    <div className="playlist">
      <header className="playlist__hero" style={{ '--h': first.hue } as React.CSSProperties}>
        <Thumbnail slug={first.slug} hue={first.hue} icon={first.icon} text={first.thumbText} />
        <h1>{meta.title}</h1>
        <p className="playlist__by">
          <img className="avatar" src={channel.avatar} width={24} height={24} alt="" /> by {channel.name}
        </p>
        <p className="playlist__info">
          Playlist · {items.length} videos
        </p>
        <p>{meta.description}</p>
        <Link to={`/watch/${first.slug}`} className="pill pill--primary playlist__play">
          <MdPlayArrow /> Play all
        </Link>
      </header>
      <ol className="playlist__items">
        {items.map((v, i) => (
          <li key={v.slug}>
            <span className="playlist__n">{i + 1}</span>
            <VideoCard video={v} layout="row" from={`playlist_${id}`} />
          </li>
        ))}
      </ol>
    </div>
  );
}
