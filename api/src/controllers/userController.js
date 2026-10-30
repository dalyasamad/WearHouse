// Handles HTTP requests, delegates business operations to services, and sends API responses.



const userService =
  require("../services/userService");

// Retrieves the profile information of the authenticated user.
// Uses the user's ID to fetch their account details from the user service.
// Retrieves the authenticated user profile.
async function getCurrentUser(req, res) {
  try {
    // Get the authenticated user's profile information.
    const user =
      await userService.getCurrentUser(
        req.user.user_id
      );

    // Return the user's profile information.
    return res.status(200).json(user);
  } catch (error) {
    // Log the error and return an appropriate error response.
    console.error(error);

    return res
      .status(error.status || 500)
      .json({
        message:
          error.message ||
          "Unable to retrieve user.",
      });
  }
}

// Handles updates to the authenticated user's profile.
// Passes the updated information to the user service.
// Updates the authenticated user profile.
async function updateCurrentUser(req, res) {
  try {
    // Update the user's profile using their ID and provided data.
    const user =
      await userService.updateCurrentUser(
        req.user.user_id,
        req.body
      );

    // Return the updated user information.
    return res.status(200).json(user);
  } catch (error) {
    // Log the error and return an appropriate error response.
    console.error(error);

    return res
      .status(error.status || 500)
      .json({
        message:
          error.message ||
          "Unable to update profile.",
      });
  }
}

// Handles deletion of the authenticated user's account.
// Uses the user's ID to identify the account to be deleted.
// Deletes the authenticated user account and its associated data.
async function deleteCurrentUser(req, res) {
  try {
    // Delete the authenticated user's account.
    await userService.deleteCurrentUser(
      req.user.user_id
    );

    // Confirm that the account was deleted successfully.
    return res.status(200).json({
      message: "Account deleted successfully.",
    });
  } catch (error) {
    // Log the error and return an appropriate error response.
    console.error(error);

    return res
      .status(error.status || 500)
      .json({
        message:
          error.message ||
          "Unable to delete account.",
      });
  }
}

// Export the controller functions for use in user routes.
module.exports = {
  getCurrentUser,
  updateCurrentUser,
  deleteCurrentUser,
};
