import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  MdMenu, MdSearch, MdArrowBack, MdLightMode, MdDarkMode, MdHome, MdOutlineHome, MdBolt, MdOutlineBolt,
  MdForum, MdOutlineForum, MdAccountCircle, MdOutlineAccountCircle, MdMail, MdOutlineMail, MdPlaylistPlay,
  MdDescription, MdAddCircleOutline, MdOutlineVideoLibrary, MdVideoLibrary,
} from 'react-icons/md';
import { useChannel } from './ChannelContext';
import { channel, playlists } from '../content/channel';
import { track, trackPageView } from '../lib/analytics';
import ContactSheet from '../components/ContactSheet';
import Logo from '../components/Logo';
import './Shell.css';

export default function Shell() {
  const location = useLocation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { theme, toggleTheme, openContact, toast } = useChannel();
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const [query, setQuery] = useState(params.get('q') ?? '');
  const searchRef = useRef<HTMLInputElement>(null);
  const onWatch = location.pathname.startsWith('/watch') || location.pathname.startsWith('/shorts');

  useEffect(() => {
    trackPageView(location.pathname + location.search);
    setDrawerOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname, location.search]);

  useEffect(() => setQuery(params.get('q') ?? ''), [params]);

  // "/" focuses search, like on the real thing.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(el.tagName)) {
        e.preventDefault();
        setMobileSearch(true);
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) track('search', { search_term: q });
    navigate(q ? `/?q=${encodeURIComponent(q)}` : '/');
    setMobileSearch(false);
    searchRef.current?.blur();
  };

  const onMenu = () => {
    if (!onWatch && window.matchMedia('(min-width: 1280px)').matches) setCollapsed((c) => !c);
    else setDrawerOpen(true);
  };

  const sidebarMode = onWatch ? 'hidden' : collapsed ? 'rail' : 'auto';

  return (
    <div className={`shell shell--${sidebarMode}`}>
      <header className={`topbar ${mobileSearch ? 'topbar--searching' : ''}`}>
        <div className="topbar__start">
          <button className="icon-btn" onClick={onMenu} aria-label="Menu">
            <MdMenu />
          </button>
          <Link to="/" aria-label="Home">
            <Logo />
          </Link>
        </div>

        <form className="search" role="search" onSubmit={onSearch}>
          <button type="button" className="icon-btn search__back" onClick={() => setMobileSearch(false)} aria-label="Close search">
            <MdArrowBack />
          </button>
          <input
            ref={searchRef}
            className="search__input"
            type="search"
            placeholder="Search projects, roles, skills"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search"
          />
          <button className="search__btn" aria-label="Search">
            <MdSearch />
          </button>
        </form>

        <div className="topbar__end">
          <button
            className="icon-btn search__open"
            onClick={() => {
              setMobileSearch(true);
              requestAnimationFrame(() => searchRef.current?.focus());
            }}
            aria-label="Search"
          >
            <MdSearch />
          </button>
          <button className="icon-btn" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
            {theme === 'dark' ? <MdLightMode /> : <MdDarkMode />}
          </button>
          <button className="pill pill--accent topbar__hire" onClick={() => openContact('topbar')}>
            <MdMail /> <span>Contact</span>
          </button>
          <Link to="/channel" aria-label="Channel">
            <img className="avatar" src={channel.avatar} width={32} height={32} alt="" />
          </Link>
        </div>
      </header>

      <Sidebar className="sidebar" />
      <div className={`drawer ${drawerOpen ? 'drawer--open' : ''}`} aria-hidden={!drawerOpen}>
        <div className="drawer__scrim" onClick={() => setDrawerOpen(false)} />
        <div className="drawer__panel">
          <div className="topbar__start drawer__head">
            <button className="icon-btn" onClick={() => setDrawerOpen(false)} aria-label="Close menu">
              <MdMenu />
            </button>
            <Link to="/">
              <Logo />
            </Link>
          </div>
          <Sidebar className="sidebar sidebar--drawer" />
        </div>
      </div>

      <main className="main">
        <Outlet />
      </main>

      <BottomNav />
      <ContactSheet />
      <div className={`toast ${toast ? 'toast--show' : ''}`} role="status" aria-live="polite">
        {toast}
      </div>
    </div>
  );
}

