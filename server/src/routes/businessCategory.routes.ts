
import { Router } from "express";

import {
  getBusinessCategories,
  getBusinessCategoryBySlug,
  getBusinessesByCategory,
} from "../controllers/businessCategory.controller.js";

const router = Router();

router.get("/", getBusinessCategories);
router.get("/:slug/businesses", getBusinessesByCategory);
router.get("/:slug", getBusinessCategoryBySlug);

export default router;
