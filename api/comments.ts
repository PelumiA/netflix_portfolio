import type { VercelRequest, VercelResponse } from '@vercel/node';
import { RegExpMatcher, englishDataset, englishRecommendedTransformers } from 'obscenity';
import { sql, ipHash, allow, isAdmin, fail, SLUG_RE } from './_lib/db.js';

const profanity = new RegExpMatcher({ ...englishDataset.build(), ...englishRecommendedTransformers });
const LINKS_RE = /(https?:\/\/|www\.)/gi;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') return await list(req, res);
    if (req.method === 'POST') return await create(req, res);
    if (req.method === 'PATCH') return await moderate(req, res);
    res.setHeader('Allow', 'GET, POST, PATCH');
    return fail(res, 405, 'Method not allowed');
  } catch (err) {
    console.error(err);
    return fail(res, 500, 'Something went wrong. Try again in a moment.');
  }
}

async function list(req: VercelRequest, res: VercelResponse) {
  const slug = typeof req.query.slug === 'string' && SLUG_RE.test(req.query.slug) ? req.query.slug : null;
  const rows = slug
    ? await sql`select id::int as id, slug, name, body, created_at, pinned, hearted from comments
                where slug = ${slug} and not hidden order by created_at desc limit 200`
    : await sql`select id::int as id, slug, name, body, created_at, pinned, hearted from comments
                where slug is null and not hidden order by created_at desc limit 200`;
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({ comments: rows });
}

async function create(req: VercelRequest, res: VercelResponse) {
  const { slug, name, body, website } = (req.body ?? {}) as Record<string, unknown>;

  const cleanName = typeof name === 'string' ? name.trim().replace(/\s+/g, ' ') : '';
  const cleanBody = typeof body === 'string' ? body.trim().replace(/\n{3,}/g, '\n\n') : '';
  const cleanSlug = typeof slug === 'string' && slug ? slug : null;

  // Honeypot filled in: pretend it worked so bots move on, but store nothing.
  if (typeof website === 'string' && website.length > 0) {
    const fake = { id: -Date.now(), slug: cleanSlug, name: cleanName, body: cleanBody, created_at: new Date().toISOString(), pinned: false, hearted: false };
    return res.status(201).json({ comment: fake });
  }

  if (cleanSlug !== null && !SLUG_RE.test(cleanSlug)) return fail(res, 400, 'Unknown video.');
  if (!cleanName || cleanName.length > 40) return fail(res, 400, 'Name must be 1–40 characters.');
  if (!cleanBody || cleanBody.length > 500) return fail(res, 400, 'Comments must be 1–500 characters.');
  if (profanity.hasMatch(cleanName) || profanity.hasMatch(cleanBody)) return fail(res, 422, 'Let’s keep it friendly. Try rephrasing that.');
  if ((cleanBody.match(LINKS_RE) ?? []).length > 1) return fail(res, 422, 'One link per comment, please.');

  const hash = ipHash(req);
  if (!(await allow('comment', hash, 3, 60)) || !(await allow('comment-day', hash, 20, 86400))) {
    return fail(res, 429, 'Whoa, you’re fast. Give it a minute before posting again.');
  }

  const rows = await sql`
    insert into comments (slug, name, body, ip_hash)
    values (${cleanSlug}, ${cleanName}, ${cleanBody}, ${hash})
    returning id::int as id, slug, name, body, created_at, pinned, hearted`;
  res.status(201).json({ comment: rows[0] });
}

async function moderate(req: VercelRequest, res: VercelResponse) {
  if (!isAdmin(req)) return fail(res, 401, 'Not authorized.');
  const id = Number(req.query.id);
  if (!Number.isInteger(id) || id <= 0) return fail(res, 400, 'Bad id.');
  const { pinned, hearted, hidden } = (req.body ?? {}) as Record<string, unknown>;
  const flag = (v: unknown) => (typeof v === 'boolean' ? v : null);
  await sql`
    update comments set
      pinned  = coalesce(${flag(pinned)}::boolean, pinned),
      hearted = coalesce(${flag(hearted)}::boolean, hearted),
      hidden  = coalesce(${flag(hidden)}::boolean, hidden)
    where id = ${id}`;
  res.status(200).json({ ok: true });
}
