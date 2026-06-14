import React from 'react';

const ReportsAndAnalytics = () => {

  const overviewMetrics = [
    { title: 'Yearly Revenue', value: 'KES 5,820,000', detail: 'Based on full unit capacity' },
    { title: 'Total Yearly Collection ', value: 'KES 2,915,000', detail: 'Total collected revenue' },
    { title: 'Operational Expenses', value: 'KES 412,000', detail: 'Maintenance & service expenses' },
    { title: 'Net Profit', value: '85.8%', detail: 'Performance index' }
  ];

  const monthlyRevenueData = [
    { month: 'Jan', amount: 310000, percentage: 65 },
    { month: 'Feb', amount: 340000, percentage: 72 },
    { month: 'Mar', amount: 390000, percentage: 80 },
    { month: 'Apr', amount: 420000, percentage: 88 },
    { month: 'May', amount: 450000, percentage: 95 },
    { month: 'Jun', amount: 485000, percentage: 100 } 
  ];

  const buildingPerformances = [
    { name: 'Amani Gardens', revenue: 'KES 1,440,000', occupancy: '91.6%', ticketsClosed: '14/15' },
    { name: 'Kilimani Heights', revenue: 'KES 1,080,000', occupancy: '80.0%', ticketsClosed: '8/9' },
    { name: 'Ruaka Ridge', revenue: 'KES 395,000', occupancy: '90.0%', ticketsClosed: '5/5' }
  ];

  return (
    <div style={{ color: 'var(--text, #333)' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '800', letterSpacing: '-0.02em' }}>Reports & Analytics</h1>
        <p style={{ margin: '0.25rem 0 0 0', color: '#777', fontSize: '0.95rem' }}>
 Analyze revenue trends, occupancy rates, and maintenance metrics to optimize your real estate investments.
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
        gap: '1.5rem', 
        marginBottom: '2.5rem' 
      }}>
        {overviewMetrics.map((stat, i) => (
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
            <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#777', marginBottom: '0.5rem', letterSpacing: '0.03em' }}>
              {stat.title}
            </span>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: i === 2 ? '#C62828' : i === 3 ? '#43A047' : '#333', marginBottom: '0.25rem' }}>
              {stat.value}
            </div>
            <span style={{ fontSize: '0.8rem', color: '#666', fontWeight: '500' }}>
              {stat.detail}
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '2rem', marginBottom: '2.5rem', alignItems: 'start' }}>
        

        <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #e0e0e0' }}>
          <h3 style={{ margin: '0 0 2rem 0', fontSize: '1.1rem', fontWeight: '700', textTransform: 'uppercase', color: '#555', letterSpacing: '0.02em' }}>
            Collection Growth Trend (Last 6 Months)
          </h3>
          
   
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-end', 
            height: '240px', 
            padding: '0 1rem',
            borderBottom: '2px solid #e0e0e0',
            marginBottom: '1rem'
          }}>
            {monthlyRevenueData.map((data, idx) => (
              <div 
                key={idx} 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  width: '12%', 
                  group: 'bar' 
                }}
              >
            
                <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#8B263E', marginBottom: '0.5rem' }}>
                  {data.amount >= 1000 ? `${(data.amount / 1000)}k` : data.amount}
                </span>
        
                <div style={{ 
                  width: '100%', 
                  height: `${data.percentage}%`, 
                  backgroundColor: '#8B263E', 
                  borderRadius: '4px 4px 0 0',
                  transition: 'height 0.5s ease-in-out',
                  boxShadow: '0 2px 4px rgba(139,38,62,0.1)'
                }}></div>
              </div>
            ))}
          </div>


          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 1rem', color: '#666', fontWeight: '700', fontSize: '0.85rem' }}>
            {monthlyRevenueData.map((data, idx) => (
              <div key={idx} style={{ width: '12%', textAlign: 'center' }}>{data.month}</div>
            ))}
          </div>
        </div>

    
        <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #e0e0e0' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.1rem', fontWeight: '700', textTransform: 'uppercase', color: '#555', letterSpacing: '0.02em' }}>
            Asset Performance
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {buildingPerformances.map((building, idx) => (
              <div 
                key={idx} 
                style={{ 
                  padding: '1.1rem', 
                  backgroundColor: '#FAF6F0', 
                  borderRadius: '8px', 
                  border: '1px solid #f0eae1' 
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: '800', fontSize: '1rem', color: '#111' }}>{building.name}</span>
                  <span style={{ fontWeight: '700', fontSize: '0.9rem', color: '#8B263E' }}>{building.revenue}</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#666', fontWeight: '600' }}>
                  <span>Occupancy: <strong style={{ color: '#333' }}>{building.occupancy}</strong></span>
                  <span>Repairs Resolved: <strong style={{ color: '#43A047' }}>{building.ticketsClosed}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default ReportsAndAnalytics;