const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  quantity: { type: Number, required: true },
});

const cartSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }, // Use email instead of username
  items: [cartItemSchema],
});

module.exports = mongoose.model("Cart", cartSchema);