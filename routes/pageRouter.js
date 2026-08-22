import { Router } from "express";
import {
  getLogin,
  getRegister,
  getTodo,
  apiTasks,
} from "../controller/pageController.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

router.get("/", getLogin);
router.get("/login", getLogin);
router.get("/register", getRegister);

router.get("/dashboard", requireAuth, getTodo);

router.post("/api/tasks", apiTasks);

export default router;
