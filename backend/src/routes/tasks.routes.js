import { Router } from "express";
import {
    createTask,
    getUserTasks,
    getTaskById,
    updateTask,
    deleteTask,
    toggleTaskStatus
} from "../controllers/task.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// 🔒 All task routes are protected
router.use(verifyJWT);

// CRUD Routes
router.route("/").get(getUserTasks);           // GET all tasks (with filter, search, pagination)
router.route("/").post(createTask);            // CREATE task

router.route("/:taskId").get(getTaskById);     // GET single task
router.route("/:taskId").put(updateTask);      // UPDATE task
router.route("/:taskId").delete(deleteTask);   // DELETE task

router.route("/toggle/:taskId").patch(toggleTaskStatus); // TOGGLE complete

export default router;