function Sidebar({ className }: { className: string }) {
  const { openContact } = useChannel();
  return (
    <nav className={className} aria-label="Main">
      <div className="sidebar__section">
        <SideLink to="/" icon={<MdOutlineHome />} activeIcon={<MdHome />} label="Home" end />
        <SideLink to="/shorts" icon={<MdOutlineBolt />} activeIcon={<MdBolt />} label="Shorts" />
        <SideLink to="/channel?tab=community" icon={<MdOutlineForum />} activeIcon={<MdForum />} label="Guestbook" />
        <SideLink to="/channel" icon={<MdOutlineAccountCircle />} activeIcon={<MdAccountCircle />} label="Channel" end />
      </div>
      <div className="sidebar__section sidebar__extra">
        <h3 className="sidebar__title">You</h3>
        <SideLink to="/channel?tab=playlists" icon={<MdOutlineVideoLibrary />} activeIcon={<MdVideoLibrary />} label="Playlists" />
        <a className="side-link" href={channel.resume} target="_blank" rel="noreferrer" onClick={() => track('resume_download', { source: 'sidebar' })}>
          <MdDescription />
          <span>Résumé</span>
        </a>
        <button className="side-link" onClick={() => openContact('sidebar')}>
          <MdOutlineMail />
          <span>Contact</span>
        </button>
      </div>
      <div className="sidebar__section sidebar__extra">
        <h3 className="sidebar__title">Playlists</h3>
        {Object.entries(playlists).map(([id, p]) => (
          <Link key={id} className="side-link" to={`/playlist/${id}`}>
            <MdPlaylistPlay />
            <span>{p.title}</span>
          </Link>
        ))}
      </div>
      <footer className="sidebar__footer sidebar__extra">
        A portfolio in the style of a video site. Not affiliated with any platform.
        <br />© {new Date().getFullYear()} {channel.name}
      </footer>
    </nav>
  );
}

function SideLink(props: { to: string; icon: JSX.Element; activeIcon: JSX.Element; label: string; end?: boolean }) {
  const location = useLocation();
  // NavLink ignores the query string, so tabs on /channel need a manual check.
  const [path, search = ''] = props.to.split('?');
  const active = location.pathname === path && (search ? location.search.includes(search) : props.end ? !location.search.includes('tab=') : true);
  return (
    <NavLink to={props.to} className={() => `side-link ${active ? 'side-link--active' : ''}`} end={props.end}>
      {active ? props.activeIcon : props.icon}
      <span>{props.label}</span>
    </NavLink>
  );
}

function BottomNav() {
  const { openContact } = useChannel();
  const { pathname, search } = useLocation();
  const is = (p: string, q = '') => pathname === p && (q ? search.includes(q) : !search.includes('tab='));
  return (
    <nav className="bottomnav" aria-label="Main">
      <Link to="/" className={is('/') ? 'active' : ''}>
        {is('/') ? <MdHome /> : <MdOutlineHome />}
        <span>Home</span>
      </Link>
      <Link to="/shorts" className={pathname === '/shorts' ? 'active' : ''}>
        {pathname === '/shorts' ? <MdBolt /> : <MdOutlineBolt />}
        <span>Shorts</span>
      </Link>
      <Link to="/channel?tab=community#sign" className="bottomnav__create" aria-label="Sign the guestbook">
        <MdAddCircleOutline />
      </Link>
      <button onClick={() => openContact('bottomnav')}>
        <MdOutlineMail />
        <span>Contact</span>
      </button>
      <Link to="/channel" className={is('/channel') ? 'active' : ''}>
        <img className="avatar" src={channel.avatar} width={24} height={24} alt="" />
        <span>You</span>
      </Link>
    </nav>
  );
}
