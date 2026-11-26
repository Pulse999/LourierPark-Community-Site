
import { Router } from "express";
import rateLimit from "express-rate-limit";

import {
  login,
  logout,
  getCurrentAdmin,
  createAdminInvitation,
  acceptAdminInvitation,
} from "../controllers/auth.controller.js";

import {
  authenticateAdmin,
  requirePermission,
} from "../middleware/auth.middleware.js";

const router = Router();

// -----------------------------------------------------
// RATE LIMITERS
// -----------------------------------------------------

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

// Rate limit for invitation creation.
const invitationRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    status: "error",
    message: "Too many invitations created. Please try again later.",
  },
});

// Rate limit for accepting invitations.
const invitationAcceptanceRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    status: "error",
    message: "Too many invitation attempts. Please try again later.",
  },
});

// -----------------------------------------------------
// AUTHENTICATION ROUTES
// -----------------------------------------------------

router.post("/login", loginRateLimiter, login);

router.post("/logout", authRateLimiter, logout);

router.get(
  "/me",
  authRateLimiter,
  authenticateAdmin,
  getCurrentAdmin
);

// -----------------------------------------------------
// ADMINISTRATOR INVITATION ROUTES
// -----------------------------------------------------

// Create an invitation.
// Requires an authenticated administrator with the relevant permission.
router.post(
  "/invitations",
  invitationRateLimiter,
  authenticateAdmin,
  requirePermission("admin.invitations.create"),
  createAdminInvitation
);

// Accept an invitation.
// Public endpoint: the invitation token provides verification.
router.post(
  "/accept-invitation",
  invitationAcceptanceRateLimiter,
  acceptAdminInvitation
);

export default router;
