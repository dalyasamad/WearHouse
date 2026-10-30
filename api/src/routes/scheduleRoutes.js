// Defines Express API endpoints and connects routes with their middleware and controllers.


const express = require("express");

const authenticate =
  require("../middleware/authMiddleware");

const scheduleController =
  require("../controllers/scheduleController");

const router = express.Router();

router.use(authenticate);

// Registers an API route and its request handlers.
router.get("/", scheduleController.getAll);
// Registers an API route and its request handlers.
router.post("/", scheduleController.create);
// Registers an API route and its request handlers.
router.put("/:id", scheduleController.update);
// Registers an API route and its request handlers.
router.delete("/:id", scheduleController.remove);

module.exports = router;