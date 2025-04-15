const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAi.getGenerativeModel({
  model: 'gemini-2.0-flash-thinking-exp-01-21',
});

const aiService = {
  prompt: async (question) => {
    const p = {
      "contents": [
        {
          "parts": [
            { "text": question }
          ],
        },
      ],
    };
    const result = await model.generateContent(p, { timeout: 60000 });
    return result.response;
  },
  longContext: () => {},
};

module.exports = aiService;
