const clothingService =
  require("../services/clothingService");

const asyncHandler =
  require("../middleware/asyncHandler");

const {
  validateClothing,
} = require("../validators/clothingValidator");

const getAll =
  asyncHandler(
    async (req, res) => {
      const items =
        await clothingService.getAll(
          req.user.user_id
        );

      return res
        .status(200)
        .json(items);
    }
  );

const getById =
  asyncHandler(
    async (req, res) => {
      const item =
        await clothingService.getById(
          req.params.id,
          req.user.user_id
        );

      return res
        .status(200)
        .json(item);
    }
  );

const create =
  asyncHandler(
    async (req, res) => {
      const validationError =
        validateClothing(
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

      const item =
        await clothingService.create(
          req.user.user_id,
          req.body
        );

      return res
        .status(201)
        .json(item);
    }
  );

const update =
  asyncHandler(
    async (req, res) => {
      const validationError =
        validateClothing(
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

      const item =
        await clothingService.update(
          req.params.id,
          req.user.user_id,
          req.body
        );

      return res
        .status(200)
        .json(item);
    }
  );

const remove =
  asyncHandler(
    async (req, res) => {
      await clothingService.remove(
        req.params.id,
        req.user.user_id
      );

      return res
        .status(200)
        .json({
          message:
            "Clothing item deleted.",
        });
    }
  );

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};