import { Router } from "express";

import { getStudentApplication } from "../controllers/applicationsController.js";
import { getStudentApplications } from "../controllers/applicationsController.js";
import { studentApplicationHandler } from "../controllers/applicationsController.js";
import { uploadKycDoc } from "../controllers/applicationsController.js";
import { finalKyc } from "../controllers/applicationsController.js";

import { authenticate, softAuthenticate } from "../middlewares/authenticator.js";
import { authorise } from "../middlewares/authoriser.js";
import { identifier } from "../controllers/authController.js";
import { newCommentHandler } from "../controllers/blogController.js";
import { categories } from "../controllers/blogController.js";
import { composeBlog } from "../controllers/blogController.js";
import { getMyBlogs } from "../controllers/blogController.js";
import { suggestions } from "../controllers/blogController.js";
import { tags } from "../controllers/blogController.js";
import { getSpBlog } from "../controllers/blogController.js";
import { updateBlog } from "../controllers/blogController.js";
import { softDeleteBlog } from "../controllers/blogController.js";
import { blogsFeed } from "../controllers/blogController.js";
import { getFeedBlog } from "../controllers/blogController.js";
import { registerRead } from "../controllers/blogController.js";
import { getComments } from "../controllers/blogController.js";
import { getReplies } from "../controllers/blogController.js";
import { toggleLike } from "../controllers/blogController.js";
import { recordBlogLike } from "../controllers/blogController.js";

const route = Router();

// **** Identification route
route.get('/me', authenticate, authorise('admin', 'superuser', 'backoffice', 'student', 'parent', 'teacher'), identifier);

route.post('/student_applications', studentApplicationHandler); // New Student applications.
route.post('/student_applications/:appRef/uploadKyc', uploadKycDoc); // Upload document for kyc.
route.post('/student_applications/:appRef/kyc', finalKyc); // Finalize kyc.
route.get('/student_applications', authenticate, authorise('admin', 'superuser'), getStudentApplications); // Get student applciations.
route.get('/student_applications/:appRef', authenticate, authorise("admin", "superuser"), getStudentApplication); // Get a specific student application.

// ****************** PUBLIC BLOG ROUTES ****************** //

route.get('/blogs-latest', blogsFeed); // get the feed for main page
route.get('/blogs-latest/:blogId', softAuthenticate, getFeedBlog); // get a specific blog for view
route.post('/blogs-latest/:blogId/like', authenticate, authorise('admin', 'superuser', 'student', 'parent', 'teacher'), recordBlogLike) // Toggle like of a blog
route.post('/blogs-latest/:blogId/read', softAuthenticate, registerRead); // register a read

// ****************** BLOG COMMENTS **************** //

route.get('/comments/:blogId/pagination', softAuthenticate, getComments); // load comments of a blog with pagination
route.post('/comments/:blogId', authenticate, authorise('admin', 'superuser', 'student', 'parent', 'teacher'), newCommentHandler); // post new comment to a blog
route.put('/comments/:commentId', authenticate, authorise('admin', 'superuser', 'student', 'parent', 'teacher'), ()=>{}); // edit a comment
route.delete('/comments/:commentId', authenticate, authorise('admin', 'superuser', 'student', 'parent', 'teacher'), ()=>{}); // delete a comment
route.get('/comments/:commentId/replies', softAuthenticate, getReplies); // load replies with pagination
route.post('/comments/:commentId/like', authenticate, authorise('admin', 'superuser', 'student', 'parent', 'teacher'), toggleLike) // Toggle like

// ********************* BLOG MANAGEMENT *************** //

route.post('/blogs', authenticate, authorise('admin', 'superuser', 'student', 'parent', 'teacher'), composeBlog); // Create new blog.
route.put('/blogs/:blogId', authenticate, authorise('admin', 'superuser', 'student', 'parent', 'teacher'), updateBlog); // Update a blog.
route.get('/blogs/mine', authenticate, authorise('admin', 'superuser', 'student', 'parent', 'teacher'), getMyBlogs); // Get user blogs.
route.get('/blogs/mine/:viewId', authenticate, authorise('admin', 'superuser', 'student', 'parent', 'teacher'), getSpBlog); // Get user's specific blog.
route.delete('/blogs/:blogId', authenticate, authorise('admin', 'superuser', 'student', 'parent', 'teacher'), softDeleteBlog); // delete a blog.

// ******************** MISCELLENEOUS BLOG ACTIONS **************** //

route.get('/blogs/bss', suggestions) // Blog suggestions.
route.get('/blogs/categories', categories); // Blog categories.
route.get('/blogs/tags', tags); // Blog tags.

export default route;