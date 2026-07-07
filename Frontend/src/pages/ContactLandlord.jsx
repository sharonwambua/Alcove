import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ContactLandlord = () => {
  const routerLocation = useLocation();
  const navigate = useNavigate();
  const propertyTitle = routerLocation.state?.propertyTitle || "General Portfolio Inquiry";

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: `Hello, I am interested in getting more details regarding ${propertyTitle}. Please share your leasing terms and tenancy application requirements.`
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Message successfully sent directly to the landlord of "${propertyTitle}". They will reply to you via ${formData.email}.`);
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--background)', padding: '4rem 1.5rem' }}>
      <div style={{ maxWidth: '550px', margin: '0 auto', background: 'var(--surface)', padding: '2.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
        
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer', marginBottom: '1.5rem' }}>
          ← Back to Listings
        </button>

        <h2 style={{ margin: '0 0 0.5rem 0', color: 'var(--text)', fontWeight: '800' }}>Inquire from Landlord</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem' }}>
          Regarding: <strong style={{ color: 'var(--text)' }}>{propertyTitle}</strong>
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label>Your Name</label>
            <input type="text" required placeholder="Alex Mwangi" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '0.65rem', borderRadius: '4px', border: '1px solid var(--border)' }} />
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label>Your Email Address</label>
            <input type="email" required placeholder="alex@domain.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '0.65rem', borderRadius: '4px', border: '1px solid var(--border)' }} />
          </div>

          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label>Detailed Message to Landlord</label>
            <textarea rows="5" required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} style={{ width: '100%', padding: '0.65rem', borderRadius: '4px', border: '1px solid var(--border)', fontFamily: 'inherit' }}></textarea>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
            Send Message to Landlord
          </button>
        </form>

      </div>
    </div>
  );
};

export default ContactLandlord;