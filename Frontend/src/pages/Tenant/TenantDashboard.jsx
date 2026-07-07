import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const TenantDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const formatKES = (amount) => {
    if (amount === undefined || amount === null || isNaN(amount)) return 'KES 0';
    return `KES ${Number(amount).toLocaleString()}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CLEARED':
        return { background: '#E8F5E9', color: '#15803D' };
      case 'AWAITING_APPROVAL':
        return { background: '#DBEAFE', color: '#1D4ED8' };
      case 'PENDING':
        return { background: '#FEF3C7', color: '#B45309' };
      case 'REJECTED':
        return { background: '#FEE2E2', color: '#DC2626' };
      default:
        return { background: '#F1F5F9', color: '#475569' };
    }
  };

  useEffect(() => {
    const tenantIdentifier = user?.tenantDocId || user?.id;

    const fetchDashboardState = async () => {
      setLoading(true);
      setError('');

      if (!tenantIdentifier) {
        setError('No tenant account is linked to this session.');
        setLoading(false);
        return;
      }

      try {
        const [profileRes, invoicesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/tenants/${tenantIdentifier}`),
          fetch(`${API_BASE_URL}/payments/tenant/${tenantIdentifier}`)
        ]);

        const profileJson = await profileRes.json();
        const invoicesJson = await invoicesRes.json();

        if (profileJson.success) {
          setProfile(profileJson.data);
        } else {
          throw new Error(profileJson.message || 'Failed to load your tenant profile.');
        }

        if (invoicesJson.success) {
          setInvoices(invoicesJson.data || []);
        }
      } catch (err) {
        console.error('Dashboard sync error:', err);
        setError(err.message || 'Unable to retrieve your rental account information.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardState();
  }, [API_BASE_URL, user]);

  const outstandingInvoices = invoices.filter(inv => inv.status !== 'CLEARED');
  const outstandingBalance = outstandingInvoices.reduce((sum, inv) => sum + Number(inv.amount || 0), 0);

  const recentActivity = [...invoices]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5)
    .map(inv => ({
      id: inv.id,
      title: inv.description || 'Monthly Statement',
      description: `Rent: ${formatKES(inv.rent)} · Water: ${formatKES(inv.waterBill)}`,
      amount: inv.amount,
      status: inv.status,
      date: inv.createdAt ? new Date(inv.createdAt).toLocaleDateString() : 'N/A'
    }));

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#F8FAFC', fontFamily: 'system-ui' }}>
        <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#64748B' }}>Loading your account...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#F8FAFC', padding: '20px', fontFamily: 'system-ui' }}>
        <div style={{ background: '#FFF1F2', border: '1px solid #FDA4AF', padding: '25px', borderRadius: '12px', maxWidth: '500px', width: '100%', textAlign: 'center' }}>
          <h3 style={{ color: '#E11D48', margin: '0 0 10px 0', fontWeight: '800' }}>⚠️ Unable to Load Dashboard</h3>
          <p style={{ color: '#4C0519', margin: 0, fontSize: '14px', lineHeight: '1.5' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "1.5rem", background: "#F8FAFC", minHeight: "100vh", fontFamily: "system-ui, -apple-system, sans-serif" }}>

      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ margin: 0, fontSize: "2rem", fontWeight: "800", color: "#1E293B", letterSpacing: '-0.025em' }}>
          Welcome Back, {profile?.name || 'Valued Resident'}
        </h1>
        <p style={{ color: "#64748B", marginTop: "6px", fontSize: '0.95rem' }}>
          Here's an overview of your account.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px", marginBottom: "30px" }}>

        <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,.04)", border: "1px solid #E2E8F0" }}>
          <h5 style={{ margin: 0, color: "#64748B", textTransform: "uppercase", fontSize: ".75rem", fontWeight: '700', letterSpacing: '0.05em' }}>Assigned Residence</h5>
          <h3 style={{ marginTop: "12px", marginBottom: "8px", color: "#1E293B", fontSize: '1.3rem', fontWeight: '700' }}>{profile?.propertyName || "Not Assigned"}</h3>
          <p style={{ color: "#475569", margin: "0 0 4px 0", fontSize: '14px' }}>Room/Unit: <strong>{profile?.roomNumber || "N/A"}</strong></p>
        </div>

        <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,.04)", border: "1px solid #E2E8F0" }}>
          <h5 style={{ margin: 0, color: "#64748B", textTransform: "uppercase", fontSize: ".75rem", fontWeight: '700', letterSpacing: '0.05em' }}>Monthly Rent</h5>
          <h2 style={{ color: "#8B263E", marginTop: "12px", marginBottom: "12px", fontSize: '1.75rem', fontWeight: '800' }}>{formatKES(profile?.rentAmount)}</h2>
        </div>

        <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,.04)", border: "1px solid #E2E8F0" }}>
          <h5 style={{ margin: 0, color: "#64748B", textTransform: "uppercase", fontSize: ".75rem", fontWeight: '700', letterSpacing: '0.05em' }}>Water Bill</h5>
          <h2 style={{ color: "#0F766E", marginTop: "12px", marginBottom: "12px", fontSize: '1.75rem', fontWeight: '800' }}>{formatKES(profile?.waterBill)}</h2>
        </div>

        <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,.04)", border: "1px solid #E2E8F0" }}>
          <h5 style={{ margin: 0, color: "#64748B", textTransform: "uppercase", fontSize: ".75rem", fontWeight: '700', letterSpacing: '0.05em' }}>Outstanding Balance</h5>
          <h2 style={{ color: outstandingBalance > 0 ? "#DC2626" : "#15803D", marginTop: "12px", marginBottom: "12px", fontSize: '1.75rem', fontWeight: '800' }}>{formatKES(outstandingBalance)}</h2>
          <p style={{ color: outstandingBalance > 0 ? '#DC2626' : '#15803D', margin: 0, fontSize: '14px', fontWeight: '600' }}>{outstandingBalance > 0 ? "Payment Required" : "Account Up To Date"}</p>
        </div>

      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "25px" }}>

        <div style={{ background: "#fff", padding: "25px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,.04)", border: "1px solid #E2E8F0", height: 'fit-content' }}>
          <h3 style={{ marginTop: 0, marginBottom: '6px', color: "#1E293B", fontWeight: '700' }}>Quick Actions</h3>
          <p style={{ color: "#64748B", marginBottom: "25px", fontSize: '14px' }}>Manage your rental account.</p>

          <button onClick={() => navigate("/tenant/rent")} style={{ width: "100%", padding: "14px", border: "none", borderRadius: "8px", background: "#8B263E", color: "#fff", fontWeight: "700", cursor: "pointer", marginBottom: "15px" }}>
            Pay Rent / View Invoices
          </button>

          <button onClick={() => navigate("/tenant/maintenance")} style={{ width: "100%", padding: "14px", border: "none", borderRadius: "8px", background: "#EA580C", color: "#fff", fontWeight: "700", cursor: "pointer" }}>
            Report Maintenance Issue
          </button>
        </div>

        <div style={{ background: "#fff", padding: "25px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,.04)", border: "1px solid #E2E8F0" }}>
          <h3 style={{ marginTop: 0, color: "#1E293B", marginBottom: "20px", fontWeight: '700' }}>Recent Invoices</h3>

          {recentActivity.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "#64748B" }}>
              <h4 style={{ margin: '0 0 6px 0', color: '#475569' }}>No Invoices Yet</h4>
              <p style={{ margin: 0, fontSize: '14px' }}>Your landlord hasn't generated any invoices for your account yet.</p>
            </div>
          ) : (
            recentActivity.map((activity) => {
              const statusStyle = getStatusColor(activity.status);
              return (
                <div key={activity.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 0", borderBottom: "1px solid #E2E8F0" }}>
                  <div style={{ paddingRight: '15px' }}>
                    <h4 style={{ margin: 0, color: "#1E293B", fontSize: "15px", fontWeight: '600' }}>{activity.title}</h4>
                    <p style={{ margin: "4px 0 6px 0", color: "#64748B", fontSize: "13px", lineHeight: '1.4' }}>{activity.description}</p>
                    <small style={{ color: "#94A3B8", display: 'block' }}>{activity.date}</small>
                  </div>

                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <h4 style={{ margin: 0, color: "#1E293B", fontSize: '15px', fontWeight: '700', marginBottom: '6px' }}>
                      {formatKES(activity.amount)}
                    </h4>
                    <span style={{ display: "inline-block", padding: "4px 10px", borderRadius: "20px", background: statusStyle.background, color: statusStyle.color, fontWeight: "700", fontSize: "11px", letterSpacing: '0.02em' }}>
                      {activity.status}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};

export default TenantDashboard;
