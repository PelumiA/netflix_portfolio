import { useEffect, useRef, useState } from 'react';
import type { IconName } from '../content/icons';
import { icons } from '../content/icons';
import type { Media } from '../content/types';
import { track } from '../lib/analytics';
import './Thumbnail.css';

interface Props {
  slug: string;
  hue: number;
  icon: IconName;
  text: string;
  badge?: string;
  image?: string;
  media?: Media;
  /** Play a muted preview loop while hovered (or mostly on screen on touch devices). */
  preview?: boolean;
  size?: 'card' | 'player' | 'small';
}

const touch = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;
const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Generated thumbnail art: gradient + oversized icon + bold caption.
 * Swapped for the real image when `image` is set, with an mp4 preview on hover.
 */
export default function Thumbnail({ slug, hue, icon, text, badge, image, media, preview, size = 'card' }: Props) {
  const Icon = icons[icon];
  const ref = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const canPreview = preview && !reducedMotion && media && media.type !== 'youtube';

  // On touch screens, preview whichever card is mostly in view.
  useEffect(() => {
    if (!canPreview || !touch || !ref.current) return;
    const io = new IntersectionObserver(([e]) => setPlaying(e.intersectionRatio >= 0.6), { threshold: [0, 0.6, 1] });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [canPreview]);

  useEffect(() => {
    if (playing) track('preview_play', { slug });
  }, [playing, slug]);

  return (
    <div
      ref={ref}
      className={`thumb thumb--${size}`}
      style={{ '--h': hue } as React.CSSProperties}
      onMouseEnter={() => canPreview && !touch && setPlaying(true)}
      onMouseLeave={() => !touch && setPlaying(false)}
    >
      {image ? (
        <img className="thumb__img" src={image} alt="" loading="lazy" />
      ) : (
        <div className="thumb__art" aria-hidden="true">
          <Icon className="thumb__icon" />
          <span className="thumb__text">{text}</span>
        </div>
      )}
      {canPreview && playing &&
        (media.type === 'gif' ? (
          <img className="thumb__img thumb__preview" src={media.src} alt="" />
        ) : (
          <video className="thumb__img thumb__preview" src={media.src} poster={media.poster} autoPlay muted loop playsInline />
        ))}
      {badge && <span className="thumb__badge">{badge}</span>}
      {playing && <span className="thumb__bar" />}
    </div>
  );
}
