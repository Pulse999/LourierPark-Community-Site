
import "dotenv/config";

import express from "express";
import cors from "cors";
import helmet from "helmet";

import { prisma } from "./lib/prisma.js";
import businessRoutes from "./routes/business.routes.js";
import businessCategoryRoutes from "./routes/businessCategory.routes.js";

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// -----------------------------------------------------
// MIDDLEWARE
// -----------------------------------------------------

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));

// -----------------------------------------------------
// API ROUTES
// -----------------------------------------------------

app.use("/api/businesses", businessRoutes);
app.use("/api/business-categories", businessCategoryRoutes);

// -----------------------------------------------------
// API HEALTH CHECK
// -----------------------------------------------------

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "LourierPark API is running.",
  });
});

// -----------------------------------------------------
// DATABASE HEALTH CHECK
// -----------------------------------------------------

app.get("/api/health/database", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      status: "ok",
      message: "Database connection successful.",
      database: "connected",
    });
  } catch (error) {
    console.error("Database health check failed:", error);

    res.status(503).json({
      status: "error",
      message: "Database connection unavailable.",
      database: "disconnected",
    });
  }
});

// -----------------------------------------------------
// SERVER
// -----------------------------------------------------

const server = app.listen(PORT, () => {
  console.log(`LourierPark API running on port ${PORT}`);
});

// -----------------------------------------------------
// GRACEFUL SHUTDOWN
// -----------------------------------------------------

const shutdown = async (signal: string) => {
  console.log(`${signal} received. Shutting down...`);

  server.close(async () => {
    await prisma.$disconnect();
    console.log("Database connection closed.");
    process.exit(0);
  });
};

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
