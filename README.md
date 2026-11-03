# Pelumi Adenikinju — portfolio

A personal portfolio laid out like a video platform:

- **Videos** are accolades: roles, projects, certifications, awards and degrees. Each duration badge shows a stat, like tenure, "500/500" or "+262%".
- **Shorts** are skills, in a swipeable vertical deck.
- **Subscribe** opens a contact sheet.
- **Like** counts are real.
- **Comments** on each video, plus a channel **Guestbook**, update live.
- Watch pages play real demo clips. When a video has none, they play an animated highlight reel of its chapters.

Built with Vite, React 18 and TypeScript. Vercel Functions and Neon Postgres provide the live bits, and Google Analytics 4 tracks events.

## Develop

```bash
npm install
npm run dev   # serves the app and the /api functions (reads .env)
```

Without a `.env`, the site still runs and likes and comments quietly hide. To set one up, copy `.env.example` to `.env` and fill in `DATABASE_URL` (use the Neon `dev` branch), `IP_SALT` and `ADMIN_TOKEN`. If the database is new, run `db/schema.sql` against it first.

The database is the Neon project `pelumi-portfolio`. Production uses its `main` branch, and local development uses `dev`.

For deployment, set the same variables in Vercel → Project → Settings → Environment Variables. Point `DATABASE_URL` at the `main` branch there.

## Where things live

| What | Where |
|---|---|
| Videos (accolades) | `src/content/videos.ts` |
| Channel info, playlists, Shorts (skills) | `src/content/channel.ts` |
| Adding demo clips / GIFs | `scripts/convert-gif.md` |
| API: comments, counters, contact | `api/*.ts` |
| Database schema | `db/schema.sql` |
| Analytics events | `src/lib/analytics.ts` |
| Comment moderation (pin, heart, hide) | `/admin` (needs `ADMIN_TOKEN`) |

## Analytics events

GA4 receives a `page_view` on every route change. It also gets these events: `video_open`, `preview_play`, `video_play`, `chapter_click`, `like`, `subscribe`, `contact_open`, `contact_submit`, `comment_post`, `share`, `chip_filter`, `search`, `resume_download`, `skip_ad` and `short_view`. Each one carries `slug`, `source` or `from` parameters, so you can see where interactions come from. Shared links carry `utm_source=share&utm_medium=<method>`.

---

This project started as a fork of [Sumanth Samala's Netflix-inspired portfolio](https://github.com/SamalaSumanth0262/netflix-portfolio). It is not affiliated with any video platform.
