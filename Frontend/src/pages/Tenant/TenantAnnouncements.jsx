import React, { useState, useEffect } from 'react';

const TenantAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenantAnnouncements = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/announcements/all');
        const data = await res.json();
        
        let list = Array.isArray(data) ? data : (data.announcements || []);
        setAnnouncements(list.reverse()); 
      } catch (err) {
        console.warn("Tenant connection isolated from announcement database pool.");
      } finally {
        setLoading(false);
      }
    };

    fetchTenantAnnouncements();
  }, []);

  return (
    <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e0e0e0', padding: '2rem' }}>
      <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1.25rem', fontWeight: '700', color: '#8B263E' }}>
        Building Notices & Announcements
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {loading ? (
          <p style={{ color: '#777', fontSize: '0.9rem' }}>Loading community announcements...</p>
        ) : announcements.length === 0 ? (
          <p style={{ color: '#999', fontSize: '0.9rem', fontStyle: 'italic' }}>No active notices from building management at this time.</p>
        ) : (
          announcements.map((item, idx) => (
            <div 
              key={item._id || idx} 
              style={{ 
                backgroundColor: '#FAF6F0', 
                borderLeft: '4px solid #8B6A4F', 
                padding: '1rem', 
                borderRadius: '0 8px 8px 0',
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
              }}
            >
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', fontWeight: '700', color: '#111' }}>
                  {item.title}
                </h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>
                  Applies to: <span style={{ fontWeight: '600' }}>{item.targetScope || 'All Residents'}</span>
                </p>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#8B6A4F', fontWeight: '600' }}>
                {item.dispatchDate}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TenantAnnouncements;