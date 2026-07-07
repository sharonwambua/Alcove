import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleReset = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 style={{ marginBottom: '0.5rem', fontSize: '1.5rem', fontWeight: '700' }}>Reset Password</h2>
        
        {!submitted ? (
          <form onSubmit={handleReset}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Enter your registered portal email validation keys below to obtain recovery instructions.
            </p>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your-email@example.com" />
            </div>
            <button type="submit" className="btn-primary">Send Recovery Link</button>
          </form>
        ) : (
          <div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✉️</div>
            <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Check your inbox</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              A secure password modification dispatch has been sent to <strong>{email}</strong>.
            </p>
          </div>
        )}
        
        <div className="auth-footer">
          <Link to="/login" style={{ textDecoration: 'none', fontWeight: '500' }}>← Return to Gateway</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;