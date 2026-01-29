const express = require('express');
const router = express.Router();
const aboutController = require('../controllers/aboutController');
const upload = require('../middleware/upload');

// CREATE About (image ke saath)
router.post('/create', upload.single('image'), aboutController.createAbout);

// UPDATE About (image ke saath)
router.put('/:id', upload.single('image'), aboutController.updateAbout);

// GET ALL
router.get('/', aboutController.getAllAbouts);

// GET BY ID
router.get('/:id', aboutController.getAboutById);

// DELETE
router.delete('/:id', aboutController.deleteAbout);

module.exports = router;
