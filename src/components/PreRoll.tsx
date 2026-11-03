import { useEffect, useState } from 'react';
import { MdSkipNext, MdInfoOutline } from 'react-icons/md';
import { useChannel } from '../app/ChannelContext';
import { channel } from '../content/channel';
import { track } from '../lib/analytics';
import { load, save } from '../lib/storage';
import './PreRoll.css';

const AD_SECONDS = 5;

/** A tongue-in-cheek "ad" for hiring me. Skippable after 5s, then gone for good. */
export default function PreRoll() {
  const { openContact } = useChannel();
  const [hidden, setHidden] = useState(() => load('preroll-skipped', false));
  const [left, setLeft] = useState(AD_SECONDS);

  useEffect(() => {
    if (hidden || left <= 0) return;
    const id = window.setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(id);
  }, [hidden, left]);

  if (hidden) return null;

  const skip = () => {
    setHidden(true);
    save('preroll-skipped', true);
    track('skip_ad', { after_seconds: AD_SECONDS - left });
  };

  return (
    <aside className="preroll" aria-label="Sponsored">
      <div className="preroll__body">
        <img className="avatar" src={channel.avatar} width={48} height={48} alt="" />
        <div>
          <p className="preroll__pitch">Need someone to make your cloud behave?</p>
          <p className="preroll__sub">
            <span className="preroll__tag">Sponsored</span> {channel.tagline}
          </p>
        </div>
      </div>
      <div className="preroll__actions">
        <button className="pill pill--accent" onClick={() => openContact('preroll')}>
          Get in touch
        </button>
        <button className="preroll__skip" onClick={skip} disabled={left > 0}>
          {left > 0 ? (
            <>Skip in {left}</>
          ) : (
            <>
              Skip Ad <MdSkipNext />
            </>
          )}
        </button>
      </div>
      <span className="preroll__info" title="Yes, this ad is for me. I'm the sponsor.">
        <MdInfoOutline /> Why this ad?
      </span>
      <span className="preroll__bar" style={{ animationDuration: `${AD_SECONDS}s` }} />
    </aside>
  );
}
