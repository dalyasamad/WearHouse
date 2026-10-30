const historyService =
  require("../services/historyService");

const asyncHandler =
  require("../middleware/asyncHandler");

const getAll =
  asyncHandler(
    async (req, res) => {
      const history =
        await historyService.getAll(
          req.user.user_id
        );

      return res
        .status(200)
        .json(history);
    }
  );

module.exports = {
  getAll,
};