// Handles HTTP requests, delegates business operations to services, and sends API responses.



const scheduleService =
  require("../services/scheduleService");
  const {
  validateSchedule,
} = require("../validators/scheduleValidator");



// Retrieves all scheduled outfits belonging to the authenticated user.
// Retrieves all records associated with the current user.
async function getAll(req, res) {
  try {
    // Get the user's scheduled outfits from the schedule service.
    const schedules =
      await scheduleService.getAll(
        req.user.user_id
      );

    // Return the list of scheduled outfits.
    return res.status(200).json(schedules);
  } catch (error) {
    // Log the error and return a server error response.
    console.error(error);

    return res.status(500).json({
      message: "Unable to load schedules.",
    });
  }
}

// Handles the creation of a new outfit schedule.
// Validates the provided information before saving the schedule.
// Creates a new record using the supplied information.
async function create(req, res) {
  try {
    // Validate the outfit ID and scheduled date.
    const validationError =
      validateSchedule(req.body);

    // Return a bad request response if validation fails.
    if (validationError) {
      return res.status(400).json({
        message: validationError,
      });
    }

    // Save the outfit schedule for the authenticated user.
    const schedule =
      await scheduleService.save(
        req.user.user_id,
        req.body
      );

    // Return the newly created schedule.
    return res.status(201).json(schedule);
  } catch (error) {
    // Log the error and return an appropriate error response.
    console.error(error);

    return res
      .status(error.status || 500)
      .json({
        message:
          error.message ||
          "Unable to schedule outfit.",
      });
  }
}

// Handles updates to an existing outfit schedule.
// Validates the updated information before passing it to the service.
// Updates an existing record using the supplied information.
async function update(req, res) {
  try {
    // Validate the updated schedule information.
    const validationError =
      validateSchedule(req.body);

    // Return a bad request response if validation fails.
    if (validationError) {
      return res.status(400).json({
        message: validationError,
      });
    }

    // Update the specified schedule belonging to the user.
    const schedule =
      await scheduleService.update(
        req.params.id,
        req.user.user_id,
        req.body
      );

    // Return the updated schedule.
    return res.status(200).json(schedule);
  } catch (error) {
    // Log the error and return an appropriate error response.
    console.error(error);

    return res
      .status(error.status || 500)
      .json({
        message:
          error.message ||
          "Unable to update schedule.",
      });
  }
}

// Handles the removal of a scheduled outfit.
// Removes the specified record.
async function remove(req, res) {
  try {
    // Remove the specified schedule belonging to the user.
    await scheduleService.remove(
      req.params.id,
      req.user.user_id
    );

    // Confirm that the schedule was removed.
    return res.status(200).json({
      message: "Schedule removed.",
    });
  } catch (error) {
    // Log the error and return an appropriate error response.
    console.error(error);

    return res
      .status(error.status || 500)
      .json({
        message:
          error.message ||
          "Unable to remove schedule.",
      });
  }
}

// Export the controller functions for use in schedule routes.
module.exports = {
  getAll,
  create,
  update,
  remove,
};
