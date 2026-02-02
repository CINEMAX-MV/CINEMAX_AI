// server.js
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const PORT = 5000;

// මේක ඔයා දාලා තියෙන API key
const OPENAI_API_KEY = "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";

app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  const prompt = req.body.prompt;
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }]
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_API_KEY}`
        }
      }
    );

    const aiText = response.data.choices[0].message.content;
    res.json({ text: aiText });
  } catch (error) {
    console.error("Error calling OpenAI:", error.message);
    res.status(500).json({ text: "AI API error 😢" });
  }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
