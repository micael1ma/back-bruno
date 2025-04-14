const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  pizza: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pizza",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  unitPrice: {
    type: Number,
    required: true,
  },
  subtotal: {
    type: Number,
  },
});

orderItemSchema.pre("validate", function (next) {
  if (this.isModified("quantity") || this.isModified("unitPrice")) {
    this.subtotal = this.unitPrice * this.quantity;
  }
  next();
});

module.exports = mongoose.model("OrderItem", orderItemSchema);
