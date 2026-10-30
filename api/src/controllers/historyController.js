// Handles HTTP requests, delegates business operations to services, and sends API responses.



const historyService =
  require("../services/historyService");

// Retrieves the wear history of the authenticated user.
// Uses the user's ID to fetch their recorded clothing wear history.
// Retrieves all records associated with the current user.
async function getAll(req, res) {
  try {
    // Get the user's wear history from the history service.
    const history =
      await historyService.getAll(
        req.user.user_id
      );

    // Return the wear history records.
    return res.status(200).json(history);
  } catch (error) {
    // Log the error and return a server error response.
    console.error(error);

    return res.status(500).json({
      message: "Unable to load wear history.",
    });
  }
}

// Export the controller function for use in history routes.
module.exports = {
  getAll,
};
