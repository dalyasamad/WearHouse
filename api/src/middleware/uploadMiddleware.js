// Configures image uploads, allowed file types, generated names, and size limits.



const multer = require("multer");
const path = require("path");

// Configure disk storage for uploaded images.
// Defines where uploaded files are stored and how they are named.
const storage = multer.diskStorage({
  // Specify the directory where uploaded files will be saved.
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  // Generate a unique filename to reduce the chance of duplicate names.
  filename: (req, file, cb) => {
    // Combine the current timestamp with a random number.
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9);

    // Preserve the original file extension when saving the image.
    cb(
      null,
      uniqueName + path.extname(file.originalname)
    );
  },
});

// Filters uploaded files based on their MIME type.
// Only JPEG, PNG, and WEBP images are accepted.
// Accepts supported image MIME types and rejects unsupported uploads.
function fileFilter(req, file, cb) {
  // Define the allowed image formats.
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  // Reject files that do not match the allowed MIME types.
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(
      new Error("Only JPG, PNG, and WEBP images are allowed.")
    );
  }

  // Accept the file if its MIME type is allowed.
  cb(null, true);
}

// Configure Multer with the defined storage, file filter,
// and a maximum file size of 5 MB.
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// Export the upload middleware for handling image uploads.
module.exports = upload;
