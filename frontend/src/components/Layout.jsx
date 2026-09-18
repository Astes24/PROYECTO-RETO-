import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { IconMenu } from './icons';

export const Layout = ({ children }) => {
  const [navOpen, setNavOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!navOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setNavOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [navOpen]);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#contenido">Ir al contenido</a>

      <Sidebar open={navOpen} onClose={() => setNavOpen(false)} />

      {navOpen && (
        <div
          className="drawer-overlay"
          onClick={() => setNavOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="layout-main">
        <header className="topbar">
          <button
            type="button"
            className="btn-icon"
            onClick={() => setNavOpen(true)}
            aria-label="Abrir menú de navegación"
            aria-expanded={navOpen}
            aria-controls="menu-lateral"
          >
            <IconMenu />
          </button>
          <span className="topbar-title">Mini Praxia</span>
        </header>

        <main id="contenido" className="layout-inner">
          {children}
        </main>
      </div>
    </div>
  );
};
