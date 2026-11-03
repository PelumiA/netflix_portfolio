import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql, ipHash, allow, fail } from './_lib/db.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return fail(res, 405, 'Method not allowed');
  }
  try {
    const { name, email, message, website } = (req.body ?? {}) as Record<string, unknown>;
    if (typeof website === 'string' && website) return res.status(200).json({ ok: true });

    const n = typeof name === 'string' ? name.trim() : '';
    const e = typeof email === 'string' ? email.trim() : '';
    const m = typeof message === 'string' ? message.trim() : '';
    if (!n || n.length > 60) return fail(res, 400, 'Please add your name.');
    if (!EMAIL_RE.test(e) || e.length > 120) return fail(res, 400, 'That email doesn’t look right.');
    if (!m || m.length > 2000) return fail(res, 400, 'Message must be 1–2000 characters.');

    const hash = ipHash(req);
    if (!(await allow('contact', hash, 3, 3600))) return fail(res, 429, 'You’ve sent a few already. I’ll get back to you!');

    await sql`insert into messages (name, email, message, ip_hash) values (${n}, ${e}, ${m}, ${hash})`;

    // Optional email notification via Resend; the message is already saved either way.
    if (process.env.RESEND_API_KEY && process.env.CONTACT_TO) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM ?? 'Portfolio <onboarding@resend.dev>',
          to: process.env.CONTACT_TO,
          reply_to: e,
          subject: `Portfolio message from ${n}`,
          text: m,
        }),
      }).catch((err) => console.error('resend failed', err));
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return fail(res, 500, 'Could not send right now.');
  }
}
