import React, { useState } from 'react';

const RentManagement = () => {

  const houseRent = 45000;
  const waterBill = 1250;
  const totalAmount = houseRent + waterBill;

  // Checkout Form States
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState({ type: '', message: '' });

  const handleMpesaPayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPaymentStatus({ type: '', message: '' });

   
    let formattedPhone = phoneNumber.trim().replace(/[\s+]/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '254' + formattedPhone.substring(1);
    } else if (formattedPhone.startsWith('7') || formattedPhone.startsWith('1')) {
      formattedPhone = '254' + formattedPhone;
    }

  
    if (!/^254[17]\d{8}$/.test(formattedPhone)) {
      setPaymentStatus({
        type: 'error',
        message: 'Please enter a valid Safaricom phone number (e.g., 0712345678 or 254712345678).'
      });
      setLoading(false);
      return;
    }

    try {
      /* FRONTEND TO BACKEND GATEWAY CONNECTIVITY LINK:
       
      */
      
    
      await new Promise((resolve) => setTimeout(resolve, 2500));

      setPaymentStatus({
        type: 'success',
        message: `STK Push prompt sent successfully to ${formattedPhone}. Please enter your M-Pesa PIN on your phone to complete the transaction.`
      });
    } catch (error) {
      setPaymentStatus({
        type: 'error',
        message: 'Failed to initiate M-Pesa STK Push. Please check your internet connection or try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', color: 'var(--text, #333)' }}>
      
  
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '800' }}>Payments Portal</h1>
        <p style={{ margin: '0.25rem 0 0 0', color: '#777', fontSize: '0.95rem' }}>
          Manage your monthly utilities and clear your balance securely via M-Pesa.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
        
   
        <section style={{ backgroundColor: '#fff', padding: '1.75rem', borderRadius: '12px', border: '1px solid #e0e0e0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1.1rem', fontWeight: '700', borderBottom: '2px solid #FAF6F0', paddingBottom: '0.5rem' }}>
            Current Month Statement
          </h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.95rem' }}>
            <span style={{ color: '#555' }}>House Rent (Current Month)</span>
            <span style={{ fontWeight: '600' }}>KES {houseRent.toLocaleString()}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            <span style={{ color: '#555' }}>Water Bill (Metered Consumption)</span>
            <span style={{ fontWeight: '600' }}>KES {waterBill.toLocaleString()}</span>
          </div>

          <div style={{ backgroundColor: '#FAF6F0', padding: '1rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e0e0e0' }}>
            <span style={{ fontWeight: '700', fontSize: '1rem' }}>Total Due:</span>
            <span style={{ fontWeight: '800', fontSize: '1.3rem', color: '#8B263E' }}>
              KES {totalAmount.toLocaleString()}
            </span>
          </div>
        </section>

     
        <section style={{ backgroundColor: '#fff', padding: '1.75rem', borderRadius: '12px', border: '1px solid #e0e0e0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          
          {/* Mpesa Brand header panel */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ backgroundColor: '#43A047', color: '#fff', fontWeight: '900', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.85rem', letterSpacing: '0.05em' }}>
              M-PESA
            </div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700' }}>Express Checkout</h3>
          </div>

          <form onSubmit={handleMpesaPayment}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: '#777', marginBottom: '0.5rem' }}>
                Safaricom Phone Number
              </label>
              <input 
                type="text"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="e.g., 0712345678"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  fontSize: '0.95rem',
                  backgroundColor: loading ? '#f5f5f5' : '#FAF6F0',
                  color: '#333'
                }}
              />
              <small style={{ display: 'block', color: '#999', marginTop: '0.35rem', fontSize: '0.78rem' }}>
                Ensure your phone is unlocked and ready to receive the secure PIN prompt wrapper.
              </small>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.85rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: loading ? '#aaa' : '#43A047', 
                color: '#fff',
                fontSize: '1rem',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              {loading ? 'Processing STK Push...' : `Pay KES ${totalAmount.toLocaleString()} Now`}
            </button>
          </form>

      
          {paymentStatus.message && (
            <div style={{
              marginTop: '1.25rem',
              padding: '1rem',
              borderRadius: '8px',
              fontSize: '0.88rem',
              lineHeight: '1.4',
              backgroundColor: paymentStatus.type === 'success' ? '#E8F5E9' : '#FFEBEE',
              color: paymentStatus.type === 'success' ? '#2E7D32' : '#C62828',
              border: `1px solid ${paymentStatus.type === 'success' ? '#A5D6A7' : '#EF9A9A'}`
            }}>
              {paymentStatus.message}
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default RentManagement;