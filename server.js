import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(cors());
app.use(express.json());

// 🔑 Inicializa Gemini con tu API KEY
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const SYSTEM_PROMPT = `
Eres el asistente oficial de INDARELÍN e INDAUTOR.
Respondes en español con precisión y sin inventar datos.
NO debes mencionar universidades ni la UTN.
Tu función es explicar trámites, dudas y problemas del sistema INDARELÍN.
`;

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const prompt = SYSTEM_PROMPT + "\nUsuario: " + message;

    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Error al procesar la solicitud con Gemini." });
  }
});

app.listen(3000, () => {
  console.log("Servidor Gemini escuchando en puerto 3000");
});
