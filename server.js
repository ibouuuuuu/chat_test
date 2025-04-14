// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";

// Charge les variables du fichier .env
dotenv.config();

// Initialise l'API OpenAI avec ta clé
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Initialise le serveur Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());              // autorise les appels depuis ton front
app.use(express.json());      // pour lire le JSON envoyé depuis fetch

// Endpoint pour traiter les messages
app.post("/api/gpt", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }],
    });

    const reply = completion.data.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("Erreur OpenAI :", error);
    res.status(500).json({ reply: "Oups, le bot a eu un bug 🤖❌" });
  }
});

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});
