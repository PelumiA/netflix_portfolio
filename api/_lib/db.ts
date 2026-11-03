import { neon } from '@neondatabase/serverless';
import { createHash } from 'node:crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export const sql = neon(process.env.DATABASE_URL!);

/** Salted hash so raw IPs are never stored. */
export function ipHash(req: VercelRequest): string {
  const fwd = req.headers['x-forwarded-for'];
  const ip = (Array.isArray(fwd) ? fwd[0] : fwd)?.split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
  return createHash('sha256').update(`${process.env.IP_SALT ?? ''}:${ip}`).digest('hex').slice(0, 32);
}

/** True while the caller is still under `limit` hits for this action in the current window. */
export async function allow(action: string, hash: string, limit: number, windowSeconds: number): Promise<boolean> {
  const rows = await sql`
    insert into rate_limits (key, count, reset_at)
    values (${`${action}:${hash}`}, 1, now() + make_interval(secs => ${windowSeconds}))
    on conflict (key) do update set
      count    = case when rate_limits.reset_at < now() then 1 else rate_limits.count + 1 end,
      reset_at = case when rate_limits.reset_at < now() then now() + make_interval(secs => ${windowSeconds}) else rate_limits.reset_at end
    returning count`;
  return Number(rows[0].count) <= limit;
}

export function isAdmin(req: VercelRequest): boolean {
  const token = process.env.ADMIN_TOKEN;
  return !!token && req.headers.authorization === `Bearer ${token}`;
}

export function fail(res: VercelResponse, status: number, error: string) {
  res.status(status).json({ error });
}

/** Slugs come from the client, so keep them to a safe, bounded shape. */
export const SLUG_RE = /^[a-z0-9-]{1,80}$/;
