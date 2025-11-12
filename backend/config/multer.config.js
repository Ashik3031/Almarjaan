// config/multer.config.js
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary.config");

// Use a single storage with resource_type: "auto" so Cloudinary accepts images & videos
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith("video/");
    return {
      // Separate folders for cleanliness
      folder: isVideo ? "products/videos" : "products/images",
      resource_type: "auto", // <-- key: allows image/* and video/*
      // Permit common formats (Cloudinary will validate)
      allowed_formats: isVideo
        ? ["mp4", "webm", "mov", "mkv"]
        : ["jpg", "jpeg", "png", "webp"],
      // Optional: nicer public IDs
      public_id: `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, "")}`,
    };
  },
});

// Raise file size limit to accommodate video (e.g., 200MB)
const upload = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok =
      file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/");
    if (!ok) return cb(new Error("Only image and video files are allowed"));
    cb(null, true);
  },
});

module.exports = upload;
