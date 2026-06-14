import React from 'react';
import DataTable from '../../components/DataTable';

const TenantManagement = () => {
  const tenants = [
    { id: 'TEN-401', name: 'Alexander Carter', unit: 'Suite 404', lease: 'Jan 01 - Dec 31', status: 'Current' }
  ];

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2>Tenant Directory Lookup</h2>
        <p style={{ color: 'var(--text-muted)' }}>Leasing occupants across managed structures</p>
      </div>
      
      <DataTable 
        headers={['Client Key', 'Full Name', 'Assigned Unit', 'Lease Period', 'Balance Status']} 
        data={tenants} 
        renderRow={(t) => (
          <tr key={t.id}>
            <td style={{ fontFamily: 'monospace' }}>{t.id}</td>
            <td style={{ fontWeight: '500' }}>{t.name}</td>
            <td>{t.unit}</td>
            <td>{t.lease}</td>
            <td style={{ color: 'var(--success)', fontWeight: '600' }}>● {t.status}</td>
          </tr>
        )} 
      />
    </div>
  );
};

export default TenantManagement;