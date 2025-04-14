const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

const secret = process.env.JWT_SECRET;

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).exec();
    if (!user) {
      return res.status(401).json({ error: "Email ou senha incorretos" });
    }

    user.isCorrectPassword(password, (err, same) => {
      if (err || !same) {
        return res.status(401).json({ error: "Email ou senha incorretos" });
      }

      const token = jwt.sign(
        {
          userId: user._id,
        },
        secret,
        { expiresIn: "30d" }
      );

      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;

      res.json({
        user: userWithoutPassword,
        token,
      });
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Erro interno, tente novamente" });
  }
};

const register = async (req, res) => {
  const { name, email, cpf, password } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { cpf }] });
    if (existingUser) {
      return res.status(400).json({ error: "Email ou CPF já cadastrado" });
    }

    const user = new User({ name, email, cpf, password });
    await user.save();

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      error: "Erro ao registrar usuário",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = { login, register };
