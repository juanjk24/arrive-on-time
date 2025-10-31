import { Router } from "express";

import { EmailController } from "../controllers/emails.js";
import { verifyToken, isAdmin } from "../middlewares/auth.js";

export const emailRouter = Router();

emailRouter.post("/send", [verifyToken, isAdmin], EmailController.send);