
import { Router } from "express";

import { getDashboardStats } from "../controllers/dashboard.controller.js";
import { getWebsiteAnalytics } from "../controllers/websiteAnalytics.controller.js";

import {
  authenticateAdmin,
  requirePermission,
} from "../middleware/auth.middleware.js";

const router = Router();

router.get(
  "/stats",
  authenticateAdmin,
  requirePermission("dashboard.analytics.view"),
  getDashboardStats
);

router.get(
  "/analytics",
  authenticateAdmin,
  requirePermission("dashboard.analytics.view"),
  getWebsiteAnalytics
);

export default router;
