import React from 'react';
import { NavLink } from 'react-router-dom';
import { IconDashboard, IconUsers, IconCalendar, IconChat, IconPulse } from './icons';

const navItems = [
  { path: '/', label: 'Panel', Icon: IconDashboard, end: true },
  { path: '/leads', label: 'Leads', Icon: IconUsers },
  { path: '/citas', label: 'Citas', Icon: IconCalendar },
  { path: '/whatsapp', label: 'WhatsApp', Icon: IconChat }
];

export const Sidebar = ({ open = false, onClose }) => {
  return (
    <aside
      id="menu-lateral"
      className={`sidebar${open ? ' is-open' : ''}`}
      aria-label="Navegación principal"
    >
      <div className="sidebar-brand">
        <span className="brand-mark"><IconPulse /></span>
        <div>
          <div className="brand-name">Mini Praxia</div>
          <div className="brand-sub">Gestión de consultorio</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(({ path, label, Icon, end }) => (
          <NavLink
            key={path}
            to={path}
            end={end}
            onClick={onClose}
            className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`}
          >
            <Icon />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">Mini Praxia v1.0</div>
    </aside>
  );
};
