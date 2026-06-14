import React, { useState } from 'react';

const LandlordPayments = () => {

  const [transactions, setTransactions] = useState([
    { id: 'TXN-98421', tenant: 'Jane Mutoni', unit: 'Amani Gardens - Apt 3B', amount: 45000, method: 'M-Pesa STK', date: '2026-06-10', status: 'Cleared' },
    { id: 'TXN-98319', tenant: 'Mary Wanjiku', unit: 'Amani Gardens - Apt 1A', amount: 45000, method: 'M-Pesa Express', date: '2026-06-08', status: 'Cleared' },
    { id: 'TXN-98102', tenant: 'David Ochieng', unit: 'Kilimani Heights - Suite 12', amount: 60000, method: 'Bank Transfer', date: '2026-06-05', status: 'Pending Review' },
    { id: 'TXN-97994', tenant: 'Ezra Kiprop', unit: 'Ruaka Ridge - House 4', amount: 35000, method: 'M-Pesa STK', date: '2026-05-29', status: 'Cleared' }
  ]);

 
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [invoice, setInvoice] = useState({
    tenantId: '',
    description: 'Monthly House Rent (June 2026)',
    baseAmount: '',
    waterBill: '0'
  });


  const handleCreateInvoice = (e) => {
    e.preventDefault();
    
    const calculatedTotal = parseFloat(invoice.baseAmount) + (parseFloat(invoice.waterBill) || 0);
    
    if (!invoice.tenantId || calculatedTotal <= 0) {
      alert('Please fill out all billing details with valid financial parameters.');
      return;
    }

    alert(`Invoice distributed successfully to Tenant ${invoice.tenantId.toUpperCase()}.\nTotal Bill generated: KES ${calculatedTotal.toLocaleString()}`);
    setInvoice({ tenantId: '', description: 'Monthly House Rent (June 2026)', baseAmount: '', waterBill: '0' });
    setShowInvoiceForm(false);
  };


  const getStatusColor = (status) => {
    return status === 'Cleared' ? { bg: '#E8F5E9', text: '#2E7D32' } : { bg: '#FFF3E0', text: '#E65100' };
  };

  return (
    <div style={{ color: 'var(--text, #333)' }}>
      
  
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '800', letterSpacing: '-0.02em' }}>Payments & Collections</h1>
          <p style={{ margin: '0.25rem 0 0 0', color: '#777', fontSize: '0.95rem' }}>
            Monitor and manage all financial transactions, tenant payments, and billing statements for your properties.
          </p>
        </div>

        <button
          onClick={() => setShowInvoiceForm(!showInvoiceForm)}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#8B263E',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(139,38,62,0.2)'
          }}
        >
          {showInvoiceForm ? 'View Transaction Ledger' : 'Generate Tenant Invoice'}
        </button>
      </div>

      {showInvoiceForm ? (
    
        <section style={{ backgroundColor: '#fff', padding: '2.5rem', borderRadius: '12px', border: '1px solid #e0e0e0', maxWidth: '600px', margin: '0 auto' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.2rem', fontWeight: '700' }}>Compile Monthly Tenant Bill Statement</h3>
          <form onSubmit={handleCreateInvoice}>
            
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', color: '#555', marginBottom: '0.45rem' }}>Target Tenant ID</label>
              <input 
                type="text" required placeholder="e.g., ALC-2026-8942"
                value={invoice.tenantId} onChange={(e) => setInvoice({...invoice, tenantId: e.target.value})}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#FAF6F0' }}
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', color: '#555', marginBottom: '0.45rem' }}>Billing Description</label>
              <input 
                type="text" required
                value={invoice.description} onChange={(e) => setInvoice({...invoice, description: e.target.value})}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#FAF6F0' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', color: '#555', marginBottom: '0.45rem' }}>House Rent (KES)</label>
                <input 
                  type="number" required placeholder="45000"
                  value={invoice.baseAmount} onChange={(e) => setInvoice({...invoice, baseAmount: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#FAF6F0' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', color: '#555', marginBottom: '0.45rem' }}>Metered Water Bill (KES)</label>
                <input 
                  type="number" placeholder="e.g., 1200"
                  value={invoice.waterBill} onChange={(e) => setInvoice({...invoice, waterBill: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#FAF6F0' }}
                />
              </div>
            </div>

            <button type="submit" style={{ width: '100%', padding: '0.85rem', border: 'none', borderRadius: '8px', backgroundColor: '#8B263E', color: '#fff', fontSize: '1rem', fontWeight: '700', cursor: 'pointer' }}>
              Authorize and send Invoice
            </button>
          </form>
        </section>
      ) : (
    
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
     
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
            <div style={{ backgroundColor: '#fff', padding: '1.25rem 1.5rem', borderRadius: '10px', border: '1px solid #e0e0e0' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#777', textTransform: 'uppercase' }}>Total collected Funds</span>
              <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#43A047', marginTop: '0.25rem' }}>KES 125,000</div>
            </div>
            <div style={{ backgroundColor: '#fff', padding: '1.25rem 1.5rem', borderRadius: '10px', border: '1px solid #e0e0e0' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#777', textTransform: 'uppercase' }}>Pending Approval</span>
              <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#E65100', marginTop: '0.25rem' }}>KES 60,000</div>
            </div>
            <div style={{ backgroundColor: '#fff', padding: '1.25rem 1.5rem', borderRadius: '10px', border: '1px solid #e0e0e0' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#777', textTransform: 'uppercase' }}>Unpaid Rent</span>
              <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#C62828', marginTop: '0.25rem' }}>KES 45,000</div>
            </div>
          </div>

       
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e0e0e0', overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f0f0f0', fontWeight: '700', fontSize: '1rem' }}>
              Global Settlement History Logs
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#FAF6F0', borderBottom: '1px solid #e0e0e0' }}>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '700', color: '#555' }}>Reference ID</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '700', color: '#555' }}>Tenant Name</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '700', color: '#555' }}>Property </th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '700', color: '#555' }}>Settled Amount</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '700', color: '#555' }}>Payment Method</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '700', color: '#555' }}> Date</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '700', color: '#555' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => {
                  const colors = getStatusColor(txn.status);
                  return (
                    <tr key={txn.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: '700', color: '#555' }}>{txn.id}</td>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>{txn.tenant}</td>
                      <td style={{ padding: '1rem 1.5rem', color: '#666' }}>{txn.unit}</td>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: '700', color: '#8B263E' }}>KES {txn.amount.toLocaleString()}</td>
                      <td style={{ padding: '1rem 1.5rem', color: '#555', fontSize: '0.88rem', fontWeight: '600' }}>{txn.method}</td>
                      <td style={{ padding: '1rem 1.5rem', color: '#777' }}>{txn.date}</td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <span style={{
                          padding: '0.3rem 0.6rem',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          backgroundColor: colors.bg,
                          color: colors.text
                        }}>
                          {txn.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      )}
    </div>
  );
};

export default LandlordPayments;