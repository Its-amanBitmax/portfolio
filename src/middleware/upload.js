const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Helper function to create directory if not exists
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// File filter (sirf images)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed'));
  }
};

// Storage for About
const storageAbout = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads/about/';
    ensureDirectoryExists(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Storage for Service
const storageService = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads/service/';
    ensureDirectoryExists(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Storage for Banner
const storageBanner = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads/banner/';
    ensureDirectoryExists(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadAbout = multer({
  storage: storageAbout,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter,
});

const uploadService = multer({
  storage: storageService,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter,
});

const uploadBanner = multer({
  storage: storageBanner,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter,
});



// Storage for Skills
const storageSkills = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads/skills/';
    ensureDirectoryExists(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadSkills = multer({
  storage: storageSkills,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter,
});



// Storage for Projects
const storageProjects = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "uploads/projects/";
    ensureDirectoryExists(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadProjects = multer({
  storage: storageProjects,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});



module.exports = { uploadAbout, uploadService, uploadBanner, uploadSkills, uploadProjects };
