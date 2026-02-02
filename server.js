const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const PORT = 5000;

const OPENAI_API_KEY = "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"; // safe backend

app.use(cors());
app.use(express.json());

app.post("/chat", async (req,res)=>{
  const prompt = req.body.prompt;
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      { model:"gpt-3.5-turbo", messages:[{role:"user", content:prompt}] },
      { headers:{ "Content-Type":"application/json", "Authorization":`Bearer ${OPENAI_API_KEY}` } }
    );
    res.json({ text: response.data.choices[0].message.content });
  } catch(err) {
    res.status(500).json({ text:"AI error" });
  }
});

app.listen(PORT,()=>console.log(`Server running at http://localhost:${PORT}`));
