import { Router } from "express";
import { getLogin , getRegister , getTodo} from "../controller/pageController.js"

const router = Router();

router.get("/", getLogin);
router.get("/login", getLogin);
router.get("/register", getRegister);
