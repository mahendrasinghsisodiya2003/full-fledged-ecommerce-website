const Cart = require("../model/Cart");


// Add or update item in cart
const addToCart = async (req, res) => {
  const { email, productId, quantity } = req.body; {
    // Find the cart for the user
    let cart = await Cart.findOne({ email });

    // If cart doesn't exist, create a new one
    if (!cart) {
      cart = new Cart({ email, items: [] });
    }

    // Check if the product already exists in the cart
    const itemIndex = cart.items.findIndex((item) => item.productId === productId);

    if (itemIndex > -1) {
      // Update the quantity if the product already exists
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Add new product to the cart
      cart.items.push({ productId, quantity });
    }

    // Save the cart
    await cart.save();

    res.status(200).json({ message: "Item added to cart", cart });
  } catch (error) {
    res.status(500).json({ message: "Error adding item to cart", error });
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