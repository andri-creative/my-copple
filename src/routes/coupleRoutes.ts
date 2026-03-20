import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { coupleController } from "../controllers/coupleController";

const router = Router();

router.post("/connect", requireAuth, coupleController.connectPartner);
router.post("/disconnect", requireAuth, coupleController.disconnectPartner);

export default router;
