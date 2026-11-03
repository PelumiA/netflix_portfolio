import { Link } from 'react-router-dom';
import { useMeta } from '../lib/useMeta';

export default function NotFound() {
  useMeta('Video unavailable');
  return (
    <div className="page" style={{ textAlign: 'center', paddingTop: 80 }}>
      <p style={{ fontSize: 64, margin: 0 }}>📼</p>
      <h1 style={{ fontSize: 20 }}>This video isn't available anymore</h1>
      <p className="muted">It may have been moved, or it never existed. Either way, the rest of the channel is still here.</p>
      <Link to="/" className="pill pill--primary">
        Go to home
      </Link>
    </div>
  );
}
