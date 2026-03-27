import { Router } from "express";
import { getAdmin, loginAdmin, logoutAdmin } from "../controllers/adminController.js";
import { getDraftApplications, previewDraftApplication } from "../controllers/draftApplicationsController.js";
import {authenticate} from '../middlewares/authenticator.js'
import {authorise} from '../middlewares/authoriser.js'

const route = Router();

route.post('/login', loginAdmin); // Admin login route.

route.post('/logout', authenticate, authorise('admin'), logoutAdmin); // Admin logout route.

route.put('/:id', (req, res) => {res.status(501).json({status: false, message: "Route under construction!"})});

route.get('/applications', authenticate, authorise('admin'), getDraftApplications);

route.get('/applications/preview/:appRef', authenticate, authorise('admin'), previewDraftApplication);

// new routes for assigning the applications to a specific admin will be added or automated assignation based on schedule is planned for later dec.

export default route;