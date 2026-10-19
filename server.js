
import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3001;

app.post("/api/ai", async (req, res) => {
  try {
    const message = req.body?.message;

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        error: "Vui lòng nhập câu hỏi."
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "Chưa cấu hình GEMINI_API_KEY trong file .env."
      });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: message
    });

    return res.json({
      reply: response.text || "AI chưa trả về nội dung."
    });
  } catch (error) {
    console.error("Gemini error:", error.message);

    return res.status(500).json({
      error: "Gọi Gemini thất bại. Hãy kiểm tra API key, quyền truy cập và hạn mức."
    });
  }
});

app.listen(PORT, () => {
  console.log(`SmartShop AI server chạy tại http://localhost:${PORT}`);
});
