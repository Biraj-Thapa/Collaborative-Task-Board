import express from 'express';
import { createTask, deleteTask, getProjectTasks, updateTask } from '../controllers/task.controller.js';
import { isAuthenticated } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/task/:projectId', isAuthenticated, createTask);
router.get('/task/:projectId', isAuthenticated, getProjectTasks);
router.patch('/task/:taskId', isAuthenticated, updateTask);
router.delete('/task/:taskId',isAuthenticated,deleteTask )

export default router;