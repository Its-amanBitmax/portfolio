const multer = require("multer");
const path = require("path");
const fs = require("fs");

// -----------------------
// Helper Functions
// -----------------------

// Create folder if it doesn't exist
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Only allow image files
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) cb(null, true);
  else cb(new Error("Only image files are allowed!"));
};

// -----------------------
// Storage Factory
// -----------------------
const createStorage = (folderName) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = `uploads/${folderName}/`;
      ensureDirectoryExists(dir);
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const uniqueName =
        Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        path.extname(file.originalname);
      cb(null, uniqueName);
    },
  });

// -----------------------
// Multer Instances
// -----------------------
const uploadAbout = multer({
  storage: createStorage("about"),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});
const uploadService = multer({
  storage: createStorage("service"),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});
const uploadBanner = multer({
  storage: createStorage("banner"),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});
const uploadSkills = multer({
  storage: createStorage("skills"),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});
const uploadProjects = multer({
  storage: createStorage("projects"),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});
const uploadTestimonials = multer({
  storage: createStorage("testimonials"),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});
const uploadContactInfo = multer({
  storage: createStorage("contactinfo"),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});
const uploadBlog = multer({
  storage: createStorage("blog"),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

// -----------------------
module.exports = {
  uploadAbout,
  uploadService,
  uploadBanner,
  uploadSkills,
  uploadProjects,
  uploadTestimonials,
  uploadContactInfo,
  uploadBlog,
};
