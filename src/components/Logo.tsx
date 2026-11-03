import './Logo.css';

export default function Logo() {
  return (
    <span className="logo">
      <svg className="logo__mark" viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="9" />
        <path d="M12 9.5v13l11-6.5z" />
      </svg>
      <span className="logo__word">Pelumi</span>
      <sup className="logo__loc">HOU</sup>
    </span>
  );
}
