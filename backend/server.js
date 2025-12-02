import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db/connection.js";
import healthRoutes from "./routes/health.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI;

if (!uri) {
  console.error("Error: ATLAS_URI environment variable is not set");
  process.exit(1);
}

app.use(cors());
app.use(express.json());

app.use("/api", healthRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
