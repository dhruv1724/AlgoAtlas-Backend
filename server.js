import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import authRouter from "./routes/authRouter.js";
import pushRouter from "./routes/pushRouter.js";


const app = express();

// Middlewares

app.use(cors());
app.use(express.json());

//  Routes
app.use("/auth", authRouter);   // OAuth routes
app.use("/api", pushRouter);    // Push routes

// Health Check
app.get("/", (req, res) => {
  res.send(" Backend is running");
});

// Global Error Handler 
app.use((err, req, res, next) => {
  console.error(" Global Error:", err);
  res.status(500).json({ error: "Something went wrong" });
});

// Start Server
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});