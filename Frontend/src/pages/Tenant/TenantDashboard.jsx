import React from 'react';
import { useNavigate } from 'react-router-dom';

const TenantDashboard = () => {
  const navigate = useNavigate();

  // Fully localized Kenyan tenancy profile state parameters
  const tenancyDetails = {
    tenantName: 'David Omondi',
    houseName: 'Amani Gardens Apartment, House 4B',
    location: 'Kilimani, Nairobi',
    rentDue: 85000,
    waterBillDue: 2450,
    dueDate: 'July 5, 2026',
    activeTickets: 1
  };

  // Realistic localized transaction ledger without emoticons
  const recentActivity = [
    { id: 'TXN-901', date: 'June 02, 2026', description: 'Rent Payment - House 4B', amount: 85000, type: 'credit', status: 'Verified' },
    { id: 'TXN-884', date: 'June 02, 2026', description: 'Water Bill Settlement', amount: 2100, type: 'credit', status: 'Verified' },
    { id: 'TXN-762', date: 'May 28, 2026', description: 'Plumbing Repair Charge - Kitchen', amount: 1500, type: 'debit', status: 'Paid' }
  ];

  return (
    <div>
      {/* Welcome Header Control */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '800', color: 'var(--text)' }}>
          Welcome Back, {tenancyDetails.tenantName}
        </h1>
        <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-muted)' }}>
          Here is the current operational standing of your rental account.
        </p>
      </div>

      {/* ITEMIZED ACCOUNTS AND UTILITIES METRICS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        
        {/* Premises Data Frame */}
        <div style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Assigned Residence</span>
          <h3 style={{ margin: '0.5rem 0 0.25rem 0', fontSize: '1.2rem', fontWeight: '700', color: 'var(--text)' }}>{tenancyDetails.houseName}</h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{tenancyDetails.location}</p>
        </div>

        {/* Rent Due Frame */}
        <div style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rent Due</span>
          <h3 style={{ margin: '0.5rem 0 0.25rem 0', fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary)' }}>
            KES {tenancyDetails.rentDue.toLocaleString()}
          </h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Due Date: {tenancyDetails.dueDate}</p>
        </div>

        {/* Water Bill Due Frame */}
        <div style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Water Bill Due</span>
          <h3 style={{ margin: '0.5rem 0 0.25rem 0', fontSize: '1.4rem', fontWeight: '800', color: 'var(--text)' }}>
            KES {tenancyDetails.waterBillDue.toLocaleString()}
          </h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Pending Consumption Cycle</p>
        </div>

      </div>

      {/* TWO COLUMN GRID: ACTIONS & RECENT ACTIVITY LOG */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* LEFT COLUMN: PRIMARY WORKSPACE QUICK ACTIONS */}
        <div style={{ background: 'var(--surface)', padding: '2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: '700', color: 'var(--text)' }}>Quick Actions Desk</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Direct utilities communication pipeline.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button 
              onClick={() => navigate('/tenant/rent')}
              className="btn-primary" 
              style={{ padding: '0.75rem 1.5rem', textAlign: 'center' }}
            >
              Pay Rent & Water Bill
            </button>
            
            <button 
              onClick={() => navigate('/tenant/maintenance')}
              style={{ 
                padding: '0.75rem 1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--primary)',
                background: 'transparent', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              File Maintenance Ticket ({tenancyDetails.activeTickets} Active)
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: RECENT ACTIVITY STATEMENT LOG */}
        <div style={{ background: 'var(--surface)', padding: '2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: '700', color: 'var(--text)' }}>Recent Activity Statement</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>Latest ledger interactions for this tenancy unit.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentActivity.map((log) => (
              <div 
                key={log.id} 
                style={{ 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                  paddingBottom: '0.75rem', borderBottom: '1px solid var(--background)'
                }}
              >
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '600', color: 'var(--text)' }}>{log.description}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Code: {log.id} | {log.date}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ 
                    display: 'block', fontSize: '0.9rem', fontWeight: '700', 
                    color: log.type === 'credit' ? 'var(--success)' : 'var(--text)' 
                  }}>
                    {log.type === 'credit' ? '' : '-'} KES {log.amount.toLocaleString()}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>
                    {log.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default TenantDashboard;