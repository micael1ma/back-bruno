const mongoose = require("mongoose");
const User = require("./user");
const Pizza = require("./pizza");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderItem",
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    summary: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "preparing", "ready", "delivered"],
      default: "pending",
    },
  },
  { timestamps: true }
);

orderSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("items")) {
    try {
      const user = await User.findById(this.user);
      const orderItems = await this.model("OrderItem")
        .find({ _id: { $in: this.items } })
        .populate("pizza");

      if (!this.total) {
        this.total = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
      }

      const pizzaCount = orderItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      const pizzaNames = [
        ...new Set(orderItems.map((item) => item.pizza.name)),
      ];

      this.summary = `${user.name} comprou ${pizzaCount} ${
        pizzaCount > 1 ? "pizzas" : "pizza"
      } (${pizzaNames.join(", ")}) por R$${this.total.toFixed(2)}`;
    } catch (error) {
      console.error("Erro ao gerar summary:", error);
      return next(error);
    }
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);
