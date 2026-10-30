const fs = require("fs");
const multer = require("multer");
const path = require("path");

const allowedMimeTypes = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const uploadsDirectory = path.join(
  __dirname,
  "../../uploads"
);

// Make sure the uploads folder exists.
fs.mkdirSync(
  uploadsDirectory,
  {
    recursive: true,
  }
);

const storage = multer.diskStorage({
  destination: (
    req,
    file,
    cb
  ) => {
    cb(
      null,
      uploadsDirectory
    );
  },

  filename: (
    req,
    file,
    cb
  ) => {
    const extension =
      allowedMimeTypes[
        file.mimetype
      ];

    const uniqueName =
      `${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}${extension}`;

    cb(
      null,
      uniqueName
    );
  },
});

function fileFilter(
  req,
  file,
  cb
) {
  if (
    !allowedMimeTypes[
      file.mimetype
    ]
  ) {
    return cb(
      new Error(
        "Only JPG, PNG, and WEBP images are allowed."
      )
    );
  }

  cb(
    null,
    true
  );
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize:
      5 * 1024 * 1024,
  },
});

module.exports = upload;