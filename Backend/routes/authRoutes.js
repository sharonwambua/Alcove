const express = require('express');
const router = express.Router();
const { loginUser, tenantLogin } = require('../controllers/authController');

router.post('/login', loginUser);
router.post('/tenant-login', tenantLogin);

module.exports = router;
