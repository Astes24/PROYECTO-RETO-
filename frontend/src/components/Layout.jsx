import React from 'react';
import { Sidebar } from './Sidebar';

export const Layout = ({ children }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main className="layout-main" style={{
        flex: 1,
        marginLeft: '260px',
        padding: '2rem 3rem',
        maxWidth: '1400px',
        width: '100%'
      }}>
        {children}
      </main>
    </div>
  );
};
