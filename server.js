import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDb from "./configs/mongodb.js";
import { clerkWebhooks } from "./middlewares/webhooks.js";

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
await connectDb();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the Edemy API!");
});

app.post("/clerk", clerkWebhooks);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
