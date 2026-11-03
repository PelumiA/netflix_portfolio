-- Run once against the Neon database (psql "$DATABASE_URL" -f db/schema.sql).
-- Safe to re-run.

create table if not exists comments (
  id          bigserial primary key,
  slug        text,                       -- null = channel guestbook
  name        text not null check (char_length(name) between 1 and 40),
  body        text not null check (char_length(body) between 1 and 500),
  created_at  timestamptz not null default now(),
  pinned      boolean not null default false,
  hearted     boolean not null default false,
  hidden      boolean not null default false,
  ip_hash     text not null
);
create index if not exists comments_slug_idx on comments (slug, created_at desc) where not hidden;

-- Like/view/subscriber counts, keyed like "likes:<slug>", "views:<slug>", "subs".
create table if not exists counters (
  key    text primary key,
  value  bigint not null default 0 check (value >= 0)
);

-- Fixed-window rate limiting per hashed IP + action.
create table if not exists rate_limits (
  key       text primary key,
  count     int not null,
  reset_at  timestamptz not null
);

create table if not exists messages (
  id          bigserial primary key,
  name        text not null,
  email       text not null,
  message     text not null,
  created_at  timestamptz not null default now(),
  ip_hash     text not null
);
