const fs = require("fs/promises");
const path = require("path");

// Deletes only files that belong to the local /uploads directory.
async function deleteUploadedFile(imageUrl) {
  if (
    !imageUrl ||
    typeof imageUrl !== "string"
  ) {
    return false;
  }

  let pathname = imageUrl;

  // Supports any old full URLs that may still exist.
  if (
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://")
  ) {
    try {
      pathname = new URL(imageUrl).pathname;
    } catch {
      return false;
    }
  }

  // Never allow this utility to delete files outside /uploads.
  if (!pathname.startsWith("/uploads/")) {
    return false;
  }

  const filename = path.basename(pathname);

  if (!filename) {
    return false;
  }

  const filePath = path.join(
    __dirname,
    "../../uploads",
    filename
  );

  try {
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    // The file may already have been deleted manually.
    if (error.code !== "ENOENT") {
      console.warn(
        `Unable to delete uploaded file: ${filename}`,
        error.message
      );
    }

    return false;
  }
}

module.exports = {
  deleteUploadedFile,
};