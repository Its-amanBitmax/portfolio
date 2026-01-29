// src/routes/bannerRoutes.js
const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');
const { uploadBanner } = require('../middleware/upload');

// CREATE Banner
router.post('/create', uploadBanner.single('image'), bannerController.createBanner);

// GET ALL Banners
router.get('/', bannerController.getAllBanners);

// GET Banner BY ID
router.get('/:id', bannerController.getBannerById);

// UPDATE Banner
router.put('/:id', uploadBanner.single('image'), bannerController.updateBanner);

// DELETE Banner
router.delete('/:id', bannerController.deleteBanner);

module.exports = router;
