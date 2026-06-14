import React from 'react';

const LandlordDashboard = () => {
 
  const systemMetrics = [
    { title: 'Total Collected (June)', value: 'KES 485,000', change: '+12% from last month', color: '#43A047' },
    { title: 'Active Occupancy Rate', value: '94.2%', change: '32 Active tenants logged', color: '#8B263E' },
    { title: 'Open Maintenance Tasks', value: '4 Tickets', change: '2 marked urgent pending action', color: '#E65100' },
    { title: 'Unpaid Invoices', value: 'KES 65,000', change: '5 accounts outstanding code', color: '#C62828' }
  ];

  const recentActivities = [
    { id: 1, action: 'New Tenant Registered', details: 'Jane Mutoni assigned to Amani Gardens Apt 3B', time: '2 hours ago' },
    { id: 2, action: 'M-Pesa Payment Received', details: 'KES 45,000 via STK Push for Kilimani Suite 12', time: '5 hours ago' },
    { id: 3, action: 'Maintenance Ticket Logged', details: 'Kitchen sink leak reported in Ruaka Ridge House 4', time: 'Yesterday' }
  ];

  return (
    <div style={{ color: 'var(--text, #333)' }}>
      
      {/* LANDLORD INTRO DUCTORY HEADER BLOCK */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '800', letterSpacing: '-0.02em' }}>
          Overview Dashboard
        </h1>
        <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-muted, #777)', fontSize: '0.95rem' }}>
          Real-time metrics tracking management node for your estate properties.
        </p>
      </div>

    
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '1.5rem', 
        marginBottom: '3rem' 
      }}>
        {systemMetrics.map((metric, i) => (
          <div 
            key={i} 
            style={{ 
              backgroundColor: '#ffffff', 
              padding: '1.5rem', 
              borderRadius: '12px', 
              border: '1px solid var(--border, #e0e0e0)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.01)'
            }}
          >
            <span style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', color: '#777', marginBottom: '0.5rem', letterSpacing: '0.03em' }}>
              {metric.title}
            </span>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: metric.color, marginBottom: '0.35rem' }}>
              {metric.value}
            </div>
            <span style={{ fontSize: '0.82rem', color: '#666', fontWeight: '500' }}>
              {metric.change}
            </span>
          </div>
        ))}
      </div>

    
      <div style={{ 
        backgroundColor: '#ffffff', 
        borderRadius: '12px', 
        border: '1px solid var(--border, #e0e0e0)', 
        padding: '2rem' 
      }}>
        <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1.15rem', fontWeight: '700' }}>
          Recent Activity Timeline Log
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {recentActivities.map((activity) => (
            <div 
              key={activity.id} 
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '1rem', 
                backgroundColor: '#FAF6F0', 
                borderRadius: '8px',
                border: '1px solid #f0eae1'
              }}
            >
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--primary, #8B263E)' }}>
                  {activity.action}
                </div>
                <div style={{ fontSize: '0.88rem', color: '#555', marginTop: '0.15rem' }}>
                  {activity.details}
                </div>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#999', fontWeight: '600' }}>
                {activity.time}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default LandlordDashboard;