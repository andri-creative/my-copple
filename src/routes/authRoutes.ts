import { Router } from "express";
import { authController } from "../controllers/authController";

const router = Router();

// Routes untuk Authentication
router.post("/register", authController.registerEmail);
router.post("/login", authController.loginEmail);

// Routes untuk OAuth (Misal dikirim langsung oleh app/frontend via Rest JSON API)
router.post("/login/google", authController.loginGoogle);
router.post("/login/apple", authController.loginApple);

export default router;
