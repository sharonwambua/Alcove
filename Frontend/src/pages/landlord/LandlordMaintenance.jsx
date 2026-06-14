import React, { useState } from 'react';

const LandlordMaintenance = () => {
 
  const [tickets, setTickets] = useState([
    { id: 'TKT-702', tenant: 'Jane Mutoni', residency: 'Amani Gardens', unit: 'Apartment 3B', category: 'Plumbing', issue: 'Kitchen sink pipe leaking heavily underneath the cabinet wrapper.', urgency: 'Urgent', date: '2026-06-12', status: 'Pending Assignment' },
    { id: 'TKT-698', tenant: 'David Ochieng', unit: 'Kilimani Heights - Suite 12', category: 'Electrical', issue: 'Living room wall sockets shorting out when appliances are plugged in.', urgency: 'Urgent', date: '2026-06-10', status: 'In Progress' },
    { id: 'TKT-695', tenant: 'Mary Wanjiku', unit: 'Amani Gardens - Apartment 1A', category: 'Carpentry', issue: 'Balcony door lock latch misaligned and failing to secure completely.', urgency: 'Normal', date: '2026-06-08', status: 'Resolved' }
  ]);


  const [activeTicketId, setActiveTicketId] = useState(null);


  const handleUpdateStatus = (ticketId, newStatus) => {
    setTickets(tickets.map(tkt => 
      tkt.id === ticketId ? { ...tkt, status: newStatus } : tkt
    ));
    alert(`Ticket ${ticketId} has been successfully updated to: ${newStatus}`);
  };


  const getUrgencyStyle = (urgency) => {
    return urgency === 'Urgent' 
      ? { color: '#C62828', backgroundColor: '#FFEBEE', fontWeight: '700' }
      : { color: '#E65100', backgroundColor: '#FFF3E0', fontWeight: '700' };
  };


  const getStatusStyle = (status) => {
    if (status === 'Resolved') return { backgroundColor: '#E8F5E9', color: '#2E7D32' };
    if (status === 'In Progress') return { backgroundColor: '#E3F2FD', color: '#0D47A1' };
    return { backgroundColor: '#ECEFF1', color: '#37474F' };
  };

  return (
    <div style={{ color: 'var(--text, #333)' }}>
      
  
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '800', letterSpacing: '-0.02em' }}>Maintenance Requests</h1>
        <p style={{ margin: '0.25rem 0 0 0', color: '#777', fontSize: '0.95rem' }}>
          Track and manage all maintenance tickets raised by tenants across your estate properties. Assign, monitor, and resolve issues efficiently.
        </p>
      </div>

     
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div style={{ backgroundColor: '#fff', padding: '1.25rem 1.5rem', borderRadius: '10px', border: '1px solid #e0e0e0' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#777', textTransform: 'uppercase' }}>New Tickets</span>
          <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#C62828', marginTop: '0.25rem' }}>
            {tickets.filter(t => t.status === 'Pending Assignment').length} Ticket
          </div>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '1.25rem 1.5rem', borderRadius: '10px', border: '1px solid #e0e0e0' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#777', textTransform: 'uppercase' }}>In Progress Tickets</span>
          <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#0D47A1', marginTop: '0.25rem' }}>
            {tickets.filter(t => t.status === 'In Progress').length} Ticket
          </div>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '1.25rem 1.5rem', borderRadius: '10px', border: '1px solid #e0e0e0' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#777', textTransform: 'uppercase' }}>Completed This Month</span>
          <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#2E7D32', marginTop: '0.25rem' }}>
            {tickets.filter(t => t.status === 'Resolved').length} Ticket
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: activeTicketId ? '1.2fr 1fr' : '1fr', gap: '2rem', alignItems: 'start' }}>
        
  
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e0e0e0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAF6F0', borderBottom: '1px solid #e0e0e0' }}>
                <th style={{ padding: '1rem 1.25rem', fontWeight: '700', color: '#555' }}>Ticket</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: '700', color: '#555' }}>Tenant & Unit</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: '700', color: '#555' }}>Category</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: '700', color: '#555' }}>Urgency</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: '700', color: '#555' }}>Logged Date</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: '700', color: '#555' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((tkt) => (
                <tr 
                  key={tkt.id} 
                  onClick={() => setActiveTicketId(tkt.id)}
                  style={{ 
                    borderBottom: '1px solid #eee', 
                    cursor: 'pointer',
                    backgroundColor: activeTicketId === tkt.id ? '#FAF6F0' : 'transparent',
                    transition: 'background-color 0.15s ease'
                  }}
                >
                  <td style={{ padding: '1rem 1.25rem', fontWeight: '700', color: '#8B263E' }}>{tkt.id}</td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ fontWeight: '600' }}>{tkt.tenant}</div>
                    <div style={{ fontSize: '0.82rem', color: '#666' }}>{tkt.unit}</div>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', color: '#333', fontWeight: '500' }}>{tkt.category}</td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.78rem', ...getUrgencyStyle(tkt.urgency) }}>
                      {tkt.urgency}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', color: '#777' }}>{tkt.date}</td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span style={{ padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', ...getStatusStyle(tkt.status) }}>
                      {tkt.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

  
        {activeTicketId && (() => {
          const selectedTicket = tickets.find(t => t.id === activeTicketId);
          if (!selectedTicket) return null;

          return (
            <div style={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '1.75rem', position: 'sticky', top: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #f0f0f0', paddingBottom: '0.75rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '800' }}>Inspection Pane: {selectedTicket.id}</h3>
                <button 
                  onClick={() => setActiveTicketId(null)}
                  style={{ border: 'none', backgroundColor: 'transparent', color: '#999', fontSize: '1.2rem', fontWeight: '700', cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#777', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Occupant Identity</span>
                <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{selectedTicket.tenant} ({selectedTicket.unit})</div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#777', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Reported Problem Statement</span>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#444', backgroundColor: '#FAF6F0', padding: '1rem', borderRadius: '8px', border: '1px solid #eee', lineHeight: '1.45' }}>
                  "{selectedTicket.issue}"
                </p>
              </div>

    
              <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '1.25rem', marginTop: '1.5rem' }}>
                <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#777', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
                  Update Job Operations Status
                </span>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <button 
                    onClick={() => handleUpdateStatus(selectedTicket.id, 'In Progress')}
                    disabled={selectedTicket.status === 'In Progress'}
                    style={{ 
                      padding: '0.7rem', border: '1px solid #b3d7ff', borderRadius: '6px', 
                      backgroundColor: selectedTicket.status === 'In Progress' ? '#f4f9ff' : '#E3F2FD', 
                      color: '#0D47A1', fontWeight: '700', cursor: selectedTicket.status === 'In Progress' ? 'default' : 'pointer' 
                    }}
                  >
                    Deploy Contractor (Mark "In Progress")
                  </button>
                  
                  <button 
                    onClick={() => handleUpdateStatus(selectedTicket.id, 'Resolved')}
                    disabled={selectedTicket.status === 'Resolved'}
                    style={{ 
                      padding: '0.7 pointer', border: '1px solid #c8e6c9', borderRadius: '6px', 
                      backgroundColor: selectedTicket.status === 'Resolved' ? '#f5fbf6' : '#E8F5E9', 
                      color: '#2E7D32', fontWeight: '700', cursor: selectedTicket.status === 'Resolved' ? 'default' : 'pointer' 
                    }}
                  >
                    Close Work Order (Mark "Resolved")
                  </button>
                </div>
              </div>

            </div>
          );
        })()}

      </div>
    </div>
  );
};

export default LandlordMaintenance;