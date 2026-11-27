
import { Router } from "express";
import rateLimit from "express-rate-limit";

import {
  getAdministrators,
  getAdministratorRoles,
  updateAdministratorStatus,
  getAdministratorInvitations,
  revokeAdministratorInvitation,
} from "../controllers/administrator.controller.js";

import {
  authenticateAdmin,
  requirePermission,
} from "../middleware/auth.middleware.js";

import { csrfProtection } from "../middleware/csrf.middleware.js";

const router = Router();

const administratorRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    status: "error",
    message: "Too many administrator management requests. Please try again later.",
  },
});

router.use(administratorRateLimiter);
router.use(authenticateAdmin);
router.use(csrfProtection);
router.use(requirePermission("admins.manage"));

router.get("/", getAdministrators);
router.get("/roles", getAdministratorRoles);
router.get("/invitations", getAdministratorInvitations);

router.patch("/:id/status", updateAdministratorStatus);

router.patch(
  "/invitations/:id/revoke",
  revokeAdministratorInvitation
);

export default router;