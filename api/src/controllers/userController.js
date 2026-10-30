const userService =
  require("../services/userService");

const asyncHandler =
  require("../middleware/asyncHandler");

const getCurrentUser =
  asyncHandler(
    async (req, res) => {
      const user =
        await userService.getCurrentUser(
          req.user.user_id
        );

      return res
        .status(200)
        .json(user);
    }
  );

const updateCurrentUser =
  asyncHandler(
    async (req, res) => {
      const user =
        await userService.updateCurrentUser(
          req.user.user_id,
          req.body
        );

      return res
        .status(200)
        .json(user);
    }
  );

const deleteCurrentUser =
  asyncHandler(
    async (req, res) => {
      await userService.deleteCurrentUser(
        req.user.user_id
      );

      return res
        .status(200)
        .json({
          message:
            "Account deleted successfully.",
        });
    }
  );

module.exports = {
  getCurrentUser,
  updateCurrentUser,
  deleteCurrentUser,
};