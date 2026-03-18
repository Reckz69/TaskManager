import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import Task  from "../models/task.models.js";
import mongoose from "mongoose";


// ✅ CREATE TASK
const createTask = asyncHandler(async (req, res) => {
    const { title, description, priority, dueDate } = req.body;

    if (!title) {
        throw new ApiError(400, "Title is required");
    }

    const task = await Task.create({
        title,
        description,
        priority,
        dueDate,
        user: req.user._id   // 🔥 important (user-specific)
    });

    return res
        .status(201)
        .json(new ApiResponse(201, task, "Task created successfully"));
});


// ✅ GET ALL TASKS (only user’s tasks)
const getUserTasks = asyncHandler(async (req, res) => {

    const userId = req.user._id;

    // 🔍 Query Params
    const {
        page = 1,
        limit = 10,
        completed,
        priority,
        search
    } = req.query;

    // 🧠 Build Filter Object
    const filter = {
        user: userId
    };

    if (completed !== undefined) {
        filter.completed = completed === "true";
    }

    if (priority) {
        filter.priority = priority; // low, medium, high
    }

    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } }
        ];
    }

    // 📄 Pagination Logic
    const skip = (page - 1) * limit;

    const tasks = await Task.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

    const totalTasks = await Task.countDocuments(filter);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                tasks,
                pagination: {
                    total: totalTasks,
                    page: Number(page),
                    limit: Number(limit),
                    totalPages: Math.ceil(totalTasks / limit)
                }
            },
            "Tasks fetched successfully"
        )
    );
});


// ✅ GET SINGLE TASK
const getTaskById = asyncHandler(async (req, res) => {
    const { taskId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
        throw new ApiError(400, "Invalid task ID");
    }

    const task = await Task.findOne({
        _id: taskId,
        user: req.user._id
    });

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, task, "Task fetched successfully"));
});


// ✅ UPDATE TASK
const updateTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
        throw new ApiError(400, "Invalid task ID");
    }

    const task = await Task.findOneAndUpdate(
        {
            _id: taskId,
            user: req.user._id   // 🔥 ensures ownership
        },
        {
            $set: updates
        },
        {
            new: true
        }
    );

    if (!task) {
        throw new ApiError(404, "Task not found or unauthorized");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, task, "Task updated successfully"));
});


// ✅ DELETE TASK
const deleteTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
        throw new ApiError(400, "Invalid task ID");
    }

    const task = await Task.findOneAndDelete({
        _id: taskId,
        user: req.user._id   // 🔥 ensures ownership
    });

    if (!task) {
        throw new ApiError(404, "Task not found or unauthorized");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Task deleted successfully"));
});


// ✅ TOGGLE COMPLETE
const toggleTaskStatus = asyncHandler(async (req, res) => {
    const { taskId } = req.params;

    const task = await Task.findOne({
        _id: taskId,
        user: req.user._id
    });

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    task.completed = !task.completed;
    await task.save();

    return res
        .status(200)
        .json(new ApiResponse(200, task, "Task status updated"));
});


export {
    createTask,
    getUserTasks,
    getTaskById,
    updateTask,
    deleteTask,
    toggleTaskStatus
};