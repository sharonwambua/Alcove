const { db } = require('../config/firebase');
const { resolveTenantDoc } = require('./tenantController');

const VALID_PAYMENT_METHODS = ['M-Pesa', 'Bank Transfer', 'Cash', 'Card'];
const OPEN_STATUSES = ['PENDING', 'AWAITING_APPROVAL', 'REJECTED'];


exports.generateInvoice = async (req, res) => {
  try {
    const { tenantId, description, rent, waterBill } = req.body;

    if (!tenantId) {
      return res.status(400).json({ success: false, message: 'A tenant must be selected to generate an invoice.' });
    }

    const tenantDoc = await resolveTenantDoc(tenantId);
    if (!tenantDoc) {
      return res.status(404).json({ success: false, message: 'Selected tenant does not exist.' });
    }


    const activeInvoice = await db.collection('payments')
      .where('tenantId', '==', tenantDoc.id)
      .where('status', 'in', ['PENDING', 'AWAITING_APPROVAL'])
      .limit(1)
      .get();

    if (!activeInvoice.empty) {
      return res.status(400).json({
        success: false,
        message: 'This tenant already has an active invoice awaiting payment or approval.'
      });
    }

    const rentValue = Number(rent || 0);
    const waterValue = Number(waterBill || 0);

    if (rentValue <= 0 && waterValue <= 0) {
      return res.status(400).json({ success: false, message: 'Rent and/or water bill must be greater than zero.' });
    }

    const tenantData = tenantDoc.data();
    const totalAmount = rentValue + waterValue;

    const invoicePayload = {
      tenantId: tenantDoc.id,
      tenantName: tenantData.name || 'Unassigned Tenant',
      propertyName: tenantData.propertyName || 'Unassigned Property',
      roomNumber: tenantData.roomNumber || '',
      description: description || 'Monthly House Rent and Water Bill',
      rent: rentValue,
      waterBill: waterValue,
      amount: totalAmount,
      paymentMethod: null,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    const docRef = await db.collection('payments').add(invoicePayload);

    return res.status(201).json({
      success: true,
      message: 'Invoice generated successfully and is now PENDING.',
      data: { id: docRef.id, ...invoicePayload }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};


exports.submitPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { method } = req.body;

    if (!method || !VALID_PAYMENT_METHODS.includes(method)) {
      return res.status(400).json({
        success: false,
        message: `A valid payment method is required (${VALID_PAYMENT_METHODS.join(', ')}).`
      });
    }

    const paymentRef = db.collection('payments').doc(id);
    const paymentDoc = await paymentRef.get();

    if (!paymentDoc.exists) {
      return res.status(404).json({ success: false, message: 'Invoice not found.' });
    }

    const payment = paymentDoc.data();
    if (!['PENDING', 'REJECTED'].includes(payment.status)) {
      return res.status(400).json({ success: false, message: `Invoice cannot be paid while in ${payment.status} status.` });
    }

    await paymentRef.update({
      status: 'AWAITING_APPROVAL',
      paymentMethod: method,
      submittedAt: new Date().toISOString()
    });

    return res.status(200).json({ success: true, message: 'Payment submitted and is now awaiting landlord approval.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};


exports.approvePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const paymentRef = db.collection('payments').doc(id);
    const paymentDoc = await paymentRef.get();

    if (!paymentDoc.exists) {
      return res.status(404).json({ success: false, message: 'Invoice not found.' });
    }

    const payment = paymentDoc.data();
    if (payment.status !== 'AWAITING_APPROVAL') {
      return res.status(400).json({ success: false, message: `Only payments awaiting approval can be cleared (current status: ${payment.status}).` });
    }

    await paymentRef.update({
      status: 'CLEARED',
      clearedAt: new Date().toISOString()
    });

    return res.status(200).json({ success: true, message: 'Payment approved and marked CLEARED.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.rejectPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const paymentRef = db.collection('payments').doc(id);
    const paymentDoc = await paymentRef.get();

    if (!paymentDoc.exists) {
      return res.status(404).json({ success: false, message: 'Invoice not found.' });
    }

    const payment = paymentDoc.data();
    if (payment.status !== 'AWAITING_APPROVAL') {
      return res.status(400).json({ success: false, message: `Only payments awaiting approval can be rejected (current status: ${payment.status}).` });
    }

    await paymentRef.update({
      status: 'REJECTED',
      rejectedAt: new Date().toISOString()
    });

    return res.status(200).json({ success: true, message: 'Payment rejected. The tenant may resubmit payment.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};


exports.getLedger = async (req, res) => {
  try {
    const snapshot = await db.collection('payments').get();
    const transactions = [];
    snapshot.forEach(doc => transactions.push({ id: doc.id, ...doc.data() }));
    transactions.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    return res.status(200).json({ success: true, data: transactions });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getInvoicesForTenant = async (req, res) => {
  try {
    const tenantDoc = await resolveTenantDoc(req.params.tenantId);
    if (!tenantDoc) {
      return res.status(404).json({ success: false, message: 'Tenant not found.' });
    }

    const snapshot = await db.collection('payments').where('tenantId', '==', tenantDoc.id).get();
    const invoices = [];
    snapshot.forEach(doc => invoices.push({ id: doc.id, ...doc.data() }));
    invoices.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    return res.status(200).json({ success: true, data: invoices });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};


const computeFinancialSummary = async () => {
  const snapshot = await db.collection('payments').get();

  let totalCollected = 0;
  let outstandingRent = 0;
  let outstandingWater = 0;
  const transactions = [];

  snapshot.forEach(doc => {
    const payment = doc.data();
    transactions.push({ id: doc.id, ...payment });

    if (payment.status === 'CLEARED') {
      totalCollected += Number(payment.amount || 0);
    } else if (OPEN_STATUSES.includes(payment.status)) {
      outstandingRent += Number(payment.rent || 0);
      outstandingWater += Number(payment.waterBill || 0);
    }
  });

  transactions.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  return {
    metrics: {
      totalCollected,
      unpaidRent: outstandingRent,
      unpaidWater: outstandingWater,
      outstandingBalance: outstandingRent + outstandingWater
    },
    transactions
  };
};

exports.getDashboardSummary = async (req, res) => {
  try {
    const summary = await computeFinancialSummary();
    return res.status(200).json({ success: true, ...summary });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.computeFinancialSummary = computeFinancialSummary;
