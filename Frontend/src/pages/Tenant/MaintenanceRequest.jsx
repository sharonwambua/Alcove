import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const MaintenanceRequest = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    category: 'Plumbing',
    title: '',
    description: '',
    urgency: 'Medium',
    tenantName: user?.name || 'Resident',
    roomNumber: user?.roomNumber || ''
  });
  
  const [historicTickets, setHistoricTickets] = useState([]);
  const [base64Image, setBase64Image] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  const [editingTicketId, setEditingTicketId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    category: 'Plumbing',
    description: '',
    priority: 'Medium'
  });
  const [editSaving, setEditSaving] = useState(false);

  const fetchMyTickets = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/maintenance/all');
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        const myData = user?.name
          ? result.data.filter(t => t.tenantName === user.name)
          : result.data;
        setHistoricTickets(myData);
      }
    } catch (err) {
      console.error('Failed to parse history:', err);
    }
  };

  useEffect(() => {
    fetchMyTickets();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      const reader = new FileReader();
      reader.onloadend = () => setBase64Image(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage({ type: '', text: '' });

    try {
      const res = await fetch('http://localhost:5000/api/maintenance/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantName: formData.tenantName,
          roomNumber: formData.roomNumber,
          title: formData.title,
          category: formData.category,
          description: formData.description,
          priority: formData.urgency,
          image: base64Image
        })
      });

      const result = await res.json();
      if (result.success) {
        setStatusMessage({ type: 'success', text: `Maintenance request logged successfully!` });
        setFormData({ ...formData, title: '', description: '', urgency: 'Medium' });
        setBase64Image('');
        setImagePreview(null);
        fetchMyTickets();
      }
    } catch (error) {
      setStatusMessage({ type: 'error', text: 'Error contacting backend service.' });
    } finally {
      setLoading(false);
    }
  };

  const openEditTicket = (ticket) => {
    setEditingTicketId(ticket.id);
    setEditFormData({
      title: ticket.title || '',
      category: ticket.category || 'Plumbing',
      description: ticket.description || '',
      priority: ticket.priority || 'Medium'
    });
  };

  const handleEditFieldChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleSaveTicketEdit = async (e) => {
    e.preventDefault();
    setEditSaving(true);
    try {
      const res = await fetch(`http://localhost:5000/api/maintenance/update/${editingTicketId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editFormData.title,
          category: editFormData.category,
          description: editFormData.description,
          priority: editFormData.priority
        })
      });
      const result = await res.json();
      if (result.success) {
        setEditingTicketId(null);
        fetchMyTickets();
      } else {
        alert(result.message || 'Failed to update ticket.');
      }
    } catch (err) {
      console.error('Failed to update ticket:', err);
      alert('An error occurred while updating the ticket.');
    } finally {
      setEditSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', fontFamily: 'sans-serif', padding: '0 1rem' }}>
      <h2 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '1.5rem' }}>File a Maintenance Request</h2>
      
      <form onSubmit={handleSubmitTicket} style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #e0e0e0', marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.5rem' }}>Category</label>
            <select name="category" value={formData.category} onChange={handleInputChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#FAF6F0' }}>
              <option value="Plumbing">Plumbing (Pipes, Taps, Tanks)</option>
              <option value="Electrical">Electrical (Sockets, Wiring, Lights)</option>
              <option value="Structural">Structural (Walls, Doors, Windows)</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.5rem' }}>Priority</label>
            <select name="urgency" value={formData.urgency} onChange={handleInputChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#FAF6F0' }}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.5rem' }}>Issue Summary</label>
          <input type="text" name="title" required value={formData.title} onChange={handleInputChange} placeholder="e.g. Broken lock handle" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#FAF6F0' }} />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.5rem' }}>Detailed Context</label>
          <textarea name="description" required rows="3" value={formData.description} onChange={handleInputChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#FAF6F0' }} />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: '60px', height: '60px', objectFit: 'cover', marginTop: '10px', borderRadius: '6px' }} />}
        </div>

        <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.85rem', borderRadius: '8px', border: 'none', backgroundColor: '#8B263E', color: '#fff', fontWeight: '700', cursor: 'pointer' }}>
          {loading ? 'Processing Submission...' : 'Submit Maintenance Ticket'}
        </button>

        {statusMessage.text && <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '8px', backgroundColor: statusMessage.type === 'success' ? '#E8F5E9' : '#FFEBEE', color: statusMessage.type === 'success' ? '#2E7D32' : '#C62828' }}>{statusMessage.text}</div>}
      </form>

      {/* PREVIEW CONTAINER OF RECENT SUBMISSIONS */}
      <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '1rem' }}>Ticket Status View</h3>
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e0e0e0', overflow: 'hidden' }}>
        {historicTickets.length === 0 ? (
          <p style={{ padding: '20px', color: '#aaa', textAlign: 'center' }}>No tickets logged yet for this unit.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAF6F0', borderBottom: '1px solid #e0e0e0' }}>
                <th style={{ padding: '1rem' }}>Summary</th>
                <th style={{ padding: '1rem' }}>Category</th>
                <th style={{ padding: '1rem' }}>Live Tracking Status</th>
                <th style={{ padding: '1rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {historicTickets.map((t) => (
                <tr key={t.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '1rem', fontWeight: '600' }}>{t.title}</td>
                  <td style={{ padding: '1rem' }}>{t.category}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase',
                      backgroundColor: t.status === 'Resolved' ? '#E8F5E9' : t.status === 'In Progress' ? '#E3F2FD' : '#FFF3E0',
                      color: t.status === 'Resolved' ? '#2E7D32' : t.status === 'In Progress' ? '#0D47A1' : '#E65100'
                    }}>
                      {t.status || 'Pending'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <button
                      onClick={() => openEditTicket(t)}
                      style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: '#FAF6F0', color: '#333', fontWeight: '600', fontSize: '0.8rem', cursor: 'pointer' }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editingTicketId && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', maxWidth: '500px', width: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
            <h3 style={{ margin: '0 0 1.25rem 0', fontWeight: '800', fontSize: '1.15rem' }}>Edit Maintenance Request</h3>
            <form onSubmit={handleSaveTicketEdit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.5rem' }}>Category</label>
                <select name="category" value={editFormData.category} onChange={handleEditFieldChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#FAF6F0' }}>
                  <option value="Plumbing">Plumbing (Pipes, Taps, Tanks)</option>
                  <option value="Electrical">Electrical (Sockets, Wiring, Lights)</option>
                  <option value="Structural">Structural (Walls, Doors, Windows)</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.5rem' }}>Priority</label>
                <select name="priority" value={editFormData.priority} onChange={handleEditFieldChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#FAF6F0' }}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.5rem' }}>Issue Summary</label>
                <input type="text" name="title" required value={editFormData.title} onChange={handleEditFieldChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#FAF6F0' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.5rem' }}>Detailed Context</label>
                <textarea name="description" required rows="3" value={editFormData.description} onChange={handleEditFieldChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#FAF6F0' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setEditingTicketId(null)} style={{ padding: '0.7rem 1.2rem', background: '#eaeaea', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '700' }}>
                  Cancel
                </button>
                <button type="submit" disabled={editSaving} style={{ padding: '0.7rem 1.2rem', background: '#8B263E', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '700' }}>
                  {editSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenanceRequest;