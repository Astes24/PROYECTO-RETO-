import React from 'react';

const VARIANTS = {
  pendiente: ['badge-warning', 'Pendiente'],
  confirmada: ['badge-success', 'Confirmada'],
  cancelada: ['badge-danger', 'Cancelada'],
  reprogramada: ['badge-primary', 'Reprogramada'],
  nuevo: ['badge-info', 'Nuevo'],
  contactado: ['badge-primary', 'Contactado'],
  convertido: ['badge-success', 'Convertido'],
  cita_programada: ['badge-primary', 'Cita programada']
};

export const StatusBadge = ({ estado }) => {
  const key = String(estado || '').toLowerCase();
  const [variant, label] = VARIANTS[key] || ['badge-neutral', estado || 'Sin estado'];

  return <span className={`badge ${variant}`}>{label}</span>;
};
