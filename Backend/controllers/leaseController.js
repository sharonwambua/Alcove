const { db } = require('../config/firebase');

exports.getLeases = async (req, res, next) => {
  try {
    let query = db.collection('leases');
    
   
    if (req.user.role === 'tenant') {
      query = query.where('tenantId', '==', req.user.uid);
    } else if (req.user.role === 'landlord') {
      query = query.where('landlordId', '==', req.user.uid);
    }

    const snapshot = await query.get();
    const data = [];
    snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};


exports.getLeaseById = async (req, res, next) => {
  try {
    const doc = await db.collection('leases').doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ success: false, message: 'Lease contract not found.' });
    
    const payload = doc.data();
    
   
    if (req.user.role === 'tenant' && payload.tenantId !== req.user.uid) {
      return res.status(403).json({ success: false, message: 'Forbidden: Access scope restriction breach.' });
    }
    if (req.user.role === 'landlord' && payload.landlordId !== req.user.uid) {
      return res.status(403).json({ success: false, message: 'Forbidden: Access scope restriction breach.' });
    }

    res.status(200).json({ success: true, data: { id: doc.id, ...payload } });
  } catch (error) {
    next(error);
  }
};

exports.createLease = async (req, res, next) => {
  try {
    const data = req.body;
    
    if (!data.tenantId || !data.propertyId || !data.startDate || !data.endDate) {
      return res.status(400).json({ success: false, message: 'Missing structural components. tenantId, propertyId, startDate, and endDate are required.' });
    }

    if (new Date(data.startDate) >= new Date(data.endDate)) {
      return res.status(400).json({ success: false, message: 'Date configuration layout clash: contract start date must occur prior to the termination date.' });
    }

    const ref = db.collection('leases').doc();
    const payload = {
      leaseId: ref.id,
      tenantId: data.tenantId,
      landlordId: req.user.uid,
      propertyId: data.propertyId,
      startDate: data.startDate,
      endDate: data.endDate,
      monthlyRent: Number(data.monthlyRent) || 0,
      status: data.status || 'Active',
      agreementURL: data.agreementURL || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await ref.set(payload);
    res.status(201).json({ success: true, data: payload });
  } catch (error) {
    next(error);
  }
};


exports.updateLease = async (req, res, next) => {
  try {
    const ref = db.collection('leases').doc(req.params.id);
    const doc = await ref.get();
    
    if (!doc.exists) return res.status(404).json({ success: false, message: 'Target lease entity index missing.' });

    if (doc.data().landlordId !== req.user.uid) {
      return res.status(403).json({ success: false, message: 'Forbidden: Resource structural tracking mutations require owning profile privileges.' });
    }

    const updates = { ...req.body, updatedAt: new Date().toISOString() };
    if (updates.monthlyRent) updates.monthlyRent = Number(updates.monthlyRent);

    await ref.update(updates);
    res.status(200).json({ success: true, message: 'Lease tracking documentation state successfully shifted.' });
  } catch (error) {
    next(error);
  }
};

exports.deleteLease = async (req, res, next) => {
  try {
    const ref = db.collection('leases').doc(req.params.id);
    const doc = await ref.get();
    
    if (!doc.exists) return res.status(404).json({ success: false, message: 'Target lease document missing.' });

    if (doc.data().landlordId !== req.user.uid) {
      return res.status(403).json({ success: false, message: 'Forbidden: Deletion requires ownership privileges.' });
    }

    await ref.delete();
    res.status(200).json({ success: true, message: 'Lease node dropped cleanly from execution engines.' });
  } catch (error) {
    next(error);
  }
};