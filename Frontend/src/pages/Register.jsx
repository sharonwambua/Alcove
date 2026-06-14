import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Can be used to automatically log them in after sign-up

 
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please verify your typing.');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('For your security, your password must be at least 6 characters long.');
      setLoading(false);
      return;
    }


    let formattedPhone = formData.phone.trim();
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '254' + formattedPhone.substring(1);
    }

    try {
      /* FRONTEND TO BACKEND GATEWAY CONNECTIVITY LINK:
       
      */

    
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setSuccess(true);
   
      setTimeout(() => {
        navigate('/login');
      }, 2500);

    } catch (err) {
      setError('Failed to create account. This email address may already be registered.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '90vh', 
      backgroundColor: 'var(--background, #FAF6F0)', 
      padding: '2rem 1.5rem' 
    }}>
      
      <div style={{ 
        width: '100%', 
        maxWidth: '500px', 
        backgroundColor: '#ffffff', 
        padding: '2.5rem', 
        borderRadius: '12px', 
        border: '1px solid var(--border, #e0e0e0)', 
        boxShadow: '0 4px 15px rgba(0,0,0,0.04)' 
      }}>
        

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.65rem', fontWeight: '800', color: 'var(--text, #333)', letterSpacing: '-0.02em' }}>
            Landlord Onboarding
          </h2>
          <p style={{ margin: '0.35rem 0 0 0', color: 'var(--text-muted, #777)', fontSize: '0.9rem' }}>
            Create your property manager account to begin listing units
          </p>
        </div>


        {error && (
          <div style={{ marginBottom: '1.5rem', padding: '0.85rem 1rem', backgroundColor: '#FFEBEE', color: '#C62828', borderRadius: '8px', fontSize: '0.86rem', border: '1px solid #EF9A9A', fontWeight: '600' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ marginBottom: '1.5rem', padding: '0.85rem 1rem', backgroundColor: '#E8F5E9', color: '#2E7D32', borderRadius: '8px', fontSize: '0.86rem', border: '1px solid #A5D6A7', fontWeight: '600' }}>
            Account created successfully! Redirecting you to the login gateway...
          </div>
        )}

  
        <form onSubmit={handleRegisterSubmit}>
          
    
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', color: '#555', marginBottom: '0.45rem' }}>
              Full Name
            </label>
            <input 
              type="text"
              name="fullName"
              required
              disabled={loading || success}
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="e.g., John Kamau"
              style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#FAF6F0', color: '#333', fontSize: '0.95rem', outline: 'none' }}
            />
          </div>

   
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', color: '#555', marginBottom: '0.45rem' }}>
              Email Address
            </label>
            <input 
              type="email"
              name="email"
              required
              disabled={loading || success}
              value={formData.email}
              onChange={handleInputChange}
              placeholder="e.g., manager@alcove.com"
              style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#FAF6F0', color: '#333', fontSize: '0.95rem', outline: 'none' }}
            />
          </div>

        
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', color: '#555', marginBottom: '0.45rem' }}>
                Phone Number
              </label>
              <input 
                type="text"
                name="phone"
                required
                disabled={loading || success}
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="e.g., 0712345678"
                style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#FAF6F0', color: '#333', fontSize: '0.95rem', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', color: '#555', marginBottom: '0.45rem' }}>
                Company/Agency <span style={{ color: '#999', fontSize: '0.7rem' }}>(Optional)</span>
              </label>
              <input 
                type="text"
                name="companyName"
                disabled={loading || success}
                value={formData.companyName}
                onChange={handleInputChange}
                placeholder="e.g., Alcove Agencies"
                style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#FAF6F0', color: '#333', fontSize: '0.95rem', outline: 'none' }}
              />
            </div>
          </div>

     
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', color: '#555', marginBottom: '0.45rem' }}>
                Choose Password
              </label>
              <input 
                type="password"
                name="password"
                required
                disabled={loading || success}
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#FAF6F0', color: '#333', fontSize: '0.95rem', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', color: '#555', marginBottom: '0.45rem' }}>
                Confirm Password
              </label>
              <input 
                type="password"
                name="confirmPassword"
                required
                disabled={loading || success}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="••••••••"
                style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#FAF6F0', color: '#333', fontSize: '0.95rem', outline: 'none' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            style={{
              width: '100%', 
              padding: '0.9rem', 
              borderRadius: '8px', 
              border: 'none',
              backgroundColor: loading || success ? '#b0a390' : 'var(--primary, #8B263E)', 
              color: '#ffffff',
              fontSize: '1rem', 
              fontWeight: '700', 
              cursor: loading || success ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.2s ease'
            }}
          >
            {loading ? 'Creating Management Account...' : 'Register as Landlord'}
          </button>
        </form>

   
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem', color: '#666' }}>
          Already managing properties with us?{' '}
          <span 
            onClick={() => navigate('/login')}
            style={{ color: 'var(--primary, #8B263E)', fontWeight: '700', cursor: 'pointer' }}
          >
            Log In here
          </span>
        </div>

      </div>
    </div>
  );
};

export default Register;