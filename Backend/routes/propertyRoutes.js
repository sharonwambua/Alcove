const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');

router.get('/all', propertyController.getAllProperties);

router.post('/add', propertyController.createProperty);
router.post('/', propertyController.createProperty);

router.put('/update/:id', propertyController.updateProperty);
router.put('/:id', propertyController.updateProperty);

router.delete('/delete/:id', propertyController.deleteProperty);
router.delete('/:id', propertyController.deleteProperty);

module.exports = router;
