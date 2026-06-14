import React, { useState } from 'react';

const TenantManagement = () => {
  // Enhanced Active Tenancy Data Matrix with Payment Status
  const [tenants, setTenants] = useState([
    { id: 'ALC-2026-8942', name: 'Jane Mutoni', phone: '254712345678', residency: 'Amani Gardens', unit: 'Apartment 3B', rent: 45000, status: 'Paid' },
    { id: 'ALC-2026-4411', name: 'David Ochieng', phone: '254722987654', residency: 'Kilimani Heights', unit: 'Suite 12', rent: 60000, status: 'Pending' },
    { id: 'ALC-2026-3029', name: 'Mary Wanjiku', phone: '254733555111', residency: 'Amani Gardens', unit: 'Apartment 1A', rent: 45000, status: 'Paid' },
    { id: 'ALC-2026-7752', name: 'Ezra Kiprop', phone: '254701444222', residency: 'Ruaka Ridge', unit: 'House 4', rent: 35000, status: 'Overdue' }
  ]);

  const [residencyFilter, setResidencyFilter] = useState('All');
  const [showRegForm, setShowRegForm] = useState(false);

  const [newTenant, setNewTenant] = useState({
    name: '',
    phone: '',
    residency: 'Amani Gardens',
    unit: '',
    rent: ''
  });

  const handleRegisterTenant = (e) => {
    e.preventDefault();
    
    const generatedId = 'ALC-2026-' + Math.floor(1000 + Math.random() * 9000);
    let formattedPhone = newTenant.phone.trim();
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '254' + formattedPhone.substring(1);
    }

    const tenantObject = {
      id: generatedId,
      name: newTenant.name,
      phone: formattedPhone,
      residency: newTenant.residency,
      unit: newTenant.unit,
      rent: parseFloat(newTenant.rent) || 0,
      status: 'Pending' // New tenants default to Pending until first payment cycles
    };

    setTenants([...tenants, tenantObject]);
    setNewTenant({ name: '', phone: '', residency: 'Amani Gardens', unit: '', rent: '' });
    setShowRegForm(false);
    
    alert(`Tenant successfully registered!\nGenerated Login ID: ${generatedId}`);
  };

  const filteredTenants = residencyFilter === 'All' 
    ? tenants 
    : tenants.filter(t => t.residency === residencyFilter);

  // Helper helper to color code the invoicing statuses cleanly
  const getStatusStyle = (status) => {
    if (status === 'Paid') return { backgroundColor: '#E8F5E9', color: '#2E7D32' };
    if (status === 'Pending') return { backgroundColor: '#FFF3E0', color: '#E65100' };
    return { backgroundColor: '#FFEBEE', color: '#C62828' };
  };

  return (
    <div style={{ color: 'var(--text, #333)' }}>
      
      {/* HEADER SECTION PANEL */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '800' }}>Tenant Management</h1>
          <p style={{ margin: '0.25rem 0 0 0', color: '#777', fontSize: '0.95rem' }}>
            Onboard new occupants, generate portal credentials, and monitor property residency lines.
          </p>
        </div>
        
        <button
          onClick={() => setShowRegForm(!showRegForm)}
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
          {showRegForm ? 'View Active Roster' : 'Register New Tenant'}
        </button>
      </div>

      {showRegForm ? (
        /* REGISTRATION FORM COMPONENT */
        <section style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #e0e0e0', maxWidth: '600px', margin: '0 auto' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.2rem', fontWeight: '700' }}>Onboard New Resident Profile</h3>
          <form onSubmit={handleRegisterTenant}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', color: '#555', marginBottom: '0.45rem' }}>Tenant Full Name</label>
              <input 
                type="text" required placeholder="e.g., Jane Mutoni"
                value={newTenant.name} onChange={(e) => setNewTenant({...newTenant, name: e.target.value})}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#FAF6F0' }}
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', color: '#555', marginBottom: '0.45rem' }}>Phone Number</label>
              <input 
                type="text" required placeholder="e.g., 0712345678"
                value={newTenant.phone} onChange={(e) => setNewTenant({...newTenant, phone: e.target.value})}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#FAF6F0' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', color: '#555', marginBottom: '0.45rem' }}>Select Residency Location</label>
                <select 
                  value={newTenant.residency} onChange={(e) => setNewTenant({...newTenant, residency: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#FAF6F0', fontWeight: '600' }}
                >
                  <option value="Amani Gardens">Amani Gardens</option>
                  <option value="Kilimani Heights">Kilimani Heights</option>
                  <option value="Ruaka Ridge">Ruaka Ridge</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', color: '#555', marginBottom: '0.45rem' }}>Unit / House Number</label>
                <input 
                  type="text" required placeholder="e.g., Apartment 3B"
                  value={newTenant.unit} onChange={(e) => setNewTenant({...newTenant, unit: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#FAF6F0' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', color: '#555', marginBottom: '0.45rem' }}>Monthly Rent Fee (KES)</label>
              <input 
                type="number" required placeholder="e.g., 45000"
                value={newTenant.rent} onChange={(e) => setNewTenant({...newTenant, rent: e.target.value})}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#FAF6F0' }}
              />
            </div>

            <button type="submit" style={{ width: '100%', padding: '0.85rem', border: 'none', borderRadius: '8px', backgroundColor: '#43A047', color: '#fff', fontSize: '1rem', fontWeight: '700', cursor: 'pointer' }}>
              Complete Enrolment & Generate ID
            </button>
          </form>
        </section>
      ) : (
        /* MAIN FILTER AND ACTIVE ROSTER GRID VIEW */
        <>
          {/* RESIDENCY FILTER BAR PANEL ROW */}
          <div style={{ backgroundColor: '#fff', padding: '1rem 1.5rem', borderRadius: '8px', border: '1px solid #e0e0e0', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontWeight: '700', fontSize: '0.9rem', color: '#555', textTransform: 'uppercase' }}>
              Filter By Complex Residency:
            </span>
            <select
              value={residencyFilter}
              onChange={(e) => setResidencyFilter(e.target.value)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: '1px solid #ccc',
                backgroundColor: '#FAF6F0',
                color: '#333',
                fontWeight: '600',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            >
              <option value="All">All Properties Combined</option>
              <option value="Amani Gardens">Amani Gardens</option>
              <option value="Kilimani Heights">Kilimani Heights</option>
              <option value="Ruaka Ridge">Ruaka Ridge</option>
            </select>
          </div>

          {/* ACTIVE ROSTER DATAGRID MATRIX TABLE */}
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e0e0e0', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#FAF6F0', borderBottom: '1px solid #e0e0e0' }}>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '700', color: '#555' }}>Tenant ID</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '700', color: '#555' }}>Full Name</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '700', color: '#555' }}>Contact Info</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '700', color: '#555' }}>Property Location</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '700', color: '#555' }}>Unit Mapping</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '700', color: '#555' }}>Monthly Cost</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '700', color: '#555' }}>June Rent Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTenants.length > 0 ? (
                  filteredTenants.map((tenant) => (
                    <tr key={tenant.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: '700', color: '#8B263E' }}>{tenant.id}</td>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>{tenant.name}</td>
                      <td style={{ padding: '1rem 1.5rem', color: '#555' }}>+{tenant.phone}</td>
                      <td style={{ padding: '1rem 1.5rem', color: '#555' }}>{tenant.residency}</td>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>{tenant.unit}</td>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: '700' }}>KES {tenant.rent.toLocaleString()}</td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <span style={{
                          padding: '0.3rem 0.6rem',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          ...getStatusStyle(tenant.status)
                        }}>
                          {tenant.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: '#999', fontWeight: '500' }}>
                      No active tenant occupancy logged under this selected residency tracking pipeline.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default TenantManagement;