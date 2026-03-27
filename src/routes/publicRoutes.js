import { Router } from "express";
import { newStudentDraftApplication } from "../controllers/draftApplicationsController.js";

const route = Router();

route.post('/public/application/new', newStudentDraftApplication);

export default route;