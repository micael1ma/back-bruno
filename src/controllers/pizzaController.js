const Pizza = require('../models/pizza');

const getPizzas = async (req, res) => {
  const pizzas = await Pizza.find();
  res.json(pizzas);
};

const createPizza = async (req, res) => {
  const { name, description, price } = req.body;

  const newPizza = new Pizza({
    name,
    description,
    price,
  });

  await newPizza.save();

  res.json({
    message: 'New Pizza created',
    newPizza,
  });
};

module.exports = { getPizzas, createPizza };
