// Defines Express API endpoints and connects routes with their middleware and controllers.


const express = require("express");

const authController =
  require("../controllers/authController");

const router = express.Router();

// Registers an API route and its request handlers.
router.post(
  "/register",
  authController.register
);

// Registers an API route and its request handlers.
router.post(
  "/login",
  authController.login
);
// Registers an API route and its request handlers.
router.post(
  "/logout",
  authController.logout
);

module.exports = router;