const express = require('express');
const router = express.Router();
const waterBillController = require('../controllers/waterBillController');

router.get('/', waterBillController.getWaterBills);
router.get('/:id', waterBillController.getWaterBillById);
router.post('/', waterBillController.createWaterBill);
router.put('/:id', waterBillController.updateWaterBill);
router.delete('/:id', waterBillController.deleteWaterBill);

module.exports = router;
