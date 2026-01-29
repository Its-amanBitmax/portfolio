# TODO: Implement Separate Upload Folders for Images

- [x] Modify src/middleware/upload.js to export separate upload middlewares: uploadAbout, uploadService, uploadBanner with respective destinations.
- [x] Update src/routes/aboutRoutes.js to use uploadAbout.single('image').
- [ ] Update src/routes/serviceRoutes.js to use uploadService.single('image').
- [ ] Update src/routes/bannerRoutes.js to use uploadBanner.single('image').
- [ ] Test image uploads to verify correct folder placement.
