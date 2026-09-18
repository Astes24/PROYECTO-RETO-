import React from 'react';

export const MetricCard = ({ icon, label, value, hint, tone = 'primary' }) => (
  <article className={`kpi kpi-${tone}`}>
    <div className="kpi-head">
      <span className="kpi-label">{label}</span>
      <span className="kpi-icon">{icon}</span>
    </div>
    <div className="kpi-value num">{value}</div>
    {hint && <div className="kpi-hint">{hint}</div>}
  </article>
);
