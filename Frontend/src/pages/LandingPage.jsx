import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = ({ search }) => {
  const navigate = useNavigate();
  
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    type: ''
  });


  const [properties] = useState([
    { 
      id: 1, 
      title: 'Amani Gardens Apartment', 
      location: 'Kilimani, Nairobi', 
      rent: 85000, 
      type: 'Apartment', 
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
      description: 'Executive 3-bedroom master en-suite with DSQ, high-speed lifts, borehole water supply, and 24/7 manned security gate.'
    },
    { 
      id: 2, 
      title: 'Mara Ridge Maisonette', 
      location: 'Syokimau, Machakos', 
      rent: 65000, 
      type: 'Maisonette', 
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
      description: 'Modern 4-bedroom gated community maisonette featuring a private backyard compound, semi-detached design, and solar water heating.'
    },
    { 
      id: 3, 
      title: 'Tumaini Court Flat', 
      location: 'Roysambu, Nairobi', 
      rent: 32000, 
      type: 'Flat', 
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80',
      description: 'Spacious 2-bedroom flat with constant water supply, prepaid token meter, high-speed Wi-Fi access, and balconies overlooking the highway.'
    },
    { 
      id: 4, 
      title: 'Zawadi Studio Block', 
      location: 'Westlands, Nairobi', 
      rent: 45000, 
      type: 'Bedsitter', 
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
      description: 'Premium serviced bedsitter near major shopping malls with backup generator and secure basement parking.'
    },
  ]);

  const [filteredProperties, setFilteredProperties] = useState(properties);

 
  useEffect(() => {
    let result = properties;

  
    if (search) {
      result = result.filter(p => 
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.location.toLowerCase().includes(search.toLowerCase())
      );
    }
   
    if (filters.location) {
      result = result.filter(p => p.location.toLowerCase().includes(filters.location.toLowerCase()));
    }
    if (filters.type) {
      result = result.filter(p => p.type === filters.type);
    }
    if (filters.minPrice) {
      result = result.filter(p => p.rent >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      result = result.filter(p => p.rent <= Number(filters.maxPrice));
    }

    setFilteredProperties(result);
  }, [search, filters, properties]);

  const handleBooking = (title) => {
    navigate('/book-visit', { state: { propertyTitle: title } });
  };

  const handleContact = (title) => {
    navigate('/contact-landlord', { state: { propertyTitle: title } });
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--background)', paddingTop: '2rem' }}>
      
  
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '300px 1fr', 
        gap: '2rem', 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '0 1.5rem' 
      }}>
        
  
        <aside style={{ 
          background: 'var(--surface)', 
          padding: '1.5rem', 
          borderRadius: 'var(--radius)', 
          border: '1px solid var(--border)', 
          height: 'max-content', 
          position: 'sticky', 
          top: '90px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: 'var(--text)' }}>Filter Parameters</h3>
            <button 
              onClick={() => setFilters({ location: '', minPrice: '', maxPrice: '', type: '' })}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }}
            >
              Reset Filters
            </button>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Location</label>
            <input 
              type="text" 
              value={filters.location}
              onChange={(e) => setFilters({...filters, location: e.target.value})}
              placeholder="e.g., Kilimani, Syokimau"
              style={{ width: '100%', padding: '0.6rem', marginTop: '0.35rem', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--background)', color: 'var(--text)' }}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Property Type</label>
            <select 
              value={filters.type}
              onChange={(e) => setFilters({...filters, type: e.target.value})}
              style={{ width: '100%', padding: '0.6rem', marginTop: '0.35rem', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--surface)', color: 'var(--text)' }}
            >
              <option value="">All Types</option>
              <option value="Apartment">Apartment</option>
              <option value="Maisonette">Maisonette</option>
              <option value="Flat">Flat Block</option>
              <option value="Bedsitter">Bedsitter</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Price per Month (KES)</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.35rem' }}>
              <input 
                type="number" 
                value={filters.minPrice}
                onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                placeholder="Min" 
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--background)', color: 'var(--text)' }}
              />
              <input 
                type="number" 
                value={filters.maxPrice}
                onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                placeholder="Max" 
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--background)', color: 'var(--text)' }}
              />
            </div>
          </div>
        </aside>

    
        <main>
          <div style={{ marginBottom: '1.5rem' }}>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800', color: 'var(--text)' }}>Available Rental Listings</h1>
            <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Showing {filteredProperties.length} verified listings
            </p>
          </div>

          {filteredProperties.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>No properties match your filter preferences.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '1.5rem' }}>
              {filteredProperties.map(property => (
                <div 
                  key={property.id} 
                  style={{ 
                    background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)',
                    overflow: 'hidden', boxShadow: 'var(--shadow)', display: 'flex', flexDirection: 'column',
                    transition: 'transform 0.2s ease'
                  }}
                >
      
                  <div style={{ 
                    height: '180px', 
                    backgroundImage: `url(${property.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundColor: 'var(--border)'
                  }} />

   
                  <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', fontWeight: '700', color: 'var(--text)' }}>{property.title}</h3>
                    <p style={{ margin: '0 0 0.75rem 0', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '500' }}>Location: {property.location}</p>
                    
                    <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.85rem', color: 'var(--text)', lineHeight: '1.5', flexGrow: 1 }}>
                      {property.description}
                    </p>
                    
                    <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text)' }}>
                        KES {property.rent.toLocaleString()}
                        <span style={{ fontSize: '0.8rem', fontWeight: '400', color: 'var(--text-muted)' }}> / mo</span>
                      </span>
                      <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--background)', color: 'var(--primary)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontWeight: '600', border: '1px solid var(--border)' }}>
                        {property.type}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <button 
                        onClick={() => handleBooking(property.title)}
                        className="btn-primary"
                        style={{ padding: '0.55rem', fontSize: '0.8rem', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Book Site Visit
                      </button>
                      <button 
                        onClick={() => handleContact(property.title)}
                        style={{ 
                          padding: '0.55rem', fontSize: '0.8rem', borderRadius: '4px',
                          border: '1px solid var(--primary)', background: 'none', color: 'var(--primary)',
                          fontWeight: '600', cursor: 'pointer'
                        }}
                      >
                        Contact Landlord
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

      </div>
    </div>
  );
};

export default LandingPage;