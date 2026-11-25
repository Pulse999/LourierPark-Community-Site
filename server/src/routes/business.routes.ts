
import { Router } from "express";
import {
  getPublishedBusinesses,
  getPublishedBusinessBySlug,
} from "../controllers/business.controller.js";

const router = Router();

router.get("/", getPublishedBusinesses);
router.get("/:slug", getPublishedBusinessBySlug);

export default router;
