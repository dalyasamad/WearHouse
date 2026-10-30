// Defines Express API endpoints and connects routes with their middleware and controllers.


const express = require("express");

const authenticate =
  require("../middleware/authMiddleware");

const userController =
  require("../controllers/userController");

const router = express.Router();

router.use(authenticate);

// Registers an API route and its request handlers.
router.get(
  "/me",
  userController.getCurrentUser
);

// Registers an API route and its request handlers.
router.put(
  "/me",
  userController.updateCurrentUser
);

// Registers an API route and its request handlers.
router.delete(
  "/me",
  userController.deleteCurrentUser
);

module.exports = router;