import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql, ipHash, allow, fail } from './_lib/db.js';

const KEY_RE = /^(subs|(views|likes):[a-z0-9-]{1,80})$/;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      const keys = String(req.query.keys ?? '')
        .split(',')
        .filter((k) => KEY_RE.test(k))
        .slice(0, 100);
      const rows = keys.length ? await sql`select key, value from counters where key = any(${keys})` : [];
      const counters: Record<string, number> = Object.fromEntries(keys.map((k) => [k, 0]));
      for (const r of rows) counters[r.key as string] = Number(r.value);
      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).json({ counters });
    }

    if (req.method === 'POST') {
      const { key, delta } = (req.body ?? {}) as { key?: string; delta?: number };
      if (typeof key !== 'string' || !KEY_RE.test(key)) return fail(res, 400, 'Unknown counter.');
      if (delta !== 1 && delta !== -1) return fail(res, 400, 'Bad delta.');
      if (key.startsWith('views:') && delta !== 1) return fail(res, 400, 'Views only go up.');

      // Views are cheap and frequent; likes and subscribes are deliberate actions.
      const [limit, window] = key.startsWith('views:') ? [60, 60] : [20, 60];
      if (!(await allow(`counter:${key.split(':')[0]}`, ipHash(req), limit, window))) {
        return fail(res, 429, 'Slow down a little.');
      }

      const rows = await sql`
        insert into counters (key, value) values (${key}, greatest(${delta}, 0))
        on conflict (key) do update set value = greatest(counters.value + ${delta}, 0)
        returning value`;
      return res.status(200).json({ value: Number(rows[0].value) });
    }

    res.setHeader('Allow', 'GET, POST');
    return fail(res, 405, 'Method not allowed');
  } catch (err) {
    console.error(err);
    return fail(res, 500, 'Something went wrong.');
  }
}
