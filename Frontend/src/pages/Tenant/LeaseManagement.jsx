import React from 'react';

const LeaseManagement = () => {
  return (
    <div style={{ background: 'var(--surface)', padding: '2rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
      <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Lease Agreement Details</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Official terms verified by property operations</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
        <div>
          <h4 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Commencement</h4>
          <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>January 01, 2026</p>
        </div>
        <div>
          <h4 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Termination</h4>
          <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>December 31, 2026</p>
        </div>
        <div>
          <h4 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Premises</h4>
          <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>Suite 404 - Skyline Apartments</p>
        </div>
        <div>
          <h4 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Monthly Contract Rent</h4>
          <p style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--primary)' }}>$2,200.00 / mo</p>
        </div>
      </div>
      
      <button className="btn-primary" style={{ width: 'auto' }} onClick={() => alert('Downloading Lease_Agreement_2026.pdf')}>
        📥 Download Certified Copy (PDF)
      </button>
    </div>
  );
};

export default LeaseManagement;