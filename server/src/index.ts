import "dotenv/config";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import { prisma } from "./lib/prisma.js";
import businessRoutes from "./routes/business.routes.js";
import businessCategoryRoutes from "./routes/businessCategory.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/businesses", businessRoutes);
app.use("/api/business-categories", businessCategoryRoutes);

// API health check
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "LourierPark API is running.",
  });
});

// Database health check
app.get("/api/health/database", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
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

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    status: "error",
    message: "API endpoint not found.",
  });
});

// Central error handler
app.use(
  (
    error: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("API error:", error);

    res.status(500).json({
      status: "error",
      message: "An unexpected server error occurred.",
    });
  }
);

// Server
const server = app.listen(PORT, () => {
  console.log(`LourierPark API running on port ${PORT}`);
});

// Graceful shutdown
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