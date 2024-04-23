import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { logger } from "../utils/logger.js";


const userRoute = Router();

/*userRoute.post("/login", userController.login);
userRoute.post("/register", userController.register);*/

userRoute.post("/login", (req, res) => {
    logger.info("POST /login requested");
    userController.login(req, res);
});

userRoute.post("/register", (req, res) => {
    logger.info("POST /register requested");
    userController.register(req, res);
});

export default userRoute;