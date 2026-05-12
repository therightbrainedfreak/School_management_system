import { response, Router } from "express";

import {
    getStudentApplications,
    getStudentApplication,
    studentApplicationHandler,
    uploadKycDoc,
    finalKyc
} from "../controllers/applicationsController.js";

import { authenticate } from "../middlewares/authenticator.js";
import { authorise } from "../middlewares/authoriser.js";
import { identifier } from "../controllers/authController.js";
import { categories, composeBlog, suggestions, tags } from "../controllers/blogController.js";

const route = Router();

route.get('/me', authenticate, authorise('admin', 'superuser', 'backoffice', 'student', 'parent', 'teacher'), identifier);

route.post('/student_applications', studentApplicationHandler); // New Student applications.

route.post('/student_applications/:appRef/uploadKyc', uploadKycDoc); // Upload document for kyc.

route.post('/student_applications/:appRef/kyc', finalKyc); // Finalize kyc.

route.get('/student_applications', authenticate, authorise('admin', 'superuser'), getStudentApplications); // Get student applciations.

route.get('/student_applications/:appRef', authenticate, authorise("admin", "superuser"), getStudentApplication); // Get a specific student application.

// ****************** BLOG ROUTES ****************** //

route.post('/blog', authenticate, authorise('admin', 'superuser'), composeBlog);

route.get('/blogs/bss', suggestions)
route.get('/blogs/categories', categories);
route.get('/blogs/tags', tags);

export default route;