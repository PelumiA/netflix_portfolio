import type { IconName } from './icons';

export type VideoKind = 'project' | 'role' | 'cert' | 'award' | 'education';

export interface Chapter {
  label: string;
  /** Seconds into the media. Only needed when the video has real media to seek. */
  t?: number;
}

export interface Media {
  /** mp4/webm play inline (muted loop for previews); gif renders as an image; youtube embeds by id. */
  type: 'mp4' | 'gif' | 'youtube';
  src: string;
  poster?: string;
}

export interface Video {
  slug: string;
  title: string;
  kind: VideoKind;
  /** The "uploaded" year shown on cards. */
  year: number;
  /** The badge in the thumbnail corner: tenure, a stat, or something quirky. */
  durationLabel: string;
  /** Big bold text painted on the generated thumbnail. */
  thumbText: string;
  icon: IconName;
  /** Hue (0-360) for the generated thumbnail and the ambient glow. */
  hue: number;
  /** Optional real thumbnail image; the generated one is used otherwise. */
  thumbnail?: string;
  media?: Media;
  org?: string;
  tags: string[];
  summary: string;
  bullets: string[];
  chapters?: Chapter[];
  links?: { label: string; url: string }[];
  playlist: PlaylistId;
}

export type PlaylistId = 'work' | 'research' | 'education' | 'certs' | 'side-projects' | 'awards';

export interface Short {
  name: string;
  category: string;
  description: string;
  icon: IconName;
  hue: number;
}
