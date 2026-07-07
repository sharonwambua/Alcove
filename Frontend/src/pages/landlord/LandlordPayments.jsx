import React, { useState, useEffect } from 'react';

const STATUS_LABELS = {
  PENDING: { label: 'PENDING', bg: '#fff3e0', color: '#e65100' },
  AWAITING_APPROVAL: { label: 'AWAITING APPROVAL', bg: '#e3f2fd', color: '#1565c0' },
  CLEARED: { label: 'CLEARED', bg: '#e8f5e9', color: '#2e7d32' },
  REJECTED: { label: 'REJECTED', bg: '#fdecea', color: '#c62828' }
};

const LandlordPayments = () => {
  const [viewMode, setViewMode] = useState('ledger');
  const [transactions, setTransactions] = useState([]);
  const [metrics, setMetrics] = useState({ totalCollected: 0, unpaidWater: 0, unpaidRent: 0 });
  const [tenantsList, setTenantsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [invoiceForm, setInvoiceForm] = useState({
    tenantId: '',
    description: 'Monthly House Rent and Water Bill',
    rent: '0',
    waterBill: '0'
  });

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const summaryRes = await fetch('http://localhost:5000/api/payments/dashboard-summary');
      const summaryResult = await summaryRes.json();
      if (summaryResult.success) {
        setTransactions(summaryResult.transactions || []);
        setMetrics(summaryResult.metrics || { totalCollected: 0, unpaidWater: 0, unpaidRent: 0 });
      }

      const tenantsRes = await fetch('http://localhost:5000/api/tenants/all');
      const tenantsResult = await tenantsRes.json();
      if (Array.isArray(tenantsResult)) {
        setTenantsList(tenantsResult);
      } else if (tenantsResult.success && Array.isArray(tenantsResult.data)) {
        setTenantsList(tenantsResult.data);
      }
    } catch (err) {
      console.error('Error loading payments data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleTenantSelectChange = (e) => {
    const selectedId = e.target.value;
    const selectedTenantRecord = tenantsList.find((t) => t.id === selectedId);

    if (selectedTenantRecord) {
      setInvoiceForm({
        ...invoiceForm,
        tenantId: selectedId,
        rent: String(selectedTenantRecord.rentAmount ?? 0),
        waterBill: String(selectedTenantRecord.waterBill ?? 0)
      });
    } else {
      setInvoiceForm({ ...invoiceForm, tenantId: selectedId, rent: '0', waterBill: '0' });
    }
  };

  const handleInvoiceChange = (e) => {
    setInvoiceForm({ ...invoiceForm, [e.target.name]: e.target.value });
  };

  const handleAuthorizeInvoice = async (e) => {
    e.preventDefault();
    if (!invoiceForm.tenantId) {
      alert('Please select a tenant from the dropdown list.');
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch('http://localhost:5000/api/payments/generate-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoiceForm)
      });
      const result = await response.json();
      if (result.success) {
        alert(result.message);
        setInvoiceForm({ tenantId: '', description: 'Monthly House Rent and Water Bill', rent: '0', waterBill: '0' });
        setViewMode('ledger');
        loadDashboardData();
      } else {
        alert(result.message || 'Failed to generate invoice.');
      }
    } catch (err) {
      console.error('Invoice generation error:', err);
      alert('A network error occurred while generating the invoice.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprovePayment = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/payments/approve/${id}`, { method: 'PUT' });
      const result = await response.json();
      if (result.success) {
        loadDashboardData();
      } else {
        alert(result.message || 'Could not approve payment.');
      }
    } catch (err) {
      console.error('Approval error:', err);
    }
  };

  const handleRejectPayment = async (id) => {
    if (!window.confirm('Reject this payment? The tenant will need to resubmit.')) return;
    try {
      const response = await fetch(`http://localhost:5000/api/payments/reject/${id}`, { method: 'PUT' });
      const result = await response.json();
      if (result.success) {
        loadDashboardData();
      } else {
        alert(result.message || 'Could not reject payment.');
      }
    } catch (err) {
      console.error('Rejection error:', err);
    }
  };

  const renderLandlordAction = (t) => {
    switch (t.status) {
      case 'PENDING':
        return <span style={{ color: '#e65100', fontSize: '12px', fontWeight: '600' }}>Waiting for Payment</span>;
      case 'AWAITING_APPROVAL':
        return (
          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
            <button
              onClick={() => handleApprovePayment(t.id)}
              style={{ background: '#2e7d32', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}
            >
              ✓ Approve
            </button>
            <button
              onClick={() => handleRejectPayment(t.id)}
              style={{ background: '#c62828', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}
            >
              ✕ Reject
            </button>
          </div>
        );
      case 'CLEARED':
        return <span style={{ color: '#2e7d32', fontSize: '12px', fontWeight: '600' }}>Approved ✓</span>;
      case 'REJECTED':
        return <span style={{ color: '#c62828', fontSize: '12px', fontWeight: '600' }}>Rejected</span>;
      default:
        return <span style={{ color: '#999', fontSize: '12px' }}>—</span>;
    }
  };

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ color: '#111111', margin: 0, fontWeight: 'bold', fontSize: '24px' }}>Payments & Collections</h2>
          <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '13px' }}>
            Monitor and manage all financial transactions, tenant payments, and billing statements for your properties.
          </p>
        </div>

        {viewMode === 'ledger' ? (
          <button
            onClick={() => setViewMode('invoice')}
            style={{ background: '#8B263E', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
          >
            Generate Tenant Invoice
          </button>
        ) : (
          <button
            onClick={() => setViewMode('ledger')}
            style={{ background: '#8B263E', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
          >
            View Transaction Ledger
          </button>
        )}
      </div>

      {viewMode === 'ledger' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '30px' }}>
            <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #eee' }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#666', fontWeight: 'bold', letterSpacing: '0.5px' }}>Total Collected (Cleared Only)</span>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2e7d32', marginTop: '8px' }}>
                KES {Number(metrics?.totalCollected ?? 0).toLocaleString()}
              </div>
            </div>

            <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #eee' }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#666', fontWeight: 'bold', letterSpacing: '0.5px' }}>Outstanding Water Bills</span>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1565c0', marginTop: '8px' }}>
                KES {Number(metrics?.unpaidWater ?? 0).toLocaleString()}
              </div>
            </div>

            <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #eee' }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#666', fontWeight: 'bold', letterSpacing: '0.5px' }}>Outstanding Rent</span>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#cc0000', marginTop: '8px' }}>
                KES {Number(metrics?.unpaidRent ?? 0).toLocaleString()}
              </div>
            </div>
          </div>

          <h3 style={{ fontSize: '14px', color: '#333', marginBottom: '14px', fontWeight: 'bold' }}>Transaction Ledger</h3>
          <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #eee', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #eee' }}>
                  <th style={{ padding: '12px 16px', color: '#555', fontWeight: 'bold' }}>Reference No.</th>
                  <th style={{ padding: '12px 16px', color: '#555', fontWeight: 'bold' }}>Tenant Name</th>
                  <th style={{ padding: '12px 16px', color: '#555', fontWeight: 'bold' }}>Property</th>
                  <th style={{ padding: '12px 16px', color: '#555', fontWeight: 'bold' }}>Amount</th>
                  <th style={{ padding: '12px 16px', color: '#555', fontWeight: 'bold' }}>Payment Method</th>
                  <th style={{ padding: '12px 16px', color: '#555', fontWeight: 'bold' }}>Date</th>
                  <th style={{ padding: '12px 16px', color: '#555', fontWeight: 'bold' }}>Status</th>
                  <th style={{ padding: '12px 16px', color: '#555', fontWeight: 'bold', textAlign: 'center' }}>Landlord Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="8" style={{ padding: '20px', textAlign: 'center', color: '#999' }}>Loading transactions...</td></tr>
                ) : transactions.length === 0 ? (
                  <tr><td colSpan="8" style={{ padding: '20px', textAlign: 'center', color: '#999' }}>No invoices generated yet.</td></tr>
                ) : (
                  transactions.map((t) => {
                    const statusMeta = STATUS_LABELS[t.status] || { label: t.status || 'UNKNOWN', bg: '#f1f1f1', color: '#555' };
                    return (
                      <tr key={t.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '14px 16px', fontFamily: 'monospace' }}>{t.id.slice(0, 10)}...</td>
                        <td style={{ padding: '14px 16px', fontWeight: '600' }}>{t.tenantName || 'Unassigned Tenant'}</td>
                        <td style={{ padding: '14px 16px' }}>
                          {t.propertyName || 'Unassigned Property'}
                          {t.roomNumber ? <span style={{ fontSize: '11px', color: '#777' }}> ({t.roomNumber})</span> : null}
                        </td>
                        <td style={{ padding: '14px 16px', fontWeight: 'bold' }}>
                          KES {Number(t.amount ?? 0).toLocaleString()}
                        </td>
                        <td style={{ padding: '14px 16px' }}>{t.paymentMethod || 'Not yet paid'}</td>
                        <td style={{ padding: '14px 16px', color: '#666' }}>{t.createdAt ? new Date(t.createdAt).toLocaleDateString() : 'N/A'}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{
                            fontSize: '11px', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold',
                            background: statusMeta.bg,
                            color: statusMeta.color
                          }}>
                            {statusMeta.label}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                          {renderLandlordAction(t)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {viewMode === 'invoice' && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
          <form onSubmit={handleAuthorizeInvoice} style={{ background: '#fff', padding: '30px', borderRadius: '8px', border: '1px solid #eee', width: '100%', maxWidth: '500px' }}>
            <h3 style={{ margin: '0 0 20px 0', textAlign: 'center', color: '#333', fontSize: '16px', fontWeight: 'bold' }}>Generate Tenant Invoice</h3>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', fontWeight: 'bold', color: '#555', marginBottom: '6px' }}>Tenant</label>
              <select
                name="tenantId"
                value={invoiceForm.tenantId}
                onChange={handleTenantSelectChange}
                required
                style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc', background: '#fff' }}
              >
                <option value="">-- Choose Tenant --</option>
                {tenantsList.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name || 'Unnamed Tenant'} ({t.propertyName || 'Unassigned Property'})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', fontWeight: 'bold', color: '#555', marginBottom: '6px' }}>Description</label>
              <input type="text" name="description" value={invoiceForm.description} onChange={handleInvoiceChange} required style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', fontWeight: 'bold', color: '#555', marginBottom: '6px' }}>House Rent (KES)</label>
                <input type="number" name="rent" min="0" value={invoiceForm.rent} onChange={handleInvoiceChange} required style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', fontWeight: 'bold', color: '#555', marginBottom: '6px' }}>Water Bill (KES)</label>
                <input type="number" name="waterBill" min="0" value={invoiceForm.waterBill} onChange={handleInvoiceChange} required style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc' }} />
              </div>
            </div>

            <button type="submit" disabled={submitting} style={{ width: '100%', padding: '12px', background: submitting ? '#c9a5b1' : '#8B263E', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: submitting ? 'not-allowed' : 'pointer', fontSize: '13px' }}>
              {submitting ? 'Generating...' : 'Generate Invoice'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default LandlordPayments;
