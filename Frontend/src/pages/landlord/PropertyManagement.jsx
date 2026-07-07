import React, { useState, useEffect } from 'react';

const PropertyManagement = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    type: 'Apartment',
    units: '',
    rent: '',
    image: '',
    description: '' 
  });

  const fetchProperties = async () => {
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
      setProperties(dataArray);
    } catch (err) {
      console.error('Failed to load properties from DB:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result }); 
    };
    reader.readAsDataURL(file);
  };


  const startEditMode = (prop) => {
    setIsEditing(true);
    setEditId(prop._id || prop.id);
    setFormData({
      name: prop.name || prop.propertyName || '',
      address: prop.address || prop.location || '',
      type: prop.type || 'Apartment',
      units: prop.units || prop.totalUnits || '',
      rent: prop.rent || prop.monthlyRent || '',
      image: prop.image || '',
      description: prop.description || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData({ name: '', address: '', type: 'Apartment', units: '', rent: '', image: '', description: '' });
    setIsEditing(false);
    setEditId(null);
    const filePicker = document.getElementById('property-image-picker');
    if (filePicker) filePicker.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.address || !formData.units || !formData.rent) {
      alert('Please fill out all mandatory operational fields');
      return;
    }

    try {
      let url = 'http://localhost:5000/api/properties/add';
      let method = 'POST';

  
      if (isEditing && editId) {
        url = `http://localhost:5000/api/properties/update/${editId}`;
        method = 'PUT'; 
      }

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await res.json();
      if (result.success || res.ok) {
        alert(isEditing ? 'Property updated successfully!' : 'Property added successfully!');
        resetForm();
        fetchProperties();
      } else {
        alert('Server refused to save property configuration parameters.');
      }
    } catch (err) {
      console.error('Error saving property to database:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you completely sure you want to delete this property record permanently?')) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/properties/delete/${id}`, {
        method: 'DELETE'
      });

      if (res.ok || (await res.json()).success) {
        alert('Property successfully removed.');
        fetchProperties();
      } else {
        alert('Delete operation rejected by system backend.');
      }
    } catch (err) {
      console.error('Error deleting property:', err);
    }
  };


  const localFallbackSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="180" viewBox="0 0 300 180"><rect width="100%" height="100%" fill="%238B263E"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="bold" fill="%23FFFFFF">Alcove Premium Home</text></svg>`;

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ color: '#333', marginBottom: '20px' }}>Property Management</h2>
      
      <form onSubmit={handleSubmit} style={{ background: '#fcfdfd', padding: '20px', borderRadius: '8px', border: '1px solid #eee', marginBottom: '35px', display: 'grid', gap: '12px' }}>
        <h3 style={{ margin: '0 0 8px 0', color: '#555' }}>
          {isEditing ? ' Edit Property' : ' Add New Property'}
        </h3>
        
        <input type="text" name="name" placeholder="Property Name (e.g. Alcove Plaza)" value={formData.name} onChange={handleChange} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
        <input type="text" name="address" placeholder="Address / Location" value={formData.address} onChange={handleChange} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
        
        <select name="type" value={formData.type} onChange={handleChange} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc', background: '#fff' }}>
          <option value="Apartment">Apartment</option>
          <option value="Bedsitter">Bedsitter</option>
          <option value="Single Room">Single Room</option>
            <option value="Mainsionetee">Mainsionetee</option>
        </select>
        
        <input type="number" name="units" placeholder="Total Units Available" value={formData.units} onChange={handleChange} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
        <input type="number" name="rent" placeholder="Monthly Rent price (KES)" value={formData.rent} onChange={handleChange} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
        
    
        <textarea 
          name="description" 
          placeholder="Enter descriptive text here..." 
          value={formData.description} 
          onChange={handleChange} 
          rows="3" 
          style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontFamily: 'sans-serif' }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '13px', color: '#666', fontWeight: 'bold' }}>Upload Property Image from PC:</label>
          <input 
            id="property-image-picker"
            type="file" 
            accept="image/*"
            onChange={handleFileChange} 
            style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc', background: '#fff' }} 
          />
        </div>

        {formData.image && (
          <div style={{ marginTop: '5px' }}>
            <span style={{ fontSize: '11px', color: '#777', display: 'block', marginBottom: '4px' }}>Image Preview:</span>
            <img src={formData.image} alt="Preview" style={{ height: '70px', borderRadius: '4px', border: '1px solid #ddd' }} />
          </div>
        )}
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" style={{ flex: 2, padding: '12px', background: '#8B263E', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
            {isEditing ? 'Save Update' : 'Save Property to Database'}
          </button>
          {isEditing && (
            <button type="button" onClick={resetForm} style={{ flex: 1, padding: '12px', background: '#e2e0da', color: '#333', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <h3 style={{ color: '#333', marginBottom: '16px' }}>Registered Properties Log</h3>
      
      {loading ? (
        <p style={{ color: '#666' }}>Refreshing listings ledger database indexes...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {properties.length === 0 ? (
            <p style={{ color: '#aaa', gridColumn: '1/-1' }}>No properties saved in the database yet.</p>
          ) : (
            properties.map((prop) => {
              const currentId = prop._id || prop.id;
              return (
                <div key={currentId || Math.random().toString()} style={{ background: '#fff', borderRadius: '10px', border: '1px solid #ddd', overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
                  
                  <img 
                    src={prop.image || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=500&q=80'} 
                    alt={prop.name || 'Property'} 
                    style={{ width: '100%', height: '180px', objectFit: 'cover', borderBottom: '1px solid #eee' }} 
                    onError={(e) => { e.target.src = localFallbackSvg; }}
                  />
                  
                  <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <strong style={{ fontSize: '18px', color: '#333' }}>{prop.name || prop.propertyName}</strong>
                        <span style={{ background: '#f1f3f5', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', color: '#555' }}>{prop.type}</span>
                      </div>
                      <div style={{ fontSize: '13px', color: '#666', marginTop: '6px' }}>📍 {prop.address || prop.location}</div>
                      
                      {prop.description && (
                        <p style={{ fontSize: '12px', color: '#777', marginTop: '8px', fontStyle: 'italic', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {prop.description}
                        </p>
                      )}
                    </div>

                    <div>
                      <div style={{ borderTop: '1px solid #eee', marginTop: '14px', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', color: '#545454', fontWeight: '500' }}>{prop.units || prop.totalUnits} Total Units</span>
                        <div style={{ fontWeight: 'bold', color: '#8B263E', fontSize: '16px' }}>KES {Number(prop.rent || prop.monthlyRent || 0).toLocaleString()}/mo</div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                        <button 
                          onClick={() => startEditMode(prop)}
                          style={{ flex: 1, padding: '6px', background: '#8B6A4F', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                           Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(currentId)}
                          style={{ flex: 1, padding: '6px', background: '#fff', color: '#cc0000', border: '1px solid #cc0000', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                           Delete
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default PropertyManagement;