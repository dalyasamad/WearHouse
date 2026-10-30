// Implements business logic between the API controllers and database repositories.


const userRepository =
  require("../repositories/userRepository");

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

  const existingUser =
    await userRepository.findByEmail(data.email);

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
    data
  );
}

// Deletes the authenticated user account and its associated data.
async function deleteCurrentUser(userId) {
  const deleted =
    await userRepository.deleteUser(userId);

  if (!deleted) {
    const error = new Error("User not found.");
    error.status = 404;
    throw error;
  }

  return deleted;
}

module.exports = {
  getCurrentUser,
  updateCurrentUser,
  deleteCurrentUser,
};