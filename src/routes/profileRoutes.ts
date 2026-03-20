import { Router } from "express";
import { profileController } from "../controllers/profileController";
import { requireAuth } from "../middlewares/authMiddleware";

const router = Router();

// Wajib menambahkan "requireAuth" sebagai Filter Keamanan
router.get("/", requireAuth, profileController.getMyProfile);
router.put("/", requireAuth, profileController.updateMyProfile);

export default router;
