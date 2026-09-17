import React from 'react';

export const MetricCard = ({ icon, label, value, subtitle, color = 'accent' }) => {
  return (
    <div className="glass" style={{
      padding: '1.5rem',
      borderRadius: 'var(--radius-lg)',
      borderLeft: `4px solid var(--${color})`,
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      cursor: 'default'
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-secondary" style={{ fontSize: '0.875rem', fontWeight: 500 }}>{label}</h3>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: 'var(--radius-full)',
          background: `rgba(var(--${color}-rgb, 6, 182, 212), 0.1)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.25rem'
        }}>
          {icon}
        </div>
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
        {value}
      </div>
      {subtitle && (
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          {subtitle}
        </div>
      )}
    </div>
  );
};
