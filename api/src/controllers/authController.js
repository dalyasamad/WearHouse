// Handles HTTP requests, delegates business operations to services, and sends API responses.



const authService =
  require("../services/authService");

const {
  validateRegister,
  validateLogin,
} = require("../validators/authValidator");

// Handles user registration requests.
// Validates the input data before calling the authentication service
// to create a new user account.
// Validates and processes a new user registration.
async function register(req, res) {
  try {
    // Validate the registration data provided by the user.
    const validationError =
      validateRegister(req.body);

    // Return a bad request response if validation fails.
    if (validationError) {
      return res.status(400).json({
        message: validationError,
      });
    }

    // Register the user through the authentication service.
    const user =
      await authService.register(req.body);

    // Return the newly created user with a success message.
    return res.status(201).json({
      message: "Account created successfully.",
      user,
    });
  } catch (error) {
    // Log the error and return an appropriate error response.
    console.error(error);

    return res
      .status(error.status || 500)
      .json({
        message:
          error.message ||
          "Registration failed.",
      });
  }
}

// Handles user login requests.
// Validates the login credentials and passes them to the
// authentication service for verification.
// Processes sign-in credentials and returns the authentication result.
async function login(req, res) {
  try {
    // Validate the login data provided by the user.
    const validationError =
      validateLogin(req.body);

    // Return a bad request response if validation fails.
    if (validationError) {
      return res.status(400).json({
        message: validationError,
      });
    }

    // Authenticate the user through the authentication service.
    const result =
      await authService.login(req.body);

    // Return the authentication result.
    return res.status(200).json(result);
  } catch (error) {
    // Log the error and return an appropriate error response.
    console.error(error);

    return res
      .status(error.status || 500)
      .json({
        message:
          error.message ||
          "Login failed.",
      });
  }
}

// Handles user logout requests.
// Returns a success response indicating that the user has logged out.
// Responds to a user logout request.
async function logout(req, res) {
  return res.status(200).json({
    message: "Logged out successfully.",
  });
}

// Export the controller functions for use in authentication routes.
module.exports = {
  register,
  login,
  logout,
};
