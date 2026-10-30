const scheduleService =
  require("../services/scheduleService");

const asyncHandler =
  require("../middleware/asyncHandler");

const {
  validateSchedule,
} = require("../validators/scheduleValidator");

const getAll =
  asyncHandler(
    async (req, res) => {
      const schedules =
        await scheduleService.getAll(
          req.user.user_id
        );

      return res
        .status(200)
        .json(schedules);
    }
  );

const create =
  asyncHandler(
    async (req, res) => {
      const validationError =
        validateSchedule(
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

      const schedule =
        await scheduleService.save(
          req.user.user_id,
          req.body
        );

      return res
        .status(201)
        .json(schedule);
    }
  );

const update =
  asyncHandler(
    async (req, res) => {
      const validationError =
        validateSchedule(
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

      const schedule =
        await scheduleService.update(
          req.params.id,
          req.user.user_id,
          req.body
        );

      return res
        .status(200)
        .json(schedule);
    }
  );

const remove =
  asyncHandler(
    async (req, res) => {
      await scheduleService.remove(
        req.params.id,
        req.user.user_id
      );

      return res
        .status(200)
        .json({
          message:
            "Schedule removed.",
        });
    }
  );

module.exports = {
  getAll,
  create,
  update,
  remove,
};