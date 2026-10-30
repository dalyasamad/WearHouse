// Configures the Express application, its middleware, and mounted API routes.


const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const clothingRoutes = require("./routes/clothingRoutes");
const outfitRoutes =require("./routes/outfitRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const historyRoutes =require("./routes/historyRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/clothing", clothingRoutes);
app.use("/outfits", outfitRoutes);
app.use("/schedules", scheduleRoutes);
app.use("/wear-history", historyRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "WearHouse API Running",
  });
});

module.exports = app;