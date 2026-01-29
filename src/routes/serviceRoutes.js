const express = require('express');
const router = express.Router();
const { uploadService } = require('../middleware/upload');
const serviceController = require('../controllers/serviceController');

// CREATE Service
router.post('/create', uploadService.single('image'), serviceController.createService);

// GET ALL Services
router.get('/', serviceController.getAllServices);

// GET Service BY ID
router.get('/:id', serviceController.getServiceById);

// UPDATE Service
router.put('/:id', uploadService.single('image'), serviceController.updateService);

// DELETE Service
router.delete('/:id', serviceController.deleteService);

module.exports = router;
