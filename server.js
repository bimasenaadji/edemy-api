import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDb from "./configs/mongodb.js";
import { clerkWebhooks, stripeWebhooks } from "./middlewares/webhooks.js";
import educatorRouter from "./routes/educator.route.js";
import { clerkMiddleware } from "@clerk/express";
import connectCloudinary from "./configs/cloudinary.js";
import courseRouter from "./routes/course.route.js";
import userRouter from "./routes/user.route.js";

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
await connectDb();
await connectCloudinary();

// Middleware
app.use(cors());
app.use(clerkMiddleware());

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the Edemy API!");
});

app.post("/clerk", express.json(), clerkWebhooks);
app.use("/api/educator", express.json(), educatorRouter);
app.use("/api/courses", express.json(), courseRouter);
app.use("/api/users", express.json(), userRouter);
app.use("/stripe", express.raw({ type: "application/json" }), stripeWebhooks);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
