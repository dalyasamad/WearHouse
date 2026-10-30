// Provides reusable Express request-processing middleware.



const jwt = require("jsonwebtoken");

// Middleware that verifies whether a user is authenticated.
// Checks for a valid JWT token before allowing access to protected routes.
// Verifies the bearer JWT and attaches decoded user data to the request.
function authenticate(req, res, next) {
  // Retrieve the authorization header from the request.
  const authorization =
    req.headers.authorization;

  // Check whether the authorization header contains a Bearer token.
  if (
    !authorization ||
    !authorization.startsWith("Bearer ")
  ) {
    // Reject requests that do not provide the required authentication token.
    return res.status(401).json({
      message: "Authentication required.",
    });
  }

  // Extract the JWT token from the authorization header.
  const token =
    authorization.split(" ")[1];

  try {
    // Verify the token using the secret key stored in environment variables.
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Attach the decoded user information to the request object.
    req.user = decoded;

    // Allow the request to continue to the next middleware or route handler.
    next();
  } catch (error) {
    // Reject requests containing an invalid or expired token.
    return res.status(401).json({
      message: "Invalid or expired token.",
    });
  }
}

// Export the authentication middleware for use in protected routes.
module.exports = authenticate;
