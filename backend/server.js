import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db/connection.js";
import registrationRoutes from './routes/registrationRoutes.js';

import healthRoutes from "./routes/health.js";
import eventRoutes from "./routes/eventRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI;

if (!uri) {
  console.error("Error: ATLAS_URI environment variable is not set");
  process.exit(1);
}

app.use(cors({
  origin: 'http://localhost:3333',
}));
app.use(express.json());
app.use('/api', registrationRoutes);
app.use("/api", healthRoutes);

app.use("/api", healthRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes);


connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});

export { app };
