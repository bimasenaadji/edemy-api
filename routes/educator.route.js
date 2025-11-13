import express from "express";
import {
  addCourse,
  educatorDashboardData,
  getEducatorCourses,
  getEnrolledStudentData,
  updateRoleToEducator,
} from "../controllers/educator.controller.js";
import { protectEducator } from "../middlewares/authMiddleware.js";
import upload from "../configs/multer.js";

const educatorRouter = express.Router();

// Add educator role
educatorRouter.get("/update-role", updateRoleToEducator);
educatorRouter.post(
  "/add-course",
  upload.single("image"),
  protectEducator,
  addCourse
);
educatorRouter.get("/courses", protectEducator, getEducatorCourses);
educatorRouter.get("/dashboard", protectEducator, educatorDashboardData);
educatorRouter.get(
  "/enrolled-students",
  protectEducator,
  getEnrolledStudentData
);

export default educatorRouter;
