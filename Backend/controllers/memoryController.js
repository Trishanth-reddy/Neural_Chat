import Memory from "../models/memoryModel.js";
import { Mistral } from "@mistralai/mistralai";
import dotenv from "dotenv";
import { createRequire } from "module"; // 1. Import createRequire

dotenv.config();

// 2. Fix for "pdf-parse does not provide an export named default"
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse"); 

const mistral = new Mistral({ apiKey: process.env.MISTRAL_API_KEYS });

// ==========================================
// 1. PROCESS PDF (Extract Text + AI JSON)
// ==========================================
export const processPdf = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No PDF provided" });
        }

        // 1. Extract Text from PDF Buffer
        const data = await pdf(req.file.buffer);
        const text = data.text;

        if (!text || text.trim().length === 0) {
            return res.status(400).json({ message: "Could not extract text from this PDF." });
        }

        // 2. Send to Mistral AI
        const ai = await mistral.chat.complete({
            model: "mistral-small-latest",
            messages: [
                {
                    role: "user",
                    content: `You are a data extraction assistant.
                    Convert the following resume text into a strictly formatted JSON object.
                    Do not include any markdown formatting (like \`\`\`json). Just return the raw JSON.
                    
                    Text to extract:
                    ${text.substring(0, 15000)}` 
                },
            ],
        });
        
        const content = ai.choices[0].message.content;

        // 3. Robust JSON Parsing
        let jsonContent;
        try {
            const firstOpen = content.indexOf('{');
            const lastClose = content.lastIndexOf('}');
            
            if (firstOpen !== -1 && lastClose !== -1) {
                const jsonString = content.substring(firstOpen, lastClose + 1);
                jsonContent = JSON.parse(jsonString);
            } else {
                jsonContent = JSON.parse(content);
            }
        } catch (parseError) {
            console.error("AI JSON Parse Error:", parseError);
            jsonContent = { 
                raw_text: "AI could not structure this document automatically.",
                summary: text.substring(0, 500) + "..." 
            };
        }

        res.status(200).json({ pdfText: text, structuredData: jsonContent });

    } catch (err) {
        console.error("PDF processing error:", err);
        if (err.code === 'LIMIT_FILE_SIZE') {
             return res.status(413).json({ message: "File too large." });
        }
        res.status(500).json({ message: "Error processing PDF on server." });
    }
};

// ==========================================
// 2. SAVE MEMORY (User Settings + Resume)
// ==========================================
export const saveMemory = async (req, res) => {
    try {
        const userId = req.user?._id || req.body.userId;

        if (!userId) {
            console.error("Save Memory Failed: No User ID found.");
            return res.status(401).json({ message: "Unauthorized: User identification missing." });
        }

        const { wyd, know, trait, structuredData, pdfFilename } = req.body;

        const updated = await Memory.findOneAndUpdate(
            { userId },
            { 
                userId, 
                wyd, 
                know, 
                trait, 
                structuredData, 
                pdfFilename 
            },
            { new: true, upsert: true }
        );

        res.json({ message: "Memory saved successfully", data: updated });

    } catch (error) {
        console.error("Save Memory Error:", error);
        res.status(500).json({ message: "Server error while saving memory." });
    }
};

// ==========================================
// 3. GET MEMORY (Load on Startup)
// ==========================================
export const getMemory = async (req, res) => {
    try {
        const userId = req.user?._id || req.query.userId;
        
        if (!userId) {
             return res.status(401).json({ message: "Unauthorized" });
        }

        const memory = await Memory.findOne({ userId });
        
        if (!memory) {
            return res.json({ 
                wyd: "", 
                know: "", 
                trait: "", 
                structuredData: null, 
                pdfFilename: null 
            });
        }
        
        res.json(memory);

    } catch (error) {
        console.error("Get Memory Error:", error);
        res.status(500).json({ message: "Error retrieving memory." });
    }
};