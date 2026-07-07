import React, { useState, useEffect } from 'react';

const LandingPage = () => {
  const [featuredListings, setFeaturedListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedProperty, setSelectedProperty] = useState(null);
  const [contactAction, setContactAction] = useState(null); 


  const [locationSearch, setLocationSearch] = useState('');
  const [propertyType, setPropertyType] = useState('All Types');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    const fetchLandingPageListings = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:5000/api/properties/all');
        const result = await res.json();
        
        let dataArray = [];
        if (result && result.success && Array.isArray(result.data)) {
          dataArray = result.data;
        } else if (Array.isArray(result)) {
          dataArray = result;
        } else if (result && Array.isArray(result.properties)) {
          dataArray = result.properties;
        }

        setFeaturedListings(dataArray);
      } catch (err) {
        console.error("Landing feed failed to load properties:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLandingPageListings();
  }, []);

  const fallbackSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"><rect width="100%" height="100%" fill="%238B263E"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18" font-weight="bold" fill="%23FFFFFF">Alcove Premium Home</text></svg>`;

  const handleResetFilters = () => {
    setLocationSearch('');
    setPropertyType('All Types');
    setMinPrice('');
    setMaxPrice('');
  };

  const handleCloseModal = () => {
    setSelectedProperty(null);
    setContactAction(null);
  };


  const filteredListings = featuredListings.filter((property) => {
    const loc = (property.location || property.address || property.propertyAddress || '').toLowerCase();
    const matchesLocation = locationSearch === '' || loc.includes(locationSearch.toLowerCase());

    const typeStr = property.type || property.category || property.propertyType || 'Apartment';
    const matchesType = propertyType === 'All Types' || typeStr.toLowerCase() === propertyType.toLowerCase();

    const priceValue = Number(property.rent || property.rentPrice || property.monthlyRent || property.price || 0);
    const matchesMinPrice = minPrice === '' || priceValue >= Number(minPrice);
    const matchesMaxPrice = maxPrice === '' || priceValue <= Number(maxPrice);

    return matchesLocation && matchesType && matchesMinPrice && matchesMaxPrice;
  });

  return (
    <div style={{ backgroundColor: '#FAF6F0', minHeight: '100vh', fontFamily: 'sans-serif', margin: 0, padding: 0 }}>
      

      <div style={{ padding: '5rem 2rem', textAlign: 'center', backgroundColor: '#8B263E', color: '#fff' }}>
        <h1 style={{ fontSize: '3rem', margin: '0 0 1rem 0', fontWeight: '800', letterSpacing: '-0.03em' }}>
          Find Your Next Home on Alcove
        </h1>
        <p style={{ fontSize: '1.2rem', margin: 0, opacity: 0.9 }}>
          Connecting modern tenants with verified property listings seamlessly.
        </p>
      </div>

      <div style={{ padding: '3rem', maxWidth: '1240px', margin: '0 auto', display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2.5rem' }}>
        
        <aside style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e0da', height: 'fit-content', position: 'sticky', top: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: '#111' }}>Filters</h3>
            <button onClick={handleResetFilters} style={{ background: 'none', border: 'none', color: '#8B263E', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '700' }}>Reset</button>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#666', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Location Area</label>
            <input type="text" placeholder="e.g. Ngong, Langata" value={locationSearch} onChange={(e) => setLocationSearch(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '0.9rem', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#666', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Property Type</label>
            <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: '#fff', fontSize: '0.9rem', cursor: 'pointer' }}>
              <option value="All Types">All Types</option>
              <option value="Apartment">Apartment</option>
              <option value="Mansionette">Mansionette</option>
              <option value="Bungalow">Bungalow</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#666', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Price Range (KES)</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '0.9rem', boxSizing: 'border-box' }} />
              <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '0.9rem', boxSizing: 'border-box' }} />
            </div>
          </div>
        </aside>

      
        <main>
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '800', color: '#111' }}>Available Rental Listings</h2>
            <p style={{ margin: '0.25rem 0 0 0', color: '#666', fontSize: '0.95rem' }}>Showing {filteredListings.length} verified vacancies</p>
          </div>

          {loading ? (
            <p style={{ color: '#777', padding: '2rem' }}>Syncing with property registry...</p>
          ) : filteredListings.length === 0 ? (
            <div style={{ backgroundColor: '#fff', padding: '3rem', borderRadius: '12px', border: '1px solid #e2e0da', textAlign: 'center' }}>
              <p style={{ margin: 0, color: '#999', fontWeight: '600' }}>No active properties found matching your selection.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '2rem' }}>
              {filteredListings.map((property) => {
                const id = property._id || property.id;
                const name = property.propertyName || property.name || property.title || 'Alcove Unit';
                const loc = property.location || property.address || property.propertyAddress || 'Nairobi Area';
                const priceValue = property.rent || property.rentPrice || property.monthlyRent || property.price || 0;
                const typeStr = property.type || property.category || property.propertyType || 'Apartment';
                const imageUrl = property.image || property.imageUrl || property.propertyImage || fallbackSvg;

                return (
                  <div key={id || Math.random().toString()} style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e0da', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                    
                    <div style={{ height: '180px', backgroundColor: '#eee', width: '100%' }}>
                      <img 
                        src={imageUrl} 
                        alt={name}
                        onError={(e) => { e.target.src = fallbackSvg; }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>

                    <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <span style={{ textTransform: 'uppercase', fontSize: '0.7rem', fontWeight: '800', color: '#8B6A4F', letterSpacing: '0.05em' }}>
                          {typeStr}
                        </span>
                        <h3 style={{ margin: '0.2rem 0 0.4rem 0', fontSize: '1.2rem', fontWeight: '800', color: '#222' }}>
                          {name}
                        </h3>
                        <p style={{ margin: '0 0 1rem 0', color: '#666', fontSize: '0.85rem' }}>
                           {loc}
                        </p>
                      </div>

                      <div style={{ borderTop: '1px solid #FAF6F0', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ fontSize: '1.15rem', fontWeight: '900', color: '#111' }}>
                            KES {Number(priceValue).toLocaleString()}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#777' }}> / mo</span>
                        </div>
                        
                        <button 
                          onClick={() => setSelectedProperty(property)}
                          style={{ padding: '0.5rem 0.85rem', backgroundColor: '#8B263E', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer' }}
                        >
                          Explore
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

  
      {selectedProperty && (() => {
        const modalName = selectedProperty.propertyName || selectedProperty.name || selectedProperty.title || 'Alcove Premium Unit';
        const modalLoc = selectedProperty.location || selectedProperty.address || selectedProperty.propertyAddress || 'Nairobi Area';
        const modalPrice = selectedProperty.rent || selectedProperty.rentPrice || selectedProperty.monthlyRent || selectedProperty.price || 0;
        const modalImg = selectedProperty.image || selectedProperty.imageUrl || selectedProperty.propertyImage || fallbackSvg;
        const modalType = selectedProperty.type || selectedProperty.category || selectedProperty.propertyType || 'Apartment';

        const landlordPhone = selectedProperty.landlordPhone || '0708528617';
        const landlordEmail = selectedProperty.landlordEmail || 'management@alcove.co.ke';

        return (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px', boxSizing: 'border-box' }}>
            <div style={{ backgroundColor: '#fff', width: '100%', maxWidth: '580px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 12px 36px rgba(0,0,0,0.15)', position: 'relative' }}>
              
              <button onClick={handleCloseModal} style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold', zIndex: 10 }}>×</button>

              <div style={{ height: '230px', backgroundColor: '#eee', width: '100%' }}>
                <img src={modalImg} alt={modalName} onError={(e) => { e.target.src = fallbackSvg; }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '14px' }}>
                  <div>
                    <span style={{ textTransform: 'uppercase', fontSize: '0.7rem', fontWeight: '800', color: '#8B6A4F', letterSpacing: '0.05em' }}>{modalType}</span>
                    <h2 style={{ margin: '2px 0 4px 0', fontSize: '1.45rem', fontWeight: '800', color: '#111' }}>{modalName}</h2>
                    <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>📍 Location: <strong>{modalLoc}</strong></p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#8B263E' }}>KES {Number(modalPrice).toLocaleString()}</div>
                    <div style={{ fontSize: '0.75rem', color: '#777' }}>Per Month</div>
                  </div>
                </div>

                <hr style={{ border: 0, borderTop: '1px solid #FAF6F0', margin: '16px 0' }} />
                
                <h4 style={{ margin: '0 0 6px 0', fontSize: '0.8rem', textTransform: 'uppercase', color: '#555', letterSpacing: '0.5px' }}>Property Features & Amenities</h4>
                <p style={{ margin: '0 0 20px 0', fontSize: '0.92rem', color: '#444', lineHeight: '1.5' }}>
                  This verified vacancy is fully provisioned with constant clean water infrastructure, secure electricity meters, perimeter fencing protection arrays, and close proximity to core access highways. Ready for occupation.
                </p>

            
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: contactAction ? '20px' : '0' }}>
                  <button 
                    onClick={() => setContactAction('visit')}
                    style={{ padding: '12px', backgroundColor: '#7A5C4D', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                     Book a Visit
                  </button>
                  
                  <button 
                    onClick={() => setContactAction('contact')}
                    style={{ padding: '12px', backgroundColor: '#8B263E', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                     Contact Landlord
                  </button>
                </div>

         
                {contactAction && (
                  <div style={{ backgroundColor: '#FDFBF7', border: '1px dashed #7A5C4D', borderRadius: '8px', padding: '16px', transition: 'all 0.3s ease-in-out' }}>
                    <h5 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', fontWeight: '700', color: contactAction === 'visit' ? '#7A5C4D' : '#8B263E' }}>
                      {contactAction === 'visit' ? ' Schedule Your Property Viewing' : ' Landlord Contact Details'}
                    </h5>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem', color: '#333' }}>
                      <div> <strong>WhatsApp/Phone:</strong> <a href={`https://wa.me/254${landlordPhone.substring(1)}`} target="_blank" rel="noreferrer" style={{ color: '#8B263E', fontWeight: '600', textDecoration: 'none' }}>{landlordPhone}</a></div>
                      <div> <strong>Email Address:</strong> <a href={`mailto:${landlordEmail}`} style={{ color: '#8B263E', fontWeight: '600', textDecoration: 'none' }}>{landlordEmail}</a></div>
                    </div>

                    <p style={{ margin: '12px 0 0 0', fontSize: '0.78rem', color: '#666', fontStyle: 'italic' }}>
                      {contactAction === 'visit' 
                        ? 'Please mention Alcove when calling or texting to arrange a date.' 
                        : 'Feel free to reach out directly via email or phone regarding occupancy terms.'}
                    </p>
                  </div>
                )}
              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
};

export default LandingPage;