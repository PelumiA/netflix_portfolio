import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MdBolt } from 'react-icons/md';
import VideoCard from '../components/VideoCard';
import PreRoll from '../components/PreRoll';
import ShortCard from '../components/ShortCard';
import { videos } from '../content/videos';
import { shorts } from '../content/channel';
import type { Video, VideoKind } from '../content/types';
import { useCounters, type CounterKey } from '../lib/api';
import { track } from '../lib/analytics';
import { useMeta } from '../lib/useMeta';
import './Home.css';

const kindChips: { label: string; kind: VideoKind }[] = [
  { label: 'Work', kind: 'role' },
  { label: 'Projects', kind: 'project' },
  { label: 'Certifications', kind: 'cert' },
  { label: 'Awards', kind: 'award' },
  { label: 'Education', kind: 'education' },
];
const tagChips = ['AWS', 'Azure', 'Terraform', 'Kubernetes', 'Python', 'Research', 'Security'];

function haystack(v: Video) {
  return [v.title, v.org, v.summary, ...v.tags, ...v.bullets].join(' ').toLowerCase();
}

export default function Home() {
  const [params] = useSearchParams();
  const q = (params.get('q') ?? '').trim().toLowerCase();
  const [chip, setChip] = useState('All');
  useMeta(q ? `Search: ${q}` : undefined);

  const viewKeys = useMemo(() => videos.map((v) => `views:${v.slug}` as CounterKey), []);
  const [counters] = useCounters(viewKeys);

  const list = useMemo(() => {
    let out = videos;
    if (q) {
      const terms = q.split(/\s+/);
      out = out.filter((v) => terms.every((t) => haystack(v).includes(t)));
    }
    if (chip !== 'All') {
      const kind = kindChips.find((c) => c.label === chip)?.kind;
      out = out.filter((v) => (kind ? v.kind === kind : v.tags.some((t) => t.toLowerCase().includes(chip.toLowerCase()))));
    }
    return out;
  }, [q, chip]);

  const pick = (label: string) => {
    setChip(label);
    track('chip_filter', { chip: label });
  };

  const views = (slug: string) => counters?.[`views:${slug}`];
  const showShelf = !q && chip === 'All';

  return (
    <div className="home">
      <div className="chips" role="toolbar" aria-label="Filter">
        {['All', ...kindChips.map((c) => c.label), ...tagChips].map((label) => (
          <button key={label} className={`chip ${chip === label ? 'chip--active' : ''}`} onClick={() => pick(label)} aria-pressed={chip === label}>
            {label}
          </button>
        ))}
      </div>

      <div className="page">
        {!q && <PreRoll />}
        {q && (
          <p className="home__results">
            {list.length} result{list.length === 1 ? '' : 's'} for “{params.get('q')}”
          </p>
        )}
        {list.length === 0 && <p className="muted">Nothing here yet. Try another search, or check out the Shorts for skills.</p>}

        <div className="grid">
          {list.slice(0, showShelf ? 8 : undefined).map((v) => (
            <VideoCard key={v.slug} video={v} views={views(v.slug)} from="home" />
          ))}
        </div>

        {showShelf && (
          <>
            <section className="shelf">
              <h2 className="shelf__title">
                <MdBolt /> Shorts <Link to="/shorts" className="shelf__more">View all</Link>
              </h2>
              <div className="shelf__row">
                {shorts.slice(0, 8).map((s, i) => (
                  <ShortCard key={s.name} short={s} index={i} />
                ))}
              </div>
            </section>
            <div className="grid">
              {list.slice(8).map((v) => (
                <VideoCard key={v.slug} video={v} views={views(v.slug)} from="home" />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
