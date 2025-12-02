import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.ATLAS_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  }

  mongoose.connection.on("error", (error) => {
    console.error("MongoDB connection error:", error);
  });
};
