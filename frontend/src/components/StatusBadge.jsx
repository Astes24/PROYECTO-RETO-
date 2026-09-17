import React from 'react';

export const StatusBadge = ({ estado }) => {
  let color = 'secondary';
  let bgColor = 'rgba(148, 163, 184, 0.1)';
  
  const est = estado ? estado.toLowerCase() : '';

  if (est === 'pendiente' || est === 'nuevo') {
    color = 'warning';
    bgColor = 'rgba(245, 158, 11, 0.1)';
  } else if (est === 'confirmada' || est === 'contactado') {
    color = 'success';
    bgColor = 'rgba(16, 185, 129, 0.1)';
  } else if (est === 'cancelada') {
    color = 'danger';
    bgColor = 'rgba(239, 68, 68, 0.1)';
  } else if (est === 'reprogramada' || est === 'cita_programada') {
    color = 'accent';
    bgColor = 'rgba(6, 182, 212, 0.1)';
  }

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '0.25rem 0.75rem',
      borderRadius: 'var(--radius-full)',
      fontSize: '0.75rem',
      fontWeight: 500,
      color: `var(--${color})`,
      backgroundColor: bgColor,
      border: `1px solid rgba(var(--${color}-rgb, 255, 255, 255), 0.2)`
    }}>
      {estado}
    </span>
  );
};
