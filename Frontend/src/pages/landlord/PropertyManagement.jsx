import React, { useState } from 'react';

const PropertyManagement = () => {

  const [properties, setProperties] = useState([
    { id: 'PROP-AMANI', name: 'Amani Gardens', location: 'Nairobi, Kilimani', totalUnits: 24, occupiedUnits: 22, type: 'Apartment Complex' },
    { id: 'PROP-KILIMANI', name: 'Kilimani Heights', location: 'Nairobi, Menelik Rd', totalUnits: 15, occupiedUnits: 12, type: 'Serviced Suites' },
    { id: 'PROP-RUAKA', name: 'Ruaka Ridge', location: 'Kiambu, Ruaka', totalUnits: 10, occupiedUnits: 9, type: 'Townhouses' }
  ]);

 
  const [showAddPropForm, setShowAddPropForm] = useState(false);
  
  const [newProperty, setNewProperty] = useState({
    name: '',
    location: '',
    totalUnits: '',
    type: 'Apartment Complex'
  });

 
  const handleAddProperty = (e) => {
    e.preventDefault();

    const generatedId = 'PROP-' + newProperty.name.toUpperCase().replace(/\s+/g, '-').substring(0, 10);
    
    const propertyObject = {
      id: generatedId,
      name: newProperty.name,
      location: newProperty.location,
      totalUnits: parseInt(newProperty.totalUnits) || 0,
      occupiedUnits: 0, 
      type: newProperty.type
    };

    setProperties([...properties, propertyObject]);
    setNewProperty({ name: '', location: '', totalUnits: '', type: 'Apartment Complex' });
    setShowAddPropForm(false);
  };

  return (
    <div style={{ color: 'var(--text, #333)' }}>
      
  
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '800', letterSpacing: '-0.02em' }}>Property Management</h1>
          <p style={{ margin: '0.25rem 0 0 0', color: '#777', fontSize: '0.95rem' }}>
            Centralized dashboard for managing yourS properties, tracking occupancy, and registering new assets.
          </p>
        </div>
        
        <button
          onClick={() => setShowAddPropForm(!showAddPropForm)}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#8B263E',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(139,38,62,0.2)'
          }}
        >
          {showAddPropForm ? 'View Asset Catalog' : 'Register New Property'}
        </button>
      </div>

    
      {showAddPropForm ? (
        <section style={{ backgroundColor: '#fff', padding: '2.5rem', borderRadius: '12px', border: '1px solid #e0e0e0', maxWidth: '600px', margin: '0 auto' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.2rem', fontWeight: '700' }}>Register New Estate</h3>
          <form onSubmit={handleAddProperty}>
            
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', color: '#555', marginBottom: '0.45rem' }}>Property Name</label>
              <input 
                type="text" required placeholder="e.g., Westlands Tower"
                value={newProperty.name} onChange={(e) => setNewProperty({...newProperty, name: e.target.value})}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#FAF6F0' }}
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', color: '#555', marginBottom: '0.45rem' }}>Location</label>
              <input 
                type="text" required placeholder="e.g., Nairobi, Woodavenue Rd"
                value={newProperty.location} onChange={(e) => setNewProperty({...newProperty, location: e.target.value})}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#FAF6F0' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', color: '#555', marginBottom: '0.45rem' }}>Building Type</label>
                <select 
                  value={newProperty.type} onChange={(e) => setNewProperty({...newProperty, type: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#FAF6F0', fontWeight: '600' }}
                >
                  <option value="Apartment Complex">Apartment Complex</option>
                  <option value="Serviced Suites">Serviced Suites</option>
                  <option value="Townhouses">Townhouses</option>
                  <option value="Commercial Hub">Commercial Hub</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', color: '#555', marginBottom: '0.45rem' }}>Total Room Units</label>
                <input 
                  type="number" required placeholder="e.g., 20"
                  value={newProperty.totalUnits} onChange={(e) => setNewProperty({...newProperty, totalUnits: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#FAF6F0' }}
                />
              </div>
            </div>

            <button type="submit" style={{ width: '100%', padding: '0.85rem', border: 'none', borderRadius: '8px', backgroundColor: '#8B263E', color: '#fff', fontSize: '1rem', fontWeight: '700', cursor: 'pointer' }}>
              Add to Catalog
            </button>
          </form>
        </section>
      ) : (
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
         
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
            <div style={{ backgroundColor: '#fff', padding: '1.25rem 1.5rem', borderRadius: '10px', border: '1px solid #e0e0e0' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#777', textTransform: 'uppercase' }}>Total Buildings Managed</span>
              <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#8B263E', marginTop: '0.25rem' }}>{properties.length} Properties</div>
            </div>
            <div style={{ backgroundColor: '#fff', padding: '1.25rem 1.5rem', borderRadius: '10px', border: '1px solid #e0e0e0' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#777', textTransform: 'uppercase' }}>Total Units</span>
              <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#333', marginTop: '0.25rem' }}>
                {properties.reduce((acc, curr) => acc + curr.totalUnits, 0)} Units
              </div>
            </div>
            <div style={{ backgroundColor: '#fff', padding: '1.25rem 1.5rem', borderRadius: '10px', border: '1px solid #e0e0e0' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#777', textTransform: 'uppercase' }}>Average Vacancy</span>
              <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#43A047', marginTop: '0.25rem' }}>
                {properties.reduce((acc, curr) => acc + (curr.totalUnits - curr.occupiedUnits), 0)} Available
              </div>
            </div>
          </div>

     
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {properties.map((property) => {
              const vacancyCount = property.totalUnits - property.occupiedUnits;
              const occupancyPercentage = ((property.occupiedUnits / property.totalUnits) * 100).toFixed(0);

              return (
                <div 
                  key={property.id}
                  style={{ 
                    backgroundColor: '#ffffff', 
                    borderRadius: '12px', 
                    border: '1px solid #e0e0e0', 
                    padding: '1.75rem',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.01)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '0.72rem', backgroundColor: '#FAF6F0', padding: '0.35rem 0.65rem', borderRadius: '4px', fontWeight: '700', color: '#8B263E', border: '1px solid #e8e2d8' }}>
                        {property.type}
                      </span>
                      <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#999' }}>{property.id}</span>
                    </div>

                    <h3 style={{ margin: '0 0 0.35rem 0', fontSize: '1.3rem', fontWeight: '800' }}>{property.name}</h3>
                    <p style={{ margin: '0 0 1.5rem 0', color: '#666', fontSize: '0.88rem' }}>📍 {property.location}</p>

                 
                    <div style={{ marginBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.45rem' }}>
                        <span>Occupancy Status</span>
                        <span style={{ fontWeight: '700', color: '#8B263E' }}>{occupancyPercentage}%</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', backgroundColor: '#FAF6F0', borderRadius: '4px', overflow: 'hidden', border: '1px solid #eee' }}>
                        <div style={{ width: `${occupancyPercentage}%`, height: '100%', backgroundColor: '#8B263E', borderRadius: '4px' }}></div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', borderTop: '1px solid #f0f0f0', paddingTop: '1rem' }}>
                    <div style={{ textAlign: 'center', backgroundColor: '#FAF6F0', padding: '0.5rem', borderRadius: '6px' }}>
                      <span style={{ display: 'block', fontSize: '0.72rem', color: '#777', fontWeight: '700', textTransform: 'uppercase' }}>Occupied</span>
                      <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#333' }}>{property.occupiedUnits} units</span>
                    </div>
                    <div style={{ textAlign: 'center', backgroundColor: vacancyCount > 0 ? '#E8F5E9' : '#FFEBEE', padding: '0.5rem', borderRadius: '6px' }}>
                      <span style={{ display: 'block', fontSize: '0.72rem', color: vacancyCount > 0 ? '#2E7D32' : '#C62828', fontWeight: '700', textTransform: 'uppercase' }}>Vacant</span>
                      <span style={{ fontSize: '1.1rem', fontWeight: '800', color: vacancyCount > 0 ? '#2E7D32' : '#C62828' }}>{vacancyCount} units</span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
};

export default PropertyManagement;