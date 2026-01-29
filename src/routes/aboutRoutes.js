const express = require('express');
const router = express.Router();
const aboutController = require('../controllers/aboutController');
const { uploadAbout } = require('../middleware/upload');

// CREATE About (image ke saath)
router.post('/create', uploadAbout.single('image'), aboutController.createAbout);

// UPDATE About (image ke saath)
router.put('/:id', uploadAbout.single('image'), aboutController.updateAbout);

// GET ALL
router.get('/', aboutController.getAllAbouts);

// GET BY ID
router.get('/:id', aboutController.getAboutById);

// DELETE
router.delete('/:id', aboutController.deleteAbout);

module.exports = router;
