import React from 'react';
import { Link } from 'react-router-dom';
import { IconAlert } from './icons';

export const NotFound = () => (
  <div className="empty" style={{ paddingTop: 'var(--sp-7)' }}>
    <span className="empty-icon"><IconAlert /></span>
    <h1>Página no encontrada</h1>
    <p>La dirección que abriste no existe o cambió de lugar.</p>
    <Link className="btn btn-primary" to="/" style={{ marginTop: 'var(--sp-3)' }}>
      Volver al panel
    </Link>
  </div>
);
