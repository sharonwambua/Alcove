import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const BookVisit = () => {
  const routerLocation = useLocation();
  const navigate = useNavigate();
  
 
  const propertyTitle = routerLocation.state?.propertyTitle || "General Property Inventory";

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    visitDate: '',
    visitTime: 'morning'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Success! Your site visit request for "${propertyTitle}" on ${formData.visitDate} has been logged. An Alcove agent will call you on ${formData.phone} to confirm.`);
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--background)', padding: '4rem 1.5rem' }}>
      <div style={{ maxWidth: '550px', margin: '0 auto', background: 'var(--surface)', padding: '2.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
        
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer', marginBottom: '1.5rem' }}>
          ← Back to House Hunting
        </button>

        <h2 style={{ margin: '0 0 0.5rem 0', color: 'var(--text)', fontWeight: '800' }}>Schedule a Physical Site Visit</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem' }}>
          Selected Property: <strong style={{ color: 'var(--text)' }}>{propertyTitle}</strong>
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label>Your Full Name</label>
            <input type="text" required placeholder="e.g., John Kamau" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} style={{ width: '100%', padding: '0.65rem', borderRadius: '4px', border: '1px solid var(--border)' }} />
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label>Phone Number (Safcom / Airtel)</label>
            <input type="tel" required placeholder="e.g., 0712345678" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '0.65rem', borderRadius: '4px', border: '1px solid var(--border)' }} />
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label>Email Address</label>
            <input type="email" required placeholder="name@domain.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '0.65rem', borderRadius: '4px', border: '1px solid var(--border)' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.75rem' }}>
            <div className="form-group">
              <label>Preferred Date</label>
              <input type="date" required value={formData.visitDate} onChange={e => setFormData({...formData, visitDate: e.target.value})} style={{ width: '100%', padding: '0.65rem', borderRadius: '4px', border: '1px solid var(--border)' }} />
            </div>
            <div className="form-group">
              <label>Preferred Time Block</label>
              <select value={formData.visitTime} onChange={e => setFormData({...formData, visitTime: e.target.value})} style={{ width: '100%', padding: '0.65rem', borderRadius: '4px', border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}>
                <option value="morning">Morning (9 AM - 12 PM)</option>
                <option value="afternoon">Afternoon (2 PM - 5 PM)</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
            Confirm Viewing Appointment
          </button>
        </form>

      </div>
    </div>
  );
};

export default BookVisit;