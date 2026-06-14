import React, { useState } from 'react';

const TenantAnnouncements = () => {
  // Mock Feed filtered for this logged-in tenant's building (e.g., Amani Gardens)
  const [announcements] = useState([
    { id: 1, title: 'Scheduled Water Interruption', target: 'Amani Gardens', date: '2026-06-14', priority: 'High', body: 'Please note that our main water inlet valve will undergo preventative maintenance this coming Thursday from 8:00 AM to 2:00 PM. Kindly store sufficient water reserves beforehand.' },
    { id: 2, title: 'Token Meter Upgrade Cycle', target: 'All Properties', date: '2026-06-11', priority: 'Normal', body: 'The prepaid electricity meter firmware update protocol begins next week. No downtime is expected, but please report any immediate system disconnects to management.' },
    { id: 3, title: 'Garbage Collection Schedule Adjustment', target: 'Amani Gardens', date: '2026-06-02', priority: 'Normal', body: 'Due to the upcoming public holiday, waste management collection routines will shift from Friday morning to Saturday morning this week only.' }
  ]);

  // Priority color tracking matrix
  const getPriorityStyle = (priority) => {
    return priority === 'High'
      ? { color: '#C62828', backgroundColor: '#FFEBEE', border: '1px solid #FFCDD2' }
      : { color: '#0D47A1', backgroundColor: '#E3F2FD', border: '1px solid #BBDEFB' };
  };

  return (
    <div style={{ color: 'var(--text, #333)' }}>
      
      {/* PORTAL HEADER BLOCK */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '800', letterSpacing: '-0.02em' }}>
          Notice Board
        </h1>
        <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-muted, #777)', fontSize: '0.95rem' }}>
          Stay updated with official statements, maintenance updates, and community alerts regarding your residency.
        </p>
      </div>

      {/* BULLETIN FEED CONTAINER */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '850px' }}>
        {announcements.length > 0 ? (
          announcements.map((notice) => (
            <div 
              key={notice.id}
              style={{ 
                backgroundColor: '#ffffff', 
                borderRadius: '12px', 
                border: '1px solid var(--border, #e0e0e0)', 
                padding: '1.75rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.01)',
                position: 'relative'
              }}
            >
              {/* TOP HEADER DETAILS STRIP */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.35rem 0', fontSize: '1.2rem', fontWeight: '800', color: '#111' }}>
                    {notice.title}
                  </h3>
                  
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.85rem', color: '#666', fontWeight: '600' }}>
                    <span style={{ color: notice.target === 'All Properties' ? '#555' : '#8B263E' }}>
                      📍 {notice.target}
                    </span>
                    <span>•</span>
                    <span style={{ color: '#888' }}>Issued: {notice.date}</span>
                  </div>
                </div>

                {/* PRIORITY TYPOGRAPHY BADGE */}
                <span style={{ 
                  padding: '0.3rem 0.65rem', 
                  borderRadius: '6px', 
                  fontSize: '0.75rem', 
                  fontWeight: '700', 
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em',
                  ...getPriorityStyle(notice.priority)
                }}>
                  {notice.priority} Urgent
                </span>
              </div>

              {/* NOTICE CONTENT BODY */}
              <div style={{ 
                fontSize: '0.95rem', 
                color: '#444', 
                lineHeight: '1.55', 
                borderTop: '1px solid #f5f5f5', 
                paddingTop: '1rem',
                marginTop: '1rem' 
              }}>
                {notice.body}
              </div>

            </div>
          ))
        ) : (
          /* EMPTY STATE DISPLAY CONTROL */
          <div style={{ 
            textAlign: 'center', 
            padding: '4rem 2rem', 
            backgroundColor: '#ffffff', 
            borderRadius: '12px', 
            border: '1px solid #e0e0e0' 
          }}>
            <p style={{ margin: 0, color: '#888', fontWeight: '600', fontSize: '1rem' }}>
              No active announcements logged for your property pipeline at this time.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

export default TenantAnnouncements;