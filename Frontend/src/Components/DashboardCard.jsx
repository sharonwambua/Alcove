import React from 'react';

const DashboardCard = ({ title, value, icon, statusColor }) => {
  return (
    <div className="card" style={{ borderLeftColor: statusColor || 'var(--primary)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>{title}</p>
          <h2 style={{ fontSize: '1.75rem', marginTop: '0.25rem', fontWeight: 700 }}>{value}</h2>
        </div>
        <div style={{ fontSize: '2rem', opacity: 0.8 }}>{icon}</div>
      </div>
    </div>
  );
};

export default DashboardCard;