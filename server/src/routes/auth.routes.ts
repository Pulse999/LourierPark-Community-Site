
import { Router } from "express";

import {
  login,
  logout,
  getCurrentAdmin,
} from "../controllers/auth.controller.js";

import { authenticateAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authenticateAdmin, getCurrentAdmin);

export default router;
