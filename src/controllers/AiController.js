const aiService = require('../services/AiService');

const aiController = {
  prompt: async (req, res) => {
    try {
      const result = await aiService.prompt(req.body.prompt);
      const text = await result.text();
      res.status(200).json(text);
    } catch (error) {
      console.error("Erro no prompt:", error);
      res.status(500).json({ error: 'Erro de servidor' });
    }
  },

  longContext: async (req, res) => {
    try {
      const result = await aiService.longContext(req.body.prompt);
      const text = await result.text();
      res.status(200).json(text);
    } catch (error) {
      console.error("Erro no longContext:", error);
      res.status(500).json({ error: 'Erro de servidor' });
    }
  },
};

module.exports = aiController;
