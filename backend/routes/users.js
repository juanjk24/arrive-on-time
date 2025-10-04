import { Router } from "express";
import multer from "multer";

import { UserController,getAllPublic } from "../controllers/users.js";
import { verifyToken, isAdmin } from "../middlewares/auth.js";
import { isAuth } from "../middlewares/users.js";

export const usersRouter = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//  Ruta pública para pruebas con Vue
usersRouter.get("/demo", getAllPublic);

usersRouter.get("/", [verifyToken, isAdmin], UserController.getAll);
usersRouter.get("/admins", [verifyToken, isAdmin], UserController.getAdmins);
usersRouter.get("/:id", [verifyToken, isAuth], UserController.getById);
usersRouter.get("/:id/image", UserController.getImageProfile);

usersRouter.post("/", [verifyToken, isAdmin], UserController.create);
usersRouter.post("/image-profile/:id", [verifyToken, isAdmin, upload.single("user_img_profile")], UserController.setImageProfile);
usersRouter.post("/image-profile-db/:id", [verifyToken, isAuth, upload.single("user_img_profile")], UserController.setImageProfileDB);

usersRouter.put("/:id", [verifyToken, isAdmin], UserController.update);

usersRouter.delete("/:id", [verifyToken, isAdmin], UserController.delete);



