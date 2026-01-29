// src/routes/bannerRoutes.js
const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');
const upload = require('../middleware/upload'); // existing middleware

// CREATE Banner
router.post('/create', upload.single('image'), bannerController.createBanner);

// GET ALL Banners
router.get('/', bannerController.getAllBanners);

// GET Banner BY ID
router.get('/:id', bannerController.getBannerById);

// UPDATE Banner
router.put('/:id', upload.single('image'), bannerController.updateBanner);

// DELETE Banner
router.delete('/:id', bannerController.deleteBanner);

module.exports = router;
