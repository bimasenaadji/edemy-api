// server.js
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

// Middleware Global
app.use(cors()); // Izinkan CORS untuk semua rute

// ----------------------------------------------------
// KUNCI #1: RUTE WEBHOOK HARUS DI SINI
// (SEBELUM 'express.json()')
// ----------------------------------------------------
app.post("/clerk", clerkWebhooks); // Webhook Clerk (mungkin butuh parser khusus, cek dokum Svix)

// Beritahu Express untuk menggunakan 'parser mentah' HANYA untuk rute ini
app.post(
  "/api/stripe",
  express.raw({ type: "application/json" }), // <-- Ini kuncinya!
  stripeWebhooks
);
// ----------------------------------------------------

// ----------------------------------------------------
// KUNCI #2: MIDDLEWARE GLOBAL (SETELAH WEBHOOK)
// ----------------------------------------------------
// 'express.json()' sekarang hanya akan berlaku untuk rute DI BAWAHNYA
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware());

// ----------------------------------------------------
// 3. Rute API Sisanya
// ----------------------------------------------------
app.get("/", (req, res) => {
  res.send("Welcome to the Edemy API!");
});

app.use("/api/educator", educatorRouter);
app.use("/api/courses", courseRouter);
app.use("/api/users", userRouter);

// (Pastikan kamu mendaftarkan semua rute lain)
app.use("/api/auth", authRoutes);
app.app.use("/api/cart", protect, cartRoutes);
app.use("/api/orders", orderRoutes);

app.listen(PORT, "0.0.0.0", () => {
  // <-- Jangan lupa '0.0.0.0' untuk hosting
  console.log(`Server is running on port ${PORT}`);
});
