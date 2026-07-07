const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.get('/dashboard-summary', paymentController.getDashboardSummary);
router.get('/ledger', paymentController.getLedger);
router.get('/tenant/:tenantId', paymentController.getInvoicesForTenant);

router.post('/generate-invoice', paymentController.generateInvoice);

router.put('/pay/:id', paymentController.submitPayment);
router.put('/approve/:id', paymentController.approvePayment);
router.put('/reject/:id', paymentController.rejectPayment);

module.exports = router;
