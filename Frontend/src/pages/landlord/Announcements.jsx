import React, { useState, useEffect } from 'react';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [scope, setScope] = useState('All Units');
  const [loading, setLoading] = useState(false);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/announcements', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setAnnouncements(data);
      }
    } catch (err) {
      console.error("Error connecting to announcement records:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleBroadcast = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, message, scope })
      });

      const result = await response.json();
      if (result.success) {
        alert(result.message);
        setTitle('');
        setMessage('');
        setScope('All Units');
        loadAnnouncements();
      } else {
        alert(result.message || "Failed to broadcast announcement.");
      }
    } catch (err) {
      console.error("Broadcast failed:", err);
    }
  };


  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to retract and delete this announcement permanently?")) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/announcements/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (result.success) {
        loadAnnouncements(); 
      }
    } catch (err) {
      console.error("Deletion connection issue:", err);
    }
  };

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif', maxWidth: '1100px', margin: '0 auto' }}>
   
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontWeight: 'bold', color: '#111', fontSize: '24px' }}>Global Announcements</h2>
        <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '13px' }}>
          Share notices, service updates, and community alerts directly to resident dashboards.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '30px', alignItems: 'start' }}>
        
    
        <form onSubmit={handleBroadcast} style={{ background: '#fff', padding: '24px', borderRadius: '8px', border: '1px solid #eee' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: 'bold', color: '#333' }}>Compose New Notice</h3>
          
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '6px', color: '#555' }}>Headline Title</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="e.g. Water Supply Interruption" 
              required 
              style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '6px' }} 
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '6px', color: '#555' }}>Audience Scope Target</label>
            <select 
              value={scope} 
              onChange={(e) => setScope(e.target.value)} 
              style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '6px', background: '#fff' }}
            >
              <option value="All Units">All Active Residents</option>
              <option value="Netti">Block Netti Only</option>

            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '6px', color: '#555' }}>Announcement Details</label>
            <textarea 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              placeholder="Provide context, operational timelines, and explicit instructions regarding this warning alert..." 
              rows={5} 
              required 
              style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '6px', fontFamily: 'sans-serif', resize: 'vertical' }} 
            />
          </div>

          <button 
            type="submit" 
            style={{ width: '100%', padding: '12px', background: '#8B263E', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
          >
            Send Announcement
          </button>
        </form>

  
        <div>
          <h3 style={{ margin: '0 0 14px 0', fontSize: '14px', fontWeight: 'bold', color: '#333' }}>Active Notice Log</h3>
          <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #eee', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #eee' }}>
                  <th style={{ padding: '12px 16px', color: '#555', fontWeight: '600' }}>Notification</th>
                  <th style={{ padding: '12px 16px', color: '#555', fontWeight: '600' }}>Scope</th>
                  <th style={{ padding: '12px 16px', color: '#555', fontWeight: '600' }}>Date</th>
                  <th style={{ padding: '12px 16px', color: '#555', fontWeight: '600', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading && announcements.length === 0 ? (
                  <tr><td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#999' }}>Syncing cloud notice logs...</td></tr>
                ) : announcements.length === 0 ? (
                  <tr><td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#999' }}>No announcements found in database.</td></tr>
                ) : (
                  announcements.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 'bold', color: '#111' }}> {item.title}</div>
                        <div style={{ fontSize: '12px', color: '#555', marginTop: '5px', whiteSpace: 'pre-wrap', lineHeight: '1.4' }}>
                          {item.message}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                        <span style={{ fontSize: '11px', background: '#efebe9', color: '#4e342e', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                          {item.scope}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#777', whiteSpace: 'nowrap' }}>
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Today'}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <button 
                          onClick={() => handleDelete(item.id)} 
                          style={{ background: 'none', border: 'none', color: '#cc0000', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
                        >
                           Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Announcements;