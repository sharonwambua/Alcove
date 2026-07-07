import React from 'react';

const PropertyGrid = ({ properties }) => {
  if (properties.length === 0) {
    return <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No units match your selected hunting criteria.</div>;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
      {properties.map(p => (
        <div key={p.id} style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
          <div style={{ padding: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--primary)', background: '#e0f2fe', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>Available</span>
            <h3 style={{ fontSize: '1.1rem', marginTop: '0.5rem', fontWeight: '600' }}>{p.title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}> {p.location}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text)' }}>${p.rent}<span style={{ fontSize: '0.85rem', fontWeight: '400', color: 'var(--text-muted)' }}>/mo</span></span>
              <button className="btn-primary" style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => alert(`Application processing initialized for asset node context: ${p.title}`)}>Apply</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PropertyGrid;