// Implements business logic between the API controllers and database repositories.


const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userRepository =
  require("../repositories/userRepository");

// Validates and processes a new user registration.
async function register({
  first_name,
  last_name,
  email,
  password,
}) {
  const existingUser =
    await userRepository.findByEmail(email);

  if (existingUser) {
    const error = new Error(
      "An account with this email already exists."
    );

    error.status = 409;

    throw error;
  }

  const password_hash =
    await bcrypt.hash(password, 10);

  const user =
    await userRepository.createUser({
      first_name,
      last_name,
      email,
      password_hash,
    });

  return user;
}

// Processes sign-in credentials and returns the authentication result.
async function login({ email, password }) {
  const user =
    await userRepository.findByEmail(email);

  if (!user) {
    const error = new Error(
      "Invalid email or password."
    );

    error.status = 401;

    throw error;
  }

  const passwordMatches =
    await bcrypt.compare(
      password,
      user.password_hash
    );

  if (!passwordMatches) {
    const error = new Error(
      "Invalid email or password."
    );

    error.status = 401;

    throw error;
  }

  const token = jwt.sign(
    {
      user_id: user.user_id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  return {
    token,

    user: {
      user_id: user.user_id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      profile_picture: user.profile_picture,
    },
  };
}

module.exports = {
  register,
  login,
};