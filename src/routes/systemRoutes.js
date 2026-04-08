import { Router } from "express";

import {
    newApplicationHandler,
    getApplications,
    getApplication,
    applicationReview,
    applicationReject
} from "../controllers/applicationsController.js";

import { authenticate } from "../middlewares/authenticator.js";
import { authorise } from "../middlewares/authoriser.js";

const route = Router();

route.post('/applications', newApplicationHandler);

route.get('/applications', authenticate, authorise('admin', 'superuser'), getApplications);

route.get('/applications/:appRef', authenticate, authorise('admin', 'superuser'), getApplication);

route.post('/applications/:appRef/pReview', authenticate, authorise('admin', 'superuser'), applicationReview);

route.post('/applications/:appRef/pReject', authenticate, authorise('admin', 'superuser'), applicationReject);

export default route;