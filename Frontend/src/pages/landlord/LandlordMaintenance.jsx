import React, { useState, useEffect } from 'react';

const LandlordMaintenance = () => {
  const [tickets, setTickets] = useState([]);
  const [activeTicketId, setActiveTicketId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({ title: '', category: '', description: '', priority: '' });
  const [editSaving, setEditSaving] = useState(false);

  // Fetch documents from MongoDB Atlas
  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/maintenance/all');
      const result = await res.json();
      if (result.success) {
        setTickets(result.data);
      }
    } catch (err) {
      console.error('Failed to pull live tickets from DB:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Update Status in MongoDB Atlas
  const handleUpdateStatus = async (ticketId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/maintenance/update-status/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const result = await res.json();
      
      if (result.success) {
        fetchTickets(); // Refresh data grid
        alert(`Ticket status has been successfully updated to: ${newStatus}`);
      }
    } catch (err) {
      console.error('Failed to patch ticket state changes:', err);
    }
  };

  const handleEditFieldChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const startEditingTicket = (ticket) => {
    setEditFormData({
      title: ticket.title || '',
      category: ticket.category || '',
      description: ticket.description || '',
      priority: ticket.priority || 'Medium'
    });
    setIsEditing(true);
  };

  const handleSaveTicketEdit = async (e) => {
    e.preventDefault();
    setEditSaving(true);
    try {
      const res = await fetch(`http://localhost:5000/api/maintenance/update/${activeTicketId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData)
      });
      const result = await res.json();
      if (result.success) {
        setIsEditing(false);
        fetchTickets();
      } else {
        alert(result.message || 'Failed to update ticket.');
      }
    } catch (err) {
      console.error('Failed to update ticket details:', err);
      alert('An error occurred while updating the ticket.');
    } finally {
      setEditSaving(false);
    }
  };

  const getUrgencyStyle = (urgency) => {
    return urgency === 'High' || urgency === 'Urgent'
      ? { color: '#C62828', backgroundColor: '#FFEBEE', fontWeight: '700' }
      : { color: '#E65100', backgroundColor: '#FFF3E0', fontWeight: '700' };
  };

  const getStatusStyle = (status) => {
    if (status === 'Resolved') return { backgroundColor: '#E8F5E9', color: '#2E7D32' };
    if (status === 'In Progress') return { backgroundColor: '#E3F2FD', color: '#0D47A1' };
    return { backgroundColor: '#ECEFF1', color: '#37474F' };
  };

  return (
    <div style={{ color: 'var(--text, #333)', fontFamily: 'sans-serif', padding: '10px' }}>
      
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '800', letterSpacing: '-0.02em' }}>Maintenance Requests</h1>
        <p style={{ margin: '0.25rem 0 0 0', color: '#777', fontSize: '0.95rem' }}>
          Track and manage all maintenance tickets raised by tenants across your estate properties.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div style={{ backgroundColor: '#fff', padding: '1.25rem 1.5rem', borderRadius: '10px', border: '1px solid #e0e0e0' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#777', textTransform: 'uppercase' }}>New Tickets</span>
          <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#C62828', marginTop: '0.25rem' }}>
            {tickets.filter(t => t.status && t.status.toLowerCase().includes('pending')).length} Tickets
          </div>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '1.25rem 1.5rem', borderRadius: '10px', border: '1px solid #e0e0e0' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#777', textTransform: 'uppercase' }}>In Progress Tickets</span>
          <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#0D47A1', marginTop: '0.25rem' }}>
            {tickets.filter(t => t.status === 'In Progress').length} Tickets
          </div>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '1.25rem 1.5rem', borderRadius: '10px', border: '1px solid #e0e0e0' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#777', textTransform: 'uppercase' }}>Completed / Resolved</span>
          <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#2E7D32', marginTop: '0.25rem' }}>
            {tickets.filter(t => t.status === 'Resolved').length} Tickets
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: activeTicketId ? '1.2fr 1fr' : '1fr', gap: '2rem', alignItems: 'start' }}>
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e0e0e0', overflow: 'hidden' }}>
          {loading ? (
            <p style={{ padding: '24px', color: '#666', textAlign: 'center' }}>Connecting to database indexes...</p>
          ) : tickets.length === 0 ? (
            <p style={{ padding: '24px', color: '#aaa', textAlign: 'center' }}>No tickets found in database cluster index.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#FAF6F0', borderBottom: '1px solid #e0e0e0' }}>
                  <th style={{ padding: '1rem 1.25rem', fontWeight: '700', color: '#555' }}>Tenant Name</th>
                  <th style={{ padding: '1rem 1.25rem', fontWeight: '700', color: '#555' }}>Room/Unit</th>
                  <th style={{ padding: '1rem 1.25rem', fontWeight: '700', color: '#555' }}>Issue Title</th>
                  <th style={{ padding: '1rem 1.25rem', fontWeight: '700', color: '#555' }}>Priority</th>
                  <th style={{ padding: '1rem 1.25rem', fontWeight: '700', color: '#555' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((tkt) => (
                  <tr 
                    key={tkt.id} 
                    onClick={() => { setActiveTicketId(tkt.id); setIsEditing(false); }}
                    style={{ 
                      borderBottom: '1px solid #eee', 
                      cursor: 'pointer',
                      backgroundColor: activeTicketId === tkt.id ? '#FAF6F0' : 'transparent'
                    }}
                  >
                    <td style={{ padding: '1rem 1.25rem', fontWeight: '700', color: '#8B263E' }}>{tkt.tenantName}</td>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: '600' }}>{tkt.roomNumber}</td>
                    <td style={{ padding: '1rem 1.25rem', color: '#333', fontWeight: '500' }}>{tkt.title}</td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.78rem', ...getUrgencyStyle(tkt.priority) }}>
                        {tkt.priority}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span style={{ padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', ...getStatusStyle(tkt.status) }}>
                        {tkt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {activeTicketId && (() => {
          const selectedTicket = tickets.find(t => t.id === activeTicketId);
          if (!selectedTicket) return null;

          return (
            <div style={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '1.75rem', position: 'sticky', top: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #f0f0f0', paddingBottom: '0.75rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '800' }}>Inspection Pane</h3>
                <button onClick={() => { setActiveTicketId(null); setIsEditing(false); }} style={{ border: 'none', backgroundColor: 'transparent', color: '#999', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#777', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Occupant Identity</span>
                <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{selectedTicket.tenantName} ({selectedTicket.roomNumber})</div>
              </div>

              {selectedTicket.image && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#777', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Damage Photo Attachment</span>
                  <img src={selectedTicket.image} alt="Evidence" style={{ width: '100%', maxHeight: '220px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd' }} />
                </div>
              )}

              {isEditing ? (
                <form onSubmit={handleSaveTicketEdit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#777', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Issue Title</label>
                    <input type="text" name="title" required value={editFormData.title} onChange={handleEditFieldChange} style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #ccc' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#777', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Category</label>
                      <select name="category" value={editFormData.category} onChange={handleEditFieldChange} style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #ccc' }}>
                        <option value="Plumbing">Plumbing</option>
                        <option value="Electrical">Electrical</option>
                        <option value="Structural">Structural</option>
                        <option value="General">General</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#777', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Priority</label>
                      <select name="priority" value={editFormData.priority} onChange={handleEditFieldChange} style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #ccc' }}>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#777', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Description</label>
                    <textarea name="description" required rows="3" value={editFormData.description} onChange={handleEditFieldChange} style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #ccc' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'flex-end' }}>
                    <button type="button" onClick={() => setIsEditing(false)} style={{ padding: '0.6rem 1rem', background: '#eaeaea', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '700' }}>
                      Cancel
                    </button>
                    <button type="submit" disabled={editSaving} style={{ padding: '0.6rem 1rem', background: '#8B263E', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '700' }}>
                      {editSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div style={{ marginBottom: '1.25rem' }}>
                    <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#777', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Issue Title</span>
                    <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{selectedTicket.title}</div>
                  </div>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#777', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Reported Problem Statement</span>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#444', backgroundColor: '#FAF6F0', padding: '1rem', borderRadius: '8px', border: '1px solid #eee', lineHeight: '1.45' }}>
                      "{selectedTicket.description}"
                    </p>
                  </div>

                  <button
                    onClick={() => startEditingTicket(selectedTicket)}
                    style={{ width: '100%', padding: '0.7rem', border: '1px solid #ccc', borderRadius: '6px', backgroundColor: '#FAF6F0', color: '#333', fontWeight: '700', cursor: 'pointer', marginBottom: '1.25rem' }}
                  >
                    Edit Ticket Details
                  </button>
                </>
              )}

              <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '1.25rem', marginTop: '1.5rem' }}>
                <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#777', textTransform: 'uppercase', marginBottom: '0.6rem' }}>Update Job Operations Status</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <button 
                    onClick={() => handleUpdateStatus(selectedTicket.id, 'In Progress')}
                    disabled={selectedTicket.status === 'In Progress'}
                    style={{ padding: '0.7rem', border: '1px solid #b3d7ff', borderRadius: '6px', backgroundColor: '#E3F2FD', color: '#0D47A1', fontWeight: '700', cursor: 'pointer' }}
                  >
                    Deploy Contractor (Mark "In Progress")
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(selectedTicket.id, 'Resolved')}
                    disabled={selectedTicket.status === 'Resolved'}
                    style={{ padding: '0.7rem', border: '1px solid #c8e6c9', borderRadius: '6px', backgroundColor: '#E8F5E9', color: '#2E7D32', fontWeight: '700', cursor: 'pointer' }}
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