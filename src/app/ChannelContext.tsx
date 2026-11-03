import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { api, useCounters } from '../lib/api';
import { track } from '../lib/analytics';
import { load, save } from '../lib/storage';

type Theme = 'dark' | 'light';

interface ChannelState {
  subscribed: boolean;
  subscribers: number | null;
  toggleSubscribe: (source: string) => void;
  contactOpen: boolean;
  openContact: (source: string) => void;
  closeContact: () => void;
  theme: Theme;
  toggleTheme: () => void;
  toast: string | null;
  notify: (message: string) => void;
}

const Ctx = createContext<ChannelState | null>(null);

export function ChannelProvider({ children }: { children: ReactNode }) {
  const [subscribed, setSubscribed] = useState(() => load('subscribed', false));
  const [counters, setCounters] = useCounters(['subs']);
  const [contactOpen, setContactOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => load<Theme>('theme', 'dark'));
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number>();

  const notify = useCallback((message: string) => {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0f0f0f' : '#ffffff');
    save('theme', theme);
  }, [theme]);

  const openContact = useCallback((source: string) => {
    setContactOpen(true);
    track('contact_open', { source });
  }, []);

  const toggleSubscribe = useCallback(
    (source: string) => {
      const next = !subscribed;
      const delta = next ? 1 : -1;
      setSubscribed(next);
      save('subscribed', next);
      setCounters((c) => (c ? { ...c, subs: Math.max(0, (c.subs ?? 0) + delta) } : c));
      api.bump('subs', delta).catch(() => {});
      if (next) {
        track('subscribe', { source });
        // Give the button animation a beat before the sheet slides up.
        window.setTimeout(() => openContact(`subscribe_${source}`), 450);
      }
    },
    [subscribed, setCounters, openContact],
  );

  return (
    <Ctx.Provider
      value={{
        subscribed,
        subscribers: counters?.subs ?? null,
        toggleSubscribe,
        contactOpen,
        openContact,
        closeContact: () => setContactOpen(false),
        theme,
        toggleTheme: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
        toast,
        notify,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useChannel() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useChannel must be used inside ChannelProvider');
  return ctx;
}
