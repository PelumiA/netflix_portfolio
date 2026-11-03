import { Link } from 'react-router-dom';
import { icons } from '../content/icons';
import type { Short } from '../content/types';
import './ShortCard.css';

export default function ShortCard({ short, index }: { short: Short; index: number }) {
  const Icon = icons[short.icon];
  return (
    <Link to={`/shorts?i=${index}`} className="short-card" style={{ '--h': short.hue } as React.CSSProperties}>
      <div className="short-card__art">
        <Icon />
      </div>
      <h3 className="short-card__title">{short.name}</h3>
      <span className="short-card__meta">{short.category}</span>
    </Link>
  );
}
