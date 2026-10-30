// Implements business logic between the API controllers and database repositories.


const userRepository =
  require("../repositories/userRepository");
const clothingRepository =
  require("../repositories/clothingRepository");

const {
  deleteUploadedFile,
} = require("../utils/fileUtils");

// Retrieves the authenticated user profile.
async function getCurrentUser(userId) {
  const user =
    await userRepository.findById(userId);

  if (!user) {
    const error = new Error("User not found.");
    error.status = 404;
    throw error;
  }

  return user;
}

// Updates the authenticated user profile.
async function updateCurrentUser(userId, data) {
  if (
    !data.first_name ||
    !data.last_name ||
    !data.email
  ) {
    const error = new Error(
      "First name, last name, and email are required."
    );

    error.status = 400;
    throw error;
  }

  const firstName =
    String(data.first_name).trim();

  const lastName =
    String(data.last_name).trim();

  const email =
    String(data.email)
      .trim()
      .toLowerCase();

  if (!firstName || !lastName) {
    const error = new Error(
      "First name and last name cannot be empty."
    );

    error.status = 400;
    throw error;
  }

  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    const error = new Error(
      "Please enter a valid email address."
    );

    error.status = 400;
    throw error;
  }

  const existingUser =
    await userRepository.findByEmail(email);

  if (
    existingUser &&
    existingUser.user_id !== userId
  ) {
    const error = new Error(
      "That email is already in use."
    );

    error.status = 409;
    throw error;
  }

  return userRepository.updateUser(
    userId,
    {
      ...data,
      first_name: firstName,
      last_name: lastName,
      email,
    }
  );
}

// Deletes the authenticated user account and its associated data.
async function deleteCurrentUser(userId) {
  // Get the user's clothing images before
  // deleting their database records.
  const clothingItems =
    await clothingRepository.findAllByUser(
      userId
    );

  const deleted =
    await userRepository.deleteUser(userId);

  if (!deleted) {
    const error = new Error(
      "User not found."
    );

    error.status = 404;
    throw error;
  }

  // Database deletion succeeded, so remove
  // the user's uploaded files from disk.
  await Promise.all(
    clothingItems
      .filter((item) => item.image_url)
      .map((item) =>
        deleteUploadedFile(item.image_url)
      )
  );

  return deleted;
}
module.exports = {
  getCurrentUser,
  updateCurrentUser,
  deleteCurrentUser,
};