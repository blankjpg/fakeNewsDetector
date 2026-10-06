require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.post("/analyse", async (req, res) => {

    try {
        const { title, text } = req.body;

        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [
                {
                    role: "system",
                    content: `You are a fake news and misinformation analysis assistant.

Analyse the provided news article carefully.

Return ONLY valid JSON in this exact format:
{
  "verdict": "Likely credible",
  "riskScore": 20,
  "reasons": [
    "reason 1",
    "reason 2",
    "reason 3"
  ],
  "claims": [
    "claim that should be verified"
  ],
  "recommendation": "short recommendation"
}

Do not claim that an article is definitely true or false.
Assess the language, unsupported claims, sensationalism, lack of evidence,
internal inconsistencies, and other signs of potential misinformation.`
                },
                {
                    role: "user",
                    content: `ARTICLE TITLE:
${title}

ARTICLE TEXT:
${text}`
                }
            ],
            response_format: { type: "json_object" }
        });

        const result = JSON.parse(response.choices[0].message.content);

        res.json(result);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "AI analysis failed"
        });
    }
});

app.listen(3000, () => {
    console.log("Fake News AI server running on http://localhost:3000");
});