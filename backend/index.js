const express = require("express");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const app = express();
const port = process.env.PORT || 3030;
const NewUser = require("./model/Newuser");
const bcrypt = require("bcryptjs");
const Stripe = require("stripe");
const Cart = require("./model/Cart");
const rateLimit = require('express-rate-limit');
const { authenticateToken, optionalAuth } = require('./middleware/auth');
require("dotenv").config();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});

app.use(limiter);

// CORS and JSON middleware - MUST be before routes
app.use(cors({
  origin: "*",
  credentials: true
}));
app.use(express.json());

// Request logger for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Connect to MongoDB (async, non-blocking)
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ecommerce", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => console.error("❌ MongoDB Connection Error:", err.message || err));

// Start server immediately (don't wait for DB)
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// Simple fallback product list (in case remote fails)
const fallbackProducts = [
  { id: 1, title: "Fallback Product 1", price: 9.99, image: "", description: "Fallback item" },
  { id: 2, title: "Fallback Product 2", price: 19.99, image: "", description: "Fallback item" }
];

// Proxy base (allorigins) - encodes target URL
const PROXY_BASE = "https://api.allorigins.win/raw?url=";
const axiosOptions = {
  timeout: 8000,
  headers: {
    Accept: "application/json, text/plain, */*",
    // Browser-like UA helps avoid simple server-side blocks
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  },
  // let us inspect non-2xx responses instead of throwing
  validateStatus: () => true
};

app.get("/all", async (req, res) => {
  console.log("GET /all called");
  const target = "https://fakestoreapi.com/products";
  const proxiedUrl = PROXY_BASE + encodeURIComponent(target);

  try {
    let response = await axios.get(proxiedUrl, axiosOptions);

    // If remote returned non-2xx, try once more (transient)
    if (response.status >= 400) {
      console.warn("First proxied request returned status", response.status, "— retrying once...");
      response = await axios.get(proxiedUrl, axiosOptions);
    }

    if (response.status >= 200 && response.status < 300 && Array.isArray(response.data)) {
      console.log("Fetched products from proxied fakestoreapi:", response.data.length);
      return res.json(response.data);
    }

    console.error("Proxy/fakestore returned non-2xx. status:", response.status, "data:", response.data);
    return res.json(fallbackProducts);
  } catch (error) {
    console.error("Unexpected error in /all - full error:", {
      message: error.message,
      code: error.code,
      stack: error.stack,
      responseStatus: error.response && error.response.status,
      responseData: error.response && error.response.data,
    });
    return res.json(fallbackProducts);
  }
});

app.get("/men", async (req, res) => {
  console.log("GET /men called");
  const target = "https://fakestoreapi.com/products/category/" + encodeURIComponent("men's clothing");
  const proxiedUrl = PROXY_BASE + encodeURIComponent(target);

  try {
    let response = await axios.get(proxiedUrl, axiosOptions);

    if (response.status >= 400) {
      console.warn("First proxied /men request returned", response.status, "— retrying once...");
      response = await axios.get(proxiedUrl, axiosOptions);
    }

    if (response.status >= 200 && response.status < 300 && Array.isArray(response.data)) {
      return res.json(response.data);
    }

    console.error("Proxy/fakestore /men non-2xx:", response.status, response.data);
    return res.json([]);
  } catch (error) {
    console.error("Error in /men:", error.message || error);
    return res.json([]);
  }
});

app.get("/women", async (req, res) => {
  console.log("GET /women called");
  const target = "https://fakestoreapi.com/products/category/" + encodeURIComponent("women's clothing");
  const proxiedUrl = PROXY_BASE + encodeURIComponent(target);

  try {
    let response = await axios.get(proxiedUrl, axiosOptions);

    if (response.status >= 400) {
      console.warn("First proxied /women request returned", response.status, "— retrying once...");
      response = await axios.get(proxiedUrl, axiosOptions);
    }

    if (response.status >= 200 && response.status < 300 && Array.isArray(response.data)) {
      return res.json(response.data);
    }

    console.error("Proxy/fakestore /women non-2xx:", response.status, response.data);
    return res.json([]);
  } catch (error) {
    console.error("Error in /women:", error.message || error);
    return res.json([]);
  }
});

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    console.log("Signup request received for email:", email);

    const existingUser = await NewUser.findOne({ email });
    if (existingUser) {
      console.log("User already exists for email:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new NewUser({ username, email, password: hashedPassword });
    await newUser.save();

    console.log("User created:", newUser);

    const secretKey = process.env.SECRET_KEY || "fallback-secret-key-for-development-only";
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      secretKey,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    console.log("Login request received for email:", normalizedEmail);

    const user = await NewUser.findOne({ email: normalizedEmail });
    console.log("Query result:", user);
    if (!user) {
      console.log("User not found for email:", normalizedEmail);
      return res.status(400).json({ message: "User not found" });
    }

    console.log("User found:", user);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch for email:", normalizedEmail);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const secretKey = process.env.SECRET_KEY || "fallback-secret-key-for-development-only";
    const token = jwt.sign(
      { id: user._id, email: user.email },
      secretKey,
      { expiresIn: "24h" }
    );

    res.json({ 
      message: "Login successful",
      token, 
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email 
      } 
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

app.get("/verify-token", authenticateToken, (req, res) => {
  res.json({ 
    message: "Token is valid", 
    user: req.user 
  });
});

app.post("/logout", authenticateToken, (req, res) => {
  res.json({ message: "Logged out successfully" });
});

app.post("/cart/add", authenticateToken, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const email = req.user.email;

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
});

app.get("/cart/:email", authenticateToken, async (req, res) => {
  try {
    const { email } = req.params;
    
    if (req.user.email !== email) {
      return res.status(403).json({ message: "Access denied" });
    }

    const cart = await Cart.findOne({ email });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json({ cart });
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart", error });
  }
});

const stripe = Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_51QxRlwHOmiBafKm0UwHT5i1ikYe0jJthLBToKG2OkWVgNfSTaWY3E01UO2VLGZ3QJCqBliDAeQSw5aiEbdiivztH00EfI4vE7Y");
app.post("/create-payment-intent", authenticateToken, async (req, res) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});