import React, { useState, useEffect } from 'react';

const TenantManagement = () => {
  const [tenants, setTenants] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTenantId, setEditingTenantId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    roomNumber: '',
    rentAmount: '0',
    waterBill: '0'
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyId: '',
    propertyName: '',
    roomNumber: '',
    rentBalance: '0',
    waterBill: '0'
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const tenantRes = await fetch('http://localhost:5000/api/tenants/all');
      const tenantResult = await tenantRes.json();
      
      if (Array.isArray(tenantResult)) {
        setTenants(tenantResult);
      } else if (tenantResult.success || tenantResult.data) {
        setTenants(tenantResult.data || []);
      }

      const propRes = await fetch('http://localhost:5000/api/properties/all');
      const propResult = await propRes.json();
      
      if (propResult.success && Array.isArray(propResult.data)) {
        setProperties(propResult.data);
      } else if (Array.isArray(propResult)) {
        setProperties(propResult);
      }
    } catch (err) {
      console.error("Error loading registry files:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'propertyName') {
      const selectedProperty = properties.find(
        (p) => (p.name || p.propertyName) === value
      );

      setFormData({
        ...formData,
        propertyName: value,
        propertyId: selectedProperty ? (selectedProperty._id || selectedProperty.id) : '',
        rentBalance: selectedProperty ? (selectedProperty.rent || selectedProperty.price || '0') : '0'
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleRegisterTenant = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Please populate Name, Email, and Phone configurations.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/tenants/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          propertyId: formData.propertyId,
          propertyName: formData.propertyName,
          roomNumber: formData.roomNumber,
          rent: Number(formData.rentBalance || 0),
          waterBill: Number(formData.waterBill || 0)
        })
      });

      const result = await response.json();
      
      if (result.success || response.ok) {
        const credentials = result.data || {};
        const assignedId = credentials.tenantId || "ALC-NEW";
        const assignedPass = credentials.password || "password123";

        alert(
          `TENANT REGISTERED SUCCESSFULLY!\n\n` +
          `Please provide these login details to the resident:\n` +
          `----------------------------------------\n` +
          `Tenant ID: ${assignedId}\n` +
          `Temporary Password: ${assignedPass}\n` +
          `----------------------------------------\n` +
          `Note: The resident will be prompted to alter this passcode upon their initial portal entries.`
        );
     
        setFormData({ name: '', email: '', phone: '', propertyId: '', propertyName: '', roomNumber: '', rentBalance: '0', waterBill: '0' });
        fetchData(); 
      } else {
        alert(result.message || "Could not register tenant.");
      }
    } catch (err) {
      console.error("Form transmission fault:", err);
      alert("An unexpected network fault locked down registration transmission layers.");
    }
  };

  const openEditModal = (tenant) => {
    setEditingTenantId(tenant.id || tenant._id);
    setEditFormData({
      name: tenant.name,
      email: tenant.email,
      phone: tenant.phone,
      roomNumber: tenant.roomNumber || '',
      rentAmount: tenant.rentAmount ?? 0,
      waterBill: tenant.waterBill ?? 0
    });
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleUpdateTenant = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/tenants/update-profile/${editingTenantId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: editFormData.name,
          email: editFormData.email,
          phone: editFormData.phone,
          roomNumber: editFormData.roomNumber,
          rent: Number(editFormData.rentAmount || 0),
          waterBill: Number(editFormData.waterBill || 0)
        })
      });

      const result = await response.json();
      if (result.success || response.ok) {
        alert("Tenant profile successfully updated!");
        setIsEditModalOpen(false);
        fetchData();
      } else {
        alert(result.message || "Failed to update tenant details.");
      }
    } catch (err) {
      console.error("Failed to update execution matrix layers:", err);
    }
  };

  const handleDeleteTenant = async (id) => {
    if (!window.confirm("Are you sure you want to remove this tenant permanently?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/tenants/delete/${id}`, {
        method: 'DELETE'
      });
      const result = await response.json();

      if (result.success || response.ok) {
        alert("Tenant successfully removed.");
        fetchData(); 
      } else {
        alert(result.message || "Could not delete tenant.");
      }
    } catch (err) {
      console.error("Error deleting tenant document:", err);
    }
  };

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ color: '#333', marginBottom: '20px', fontWeight: 'bold' }}>Tenant Management</h2>

      <form onSubmit={handleRegisterTenant} style={{ background: '#fcfdfd', padding: '24px', borderRadius: '8px', border: '1px solid #eee', marginBottom: '35px' }}>
        <h3 style={{ margin: '0 0 16px 0', color: '#555', fontSize: '16px', fontWeight: 'bold' }}>Register a New Tenant</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
          <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
          <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
          <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
          
          <select name="propertyName" value={formData.propertyName} onChange={handleChange} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc', background: '#fff' }}>
            <option value=""> Assign to a Registered Property </option>
            {properties.map((p) => {
              const nameValue = p.name || p.propertyName;
              return (
                <option key={p._id || p.id} value={nameValue}>{nameValue}</option>
              );
            })}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
          <input type="text" name="roomNumber" placeholder="House / Room Number (e.g., A4)" value={formData.roomNumber} onChange={handleChange} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
          <input type="number" name="rentBalance" placeholder="Monthly Rent (KES)" value={formData.rentBalance} onChange={handleChange} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
          <input type="number" name="waterBill" placeholder="Monthly Water Bill (KES)" value={formData.waterBill} onChange={handleChange} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
        </div>

        <button type="submit" style={{ width: '100%', padding: '12px', background: '#8B263E', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>
          Register Tenant
        </button>
      </form>

      <h3 style={{ color: '#333', marginBottom: '16px', fontSize: '18px', fontWeight: 'bold' }}>Current Occupancy Ledger</h3>
      
      <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #eee', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #eee' }}>
              <th style={{ padding: '12px 16px', color: '#555', fontWeight: 'bold' }}>Tenant Details</th>
              <th style={{ padding: '12px 16px', color: '#555', fontWeight: 'bold' }}>Contact Info</th>
              <th style={{ padding: '12px 16px', color: '#555', fontWeight: 'bold' }}>Assigned Unit</th>
              <th style={{ padding: '12px 16px', color: '#555', fontWeight: 'bold' }}>Monthly Rent / Water</th>
              <th style={{ padding: '12px 16px', color: '#555', fontWeight: 'bold', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#999' }}>Loading lists...</td>
              </tr>
            ) : tenants.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#999' }}>No tenants registered yet.</td>
              </tr>
            ) : (
              tenants.map((tenant) => (
                <tr key={tenant.id || tenant._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{tenant.name}</div>
                    <div style={{ fontSize: '0.75rem', marginTop: '4px' }}>
                      <span style={{ backgroundColor: '#f4f5f7', padding: '2px 6px', borderRadius: '4px', fontWeight: '600', color: '#555', border: '1px solid #e1e4e8' }}>
                        ID: {tenant.tenantId || "UNASSIGNED"}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontSize: '0.85rem' }}>{tenant.phone}</div>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>{tenant.email}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: '500' }}>{tenant.propertyName || "N/A"}</div>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>Room/Unit: {tenant.roomNumber}</div>
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 'bold', color: '#222' }}>
                    Rent: KES {Number(tenant.rentAmount || 0).toLocaleString()}
                    <div style={{ fontSize: '0.8rem', fontWeight: '500', color: '#666' }}>
                      Water: KES {Number(tenant.waterBill || 0).toLocaleString()}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <button onClick={() => openEditModal(tenant)} style={{ marginRight: '8px', padding: '6px 12px', background: '#f4f5f7', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', color: '#333' }}>
                      Edit
                    </button>
                    <button onClick={() => handleDeleteTenant(tenant.id || tenant._id)} style={{ padding: '6px 12px', background: '#fce8e6', border: '1px solid #f5c2c1', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', color: '#c5221f' }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isEditModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', maxWidth: '500px', width: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontWeight: 'bold', color: '#333' }}>Edit Tenant Metrics</h3>
            <form onSubmit={handleUpdateTenant} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input type="text" name="name" placeholder="Full Name" value={editFormData.name} onChange={handleEditChange} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
              <input type="email" name="email" placeholder="Email Address" value={editFormData.email} onChange={handleEditChange} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
              <input type="text" name="phone" placeholder="Phone Number" value={editFormData.phone} onChange={handleEditChange} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
              <input type="text" name="roomNumber" placeholder="House/Room Number" value={editFormData.roomNumber} onChange={handleEditChange} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
              <input type="number" name="rentAmount" placeholder="Monthly Rent (KES)" value={editFormData.rentAmount} onChange={handleEditChange} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
              <input type="number" name="waterBill" placeholder="Monthly Water Bill (KES)" value={editFormData.waterBill} onChange={handleEditChange} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setIsEditModalOpen(false)} style={{ padding: '10px 16px', background: '#eaeaea', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Cancel
                </button>
                <button type="submit" style={{ padding: '10px 16px', background: '#8B263E', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Save Modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantManagement;