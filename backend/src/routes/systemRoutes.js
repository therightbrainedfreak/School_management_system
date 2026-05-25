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
import { identifier } from "../controllers/authController.js";
import {
    categories,
    composeBlog,
    getMyBlogs,
    suggestions,
    tags,
    getSpBlog,
    updateBlog,
    softDeleteBlog
} from "../controllers/blogController.js";

const route = Router();

route.get('/me', authenticate, authorise('admin', 'superuser', 'backoffice', 'student', 'parent', 'teacher'), identifier);

route.post('/student_applications', studentApplicationHandler); // New Student applications.

route.post('/student_applications/:appRef/uploadKyc', uploadKycDoc); // Upload document for kyc.

route.post('/student_applications/:appRef/kyc', finalKyc); // Finalize kyc.

route.get('/student_applications', authenticate, authorise('admin', 'superuser'), getStudentApplications); // Get student applciations.

route.get('/student_applications/:appRef', authenticate, authorise("admin", "superuser"), getStudentApplication); // Get a specific student application.

// ****************** BLOG ROUTES ****************** //

route.post('/blogs', authenticate, authorise('admin', 'superuser', 'student', 'parent', 'teacher'), composeBlog); // Create new blog.
route.put('/blogs/:blogId', authenticate, authorise('admin', 'superuser', 'student', 'parent', 'teacher'), updateBlog); // Update a blog.
route.get('/blogs/mine', authenticate, authorise('admin', 'superuser', 'student', 'parent', 'teacher'), getMyBlogs); // Get user blogs.
route.get('/blogs/mine/:viewId', authenticate, authorise('admin', 'superuser', 'student', 'parent', 'teacher'), getSpBlog); // Get user's specific blog.
route.delete('/blogs/:blogId', authenticate, authorise('admin', 'superuser', 'student', 'parent', 'teacher'), softDeleteBlog); // delete a blog.

route.get('/blogs/bss', suggestions) // Blog suggestions.
route.get('/blogs/categories', categories); // Blog categories.
route.get('/blogs/tags', tags); // Blog tags.

export default route;