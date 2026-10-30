// Handles HTTP requests, delegates business operations to services, and sends API responses.



const outfitService =
  require("../services/outfitService");

const {
  validateOutfit,
} = require("../validators/outfitValidator");

// Retrieves all outfits belonging to the authenticated user.
// Retrieves all records associated with the current user.
async function getAll(req, res) {
  try {
    // Get the user's saved outfits from the outfit service.
    const outfits =
      await outfitService.getAll(
        req.user.user_id
      );

    // Return the list of outfits.
    return res.status(200).json(outfits);
  } catch (error) {
    // Log the error and return a server error response.
    console.error(error);

    return res.status(500).json({
      message: "Unable to load outfits.",
    });
  }
}

// Retrieves a specific outfit using its ID.
// The user's ID is provided to ensure the outfit belongs to them.
// Retrieves one record by its identifier and user ownership.
async function getById(req, res) {
  try {
    // Fetch the requested outfit from the service.
    const outfit =
      await outfitService.getById(
        req.params.id,
        req.user.user_id
      );

    // Return the requested outfit.
    return res.status(200).json(outfit);
  } catch (error) {
    // Log the error and return an appropriate error response.
    console.error(error);

    return res
      .status(error.status || 500)
      .json({
        message:
          error.message ||
          "Unable to load outfit.",
      });
  }
}

// Handles the creation of a new outfit.
// Validates the provided information before saving the outfit.
// Creates a new record using the supplied information.
async function create(req, res) {
  try {
    // Validate the outfit information provided by the user.
    const validationError =
      validateOutfit(req.body);

    // Return a bad request response if validation fails.
    if (validationError) {
      return res.status(400).json({
        message: validationError,
      });
    }

    // Create a new outfit for the authenticated user.
    const outfit =
      await outfitService.create(
        req.user.user_id,
        req.body
      );

    // Return the newly created outfit.
    return res.status(201).json(outfit);
  } catch (error) {
    // Log the error and return an appropriate error response.
    console.error(error);

    return res
      .status(error.status || 500)
      .json({
        message:
          error.message ||
          "Unable to create outfit.",
      });
  }
}

// Handles deletion of an outfit from the user's saved outfits.
// Removes the specified record.
async function remove(req, res) {
  try {
    // Delete the specified outfit belonging to the user.
    await outfitService.remove(
      req.params.id,
      req.user.user_id
    );

    // Confirm that the outfit was deleted.
    return res.status(200).json({
      message: "Outfit deleted.",
    });
  } catch (error) {
    // Log the error and return an appropriate error response.
    console.error(error);

    return res
      .status(error.status || 500)
      .json({
        message:
          error.message ||
          "Unable to delete outfit.",
      });
  }
}
// Handles adding or removing an outfit from the user's favorites.
// Switches an outfit between favorited and unfavorited.
async function toggleFavorite(req, res) {
  try {
    // Toggle the favorite status of the specified outfit.
    const outfit =
      await outfitService.toggleFavorite(
        req.params.id,
        req.user.user_id
      );

    // Return the outfit with its updated favorite status.
    return res.status(200).json(outfit);
  } catch (error) {
    // Log the error and return an appropriate error response.
    console.error(error);

    return res
      .status(error.status || 500)
      .json({
        message:
          error.message ||
          "Unable to update favorite.",
      });
  }
}

// Handles marking an outfit as worn.
// Records the selected outfit in the user's wear history.
// Adds an outfit wear entry to the history.
async function markAsWorn(req, res) {
  try {
    // Create a wear history record for the specified outfit.
    const history =
      await outfitService.markAsWorn(
        req.params.id,
        req.user.user_id
      );

    // Return the newly created wear history record.
    return res.status(201).json(history);
  } catch (error) {
    // Log the error and return an appropriate error response.
    console.error(error);

    return res
      .status(error.status || 500)
      .json({
        message:
          error.message ||
          "Unable to mark outfit as worn.",
      });
  }
}
// Handles updates to an existing outfit.
// Validates the updated information before passing it to the service.
// Updates an existing record using the supplied information.
async function update(req, res) {
  try {
    // Validate the updated outfit information.
    const validationError =
      validateOutfit(req.body);

    // Return a bad request response if validation fails.
    if (validationError) {
      return res.status(400).json({
        message: validationError,
      });
    }

    // Update the specified outfit for the authenticated user.
    const outfit =
      await outfitService.update(
        req.params.id,
        req.user.user_id,
        req.body
      );

    // Return the updated outfit.
    return res.status(200).json(outfit);
  } catch (error) {
    // Log the error and return an appropriate error response.
    console.error(error);

    return res
      .status(error.status || 500)
      .json({
        message:
          error.message ||
          "Unable to update outfit.",
      });
  }
}

// Export the controller functions for use in outfit routes.
module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  toggleFavorite,
  markAsWorn,
};
