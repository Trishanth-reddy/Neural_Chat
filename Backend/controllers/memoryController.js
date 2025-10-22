import Memory from "../models/memoryModel.js";
import { Mistral } from "@mistralai/mistralai";
import { PDFParse } from 'pdf-parse';
import "pdf-parse/worker"; // This line is essential for the backend
import dotenv from "dotenv";
dotenv.config();

const mistral = new Mistral({ apiKey: process.env.MISTRAL_API_KEYS});

export const processPdf = async (req, res) => {
  let parser; 
  
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No PDF provided" });
    }

    // Use the new class-based method from pdf-parse v2
    parser = new PDFParse({ data: req.file.buffer });
    
    const data = await parser.getText();
    const text = data.text;

    const ai = await mistral.chat.complete({
      model: "mistral-small-latest",
      messages: [
        {
          role: "user",
          content: `Convert this resume text to structured JSON:\n\n${text}`,
        },
      ],
    });
    const content = ai.choices[0].message.content;

    let jsonContent;
    try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            jsonContent = JSON.parse(jsonMatch[0]);
        } else {
            throw new Error("No valid JSON object found in AI response.");
        }
    } catch (parseError) {
        console.error("Failed to parse JSON from AI response:", parseError);
        return res.status(500).json({ message: "Error parsing AI response." });
    }

    res.status(200).json({ pdfText: text, structuredData: jsonContent });

  } catch (err) {
    console.error("PDF processing error:", err);
    res.status(500).json({ message: "Error processing PDF" });
  } finally {
    // IMPORTANT: Always destroy the parser to free memory
    if (parser) {
      await parser.destroy();
    }
  }
};

export const saveMemory = async (req, res) => {
  const userId = req.user._id;
  const { wyd, know, trait, structuredData,pdfFilename } = req.body;
  const updated = await Memory.findOneAndUpdate(
    { userId },
    { wyd, know, trait, structuredData,pdfFilename },
    { new: true, upsert: true }
  );
  res.json({ message: "Saved", data: updated });
};

export const getMemory = async (req, res) => {
  const memory = await Memory.findOne({ userId: req.user._id });
  if (!memory) return res.json({ wyd: "", know: "", trait: "", structuredData: null, pdfFilename: null });
  res.json(memory);
};