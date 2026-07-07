const { db } = require('../config/firebase');


exports.createTicket = async (req, res) => {
  try {
    const { tenantName, roomNumber, title, category, description, priority, image } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required.' });
    }

    const ticketRef = db.collection('maintenance').doc();
    const newTicket = {
      tenantName: tenantName || 'Unassigned Tenant',
      roomNumber: roomNumber || '',
      title: title.trim(),
      category: category || 'General',
      description: description.trim(),
      priority: priority || 'Medium',
      image: image || '',
      status: 'OPEN',
      createdAt: new Date().toISOString()
    };

    await ticketRef.set(newTicket);
    return res.status(201).json({ success: true, data: { id: ticketRef.id, ...newTicket } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


exports.getAllTickets = async (req, res) => {
  try {
    const snapshot = await db.collection('maintenance').get();
    const tickets = [];
    snapshot.forEach(doc => tickets.push({ id: doc.id, ...doc.data() }));
    tickets.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    return res.status(200).json({ success: true, data: tickets });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


exports.updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, description, priority, roomNumber, status } = req.body;

    const ticketRef = db.collection('maintenance').doc(id);
    const doc = await ticketRef.get();
    if (!doc.exists) {
      return res.status(404).json({ success: false, message: 'Ticket not found.' });
    }

    const updates = { updatedAt: new Date().toISOString() };
    if (title !== undefined) updates.title = title.trim();
    if (category !== undefined) updates.category = category;
    if (description !== undefined) updates.description = description.trim();
    if (priority !== undefined) updates.priority = priority;
    if (roomNumber !== undefined) updates.roomNumber = roomNumber;
    if (status !== undefined) updates.status = status;

    await ticketRef.update(updates);
    return res.status(200).json({ success: true, message: 'Ticket updated successfully.', data: { id, ...doc.data(), ...updates } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


exports.updateTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'A status value is required.' });
    }

    const ticketRef = db.collection('maintenance').doc(id);
    const doc = await ticketRef.get();
    if (!doc.exists) {
      return res.status(404).json({ success: false, message: 'Ticket not found.' });
    }

    await ticketRef.update({ status, updatedAt: new Date().toISOString() });
    return res.status(200).json({ success: true, message: `Ticket status updated to ${status}.` });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
