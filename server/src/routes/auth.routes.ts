
import { Router } from "express";
import rateLimit from "express-rate-limit";

import {
  login,
  logout,
  getCurrentAdmin,
} from "../controllers/auth.controller.js";

import { authenticateAdmin } from "../middleware/auth.middleware.js";

const router = Router();

// Strict rate limit for administrator login attempts.
const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    status: "error",
    message: "Too many login attempts. Please try again in 15 minutes.",
  },
});

// General rate limit for authentication endpoints.
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    status: "error",
    message: "Too many requests. Please try again later.",
  },
});

// Administrator authentication routes.
router.post("/login", loginRateLimiter, login);

router.post("/logout", authRateLimiter, logout);

router.get("/me", authRateLimiter, authenticateAdmin, getCurrentAdmin);

export default router;
