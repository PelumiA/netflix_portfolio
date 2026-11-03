import { Link } from 'react-router-dom';
import { MdVerified } from 'react-icons/md';
import Thumbnail from './Thumbnail';
import type { Video, VideoKind } from '../content/types';
import { channel } from '../content/channel';
import { compact, yearsAgo } from '../lib/format';
import { track } from '../lib/analytics';
import './VideoCard.css';

export const kindLabel: Record<VideoKind, string> = {
  project: 'Project',
  role: 'Work',
  cert: 'Certification',
  award: 'Award',
  education: 'Education',
};

export default function VideoCard({ video, views, layout = 'grid', from }: { video: Video; views?: number; layout?: 'grid' | 'row'; from: string }) {
  return (
    <Link
      to={`/watch/${video.slug}`}
      className={`vcard vcard--${layout}`}
      onClick={() => track('video_open', { slug: video.slug, kind: video.kind, from })}
    >
      <Thumbnail
        slug={video.slug}
        hue={video.hue}
        icon={video.icon}
        text={video.thumbText}
        badge={video.durationLabel}
        image={video.thumbnail}
        media={video.media}
        preview
        size={layout === 'row' ? 'small' : 'card'}
      />
      <div className="vcard__info">
        {layout === 'grid' && <img className="avatar vcard__avatar" src={channel.avatar} width={36} height={36} alt="" />}
        <div className="vcard__text">
          <h3 className="vcard__title">{video.title}</h3>
          <div className="vcard__meta">
            <span>
              {video.org ?? channel.name} <MdVerified aria-label="verified" />
            </span>
            <span>
              {kindLabel[video.kind]}
              {views !== undefined && ` • ${compact(views)} views`} • {yearsAgo(video.year)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
