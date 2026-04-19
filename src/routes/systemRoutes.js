import { Router } from "express";

import {
    getStudentApplications,
    getStudentApplication,
    studentApplicationHandler,
    uploadKycDoc,
    finalKyc
} from "../controllers/applicationsController.js";

import { authenticate } from "../middlewares/authenticator.js";
import { authorise } from "../middlewares/authoriser.js";

const route = Router();

route.post('/student_applications', studentApplicationHandler);

route.post('/student_applications/:appRef/uploadKyc', uploadKycDoc);

route.post('/student_applications/:appRef/kyc', finalKyc);

route.get('/student_applications', authenticate, authorise('admin', 'superuser'), getStudentApplications);

route.get('/student_applications/:appRef', authenticate, authorise("admin", "superuser"), getStudentApplication);

// Paused work for below routes

// route.post('/studentApplications/:appRef/review', authenticate, authorise('admin', 'superuser'), applicationReview);

// route.post('/studentApplications/:appRef/reject', authenticate, authorise('admin', 'superuser'), applicationReject);

// route.post('/studentApplications/:appRef/verify', authenticate, authorise('admin', 'superuser'), applicationVerify);

export default route;