import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';

const PAYMENT_METHODS = ['M-Pesa', 'Bank Transfer', 'Cash', 'Card'];

const STATUS_META = {
  PENDING: { label: 'Pending Payment', bg: '#fff3e0', color: '#e65100' },
  AWAITING_APPROVAL: { label: 'Awaiting Landlord Approval', bg: '#e3f2fd', color: '#1565c0' },
  CLEARED: { label: 'Cleared', bg: '#e8f5e9', color: '#2e7d32' },
  REJECTED: { label: 'Rejected - Please Resubmit', bg: '#fdecea', color: '#c62828' }
};

const RentManagement = () => {
  const { user } = useAuth();
  const [tenantIdentifier, setTenantIdentifier] = useState(user?.id || '');
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [methodChoice, setMethodChoice] = useState({});
  const [payingId, setPayingId] = useState(null);

  const loadInvoices = useCallback(async (identifier) => {
    if (!identifier) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`http://localhost:5000/api/payments/tenant/${identifier}`);
      const result = await res.json();
      if (result.success) {
        setInvoices(result.data || []);
      } else {
        setError(result.message || 'Unable to load your invoices.');
        setInvoices([]);
      }
    } catch (err) {
      console.error('Failed to load tenant invoices:', err);
      setError('A network error occurred while loading your invoices.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInvoices(tenantIdentifier);
  }, [tenantIdentifier, loadInvoices]);

  const handleSubmitPayment = async (invoiceId) => {
    const method = methodChoice[invoiceId];
    if (!method) {
      alert('Please choose a payment method first.');
      return;
    }
    setPayingId(invoiceId);
    try {
      const res = await fetch(`http://localhost:5000/api/payments/pay/${invoiceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method })
      });
      const result = await res.json();
      if (result.success) {
        alert('Payment submitted! Your landlord will review and approve it.');
        loadInvoices(tenantIdentifier);
      } else {
        alert(result.message || 'Could not submit payment.');
      }
    } catch (err) {
      console.error('Payment submission error:', err);
      alert('A network error occurred while submitting your payment.');
    } finally {
      setPayingId(null);
    }
  };

  const openInvoices = invoices.filter(inv => inv.status !== 'CLEARED');
  const totalDue = openInvoices.reduce((sum, inv) => sum + Number(inv.amount || 0), 0);

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif', maxWidth: '1100px', margin: '0 auto' }}>
      <h2 style={{ color: '#333', marginBottom: '6px' }}>Rent &amp; Payments</h2>
      <p style={{ color: '#666', margin: '0 0 20px 0', fontSize: '14px' }}>
        View your invoices and submit payment. Your landlord must approve each payment before it is cleared.
      </p>

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px', background: '#fff', padding: '14px 16px', borderRadius: '8px', border: '1px solid #eef0f2' }}>
        <label style={{ fontSize: '13px', color: '#555', fontWeight: '600' }}>Tenant ID / Email:</label>
        <input
          type="text"
          value={tenantIdentifier}
          onChange={(e) => setTenantIdentifier(e.target.value)}
          placeholder="e.g. ALC-2026-ABCDE"
          style={{ flex: 1, padding: '8px 10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px' }}
        />
        <button
          onClick={() => loadInvoices(tenantIdentifier)}
          style={{ padding: '8px 16px', background: '#8B263E', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
        >
          Load
        </button>
      </div>

      <div style={{ background: '#FAF5F6', padding: '16px', borderRadius: '8px', border: '1px solid #F3E6E8', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <span style={{ fontWeight: 'bold', color: '#555', fontSize: '16px' }}>Total Outstanding:</span>
        <span style={{ fontWeight: 'bold', color: '#8B263E', fontSize: '22px' }}>KES {totalDue.toLocaleString()}</span>
      </div>

      {loading ? (
        <p style={{ color: '#666', fontStyle: 'italic' }}>Loading invoices...</p>
      ) : error ? (
        <p style={{ color: '#c62828' }}>{error}</p>
      ) : invoices.length === 0 ? (
        <p style={{ color: '#999', fontStyle: 'italic' }}>No invoices found for this tenant ID yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {invoices.map((invoice) => {
            const meta = STATUS_META[invoice.status] || { label: invoice.status, bg: '#f1f1f1', color: '#555' };
            const canPay = invoice.status === 'PENDING' || invoice.status === 'REJECTED';

            return (
              <div key={invoice.id} style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #eef0f2', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#222', fontSize: '15px' }}>{invoice.description || 'Monthly Statement'}</div>
                    <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                      {invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString() : ''}
                    </div>
                  </div>
                  <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '20px', fontWeight: 'bold', background: meta.bg, color: meta.color }}>
                    {meta.label}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '6px' }}>
                  <span style={{ color: '#555' }}>Rent</span>
                  <strong>KES {Number(invoice.rent || 0).toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '12px' }}>
                  <span style={{ color: '#555' }}>Water Bill</span>
                  <strong>KES {Number(invoice.waterBill || 0).toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', paddingTop: '10px', borderTop: '1px solid #eee' }}>
                  <span style={{ fontWeight: 'bold' }}>Total</span>
                  <strong style={{ color: '#8B263E' }}>KES {Number(invoice.amount || 0).toLocaleString()}</strong>
                </div>

                {canPay && (
                  <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                    <select
                      value={methodChoice[invoice.id] || ''}
                      onChange={(e) => setMethodChoice({ ...methodChoice, [invoice.id]: e.target.value })}
                      style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
                    >
                      <option value="">-- Select Payment Method --</option>
                      {PAYMENT_METHODS.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleSubmitPayment(invoice.id)}
                      disabled={payingId === invoice.id}
                      style={{ padding: '8px 18px', background: '#8B263E', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      {payingId === invoice.id ? 'Submitting...' : 'Submit Payment'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '16px', borderRadius: '8px', marginTop: '24px', fontSize: '13px', color: '#4a5568' }}>
        <strong>Accepted payment methods:</strong> M-Pesa, Bank Transfer, Cash, or Card. After you submit, your payment
        will show as <em>Awaiting Landlord Approval</em> until your landlord reviews and clears it.
      </div>
    </div>
  );
};

export default RentManagement;
