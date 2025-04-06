import React, { createContext, useContext, useEffect, useState } from "react";

// Create contexts
const UserContext = createContext();
const CartContext = createContext();

// Combined provider
export const AppProvider = ({ children }) => {
  // User state
  const [user, setUser] = useState(null);

  // Cart state
  const [cart, setCart] = useState([]);

  // Load cart from local storage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Add to cart
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);

      if (existingItem) {
        // If the item already exists, update its quantity
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // If the item doesn't exist, add it to the cart
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // Remove from cart
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <CartContext.Provider value={{ cart, addToCart, removeFromCart, setCart }}>
        {children}
      </CartContext.Provider>
    </UserContext.Provider>
  );
};

// Custom hooks for accessing contexts
export const useUser = () => useContext(UserContext);
export const useCart = () => useContext(CartContext);