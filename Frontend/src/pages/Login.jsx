import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, saveUserSession } = useAuth();
  const [activeTab, setActiveTab] = useState('landlord');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setEmail('');
    setPassword('');
    setError('');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    try {
      console.log(`Submitting traditional form credentials for: ${activeTab}`);
      const result = await login(email, password, activeTab);

      if (result.success) {
        console.log(`Login successful. Role: ${result.role}`);
        
        if (result.role === 'tenant' && result.user?.isPasswordChanged === false) {
          const setupPassword = prompt(
            " FIRST-TIME LOGIN DETECTED\n\n" +
            "Your landlord requires you to configure a secure, custom password before continuing.\n\n" +
            "Please enter your new password below:"
          );

          if (!setupPassword || setupPassword.trim() === "") {
            setError("Account activation aborted. A new secure password is required to proceed.");
            setLoading(false);
            return;
          }

          const targetDocId = result.user?.tenantDocId || result.user?.id || result.user?._id;
          const patchResponse = await fetch(`http://localhost:5000/api/tenants/update-password/${targetDocId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newPassword: setupPassword.trim() })
          });

          const patchResult = await patchResponse.json();

          if (patchResult.success) {
            alert("Password updated successfully! Please sign in again with your new password.");
            setPassword('');
            setLoading(false);
            return;
          } else {
            setError(patchResult.message || "Failed to update onboarding configurations.");
            setLoading(false);
            return;
          }
        }

  
        if (result.role === 'landlord') {
          navigate('/landlord/dashboard');
        } else if (result.role === 'tenant') {
          navigate('/tenant/dashboard');
        } else {
          navigate('/');
        }
      } else {
        setError(result.message || 'Invalid login credentials. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      console.error("Authentication submission fault:", err);
      setError("A server connection fault occurred.");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userPayload = result.user;
      const idToken = await userPayload.getIdToken();

      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ role: 'landlord' })
      });

      const data = await response.json();

      if (data.success) {
        saveUserSession({
          id: data.user?.uid || userPayload.uid,
          name: data.user?.name || userPayload.displayName || 'Google Landlord',
          email: data.user?.email || userPayload.email,
          role: 'landlord'
        });
        navigate('/landlord/dashboard');
      } else {
        setError(data.message || 'Server rejected verification validation.');
      }
    } catch (err) {
      console.error('Popup processing block error:', err);
      setError('Google Sign-In failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2.5rem 2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', borderRadius: '12px', backgroundColor: '#fff', border: '1px solid #eef0f2', fontFamily: 'sans-serif' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ color: '#333', marginBottom: '0.5rem', fontWeight: '800' }}>Welcome to Alcove</h2>
        <p style={{ color: '#666', fontSize: '0.9rem' }}>Access your secure portal workspace.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', backgroundColor: '#f4f5f7', padding: '5px', borderRadius: '8px', marginBottom: '1.5rem' }}>
        <button
          onClick={() => handleTabChange('landlord')}
          style={{ padding: '0.6rem', border: 'none', borderRadius: '6px', fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer', backgroundColor: activeTab === 'landlord' ? '#fff' : 'transparent', color: activeTab === 'landlord' ? '#8B263E' : '#666', boxShadow: activeTab === 'landlord' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s' }}
        >
          Landlord Portal
        </button>
        <button
          onClick={() => handleTabChange('tenant')}
          style={{ padding: '0.6rem', border: 'none', borderRadius: '6px', fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer', backgroundColor: activeTab === 'tenant' ? '#fff' : 'transparent', color: activeTab === 'tenant' ? '#8B263E' : '#666', boxShadow: activeTab === 'tenant' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s' }}
        >
          Tenant Portal
        </button>
      </div>

      {error && (
        <div style={{ padding: '10px', marginBottom: '20px', borderRadius: '6px', backgroundColor: '#fce8e6', color: '#c5221f', fontSize: '0.85rem', fontWeight: '500', textAlign: 'center' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', textAlign: 'left' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#444' }}>
            {activeTab === 'landlord' ? 'Registered Email Address' : 'Tenant Registration ID'}
          </label>
          <input
            type="text"
            placeholder={activeTab === 'landlord' ? 'landlord@alcove.com' : 'e.g. alc-101'}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc', fontSize: '0.95rem' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', textAlign: 'left' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#444' }}>Portal Security Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc', fontSize: '0.95rem' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '0.85rem', backgroundColor: loading ? '#eaeaea' : '#8B263E', color: loading ? '#aaa' : '#fff', border: 'none', borderRadius: '6px', fontSize: '0.95rem', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '5px' }}
        >
          {loading ? 'Processing Auth...' : `Sign In as ${activeTab === 'landlord' ? 'Landlord' : 'Tenant'}`}
        </button>
      </form>

      {activeTab === 'landlord' && (
        <>
          <div style={{ position: 'relative', margin: '1.5rem 0', textTransform: 'uppercase', fontSize: '0.75rem', color: '#aaa', fontWeight: 'bold', textAlign: 'center' }}>
            <span style={{ background: '#fff', padding: '0 10px', zIndex: 1, position: 'relative' }}>Or Access Via</span>
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, borderTop: '1px solid #eee', zIndex: 0 }}></div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            style={{ width: '100%', padding: '0.85rem', backgroundColor: loading ? '#eaeaea' : '#ffffff', color: loading ? '#aaa' : '#333', border: '1px solid #ccc', borderRadius: '6px', fontSize: '0.95rem', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', marginBottom: '0.5rem' }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.47h4.84c-.21 1.12-.84 2.07-1.8 2.71v2.24h2.91c1.7-1.57 2.69-3.88 2.69-6.58z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.24c-.8.54-1.84.87-3.05.87-2.34 0-4.33-1.58-5.03-3.7H1.02v2.32C2.51 15.96 5.52 18 9 18z"/>
              <path fill="#FBBC05" d="M3.97 10.75c-.18-.54-.28-1.12-.28-1.71s.1-1.17.28-1.71V5.01H1.02C.37 6.3 0 7.77 0 9.3s.37 3 1.02 4.29l2.95-2.84z"/>
              <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35L15 2.4C13.46.99 11.42 0 9 0 5.52 0 2.51 2.04 1.02 4.31l2.95 2.32c.7-2.12 2.69-3.7 5.03-3.7z"/>
            </svg>
            Sign in with Google
          </button>
        </>
      )}
    </div>
  );
};

export default Login;