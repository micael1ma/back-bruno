const Pizza = require("../models/pizza");

const getPizzas = async (req, res) => {
  try {
    const pizzas = await Pizza.find();
    res.status(200).json(pizzas);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar pizzas" });
  }
};

const createPizza = async (req, res) => {
  const { name, description, price } = req.body;

  if (!name || !price) {
    return res.status(400).json({ error: "Nome e preço são obrigatórios" });
  }

  try {
    const newPizza = new Pizza({ name, description, price });
    await newPizza.save();
    res.status(201).json({
      message: "Pizza criada com sucesso",
      pizza: newPizza,
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar pizza" });
  }
};

module.exports = { getPizzas, createPizza };
