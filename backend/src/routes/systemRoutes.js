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
import { composeBlog } from "../controllers/blogController.js";

const route = Router();

route.get('/me', authenticate, authorise('admin', 'superuser', 'backoffice', 'student', 'parent', 'teacher'), identifier);

route.post('/student_applications', studentApplicationHandler); // New Student applications.

route.post('/student_applications/:appRef/uploadKyc', uploadKycDoc); // Upload document for kyc.

route.post('/student_applications/:appRef/kyc', finalKyc); // Finalize kyc.

route.get('/student_applications', authenticate, authorise('admin', 'superuser'), getStudentApplications); // Get student applciations.

route.get('/student_applications/:appRef', authenticate, authorise("admin", "superuser"), getStudentApplication); // Get a specific student application.

// ****************** BLOG ROUTES ****************** //

route.post('/blog', authenticate, authorise('admin', 'superuser'), composeBlog);

// test search route

const f = async () => {
    const d = await fetch('https://jsonplaceholder.typicode.com/comments')
    const response = await d.json();
    return response
}

let data = []

f().then(res => data = res).catch(err => console.log(err))

route.get('/blogs/search', async (req, res) => {
    const {q} = req.query;
    if (!q) return res.status(400).json({message: "empty queries"});
    if (!data) return res.status(400).json({message: "data not loaded yet"});
    const r = data.filter(f => f.name.toLowerCase().includes(q.toLowerCase())).slice(0, 10)
    res.json(r);
})

export default route;