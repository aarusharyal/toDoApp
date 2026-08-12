import { Router } from "express";
import {
  register,
  login,
  getSession,
  logout,
} from "../controller/authController.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/session", getSession);
router.get("/logout", logout);

export default router;
