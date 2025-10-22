import mongoose from "mongoose";

const memorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true, // Each user has only one memory document
    },
    wyd: { // What you do (Role/Profession)
        type: String,
        trim: true,
        default: "",
    },
    know: { // Key information
        type: String,
        trim: true,
        default: "",
    },
    trait: { // AI Traits
        type: String,
        trim: true,
        default: "",
    },
    pdfFilename: { // We'll store the name of the PDF
        type: String,
        default: null,
    },
    structuredData: { // The JSON extracted from the PDF
        type: mongoose.Schema.Types.Mixed,
        default: null,
    },
}, { timestamps: true });

const Memory = mongoose.model("Memory", memorySchema);

export default Memory;
