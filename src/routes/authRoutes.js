import { Router } from "express";
import { loginController, logoutController, logoutAllController } from '../controllers/authController.js';
import { authenticate } from "../middlewares/authenticator.js";
import { loginLimiter } from "../middlewares/rateLimiter.js";

const route = Router();

route.post('/login', loginLimiter, loginController);
route.post('/logout', authenticate, logoutController);
route.post('/logoutAll', authenticate, logoutAllController);

export default route;