import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [activeRole, setActiveRole] = useState('tenant');
  

  const [usernameInput, setUsernameInput] = useState(''); 
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRoleChange = (role) => {
    setActiveRole(role);
    setUsernameInput('');
    setPassword('');
    setError('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formattedInput = usernameInput.trim();

    if (!formattedInput) {
      setError(activeRole === 'tenant' ? 'Please enter a valid Tenant ID.' : 'Please enter your registered email address.');
      setLoading(false);
      return;
    }

    try {
  
      const result = await login(formattedInput, password);
      
      if (result.success) {
        if (result.role === 'tenant') {
          navigate('/tenant/dashboard');
        } else if (result.role === 'landlord') {
          navigate('/landlord/dashboard');
        }
      } else {
        setError(result.message || 'Authentication failed. Please verify your credentials.');
      }
    } catch (err) {
      setError('An internal server connection error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '85vh', 
      backgroundColor: 'var(--background, #FAF6F0)', 
      padding: '2rem 1.5rem' 
    }}>
      
      <div style={{ 
        width: '100%', 
        maxWidth: '440px', 
        backgroundColor: '#ffffff', 
        padding: '2.5rem', 
        borderRadius: '12px', 
        border: '1px solid var(--border, #e0e0e0)', 
        boxShadow: '0 4px 15px rgba(0,0,0,0.04)' 
      }}>
        
  
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.65rem', fontWeight: '800', color: 'var(--text, #333)', letterSpacing: '-0.02em' }}>
            Welcome to Alcove
          </h2>
          <p style={{ margin: '0.35rem 0 0 0', color: 'var(--text-muted, #777)', fontSize: '0.9rem' }}>
            Secure portal access for tenants and landlords.
          </p>
        </div>

  
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '0.25rem', 
          backgroundColor: 'var(--background, #FAF6F0)', 
          padding: '0.35rem', 
          borderRadius: '8px', 
          marginBottom: '2rem',
          border: '1px solid #e8e2d8'
        }}>
          <button
            type="button"
            onClick={() => handleRoleChange('tenant')}
            style={{
              padding: '0.65rem',
              borderRadius: '6px',
              border: 'none',
              fontSize: '0.88rem',
              fontWeight: '700',
              cursor: 'pointer',
              backgroundColor: activeRole === 'tenant' ? '#ffffff' : 'transparent',
              color: activeRole === 'tenant' ? 'var(--primary, #8B263E)' : '#666',
              boxShadow: activeRole === 'tenant' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            Tenant 
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('landlord')}
            style={{
              padding: '0.65rem',
              borderRadius: '6px',
              border: 'none',
              fontSize: '0.88rem',
              fontWeight: '700',
              cursor: 'pointer',
              backgroundColor: activeRole === 'landlord' ? '#ffffff' : 'transparent',
              color: activeRole === 'landlord' ? 'var(--primary, #8B263E)' : '#666',
              boxShadow: activeRole === 'landlord' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            Landlord 
          </button>
        </div>

     
        {error && (
          <div style={{ 
            marginBottom: '1.5rem', 
            padding: '0.85rem 1rem', 
            backgroundColor: '#FFEBEE', 
            color: '#C62828', 
            borderRadius: '8px', 
            fontSize: '0.86rem', 
            border: '1px solid #EF9A9A', 
            fontWeight: '600',
            lineHeight: '1.4'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLoginSubmit}>
          
       
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', color: '#555', marginBottom: '0.45rem', letterSpacing: '0.03em' }}>
              {activeRole === 'tenant' ? 'Unique Tenant ID' : 'Property Manager Email'}
            </label>
            <input 
              type={activeRole === 'tenant' ? 'text' : 'email'}
              required
              disabled={loading}
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder={activeRole === 'tenant' ? 'e.g., ALC-2026-8942' : 'name@example.com'}
              style={{ 
                width: '100%', 
                padding: '0.8rem 1rem', 
                borderRadius: '8px', 
                border: '1px solid #ccc', 
                backgroundColor: loading ? '#f5f5f5' : 'var(--background, #FAF6F0)', 
                color: '#333', 
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            />
            
            {activeRole === 'tenant' && (
              <small style={{ display: 'block', color: '#999', marginTop: '0.45rem', fontSize: '0.76rem', lineHeight: '1.3' }}>
                Enter the unique ID issued by your landlord when they registered your tenancy lease profile.
              </small>
            )}
          </div>

 
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', color: '#555', margin: 0, letterSpacing: '0.03em' }}>
                 Password
              </label>
              <span 
                onClick={() => navigate('/forgot-password')}
                style={{ fontSize: '0.78rem', color: 'var(--primary, #8B263E)', fontWeight: '700', cursor: 'pointer' }}
              >
                Forgot Password?
              </span>
            </div>
            <input 
              type="password"
              required
              disabled={loading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ 
                width: '100%', 
                padding: '0.8rem 1rem', 
                borderRadius: '8px', 
                border: '1px solid #ccc', 
                backgroundColor: loading ? '#f5f5f5' : 'var(--background, #FAF6F0)', 
                color: '#333', 
                fontSize: '0.95rem',
                outline: 'none'
              }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', 
              padding: '0.9rem', 
              borderRadius: '8px', 
              border: 'none',
              backgroundColor: loading ? '#b0a390' : 'var(--primary, #8B263E)', 
              color: '#ffffff',
              fontSize: '1rem', 
              fontWeight: '700', 
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 4px rgba(139, 38, 62, 0.15)',
              transition: 'opacity 0.2s ease'
            }}
            onMouseOver={(e) => { if(!loading) e.target.style.opacity = '0.95'; }}
            onMouseOut={(e) => { if(!loading) e.target.style.opacity = '1'; }}
          >
            {loading ? 'Verifying Credentials Security...' : `Access ${activeRole === 'tenant' ? 'Tenant' : 'Landlord'} Dashboard`}
          </button>
        </form>
{activeRole === 'landlord' && (
          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem', color: '#666' }}>
            New to the platform?{' '}
            <span 
              onClick={() => navigate('/register')}
              style={{ color: 'var(--primary, #8B263E)', fontWeight: '700', cursor: 'pointer' }}
            >
              Create a Landlord Account
            </span>
          </div>
        )}

      </div>
    </div>
  );
};

export default Login;