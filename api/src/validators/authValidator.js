// Checks incoming data and returns validation messages for invalid input.

// Checks required registration fields and their validity.
function validateRegister(data) {
  const {
    first_name,
    last_name,
    email,
    password,
  } = data;

  if (
    !first_name ||
    !last_name ||
    !email ||
    !password
  ) {
    return "All fields are required.";
  }

  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email.trim())) {
    return "Please enter a valid email address.";
  }

  if (typeof password !== "string") {
    return "Password is invalid.";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters.";
  }

  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter.";
  }

  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter.";
  }

  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number.";
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return "Password must contain at least one special character.";
  }

  return null;
}

// Checks submitted login credentials for valid input.
function validateLogin(data) {
  const { email, password } = data;

  if (!email || !password) {
    return "Email and password are required.";
  }

  return null;
}

module.exports = {
  validateRegister,
  validateLogin,
};