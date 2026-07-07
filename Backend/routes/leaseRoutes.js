const express = require('express');
const router = express.Router();
const leaseController = require('../controllers/leaseController');

router.get('/', leaseController.getLeases);
router.get('/:id', leaseController.getLeaseById);
router.post('/', leaseController.createLease);
router.put('/:id', leaseController.updateLease);
router.delete('/:id', leaseController.deleteLease);

module.exports = router;
