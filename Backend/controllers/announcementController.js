const { db } = require('../config/firebase');

exports.createAnnouncement = async (req, res) => {
  try {
    const { title, message, scope } = req.body;

    if (!title || !message) {
      return res.status(400).json({ success: false, message: 'Title and message are required.' });
    }

    const newAnnouncement = {
      title,
      message,
      scope: scope || 'All Units',
      active: true,
      createdAt: new Date().toISOString(),
      createdBy: 'Landlord'
    };

    const docRef = await db.collection('announcements').add(newAnnouncement);

    return res.status(201).json({
      success: true,
      id: docRef.id,
      message: 'Announcement posted successfully!'
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAnnouncements = async (req, res) => {
  try {
    const snapshot = await db.collection('announcements').get();
    const data = [];
    snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
    data.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('announcements').doc(id).delete();
    return res.status(200).json({ success: true, message: 'Announcement removed.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
