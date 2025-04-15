const Order = require("../models/order");
const OrderItem = require("../models/orderItem");
const Pizza = require("../models/pizza");

const createOrder = async (req, res) => {
  try {
    const { items } = req.body;
    const userId = req.user._id;

    const orderItems = await Promise.all(
      items.map(async (item) => {
        const pizza = await Pizza.findById(item.pizzaId);
        if (!pizza) {
          throw new Error(`Pizza ${item.pizzaId} não encontrada`);
        }

        const orderItem = new OrderItem({
          pizza: item.pizzaId,
          quantity: item.quantity,
          unitPrice: pizza.price,
        });
        await orderItem.validate();
        await orderItem.save();
        return orderItem;
      })
    );

    const order = new Order({
      user: userId,
      items: orderItems.map((item) => item._id),
      total: orderItems.reduce((sum, item) => sum + item.subtotal, 0),
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    res.status(400).json({
      error: error.message,
      details: error.errors,
    });
  }
};
const searchBySummary = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.length < 3) {
      return res.status(400).json({
        success: false,
        error: "Forneça pelo menos 3 caracteres para busca",
      });
    }

    const orders = await Order.find({
      user: req.user._id,
      summary: { $regex: query, $options: "i" }, // Case insensitive
    })
      .select("summary createdAt status total")
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erro ao buscar pedidos",
    });
  }
};

const getAllSummaries = async (req, res) => {
  try {
    const orders = await Order.find()
      .select("summary createdAt -_id")
      .sort({ createdAt: -1 })
      .lean();

    if (!orders.length) {
      return res.type("text/plain").send("Nenhum pedido registrado no sistema");
    }

    let result = "Os pedidos que já foram feitos são:\n\n";

    orders.forEach((order, index) => {
      const orderNumber = orders.length - index;
      const date = new Date(order.createdAt).toLocaleString("pt-BR");

      result += `* **Pedido ${orderNumber} - ${date}:** ${order.summary}\n`;
    });

    res.type("text/plain").send(result);
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    res.status(500).type("text/plain").send("Erro interno ao gerar relatório");
  }
};

module.exports = {
  createOrder,
  searchBySummary,
  getAllSummaries,
};
