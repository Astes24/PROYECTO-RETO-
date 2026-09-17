import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/leads', label: 'Leads', icon: '👥' },
  { path: '/citas', label: 'Citas', icon: '📅' },
  { path: '/whatsapp', label: 'WhatsApp', icon: '💬' }
];

export const Sidebar = () => {
  return (
    <aside className="sidebar glass" style={{
      width: '260px',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid var(--border)',
      zIndex: 100
    }}>
      <div style={{ padding: '2rem 1.5rem' }}>
        <h2 className="text-gradient" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🏥 Mini Praxia</h2>
        <p className="text-secondary" style={{ fontSize: '0.875rem' }}>Gestión Médica</p>
      </div>

      <nav style={{ flex: 1, padding: '0 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              textDecoration: 'none',
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: isActive ? 'rgba(6, 182, 212, 0.1)' : 'transparent',
              borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
              transition: 'all 0.2s ease',
              fontWeight: isActive ? '600' : '400'
            })}
          >
            <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
        <span className="text-secondary" style={{ fontSize: '0.75rem' }}>Mini Praxia v1.0</span>
      </div>
    </aside>
  );
};
