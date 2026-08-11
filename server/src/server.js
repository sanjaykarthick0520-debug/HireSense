import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import resumeRoutes from "./routes/resumeRoutes.js";

dotenv.config();

const app = express();

// =========================================================
// MIDDLEWARE
// =========================================================

app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// =========================================================
// HEALTH CHECK
// =========================================================

app.get(["/", "/api"], (req, res) => {
  res.json({
    success: true,
    message: "Welcome to HireSense API 🚀",
  });
});

// =========================================================
// RESUME API ROUTES
// =========================================================

app.use("/api/resume", resumeRoutes);

// =========================================================
// 404 HANDLER
// =========================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// =========================================================
// ERROR HANDLER
// =========================================================

app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// =========================================================
// LOCAL DEVELOPMENT
// =========================================================

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(
      `🚀 HireSense API running on http://localhost:${PORT}`
    );
  });
}

// =========================================================
// VERCEL
// =========================================================

export default app;