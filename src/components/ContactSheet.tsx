import { useState, type FormEvent } from 'react';
import { MdMail, MdDescription, MdContentCopy, MdCheck, MdNotificationsActive } from 'react-icons/md';
import { FaLinkedin } from 'react-icons/fa';
import Sheet from './Sheet';
import { useChannel } from '../app/ChannelContext';
import { channel } from '../content/channel';
import { api } from '../lib/api';
import { track } from '../lib/analytics';
import './ContactSheet.css';

export default function ContactSheet() {
  const { contactOpen, closeContact, subscribed } = useChannel();
  return (
    <Sheet open={contactOpen} onClose={closeContact} title={subscribed ? 'Notifications: on 🔔' : 'Get in touch'}>
      <ContactBody subscribed={subscribed} />
    </Sheet>
  );
}

function ContactBody({ subscribed }: { subscribed: boolean }) {
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(channel.email);
      setCopied(true);
      track('contact_open', { method: 'copy_email' });
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${channel.email}`;
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus('sending');
    try {
      await api.contact({
        name: String(form.get('name') ?? ''),
        email: String(form.get('email') ?? ''),
        message: String(form.get('message') ?? ''),
        website: String(form.get('website') ?? ''),
      });
      setStatus('sent');
      track('contact_submit');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Could not send.');
    }
  };

  return (
    <div className="contact">
      <div className="contact__who">
        <img className="avatar" src={channel.avatar} width={56} height={56} alt="" />
        <div>
          <strong>{channel.fullName}</strong>
          <div className="muted">{channel.title} · {channel.location}</div>
        </div>
      </div>

      {subscribed && (
        <p className="contact__note">
          <MdNotificationsActive /> Thanks for subscribing! The fastest way to reach me is below.
        </p>
      )}

      <div className="contact__actions">
        <a className="pill pill--accent" href={`mailto:${channel.email}`} onClick={() => track('contact_open', { method: 'mailto' })}>
          <MdMail /> Email
        </a>
        <button className="pill" onClick={copyEmail} aria-live="polite">
          {copied ? <MdCheck /> : <MdContentCopy />} {copied ? 'Copied' : 'Copy address'}
        </button>
        <a className="pill" href={channel.linkedin} target="_blank" rel="noreferrer" onClick={() => track('contact_open', { method: 'linkedin' })}>
          <FaLinkedin /> LinkedIn
        </a>
        <a className="pill" href={channel.resume} target="_blank" rel="noreferrer" onClick={() => track('resume_download', { source: 'contact' })}>
          <MdDescription /> Résumé
        </a>
      </div>

      <h3 className="contact__h">Or leave a quick note</h3>
      {status === 'sent' ? (
        <p className="contact__sent">Message sent. I'll get back to you soon. 🙌</p>
      ) : (
        <form className="contact__form" onSubmit={onSubmit}>
          <input name="name" placeholder="Your name" required maxLength={60} autoComplete="name" />
          <input name="email" type="email" placeholder="Email (so I can reply)" required maxLength={120} autoComplete="email" />
          <textarea name="message" placeholder="What's up?" required maxLength={2000} rows={4} />
          {/* Honeypot: hidden from people, irresistible to bots */}
          <input name="website" className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          {status === 'error' && <p className="contact__error">{error} You can always email me directly.</p>}
          <button className="pill pill--primary" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Send'}
          </button>
        </form>
      )}
    </div>
  );
}
