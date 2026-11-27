
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

import { csrfProtection } from "../middleware/csrf.middleware.js";

const router = Router();

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

// Login does not yet have an authenticated cookie.
router.post("/login", loginRateLimiter, login);

// Logout changes the authenticated session.
router.post(
  "/logout",
  authRateLimiter,
  authenticateAdmin,
  csrfProtection,
  logout
);

router.get(
  "/me",
  authRateLimiter,
  authenticateAdmin,
  getCurrentAdmin
);

// Create administrator invitation.
router.post(
  "/invitations",
  invitationRateLimiter,
  authenticateAdmin,
  csrfProtection,
  requirePermission("admin.invitations.create"),
  createAdminInvitation
);

// Public invitation acceptance.
// The invitation token provides verification.
router.post(
  "/accept-invitation",
  invitationAcceptanceRateLimiter,
  acceptAdminInvitation
);

export default router;