import express from "express";
import {
  addUserRating,
  getUserCourseProgress,
  getUserData,
  purchaseCourse,
  updateUserCourseProgress,
  userEnrolledCourses,
} from "../controllers/userController.js";

const userRouter = express.Router();

// Get data user
userRouter.get("/data", getUserData);

// Get Enrollments class
userRouter.get("/enrolled-courses", userEnrolledCourses);

// Purchase course
userRouter.post("/purchase", purchaseCourse);

// Update progress course
userRouter.post("/update-course-progress", updateUserCourseProgress);
userRouter.post("/get-course-progress", getUserCourseProgress);
userRouter.post("/add-rating", addUserRating);

export default userRouter;
