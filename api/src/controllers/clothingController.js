// Handles HTTP requests, delegates business operations to services, and sends API responses.



const clothingService =
  require("../services/clothingService");

const {
  validateClothing,
} = require("../validators/clothingValidator");

// Retrieves all clothing items belonging to the authenticated user.
// Retrieves all records associated with the current user.
async function getAll(req, res) {
  try {
    // Get the user's clothing items from the clothing service.
    const items =
      await clothingService.getAll(
        req.user.user_id
      );

    // Return the list of clothing items.
    return res.status(200).json(items);
  } catch (error) {
    // Log the error and return a server error response.
    console.error(error);

    return res.status(500).json({
      message: "Unable to load clothing items.",
    });
  }
}

// Retrieves a specific clothing item using its ID.
// The user's ID is also provided to ensure the item belongs to them.
// Retrieves one record by its identifier and user ownership.
async function getById(req, res) {
  try {
    // Fetch the requested clothing item from the service.
    const item =
      await clothingService.getById(
        req.params.id,
        req.user.user_id
      );

    // Return the requested clothing item.
    return res.status(200).json(item);
  } catch (error) {
    // Log the error and return an appropriate error response.
    console.error(error);

    return res
      .status(error.status || 500)
      .json({
        message:
          error.message ||
          "Unable to load clothing item.",
      });
  }
}

// Handles the creation of a new clothing item.
// Validates the input before saving the item to the user's wardrobe.
// Creates a new record using the supplied information.
async function create(req, res) {
  try {
    // Validate the clothing information provided by the user.
    const validationError =
      validateClothing(req.body);

    // Return a bad request response if validation fails.
    if (validationError) {
      return res.status(400).json({
        message: validationError,
      });
    }

    // Create a new clothing item for the authenticated user.
    const item =
      await clothingService.create(
        req.user.user_id,
        req.body
      );

    // Return the newly created clothing item.
    return res.status(201).json(item);
  } catch (error) {
    // Log the error and return a server error response.
    console.error(error);

    return res.status(500).json({
      message: "Unable to create clothing item.",
    });
  }
}

// Handles updates to an existing clothing item.
// Validates the updated information before passing it to the service.
// Updates an existing record using the supplied information.
async function update(req, res) {
  try {
    // Validate the updated clothing information.
    const validationError =
      validateClothing(req.body);

    // Return a bad request response if validation fails.
    if (validationError) {
      return res.status(400).json({
        message: validationError,
      });
    }

    // Update the specified clothing item for the authenticated user.
    const item =
      await clothingService.update(
        req.params.id,
        req.user.user_id,
        req.body
      );

    // Return the updated clothing item.
    return res.status(200).json(item);
  } catch (error) {
    // Log the error and return an appropriate error response.
    console.error(error);

    return res
      .status(error.status || 500)
      .json({
        message:
          error.message ||
          "Unable to update clothing item.",
      });
  }
}

// Handles deletion of a clothing item from the user's wardrobe.
// Removes the specified record.
async function remove(req, res) {
  try {
    // Delete the specified clothing item belonging to the user.
    await clothingService.remove(
      req.params.id,
      req.user.user_id
    );

    // Confirm that the clothing item was deleted.
    return res.status(200).json({
      message: "Clothing item deleted.",
    });
  } catch (error) {
    // Log the error and return an appropriate error response.
    console.error(error);

    return res
      .status(error.status || 500)
      .json({
        message:
          error.message ||
          "Unable to delete clothing item.",
      });
  }
}

// Export the controller functions for use in clothing routes.
module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
