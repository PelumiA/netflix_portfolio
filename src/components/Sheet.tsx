import { useEffect, type ReactNode } from 'react';
import { MdClose } from 'react-icons/md';
import './Sheet.css';

/** Bottom sheet on phones, centered dialog on larger screens. */
export default function Sheet(props: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  const { open, onClose } = props;
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return (
    <div className={`sheet ${open ? 'sheet--open' : ''}`} aria-hidden={!open}>
      <div className="sheet__scrim" onClick={onClose} />
      <div className="sheet__panel" role="dialog" aria-modal="true" aria-label={props.title}>
        <div className="sheet__grip" />
        <header className="sheet__head">
          <h2>{props.title}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <MdClose />
          </button>
        </header>
        <div className="sheet__body">{open && props.children}</div>
      </div>
    </div>
  );
}
