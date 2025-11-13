import { clerkClient, getAuth } from "@clerk/express";
import Course from "../models/Course.js";
import { v2 as cloudinary } from "cloudinary";
import Purchase from "../models/Purchase.js";
import User from "../models/User.js";

// Update user role to educator
export const updateRoleToEducator = async (req, res) => {
  try {
    const { userId } = getAuth(req);

    await clerkClient.users.updateUser(userId, {
      publicMetadata: { role: "educator" },
    });

    res.json({ success: true, message: "Role updated to educator" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Add a new course
export const addCourse = async (req, res) => {
  try {
    const { courseData } = req.body;
    const imageFile = req.file;
    const { userId } = getAuth(req);

    if (!imageFile) {
      return res.json({
        success: false,
        message: "Course thumbnail is required",
      });
    }

    const parsedCourseData = JSON.parse(courseData);
    parsedCourseData.educator = userId;

    const imageUpload = await cloudinary.uploader.upload(imageFile.path);

    parsedCourseData.courseThumbnail = imageUpload.secure_url;

    const newCourse = await Course.create(parsedCourseData);

    res.json({ success: true, message: "Course added successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get all courses for an educator
export const getEducatorCourses = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const courses = await Course.find({ educator: userId });
    res.json({ success: true, courses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get educator dashboard data (total earning, enrolled student,no. of courses)
export const educatorDashboardData = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const courses = await Course.find({ educator: userId });
    const totalCourses = courses.length;

    const coursesId = courses.map((course) => {
      return course._id;
    });

    // Calculate total earning
    const purchases = await Purchase.find({
      courseId: { $in: coursesId },
      status: "completed",
    });

    const totalEarnings = purchases.reduce((acc, purchase) => {
      return acc + purchase.amount;
    }, 0);

    // Collect unique enrolled students
    const enrolledStudentsData = [];

    for (const course of courses) {
      const students = await User.find(
        {
          _id: { $in: course.enrolledStudents },
        },
        "name imageUrl"
      );

      students.forEach((student) => {
        enrolledStudentsData.push({ courseTitle: course.courseTitle, student });
      });
    }

    res.json({
      success: true,
      dashboardData: { totalEarnings, totalCourses, enrolledStudentsData },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get enrolled students data with purchase data
export const getEnrolledStudentData = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const courses = Course.find({ educator: userId });
    const coursesId = courses.map((course) => {
      return course._id;
    });

    const purchases = Purchase.find({
      courseId: { $in: coursesId },
      status: "completed",
    })
      .populate("userId", "name imageUrl")
      .populate("courseId", "courseTitle");

    const enrolledStudents = purchases.map((purchase) => {
      return {
        student: purchase.userId,
        courseTitle: purchase.courseId.courseTitle,
        purchaseDate: purchase.createdAt,
      };
    });

    res.json({ success: true, enrolledStudents });
  } catch (error) {}
};
