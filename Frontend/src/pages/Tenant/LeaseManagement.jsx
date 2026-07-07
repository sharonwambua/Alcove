import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const formatKES = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return 'KES 0.00';
  return `KES ${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: '2-digit' });
};


const addOneYear = (date) => {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + 1);
  d.setDate(d.getDate() - 1); 
  return d;
};

const LeaseManagement = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const tenantIdentifier = user?.tenantDocId || user?.id;

    const loadLeaseData = async () => {
      setLoading(true);
      setError('');

      if (!tenantIdentifier) {
        setError('No tenant account is linked to this session.');
        setLoading(false);
        return;
      }

      try {
        const [profileRes, propertiesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/tenants/${tenantIdentifier}`),
          fetch(`${API_BASE_URL}/properties/all`)
        ]);

        const profileJson = await profileRes.json();
        if (!profileJson.success) {
          throw new Error(profileJson.message || 'Failed to load your lease profile.');
        }
        setProfile(profileJson.data);

        const propertiesJson = await propertiesRes.json();
        if (propertiesJson.success && Array.isArray(propertiesJson.data)) {
          const matchedProperty = propertiesJson.data.find(
            (p) => p.id === profileJson.data.propertyId || p.propertyId === profileJson.data.propertyId
          );
          setProperty(matchedProperty || null);
        }
      } catch (err) {
        console.error('Lease sync error:', err);
        setError(err.message || 'Unable to retrieve your lease information.');
      } finally {
        setLoading(false);
      }
    };

    loadLeaseData();
  }, [user]);

  if (loading) {
    return (
      <div style={{ background: 'var(--surface)', padding: '2rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading your lease agreement...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ background: 'var(--surface)', padding: '2rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
        <p style={{ color: '#C62828', fontWeight: '600' }}>{error}</p>
      </div>
    );
  }

  const commencementDate = profile?.createdAt ? new Date(profile.createdAt) : null;
  const terminationDate = commencementDate ? addOneYear(commencementDate) : null;

  const premises = property
    ? `${property.title || property.propertyName || profile?.propertyName || 'Unassigned Property'}${profile?.roomNumber ? ` - Room ${profile.roomNumber}` : ''}`
    : `${profile?.propertyName || 'Unassigned Property'}${profile?.roomNumber ? ` - Room ${profile.roomNumber}` : ''}`;

  const monthlyRent = property?.monthlyRent ?? property?.rent ?? profile?.rentAmount ?? 0;

  return (
    <div style={{ background: 'var(--surface)', padding: '2rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
      <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Lease Agreement Details</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Official terms verified by property operations</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
        <div>
          <h4 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Commencement</h4>
          <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>{formatDate(commencementDate)}</p>
        </div>
        <div>
          <h4 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Termination</h4>
          <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>{formatDate(terminationDate)}</p>
        </div>
        <div>
          <h4 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Location</h4>
          <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>{premises}</p>
        </div>
        <div>
          <h4 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Monthly Contract Rent</h4>
          <p style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--primary)' }}>{formatKES(monthlyRent)} / mo</p>
        </div>
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
        This is a fixed 1-year tenancy running from your registration date to the same date the following year.
      </p>

      <button className="btn-primary" style={{ width: 'auto' }} onClick={() => alert(`Downloading Lease_Agreement_${commencementDate ? commencementDate.getFullYear() : ''}.pdf`)}>
        Download Certified Copy (PDF)
      </button>
    </div>
  );
};

export default LeaseManagement;
