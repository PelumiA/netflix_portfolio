import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { MdPlayArrow, MdPause, MdReplay } from 'react-icons/md';
import Thumbnail from './Thumbnail';
import type { Video } from '../content/types';
import { clock } from '../lib/format';
import { track } from '../lib/analytics';
import './Player.css';

/** Seconds each chapter "slide" stays up when a video has no real media. */
export const SLIDE_SECONDS = 5;

export interface PlayerHandle {
  seek: (chapter: number) => void;
  togglePlay: () => void;
}

export function chapterLabels(video: Video) {
  return video.chapters?.map((c) => c.label) ?? video.bullets;
}

/** Start time (seconds) of each chapter, from real timestamps or the slideshow rhythm. */
export function chapterTimes(video: Video) {
  if (video.media && video.chapters) return video.chapters.map((c, i) => c.t ?? i * SLIDE_SECONDS);
  return chapterLabels(video).map((_, i) => i * SLIDE_SECONDS);
}

const Player = forwardRef<PlayerHandle, { video: Video; onChapterChange?: (i: number) => void }>(function Player(
  { video, onChapterChange },
  ref,
) {
  if (video.media?.type === 'mp4') return <VideoPlayer ref={ref} video={video} />;
  if (video.media?.type === 'youtube') return <EmbedPlayer ref={ref} video={video} />;
  if (video.media?.type === 'gif')
    return (
      <div className="player">
        <img className="player__media" src={video.media.src} alt={`Demo of ${video.title}`} />
      </div>
    );
  return <SlideshowPlayer ref={ref} video={video} onChapterChange={onChapterChange} />;
});
export default Player;

const VideoPlayer = forwardRef<PlayerHandle, { video: Video }>(function VideoPlayer({ video }, ref) {
  const el = useRef<HTMLVideoElement>(null);
  const times = chapterTimes(video);
  useImperativeHandle(ref, () => ({
    seek: (i) => {
      if (!el.current) return;
      el.current.currentTime = times[i] ?? 0;
      el.current.play().catch(() => {});
    },
    togglePlay: () => (el.current?.paused ? el.current.play().catch(() => {}) : el.current?.pause()),
  }));
  return (
    <div className="player">
      <video
        ref={el}
        className="player__media"
        src={video.media!.src}
        poster={video.media!.poster}
        controls
        playsInline
        preload="metadata"
        onPlay={() => track('video_play', { slug: video.slug })}
      />
    </div>
  );
});

const EmbedPlayer = forwardRef<PlayerHandle, { video: Video }>(function EmbedPlayer({ video }, ref) {
  const [start, setStart] = useState<number | null>(null);
  const times = chapterTimes(video);
  useImperativeHandle(ref, () => ({ seek: (i) => setStart(times[i] ?? 0), togglePlay: () => {} }));
  const src = `https://www.youtube-nocookie.com/embed/${video.media!.src}?rel=0&modestbranding=1${start !== null ? `&start=${start}&autoplay=1` : ''}`;
  return (
    <div className="player">
      <iframe
        key={start}
        className="player__media"
        src={src}
        title={video.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
});

/**
 * No demo footage? The "video" becomes an animated highlight reel that steps
 * through the chapters with a real progress bar and scrubbable segments.
 */
const SlideshowPlayer = forwardRef<PlayerHandle, { video: Video; onChapterChange?: (i: number) => void }>(
  function SlideshowPlayer({ video, onChapterChange }, ref) {
    const labels = chapterLabels(video);
    const total = labels.length * SLIDE_SECONDS;
    const [elapsed, setElapsed] = useState(0);
    const [playing, setPlaying] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const current = Math.min(labels.length - 1, Math.floor(elapsed / SLIDE_SECONDS));
    const ended = elapsed >= total;

    useEffect(() => {
      setElapsed(0);
    }, [video.slug]);

    useEffect(() => {
      if (!playing || ended) return;
      let last = performance.now();
      const id = window.setInterval(() => {
        const now = performance.now();
        setElapsed((e) => Math.min(total, e + (now - last) / 1000));
        last = now;
      }, 100);
      return () => window.clearInterval(id);
    }, [playing, ended, total]);

    useEffect(() => onChapterChange?.(current), [current, onChapterChange]);

    const togglePlay = () => {
      if (ended) setElapsed(0);
      setPlaying((p) => (ended ? true : !p));
      if (!playing) track('video_play', { slug: video.slug });
    };

    useImperativeHandle(ref, () => ({
      seek: (i) => {
        setElapsed(i * SLIDE_SECONDS + 0.01);
        setPlaying(true);
      },
      togglePlay,
    }));

    return (
      <div className="player player--slides">
        <Thumbnail slug={video.slug} hue={video.hue} icon={video.icon} text="" size="player" image={video.thumbnail} />
        <button className="slides__stage" onClick={togglePlay} aria-label={playing && !ended ? 'Pause' : 'Play'}>
          <span className="slides__kicker">
            {video.org ?? video.thumbText} · {current + 1}/{labels.length}
          </span>
          <span key={current} className="slides__label">
            {labels[current]}
          </span>
        </button>

        <div className="slides__controls">
          <div className="slides__track" role="group" aria-label="Chapters">
            {labels.map((label, i) => {
              const fill = Math.max(0, Math.min(1, (elapsed - i * SLIDE_SECONDS) / SLIDE_SECONDS));
              return (
                <button
                  key={i}
                  className="slides__seg"
                  onClick={() => {
                    setElapsed(i * SLIDE_SECONDS + 0.01);
                    setPlaying(true);
                    track('chapter_click', { slug: video.slug, chapter: i });
                  }}
                  aria-label={`Chapter ${i + 1}: ${label}`}
                >
                  <span style={{ transform: `scaleX(${fill})` }} />
                </button>
              );
            })}
          </div>
          <div className="slides__bar">
            <button className="slides__play" onClick={togglePlay} aria-label={ended ? 'Replay' : playing ? 'Pause' : 'Play'}>
              {ended ? <MdReplay /> : playing ? <MdPause /> : <MdPlayArrow />}
            </button>
            <span className="slides__time">
              {clock(elapsed)} / {clock(total)}
            </span>
            <span className="slides__chapter">• {labels[current]}</span>
          </div>
        </div>
      </div>
    );
  },
);
