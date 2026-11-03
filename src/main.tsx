import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ChannelProvider } from './app/ChannelContext';
import Shell from './app/Shell';
import Home from './pages/Home';
import Watch from './pages/Watch';
import Shorts from './pages/Shorts';
import Channel from './pages/Channel';
import Playlist from './pages/Playlist';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ChannelProvider>
        <Routes>
          <Route element={<Shell />}>
            <Route path="/" element={<Home />} />
            <Route path="/watch/:slug" element={<Watch />} />
            <Route path="/shorts" element={<Shorts />} />
            <Route path="/channel" element={<Channel />} />
            <Route path="/playlist/:id" element={<Playlist />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ChannelProvider>
    </BrowserRouter>
  </StrictMode>,
);
