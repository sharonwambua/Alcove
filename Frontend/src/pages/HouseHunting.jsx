import React, { useState, useEffect } from 'react';

const HouseHunting = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters state parameters
  const [locationSearch, setLocationSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const fetchLiveListings = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/properties/all');
      const result = await res.json();
      

      if (result && result.success && Array.isArray(result.data)) {
        setListings(result.data);
      } else if (Array.isArray(result)) {
        setListings(result);
      } else if (result && Array.isArray(result.properties)) {
        setListings(result.properties);
      }
    } catch (err) {
      console.error("Error reading live property ledger feed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveListings();
  }, []);

  const resetFilters = () => {
    setLocationSearch('');
    setSelectedType('All');
    setMinPrice('');
    setMaxPrice('');
  };

  const filteredListings = listings.filter((item) => {
    if (!item) return false;
    
    const propName = (item.propertyName || item.name || '').toLowerCase();
    const propLoc = (item.location || item.address || '').toLowerCase();
    const matchesLocation = propName.includes(locationSearch.toLowerCase()) || 
                            propLoc.includes(locationSearch.toLowerCase());

    const currentType = item.type || item.category || 'Apartment';
    const matchesType = selectedType === 'All' || currentType.toLowerCase() === selectedType.toLowerCase();

    const numericPrice = parseFloat(item.monthlyRent || item.price || 0);
    const matchesMinPrice = minPrice === '' || numericPrice >= parseFloat(minPrice);
    const matchesMaxPrice = maxPrice === '' || numericPrice <= parseFloat(maxPrice);

    return matchesLocation && matchesType && matchesMinPrice && matchesMaxPrice;
  });

  const fallbackSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="170" viewBox="0 0 300 170"><rect width="100%" height="100%" fill="%238B263E"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="%23FFFFFF">Alcove Residence</text></svg>`;

  return (
    <div style={{ backgroundColor: '#FAF6F0', minHeight: '100vh', fontFamily: 'sans-serif', padding: '2rem' }}>
      
    
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
        <input 
          type="text" 
          placeholder="Search by area, neighborhood, or housing complex..."
          value={locationSearch}
          onChange={(e) => setLocationSearch(e.target.value)}
          style={{ width: '100%', maxWidth: '600px', padding: '0.85rem 1.5rem', borderRadius: '30px', border: '1px solid #e2e0da', fontSize: '0.95rem', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}
        />
      </div>

  
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem', alignItems: 'start' }}>
        
     
        <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e0da' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '800' }}>Filters</h3>
            <button onClick={resetFilters} style={{ background: 'none', border: 'none', color: '#8B6A4F', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}>Reset</button>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#666', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Location Area</label>
            <input 
              type="text" 
              placeholder="e.g. Langata, Limuru" 
              value={locationSearch} 
              onChange={(e) => setLocationSearch(e.target.value)}
              style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: '#FAF6F0', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#666', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Property Type</label>
            <select 
              value={selectedType} 
              onChange={(e) => setSelectedType(e.target.value)}
              style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: '#fff' }}
            >
              <option value="All">All Types</option>
              <option value="Apartment">Apartment</option>
              <option value="Maisonette">Maisonette</option>
              <option value="Studio">Studio</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#666', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Price Limit (KES)</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: '#FAF6F0' }} />
              <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: '#FAF6F0' }} />
            </div>
          </div>
        </div>

 
        <div>
          <div style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '800' }}>Available Rental Listings</h2>
            <p style={{ margin: '0.2rem 0 0 0', color: '#777', fontSize: '0.88rem' }}>Showing {filteredListings.length} verified vacancies</p>
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', color: '#888', marginTop: '3rem' }}>Streaming database assets...</p>
          ) : filteredListings.length === 0 ? (
            <div style={{ backgroundColor: '#fff', textAlign: 'center', padding: '4rem 2rem', borderRadius: '12px', border: '1px solid #e2e0da' }}>
              <p style={{ margin: 0, color: '#999', fontWeight: '600' }}>No houses found matching those filters.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {filteredListings.map((property) => {
                const name = property.propertyName || property.name || 'Premium Complex';
                const loc = property.location || 'Nairobi Area';
                const priceValue = property.monthlyRent || property.price || 0;
                const typeStr = property.type || property.category || 'Apartment';
                const imageUrl = property.image || property.imageUrl || fallbackSvg;

                return (
                  <div key={property._id || Math.random().toString()} style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e0da', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ height: '170px', width: '100%', backgroundColor: '#eee' }}>
                      <img 
                        src={imageUrl} 
                        alt={name} 
                        onError={(e) => { e.target.src = fallbackSvg; }} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    </div>

                    <div style={{ padding: '1.2rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.15rem', fontWeight: '800' }}>{name}</h3>
                        <p style={{ margin: '0 0 1rem 0', color: '#777', fontSize: '0.82rem', fontWeight: '600' }}> {loc}</p>
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                          <div style={{ fontSize: '1.15rem', fontWeight: '900', color: '#222' }}>
                            KES {typeof priceValue === 'number' ? priceValue.toLocaleString() : priceValue}
                          </div>
                          <span style={{ backgroundColor: '#FAF6F0', color: '#8B6A4F', fontSize: '0.72rem', fontWeight: '700', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                            {typeStr}
                          </span>
                        </div>

                        <button style={{ width: '100%', padding: '0.55rem', backgroundColor: '#8B6A4F', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer' }}>
                          Book Visit
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default HouseHunting;