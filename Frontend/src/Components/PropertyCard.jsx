import React from 'react';

const PropertyCard = ({ property }) => {
  return (
    <div className="property-card">
      <img src={property.image} alt={property.title} className="property-img" />
      <div className="property-body">
        <h3 style={{ fontSize: '1.15rem', marginBottom: '0.25rem' }}>{property.title}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>📍 {property.location}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0.75rem 0' }}>
          <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.2rem' }}>${property.rent}/mo</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--secondary)' }}>🛏️ {property.beds}b | 🛁 {property.baths}ba</span>
        </div>
        <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {property.amenities.map((a, i) => (
            <span key={i} style={{ background: '#f1f5f9', fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: 4 }}>{a}</span>
          ))}
        </div>
        <button className="btn-primary" style={{ padding: '0.5rem' }}>View Details</button>
      </div>
    </div>
  );
};

export default PropertyCard;