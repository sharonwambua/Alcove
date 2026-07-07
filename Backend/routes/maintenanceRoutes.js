const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');

router.get('/all', maintenanceController.getAllTickets);
router.post('/create', maintenanceController.createTicket);
router.patch('/update-status/:id', maintenanceController.updateTicketStatus);
router.put('/update/:id', maintenanceController.updateTicket);

module.exports = router;
