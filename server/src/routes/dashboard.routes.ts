
import { Router } from "express";
import rateLimit from "express-rate-limit";

import { getDashboardStats } from "../controllers/dashboard.controller.js";
import { getWebsiteAnalytics } from "../controllers/websiteAnalytics.controller.js";

import {
  authenticateAdmin,
  requirePermission,
} from "../middleware/auth.middleware.js";

const router = Router();

const dashboardRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 120,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    status: "error",
    message: "Too many dashboard requests. Please try again later.",
  },
});

router.use(dashboardRateLimiter);
router.use(authenticateAdmin);
router.use(requirePermission("dashboard.analytics.view"));

router.get("/stats", getDashboardStats);
router.get("/analytics", getWebsiteAnalytics);

export default router;