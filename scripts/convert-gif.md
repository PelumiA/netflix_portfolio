# Adding demo media to a video

Long GIFs are huge. Converting them to MP4 usually cuts the size by about 10× and they still autoplay, loop, and stay silent like a GIF.

## 1. Convert

```bash
# GIF → MP4 (H.264, plays everywhere). The scale filter keeps dimensions even.
ffmpeg -i demo.gif -movflags +faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" -c:v libx264 -crf 26 public/media/my-project.mp4

# Poster frame (shown before playback and as the thumbnail)
ffmpeg -i public/media/my-project.mp4 -frames:v 1 -q:v 3 public/media/my-project.jpg
```

Keep clips in `public/media/` under about 8 MB. Put bigger ones in Vercel Blob, or upload them to a video host and use an embed.

## 2. Point the video at it

In `src/content/videos.ts`:

```ts
{
  slug: 'slack-onboarding-bot',
  // …
  thumbnail: '/media/my-project.jpg',
  media: { type: 'mp4', src: '/media/my-project.mp4', poster: '/media/my-project.jpg' },
  chapters: [
    { label: 'Trigger phrases', t: 0 },
    { label: 'Mentor group chats', t: 12 },   // seconds into the clip
    { label: 'Personalized docs', t: 31 },
  ],
}
```

- `type: 'gif'` shows the file as an image. Use it only if you can't convert.
- `type: 'youtube'` takes a video **id** as `src`. Chapters then seek the embed.
- Without `media`, the watch page plays an animated highlight reel of the chapters.
