import React, { useState } from 'react';
import DataTable from '../../components/DataTable';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: 'Quarterly Fire Alarm Inspection', scope: 'All Units', date: '2026-06-15' },
    { id: 2, title: 'Water Main Maintenance Notice', scope: 'Block B Only', date: '2026-06-18' }
  ]);
  const [title, setTitle] = useState('');
  const [scope, setScope] = useState('All Units');

  const handleBroadcast = (e) => {
    e.preventDefault();
    const newAlert = { id: Date.now(), title, scope, date: new Date().toISOString().split('T')[0] };
    setAnnouncements([newAlert, ...announcements]);
    setTitle('');
    alert('Broadcast notification dispatched to all matching tenant devices.');
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
      <form onSubmit={handleBroadcast} style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', height: 'max-content' }}>
        <h3 style={{ marginBottom: '1rem', fontWeight: '700' }}>Create Broadcast Notice</h3>
        <div className="form-group">
          <label>Announcement Headline</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g., Routine Maintenance Shift" />
        </div>
        <div className="form-group">
          <label>Target Audience Scope</label>
          <select value={scope} onChange={(e) => setScope(e.target.value)}>
            <option value="All Units">All Active Tenancies</option>
            <option value="Block A Only">Skyline Premium Block A</option>
            <option value="Block B Only">Greenwood Heights</option>
          </select>
        </div>
        <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>Send Broadcast Message</button>
      </form>

      <div>
        <h3 style={{ marginBottom: '1rem', fontWeight: '600' }}>Active Notices Log</h3>
        <DataTable 
          headers={['ID', 'Notification Title', 'Target Scope', 'Dispatch Date']} 
          data={announcements} 
          renderRow={(ann) => (
            <tr key={ann.id}>
              <td>{ann.id.toString().slice(-4)}</td>
              <td style={{ fontWeight: '500' }}>{ann.title}</td>
              <td><span style={{ background: '#e0f2fe', color: 'var(--primary)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>{ann.scope}</span></td>
              <td>{ann.date}</td>
            </tr>
          )} 
        />
      </div>
    </div>
  );
};

export default Announcements;