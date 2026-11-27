
import { Router } from "express";

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

const router = Router();

// All administrator management endpoints require authentication.
router.use(authenticateAdmin);
router.use(requirePermission("admins.manage"));

// Administrator accounts
router.get("/", getAdministrators);

router.patch("/:id/status", updateAdministratorStatus);

// Available roles
router.get("/roles", getAdministratorRoles);

// Invitations
router.get("/invitations", getAdministratorInvitations);

router.patch(
  "/invitations/:id/revoke",
  revokeAdministratorInvitation
);

export default router;
