import React, { useState } from 'react';

const MaintenanceRequest = () => {

  const [formData, setFormData] = useState({
    category: 'Plumbing',
    title: '',
    description: '',
    urgency: 'Medium'
  });
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
  
      if (!file.type.startsWith('image/')) {
        setStatusMessage({ type: 'error', text: 'Please select a valid image file (PNG, JPG, or JPEG).' });
        return;
      }
      
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage({ type: '', text: '' });

    try {
      /* FRONTEND TO BACKEND GATEWAY ATTACHMENT:
        - Endpoint: POST /api/maintenance-tickets
      */

     
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setStatusMessage({
        type: 'success',
        text: `Maintenance ticket "${formData.title}" logged successfully! The property manager will review your issue.`
      });

    
      setFormData({ category: 'Plumbing', title: '', description: '', urgency: 'Medium' });
      setSelectedImage(null);
      setImagePreview(null);
    } catch (error) {
      setStatusMessage({
        type: 'error',
        text: 'Failed to file maintenance request. Please try again later.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '750px', margin: '0 auto', color: 'var(--text, #333)' }}>
      
      {/* HEADER SECTION */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '800' }}>File a Maintenance Ticket</h1>
        <p style={{ margin: '0.25rem 0 0 0', color: '#777', fontSize: '0.95rem' }}>
          Report structural faults or repairs directly to your landlord.
        </p>
      </div>

  
      <form onSubmit={handleSubmitTicket} style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #e0e0e0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
        
  
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: '#777', marginBottom: '0.5rem' }}>Issue Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#FAF6F0', color: '#333', fontSize: '0.95rem', fontWeight: '600' }}
            >
              <option value="Plumbing">Plumbing (Pipes, Taps, Tanks)</option>
              <option value="Electrical">Electrical (Sockets, Wiring, Lights)</option>
              <option value="Structural">Structural (Walls, Doors, Windows)</option>
              <option value="Appliance">Serviced Appliances / Other</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: '#777', marginBottom: '0.5rem' }}>Urgency Priority</label>
            <select
              name="urgency"
              value={formData.urgency}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#FAF6F0', color: '#333', fontSize: '0.95rem', fontWeight: '600' }}
            >
              <option value="Low">Low (Minor cosmetic issue)</option>
              <option value="Medium">Medium (Disruptive but manageable)</option>
              <option value="High">High (Immediate attention needed)</option>
            </select>
          </div>
        </div>

      
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: '#777', marginBottom: '0.5rem' }}>Issue Title Summary</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g., Leaking pipe beneath the kitchen sink"
            style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#FAF6F0', color: '#333', fontSize: '0.95rem' }}
          />
        </div>

    
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: '#777', marginBottom: '0.5rem' }}>Detailed Description</label>
          <textarea
            name="description"
            required
            rows="4"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="e.g., The drainage joint pipe directly under the kitchen sink basin is cracked and dripping continuously when water runs. It has started flooding the under-sink cabinet floor cupboard area."
            style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#FAF6F0', color: '#333', fontSize: '0.95rem', fontFamily: 'inherit', resize: 'vertical' }}
          />
        </div>

     
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: '#777', marginBottom: '0.5rem' }}>Attach Photo Proof (Optional)</label>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <input
              type="file"
              accept="image/*"
              id="ticket-image-upload"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
            <label
              htmlFor="ticket-image-upload"
              style={{
                padding: '0.65rem 1.25rem',
                border: '1px dashed #8B263E',
                borderRadius: '6px',
                color: '#8B263E',
                backgroundColor: '#FFF',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '0.85rem',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => { e.target.style.backgroundColor = '#FAF6F0'; }}
              onMouseOut={(e) => { e.target.style.backgroundColor = '#FFF'; }}
            >
              Choose Image File
            </label>

     
            {imagePreview && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  border: '1px solid #ccc',
                  position: 'relative'
                }}>
                  <img src={imagePreview} alt="Upload Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <span style={{ fontSize: '0.82rem', color: '#777' }}>{selectedImage?.name}</span>
              </div>
            )}
          </div>
        </div>


        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.85rem',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: loading ? '#aaa' : '#8B263E',
            color: '#fff',
            fontSize: '1rem',
            fontWeight: '700',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'opacity 0.2s'
          }}
        >
          {loading ? 'Submitting Report Data...' : 'Submit Maintenance Ticket'}
        </button>


        {statusMessage.text && (
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            borderRadius: '8px',
            fontSize: '0.9rem',
            backgroundColor: statusMessage.type === 'success' ? '#E8F5E9' : '#FFEBEE',
            color: statusMessage.type === 'success' ? '#2E7D32' : '#C62828',
            border: `1px solid ${statusMessage.type === 'success' ? '#A5D6A7' : '#EF9A9A'}`
          }}>
            {statusMessage.text}
          </div>
        )}
      </form>

    </div>
  );
};

export default MaintenanceRequest;