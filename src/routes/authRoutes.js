import { Router } from "express";
import { loginController, logoutController, logoutAllController } from '../controllers/authController.js';
import { authenticate } from "../middlewares/authenticator.js";

const route = Router();

route.post('/login', loginController);
route.post('/logout', authenticate, logoutController);
route.post('/logoutAll', authenticate, logoutAllController);

export default route;