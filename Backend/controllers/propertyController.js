const { db } = require('../config/firebase');

const normalizePropertyData = (docId, data) => {
  const title = data.title || data.name || 'Unnamed Property';
  const location = data.location || data.address || 'No Location Listed';
  const rent = Number(data.monthlyRent || data.rent || 0);
  const units = Number(data.units || data.bedrooms || data.unitsCount || 1);

  return {
    id: docId,
    propertyId: docId,
    title,
    name: title,
    propertyName: title,
    location,
    address: location,
    monthlyRent: rent,
    rent,
    units,
    bedrooms: units,
    type: data.type || 'Apartment',
    image: data.image || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=500&q=80',
    description: data.description || '',
    landlordId: data.landlordId || 'demo-landlord-id',
    createdAt: data.createdAt || new Date().toISOString()
  };
};

exports.getAllProperties = async (req, res) => {
  try {
    const snapshot = await db.collection('properties').get();
    const properties = [];
    snapshot.forEach(doc => properties.push(normalizePropertyData(doc.id, doc.data())));
    properties.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res.status(200).json({ success: true, data: properties });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.createProperty = async (req, res) => {
  try {
    const propertyRef = db.collection('properties').doc();
    const normalizedData = normalizePropertyData(propertyRef.id, req.body);
    await propertyRef.set(normalizedData);
    return res.status(201).json({ success: true, data: normalizedData });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const propertyRef = db.collection('properties').doc(id);
    const doc = await propertyRef.get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, message: 'Property not found.' });
    }

    const mergedData = { ...doc.data(), ...req.body, updatedAt: new Date().toISOString() };
    const normalizedData = normalizePropertyData(id, mergedData);

    await propertyRef.set(normalizedData);
    return res.status(200).json({ success: true, data: normalizedData });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id === 'undefined') {
      return res.status(400).json({ success: false, message: 'A valid property ID is required.' });
    }

    const propertyRef = db.collection('properties').doc(id);
    const doc = await propertyRef.get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, message: 'Property already removed or does not exist.' });
    }

    const assignedTenants = await db.collection('tenants').where('propertyId', '==', id).get();
    if (!assignedTenants.empty) {
      return res.status(400).json({ success: false, message: 'Cannot delete a property with active tenants assigned.' });
    }

    await propertyRef.delete();
    return res.status(200).json({ success: true, message: 'Property deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
