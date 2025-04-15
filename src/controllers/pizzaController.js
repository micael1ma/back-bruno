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

const getAvailablePizzas = async (req, res) => {
  try {
    const pizzas = await Pizza.find()
      .select("name price -_id")
      .sort({ name: 1 })
      .lean();

    if (!pizzas.length) {
      return res.type("text/plain").send("Nenhuma pizza cadastrada no sistema");
    }

    const cardapioString = pizzas
      .map((pizza) => {
        const precoFormatado = pizza.price.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
          minimumFractionDigits: 2,
        });
        return `- ${pizza.name.padEnd(20)} ${precoFormatado}`;
      })
      .join("\n");

    const result = `Cardápio de Pizzas:\n\n${cardapioString}\n\nTotal de ${pizzas.length} sabores disponíveis.`;

    res.type("text/plain").send(result);
  } catch (error) {
    console.error("Erro ao buscar pizzas:", error);
    res
      .status(500)
      .type("text/plain")
      .send("Erro ao gerar cardápio. Por favor, tente novamente.");
  }
};

module.exports = { getPizzas, createPizza, getAvailablePizzas };
