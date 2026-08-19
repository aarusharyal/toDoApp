import { Router } from "express";
import { getLogin , getRegister , getTodo , apiTasks} from "../controller/pageController.js"

const router = Router();

router.get("/", getLogin);
router.get("/login", getLogin);
router.get("/register", getRegister);

router.post("/api/tasks", apiTasks)

export default router;