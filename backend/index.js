const express = require("express");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken"); // Import jsonwebtoken
const app = express();
const port = 3030;
const NewUser = require("./model/Newuser");
const bcrypt = require("bcryptjs");
const Stripe = require("stripe");
const Cart = require("./model/Cart");
const rateLimit = require('express-rate-limit');
require("dotenv").config();


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

app.use(limiter);


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

mongoose.connect(process.env.MONGOOS, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Middleware
app.use(cors());
app.use(express.json());

// Route to fetch data when frontend requests `/all`
app.get("/all", async (req, res) => {
  try {
    const response = await axios.get("https://fakestoreapi.com/products"); // Fetch data from external API
    res.json(response.data); // Send data to frontend
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
});

// Route to fetch data when frontend requests `/men`
app.get("/men", async (req, res) => {
  try {
    const response = await axios.get("https://fakestoreapi.com/products/category/men's clothing"); // Fetch data from external API
    res.json(response.data); // Send data to frontend
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
});

// Route to fetch data when frontend requests `/women`
app.get("/women", async (req, res) => {
  try {
    const response = await axios.get("https://fakestoreapi.com/products/category/women's clothing"); // Fetch data from external API
    res.json(response.data); // Send data to frontend
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
});

// Default Route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Signup Route
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    console.log("Signup request received for email:", email); // Log the email

    // Check if user already exists
    const existingUser = await NewUser.findOne({ email });
    if (existingUser) {
      console.log("User already exists for email:", email); // Log the email
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new NewUser({ username, email, password: hashedPassword });
    await newUser.save();

    console.log("User created:", newUser); // Log the created user

    // Send a proper response with user data
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Error during signup:", error); // Log the error
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});


// Login Route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Trim and convert email to lowercase
    const normalizedEmail = email.trim().toLowerCase();

    console.log("Login request received for email:", normalizedEmail); // Log the normalized email

    // Find user by normalized email
    const user = await NewUser.findOne({ email: normalizedEmail });
    console.log("Query result:", user); // Log the query result
    if (!user) {
      console.log("User not found for email:", normalizedEmail); // Log the normalized email
      return res.status(400).json({ message: "User not found" });
    }

    console.log("User found:", user); // Log the user object

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch for email:", normalizedEmail); // Log the normalized email
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "1h" });

    // Return user data
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    console.error("Error during login:", error); // Log the error
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
app.post("/create-payment-intent", async (req, res) => {
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