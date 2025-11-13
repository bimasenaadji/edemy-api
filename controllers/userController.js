import { getAuth } from "@clerk/express";
import User from "../models/User.js";
import Course from "../models/Course.js";
import Stripe from "stripe";
import Purchase from "../models/Purchase.js";

// Get User Data
export const getUserData = async (req, res) => {
  const { userId } = getAuth(req);
  try {
    const user = await User.findById(userId);
    if (!userId) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get users enrolled courses with lecture links
export const userEnrolledCourses = async (req, res) => {
  const { userId } = getAuth(req);

  try {
    const userData = await User.findById({ _id: userId }).populate(
      "enrolledCourses"
    );

    res.json({ success: true, courses: userData.enrolledCourses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Purchase Course
export const purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const { origin } = req.headers;
    const { userId } = getAuth(req);

    const userData = await User.findById(userId);
    const courseData = await Course.findById(courseId);

    if (!userData || !courseData) {
      return res.json({ success: false, message: "Invalid user or course" });
    }

    const purchaseData = {
      courseId: courseData._id,
      userId,
      amount: (
        courseData.coursePrice -
        (courseData.discount / 100) * courseData.coursePrice
      ).toFixed(2),
    };

    const newPurchase = await Purchase.create(purchaseData);

    // Stripe gateway initialization and session creation logic goes here
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const currency = process.env.CURRENCY.toLowerCase();

    // Creating line items for stripe
    const line_items = [
      {
        price_data: {
          currency,
          product_data: {
            name: courseData.courseTitle,
          },
          unit_amount: Math.floor(newPurchase.amount) * 100,
        },
        quantity: 1,
      },
    ];

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/loading/my-enrollments`,
      cancel_url: `${origin}/`,
      line_items: line_items,
      mode: "payment",
      metadata: {
        purchaseId: newPurchase._id.toString(),
      },
    });

    res.json({ success: true, url: session.url });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
