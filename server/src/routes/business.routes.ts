
import { Router } from "express";

import {
  getPublishedBusinesses,
  getPublishedBusinessBySlug,
} from "../controllers/business.controller.js";

const router = Router();

// -----------------------------------------------------
// PUBLIC BUSINESS DIRECTORY
// -----------------------------------------------------

// GET /api/businesses
router.get("/", getPublishedBusinesses);

// GET /api/businesses/:slug
router.get("/:slug", getPublishedBusinessBySlug);

export default router;
