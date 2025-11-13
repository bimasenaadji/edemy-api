import express from "express";
import {
  getUserData,
  purchaseCourse,
  userEnrolledCourses,
} from "../controllers/userController.js";

const userRouter = express.Router();

// Get data user
userRouter.get("/data", getUserData);

// Get Enrollments class
userRouter.get("/enrolled-courses", userEnrolledCourses);

// Purchase course
userRouter.post("/purchase", purchaseCourse);

export default userRouter;
