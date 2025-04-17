const Cart = require("../model/Cart");


// Add or update item in cart
const addToCart = async (req, res) => {
  const { email, productId, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ email });

    if (!cart) {
      cart = new Cart({ email, items: [] });
    }

    const itemIndex = cart.items.findIndex((item) => item.productId === productId);

    if (itemIndex > -1) {
      if (quantity === 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
      }
    } else if (quantity > 0) {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.status(200).json({ message: "Cart updated successfully", cart });
  } catch (error) {
    res.status(500).json({ message: "Error updating cart", error });
  }
};

// Fetch cart for a user
const getCart = async (req, res) => {
  const { email } = req.params;
  try {
    const cart = await Cart.findOne({ email });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json({ cart });
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart", error });
  }
};

module.exports = { addToCart, getCart };