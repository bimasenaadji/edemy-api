import express from "express";
import {
  getAllCourses,
  getCourseById,
} from "../controllers/courseController.js";

const courseRouter = express.Router();

// Get all courses
courseRouter.get("/all", getAllCourses);
courseRouter.get("/:id", getCourseById);

export default courseRouter;
