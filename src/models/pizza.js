const mongoose = require("mongoose");

let pizzaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "O nome da pizza é obrigatório"],
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    required: [true, "A descrição é obrigatória"],
    maxlength: [500, "Descrição muito longa (máx. 500 caracteres)"],
  },
  price: {
    type: Number,
    required: [true, "O preço é obrigatório"],
    min: [0, "O preço não pode ser negativo"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Pizza", pizzaSchema);
