import React from 'react';

const NotificationPanel = () => {
  const alerts = [
    { id: 1, text: 'Rent cycle processing deadline tomorrow.', time: '2h ago' },
    { id: 2, text: 'Maintenance request status updated to [In Progress].', time: '5h ago' },
    { id: 3, text: 'System update scheduled for 02:00 AM UTC.', time: '1d ago' },
  ];

  return (
    <div className="notification-panel">
      <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>Notifications</div>
      {alerts.map((a) => (
        <div key={a.id} style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)', fontSize: '0.85rem' }}>
          <p style={{ color: 'var(--text)' }}>{a.text}</p>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{a.time}</span>
        </div>
      ))}
    </div>
  );
};

export default NotificationPanel;