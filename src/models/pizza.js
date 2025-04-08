const mongoose = require('mongoose');

let pizzaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
});

module.exports = mongoose.model('Pizza', pizzaSchema);
