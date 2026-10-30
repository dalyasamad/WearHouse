const outfitService =
  require("../services/outfitService");

const asyncHandler =
  require("../middleware/asyncHandler");

const {
  validateOutfit,
} = require("../validators/outfitValidator");

const getAll =
  asyncHandler(
    async (req, res) => {
      const outfits =
        await outfitService.getAll(
          req.user.user_id
        );

      return res
        .status(200)
        .json(outfits);
    }
  );

const getById =
  asyncHandler(
    async (req, res) => {
      const outfit =
        await outfitService.getById(
          req.params.id,
          req.user.user_id
        );

      return res
        .status(200)
        .json(outfit);
    }
  );

const create =
  asyncHandler(
    async (req, res) => {
      const validationError =
        validateOutfit(
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

      const outfit =
        await outfitService.create(
          req.user.user_id,
          req.body
        );

      return res
        .status(201)
        .json(outfit);
    }
  );

const update =
  asyncHandler(
    async (req, res) => {
      const validationError =
        validateOutfit(
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

      const outfit =
        await outfitService.update(
          req.params.id,
          req.user.user_id,
          req.body
        );

      return res
        .status(200)
        .json(outfit);
    }
  );

const remove =
  asyncHandler(
    async (req, res) => {
      await outfitService.remove(
        req.params.id,
        req.user.user_id
      );

      return res
        .status(200)
        .json({
          message:
            "Outfit deleted.",
        });
    }
  );

const toggleFavorite =
  asyncHandler(
    async (req, res) => {
      const outfit =
        await outfitService.toggleFavorite(
          req.params.id,
          req.user.user_id
        );

      return res
        .status(200)
        .json(outfit);
    }
  );

const markAsWorn =
  asyncHandler(
    async (req, res) => {
      const history =
        await outfitService.markAsWorn(
          req.params.id,
          req.user.user_id
        );

      return res
        .status(201)
        .json(history);
    }
  );

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  toggleFavorite,
  markAsWorn,
};