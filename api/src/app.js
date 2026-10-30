// Configures the Express application, its middleware, and mounted API routes.

const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const express = require("express");
const cors = require("cors");
const path = require("path");
const errorHandler =require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const clothingRoutes = require("./routes/clothingRoutes");
const outfitRoutes =require("./routes/outfitRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const historyRoutes =require("./routes/historyRoutes");


const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

app.use(
  cors({
    origin:
      process.env.CLIENT_ORIGIN ||
      "http://localhost:5173",
    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message:
      "Too many requests. Please try again later.",
  },
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message:
      "Too many authentication attempts. Please try again later.",
  },
});
app.use(apiLimiter);
app.use(express.json());
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);

// Routes
app.use("/auth", authLimiter, authRoutes);
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
app.use(errorHandler);

module.exports = app;