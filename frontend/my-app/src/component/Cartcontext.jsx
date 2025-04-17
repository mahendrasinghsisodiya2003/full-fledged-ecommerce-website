import React, { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();
const CartContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const loadCart = async () => {
      if (user?.email) {
        try {
          const response = await fetch(`http://localhost:3030/cart/${user.email}`);
          if (response.ok) {
            const data = await response.json();
            if (data.cart) {
              setCart(data.cart.items);
            }
          }
        } catch (error) {
          console.error("Error loading cart:", error);
        }
      }
    };

    loadCart();
  }, [user]);

  const addToCart = async (product) => {
    if (!user?.email) {
      setCart((prevCart) => {
        const existingItem = prevCart.find((item) => item.id === product.id);
        if (existingItem) {
          return prevCart.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        } else {
          return [...prevCart, { ...product, quantity: 1 }];
        }
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:3030/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          productId: product.id,
          quantity: 1,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data.cart.items);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const removeFromCart = async (productId) => {
    if (!user?.email) {
      setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
      return;
    }

    try {
      const response = await fetch("http://localhost:3030/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          productId: productId,
          quantity: 0,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data.cart.items);
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <CartContext.Provider value={{ cart, addToCart, removeFromCart, setCart }}>
        {children}
      </CartContext.Provider>
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
export const useCart = () => useContext(CartContext); 