import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import categoriesRoute from "./routes/categories.js";
import expensesRoute from "./routes/expenses.js";

dotenv.config();
console.log('Has MONGO_URI?', Boolean(process.env.MONGO_URI));
console.log('MONGO_URI prefix:', (process.env.MONGO_URI || '').slice(0, 18));


const app = express();
const { PORT = 5000, MONGO_URI, CORS_ORIGIN = "http://localhost:3000" } = process.env;

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

// health
app.get("/", (_req, res) => res.json({ ok: true, message: "Backend is running 🚀" }));

// routes
app.use("/api/categories", categoriesRoute);
app.use("/api/expenses", expensesRoute);

// start
mongoose
  .connect(MONGO_URI, { serverSelectionTimeoutMS: 10000 })
  .then(() => app.listen(PORT, () => console.log(`✅ Backend: http://localhost:${PORT}`)))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));
