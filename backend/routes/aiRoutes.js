const express = require("express");
const axios = require("axios");
const dotenv =  require("dotenv");

dotenv.config();

const router = express.Router();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

router.post("/askgemini", async (req, res) => {
    const { userInput, fields } = req.body;
    const fieldNames = fields.map(field => field.name);
    
    const prompt = `
        Extract the following details from the text:
        ${fieldNames}.

        Text: "${userInput}"

        Provide the result in **pure JSON format** without any markdown or explanations. If the field Date of Birth is in words, make it in "yyyy-mm-dd" format.
        Make sure to not change the field names in the response.
    `;

    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                contents: [{ parts: [{ text: prompt }] }]
            }
        );

        let extractedData = response.data.candidates[0]?.content?.parts[0]?.text || "{}";

        //  Remove Markdown Formatting (```json ... ```)
        extractedData = extractedData.replace(/```json/g, "").replace(/```/g, "").trim();

        // Convert to JSON
        const parsedData = JSON.parse(extractedData);

        res.json({ extractedData: parsedData });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "Failed to extract data" });
    }
});

module.exports = router;
