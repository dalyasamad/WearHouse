const authService =
  require("../services/authService");

const asyncHandler =
  require("../middleware/asyncHandler");

const {
  validateRegister,
  validateLogin,
} = require("../validators/authValidator");

const register =
  asyncHandler(
    async (req, res) => {
      const validationError =
        validateRegister(
          req.body
        );

      if (validationError) {
        return res
          .status(400)
          .json({
            message:
              validationError,
          });
      }

      const user =
        await authService.register(
          req.body
        );

      return res
        .status(201)
        .json({
          message:
            "Account created successfully.",
          user,
        });
    }
  );

const login =
  asyncHandler(
    async (req, res) => {
      const validationError =
        validateLogin(
          req.body
        );

      if (validationError) {
        return res
          .status(400)
          .json({
            message:
              validationError,
          });
      }

      const result =
        await authService.login(
          req.body
        );

      return res
        .status(200)
        .json(result);
    }
  );

async function logout(
  req,
  res
) {
  return res
    .status(200)
    .json({
      message:
        "Logged out successfully.",
    });
}

module.exports = {
  register,
  login,
  logout,
};