import { Router } from "express";

import {
    getStudentApplications,
    getStudentApplication,
    applicationReview,
    applicationReject,
    applicationVerify,
    studentApplicationHandler
} from "../controllers/applicationsController.js";

import { authenticate } from "../middlewares/authenticator.js";
import { authorise } from "../middlewares/authoriser.js";

const route = Router();

route.post('/studentApplication', studentApplicationHandler);

route.get('/applications', authenticate, authorise('admin', 'superuser'), getStudentApplications);

// route.get('/applications/:appRef', authenticate, authorise["admin", "superuser"], getStudentApplication);

route.post('/applications/:appRef/review', authenticate, authorise('admin', 'superuser'), applicationReview);

route.post('/applications/:appRef/reject', authenticate, authorise('admin', 'superuser'), applicationReject);

route.post('/applications/:appRef/verify', authenticate, authorise('admin', 'superuser'), applicationVerify);

export default route;