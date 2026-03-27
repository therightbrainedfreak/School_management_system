import { Router } from 'express';
import { createUser, deactivateAdmin, activateAdmin } from '../controllers/superUserController.js';
import {authenticate} from '../middlewares/authenticator.js'
import {authorise} from '../middlewares/authoriser.js'

const route = Router();

route.post('/admin', authenticate, authorise('superuser'), createUser);

route.patch('/admin/deactivate', authenticate, authorise('superuser'), deactivateAdmin);

route.patch('/admin/activate', authenticate, authorise('superuser'), activateAdmin);

export default route;