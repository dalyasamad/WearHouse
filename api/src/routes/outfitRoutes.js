// Defines Express API endpoints and connects routes with their middleware and controllers.


const express = require("express");

const authenticate =
  require("../middleware/authMiddleware");

const outfitController =
  require("../controllers/outfitController");

const router = express.Router();

router.use(authenticate);

// Registers an API route and its request handlers.
router.get("/", outfitController.getAll);

// Registers an API route and its request handlers.
router.post("/", outfitController.create);
// Registers an API route and its request handlers.
router.post("/:id/favorite",outfitController.toggleFavorite);
// Registers an API route and its request handlers.
router.post("/:id/wear",outfitController.markAsWorn);
// Registers an API route and its request handlers.
router.put("/:id",outfitController.update);
// Registers an API route and its request handlers.
router.get("/:id", outfitController.getById);
// Registers an API route and its request handlers.
router.delete("/:id", outfitController.remove);

module.exports = router;