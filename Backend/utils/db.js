import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()
export const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        // Suggestion 1: Corrected the log message
        console.log("MongoDB connected successfully");

    } catch (error) {
        console.error("Failed to connect to MongoDB", error);
        process.exit(1);
    }
};