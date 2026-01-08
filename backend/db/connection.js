import mongoose from "mongoose";
import Registration from "../model/Registration.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.ATLAS_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("MongoDB connected successfully");
    
    // Drop old index that doesn't include ticketType_id (if it exists)
    // This allows users to register for multiple ticket types for the same event
    try {
      await Registration.collection.dropIndex("user_id_1_event_id_1");
      console.log("Dropped old registration index (user_id_1_event_id_1)");
    } catch (error) {
      // Index doesn't exist or already dropped - this is fine
      if (error.code !== 27) { // 27 = IndexNotFound
        console.log("Note: Old index may not exist:", error.message);
      }
    }
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  }

  mongoose.connection.on("error", (error) => {
    console.error("MongoDB connection error:", error);
  });
};
