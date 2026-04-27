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

route.get('/me');

route.post('/student_applications', studentApplicationHandler); // New Student applications.

route.post('/student_applications/:appRef/uploadKyc', uploadKycDoc); // Upload document for kyc.

route.post('/student_applications/:appRef/kyc', finalKyc); // Finalize kyc.

route.get('/student_applications', authenticate, authorise('admin', 'superuser'), getStudentApplications); // Get student applciations.

route.get('/student_applications/:appRef', authenticate, authorise("admin", "superuser"), getStudentApplication); // Get a specific student application.

export default route;