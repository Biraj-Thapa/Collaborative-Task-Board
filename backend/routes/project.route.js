import express from "express";
import {
  createProject,
  getUserProjects,
  joinProject,
  getProjectMembers
} from "../controllers/project.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/projects", isAuthenticated, createProject);
router.get("/projects", isAuthenticated, getUserProjects);
router.post("/projects/:id/join", isAuthenticated, joinProject);
router.get("/projects/:id/members", isAuthenticated, getProjectMembers);

export default router;
