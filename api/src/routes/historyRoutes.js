// Defines Express API endpoints and connects routes with their middleware and controllers.


const express = require("express");

const authenticate =
  require("../middleware/authMiddleware");

const historyController =
  require("../controllers/historyController");

const router = express.Router();

router.use(authenticate);

// Registers an API route and its request handlers.
router.get("/", historyController.getAll);

module.exports = router;