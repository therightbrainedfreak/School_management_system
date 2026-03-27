import { Router } from 'express';
import { createUser, handleAccountActions } from '../controllers/superUserController.js';
import {authenticate} from '../middlewares/authenticator.js'
import {authorise} from '../middlewares/authoriser.js'

const route = Router();

route.post('/accounts', authenticate, authorise('superuser'), createUser);

route.post('/accounts/:userId/actions', authenticate, authorise('superuser'), handleAccountActions);

export default route;