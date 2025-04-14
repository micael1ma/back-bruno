const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      _id: decoded.userId,
      email: decoded.email,
    };

    next();
  } catch (error) {
    console.error("Erro na verificação do token:", error.message);
    res.status(401).json({
      error: "Token inválido",
      details: process.env.NODE_ENV === "development" ? error.message : null,
    });
  }
};

module.exports = authMiddleware;
