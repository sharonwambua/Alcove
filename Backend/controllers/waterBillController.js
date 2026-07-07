const { db } = require('../config/firebase');

exports.getWaterBills = async (req, res, next) => {
  try {
    let query = db.collection('waterBills');

    if (req.user.role === 'tenant') {
      query = query.where('tenantId', '==', req.user.uid);
    }

    const snapshot = await query.get();
    const data = [];
    snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};


exports.getWaterBillById = async (req, res, next) => {
  try {
    const doc = await db.collection('waterBills').doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ success: false, message: 'Water bill entry reference mismatch.' });
    
    const payload = doc.data();

    if (req.user.role === 'tenant' && payload.tenantId !== req.user.uid) {
      return res.status(403).json({ success: false, message: 'Forbidden: Access scope restriction breach.' });
    }

    res.status(200).json({ success: true, data: { id: doc.id, ...payload } });
  } catch (error) {
    next(error);
  }
};


exports.createWaterBill = async (req, res, next) => {
  try {
    const { tenantId, propertyId, billingMonth, amount, dueDate, meterReading } = req.body;
    
    if (!tenantId || !propertyId || isNaN(Number(amount)) || Number(amount) < 0) {
      return res.status(400).json({ success: false, message: 'Invalid billing validation layout metrics. tenantId, propertyId, and a valid amount are required.' });
    }

    const ref = db.collection('waterBills').doc();
    const payload = {
      billId: ref.id,
      tenantId,
      propertyId,
      billingMonth: billingMonth || new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
      amount: Number(amount),
      dueDate,
      paymentStatus: 'Unpaid',
      paymentDate: '',
      meterReading: Number(meterReading) || 0,
      createdAt: new Date().toISOString()
    };

    await ref.set(payload);
    res.status(201).json({ success: true, data: payload });
  } catch (error) {
    next(error);
  }
};

exports.updateWaterBill = async (req, res, next) => {
  try {
    const ref = db.collection('waterBills').doc(req.params.id);
    const doc = await ref.get();
    if (!doc.exists) return res.status(404).json({ success: false, message: 'Target utility statement missing.' });

    const updates = { ...req.body };
    if (updates.amount) updates.amount = Number(updates.amount);
    if (updates.meterReading) updates.meterReading = Number(updates.meterReading);
    if (updates.paymentStatus === 'Paid' && !updates.paymentDate) {
      updates.paymentDate = new Date().toISOString();
    }

    await ref.update(updates);
    res.status(200).json({ success: true, message: 'Utility configuration node updated successfully.' });
  } catch (error) {
    next(error);
  }
};


exports.deleteWaterBill = async (req, res, next) => {
  try {
    const ref = db.collection('waterBills').doc(req.params.id);
    const doc = await ref.get();
    if (!doc.exists) return res.status(404).json({ success: false, message: 'Target entry does not exist.' });

    await ref.delete();
    res.status(200).json({ success: true, message: 'Utility statement log record dropped cleanly.' });
  } catch (error) {
    next(error);
  }
};