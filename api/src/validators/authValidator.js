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

  if (!emailPattern.test(email)) {
    return "Please enter a valid email address.";
  }

  if (password.length < 6) {
    return "Password must be at least 6 characters.";
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