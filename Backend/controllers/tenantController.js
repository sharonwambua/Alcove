const { db } = require('../config/firebase');
const resolveTenantDoc = async (identifier) => {
  if (!identifier) return null;

  const directRef = db.collection('tenants').doc(identifier);
  const directSnap = await directRef.get();
  if (directSnap.exists) return directSnap;

  const query = await db.collection('tenants').where('tenantId', '==', identifier).limit(1).get();
  if (!query.empty) return query.docs[0];

  return null;
};

const generatePassword = () => Math.random().toString(36).slice(-8);

exports.registerTenant = async (req, res) => {
  try {
    const { name, email, phone, propertyName, propertyId, roomNumber, rent, rentAmount, waterBill, password } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, message: 'Name, email, and phone are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = await db.collection('tenants').where('email', '==', cleanEmail).limit(1).get();
    if (!existing.empty) {
      return res.status(400).json({ success: false, message: 'A tenant with this email is already registered.' });
    }

    const tenantRef = db.collection('tenants').doc();
    const generatedTenantId = `ALC-${new Date().getFullYear()}-${tenantRef.id.slice(0, 5).toUpperCase()}`;
    const tempPassword = password || generatePassword();

    const payload = {
      tenantId: generatedTenantId,
      name: name.trim(),
      email: cleanEmail,
      phone: phone.trim(),
      propertyName: propertyName || '',
      propertyId: propertyId || '',
      roomNumber: roomNumber || '',
      rentAmount: Number(rent ?? rentAmount ?? 0),
      waterBill: Number(waterBill || 0),
      password: tempPassword,
      isPasswordChanged: false,
      createdAt: new Date().toISOString()
    };

    await tenantRef.set(payload);

    return res.status(201).json({
      success: true,
      message: 'Tenant registered successfully!',
      data: { id: tenantRef.id, ...payload }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllTenants = async (req, res) => {
  try {
    const snapshot = await db.collection('tenants').get();
    const data = [];
    snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
exports.getTenantById = async (req, res) => {
  try {
    const doc = await resolveTenantDoc(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Tenant not found.' });
    }
    return res.status(200).json({ success: true, data: { id: doc.id, ...doc.data() } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
exports.updateTenantProfile = async (req, res) => {
  try {
    const { name, email, phone, roomNumber, propertyName, propertyId, rent, rentAmount, waterBill } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, message: 'Name, email, and phone are required.' });
    }

    const doc = await resolveTenantDoc(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Tenant not found.' });
    }

    const updates = {
      name,
      email: email.trim().toLowerCase(),
      phone,
      roomNumber: roomNumber || '',
      updatedAt: new Date().toISOString()
    };

    if (propertyName !== undefined) updates.propertyName = propertyName;
    if (propertyId !== undefined) updates.propertyId = propertyId;
    if (rent !== undefined || rentAmount !== undefined) updates.rentAmount = Number(rent ?? rentAmount ?? 0);
    if (waterBill !== undefined) updates.waterBill = Number(waterBill || 0);

    await doc.ref.update(updates);

    return res.status(200).json({ success: true, message: 'Tenant profile updated successfully!' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
exports.updateTenantPassword = async (req, res) => {
  try {
    const newPassword = req.body.password || req.body.newPassword;
    if (!newPassword) {
      return res.status(400).json({ success: false, message: "A new password value is required (field 'password' or 'newPassword')." });
    }

    const doc = await resolveTenantDoc(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Tenant not found.' });
    }

    await doc.ref.update({
      password: newPassword,
      isPasswordChanged: true,
      passwordUpdatedAt: new Date().toISOString()
    });

    return res.status(200).json({ success: true, message: 'Tenant password updated successfully!' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteTenant = async (req, res) => {
  try {
    const doc = await resolveTenantDoc(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Tenant not found.' });
    }

    await doc.ref.delete();
    return res.status(200).json({ success: true, message: 'Tenant deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.resolveTenantDoc = resolveTenantDoc;
