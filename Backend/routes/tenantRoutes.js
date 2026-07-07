const express = require('express');
const router = express.Router();
const tenantController = require('../controllers/tenantController');

router.get('/all', tenantController.getAllTenants);
router.get('/', tenantController.getAllTenants);

router.post('/register', tenantController.registerTenant);

router.put('/update-profile/:id', tenantController.updateTenantProfile);
router.put('/update-password/:id', tenantController.updateTenantPassword);
router.delete('/delete/:id', tenantController.deleteTenant);

router.get('/:id', tenantController.getTenantById);

module.exports = router;
