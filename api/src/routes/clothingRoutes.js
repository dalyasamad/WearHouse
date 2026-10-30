// Defines Express API endpoints and connects routes with their middleware and controllers.


const express = require("express");
const upload =
    require("../middleware/uploadMiddleware");

const authenticate =
    require("../middleware/authMiddleware");

const clothingController =
    require("../controllers/clothingController");

const router = express.Router();

router.use(authenticate);

// Registers an API route and its request handlers.
router.get("/", clothingController.getAll);

// Registers an API route and its request handlers.
router.post("/", clothingController.create);
// Registers an API route and its request handlers.
router.post( "/upload", upload.single("image"),(req, res) => {
        if (!req.file) {
            return res.status(400).json({
                message: "No image uploaded.",
            });
        }

        const imageUrl =`http://localhost:3000/uploads/${req.file.filename}`;

        return res.status(201).json({image_url: imageUrl,});
    }
);

// Registers an API route and its request handlers.
router.get("/:id", clothingController.getById);

// Registers an API route and its request handlers.
router.put("/:id", clothingController.update);

// Registers an API route and its request handlers.
router.delete("/:id", clothingController.remove);

module.exports = router;