
import { Router } from "express";
import rateLimit from "express-rate-limit";

import { recordPageView } from "../controllers/analytics.controller.js";

const router = Router();

const analyticsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "error",
    message: "Too many analytics requests. Please try again later.",
  },
});

router.post("/page-view", analyticsLimiter, recordPageView);

export default router;
