import React, { useState, useEffect } from 'react';

const PropertyDetails = () => {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showContact, setShowContact] = useState(false);


  const queryParams = new URLSearchParams(window.location.search);
  const propertyId = queryParams.get('id');

  useEffect(() => {
    const fetchSingleProperty = async () => {
      if (!propertyId) {
        setLoading(false);
        return;
      }
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

        const foundItem = dataArray.find(item => (item._id || item.id) === propertyId);
        setProperty(foundItem || null);
      } catch (err) {
        console.error("Could not fetch property detail context logs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSingleProperty();
  }, [propertyId]);

  const fallbackSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450"><rect width="100%" height="100%" fill="%238B263E"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" font-weight="bold" fill="%23FFFFFF">Alcove Premium Luxury Space</text></svg>`;

  if (loading) {
    return (
      <div style={{ backgroundColor: '#FAF6F0', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' }}>
        <h3>Loading full residence ledger details...</h3>
      </div>
    );
  }

  if (!property) {
    return (
      <div style={{ backgroundColor: '#FAF6F0', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif', padding: '2rem' }}>
        <h3>Property Record Not Found</h3>
        <p>The parameter listing could have been archived or removed by the landlord.</p>
        <button onClick={() => window.location.href = '/'} style={{ padding: '0.6rem 1.2rem', backgroundColor: '#8B263E', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Return Home</button>
      </div>
    );
  }

  const name = property.propertyName || property.name || property.title || 'Premium Managed Unit';
  const loc = property.location || property.address || property.propertyAddress || 'Nairobi Area';
  const priceValue = property.rent || property.rentPrice || property.monthlyRent || property.price || 0;
  const typeStr = property.type || property.category || property.propertyType || 'Apartment';
  const imageUrl = property.image || property.imageUrl || property.propertyImage || fallbackSvg;
  const desc = property.description || property.desc || 'Premium residency unit featuring spacious structural layout designs, reliable security check configurations, high-capacity utility frameworks, and modern finishings positioned inside a prime residential neighborhood layout context.';
  

  const landlordName = property.landlordName || 'Alcove Property Manager';
  const landlordPhone = property.landlordPhone || property.contactPhone || '+254 700 123 456';
  const landlordEmail = property.landlordEmail || property.contactEmail || 'management@alcove.co.ke';

  return (
    <div style={{ backgroundColor: '#FAF6F0', minHeight: '100vh', fontFamily: 'sans-serif', padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e0da', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
        
   
        <div style={{ width: '100%', height: '400px', backgroundColor: '#eee', position: 'relative' }}>
          <img 
            src={imageUrl} 
            alt={name} 
            onError={(e) => { e.target.src = fallbackSvg; }}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <span style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', backgroundColor: '#8B263E', color: '#fff', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase' }}>
            {typeStr}
          </span>
        </div>

        <div style={{ padding: '2.5rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', borderBottom: '1px solid #FAF6F0', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2.2rem', fontWeight: '800', color: '#111' }}>{name}</h1>
              <p style={{ margin: 0, fontSize: '1.1rem', color: '#555', fontWeight: '600' }}>📍 {loc}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.85rem', color: '#666', display: 'block', textTransform: 'uppercase', fontWeight: '700' }}>Monthly Rate</span>
              <span style={{ fontSize: '2rem', fontWeight: '900', color: '#8B263E' }}>KES {Number(priceValue).toLocaleString()}</span>
            </div>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: '0 0 0.75rem 0', color: '#222' }}>About This Listing</h3>
            <p style={{ color: '#444', lineHeight: '1.7', fontSize: '1rem', margin: 0 }}>{desc}</p>
          </div>


          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            
            <button 
              onClick={() => alert(`Redirecting to scheduled calendar portal setup for ${name}...`)}
              style={{ flex: 1, minWidth: '200px', padding: '1rem', backgroundColor: '#8B263E', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '700', cursor: 'pointer', boxShadow: '0 2px 4px rgba(139,38,62,0.15)' }}
            >
            Schedule Tour
            </button>

            <button 
              onClick={() => setShowContact(!showContact)}
              style={{ flex: 1, minWidth: '200px', padding: '1rem', backgroundColor: showContact ? '#FAF6F0' : '#8B6A4F', color: showContact ? '#8B6A4F' : '#fff', border: showContact ? '2px solid #8B6A4F' : 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '700', cursor: 'pointer' }}
            >
               {showContact ? 'Hide Contact Info' : 'Contact Landlord'}
            </button>

          </div>


          {showContact && (
            <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#FAF6F0', borderRadius: '8px', border: '1px solid #e2e0da', animation: 'fadeIn 0.3s ease-out' }}>
              <h4 style={{ margin: '0 0 1rem 0', color: '#8B6A4F', fontSize: '1.1rem', fontWeight: '800' }}>Landlord Assignment Ledger</h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#777', display: 'block', textTransform: 'uppercase', fontWeight: '700' }}>Name / Representative</span>
                  <strong style={{ fontSize: '0.95rem', color: '#222' }}>{landlordName}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#777', display: 'block', textTransform: 'uppercase', fontWeight: '700' }}>Direct Telephone</span>
                  <strong style={{ fontSize: '0.95rem', color: '#222' }}>{landlordPhone}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#777', display: 'block', textTransform: 'uppercase', fontWeight: '700' }}>Email Network Address</span>
                  <strong style={{ fontSize: '0.95rem', color: '#222' }}>{landlordEmail}</strong>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;