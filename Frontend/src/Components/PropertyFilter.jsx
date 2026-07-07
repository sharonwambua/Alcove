import React from 'react';

const PropertyFilter = ({ filters, onChange }) => {
  return (
    <div className="filter-sidebar" style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', height: 'max-content' }}>
      <h3 style={{ marginBottom: '1.25rem', fontSize: '1.1rem', fontWeight: '600' }}>Filter Listings</h3>
      
      <div className="form-group">
        <label>Location Node</label>
        <input type="text" value={filters.location} onChange={(e) => onChange('location', e.target.value)} placeholder="e.g., Downtown" />
      </div>

      <div className="form-group">
        <label>Minimum Budget ($)</label>
        <input type="number" value={filters.minBudget} onChange={(e) => onChange('minBudget', e.target.value)} placeholder="0" />
      </div>

      <div className="form-group">
        <label>Maximum Budget ($)</label>
        <input type="number" value={filters.maxBudget} onChange={(e) => onChange('maxBudget', e.target.value)} placeholder="5000" />
      </div>
    </div>
  );
};

export default PropertyFilter;