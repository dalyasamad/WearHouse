const requiredVariables = [
  "DB_HOST",
  "DB_PORT",
  "DB_NAME",
  "DB_USER",
  "DB_PASSWORD",
  "JWT_SECRET",
];

function validateEnvironment() {
  const missingVariables =
    requiredVariables.filter(
      (name) =>
        !process.env[name] ||
        process.env[name].trim() === ""
    );

  if (missingVariables.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVariables.join(
        ", "
      )}`
    );
  }
}

module.exports = {
  validateEnvironment,
};