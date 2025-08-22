import React, { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();
const CartContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        try {
          const response = await fetch('http://localhost:3030/verify-token', {
            headers: {
              'Authorization': `Bearer ${storedToken}`
            }
          });
          
          if (response.ok) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setToken(null);
            setUser(null);
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        }
      }
    };

    verifyToken();
  }, []);

  useEffect(() => {
    const loadCart = async () => {
      if (user?.email && token) {
        try {
          const response = await fetch(`http://localhost:3030/cart/${user.email}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
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
  }, [user, token]);

  const addToCart = async (product) => {
    if (!user?.email || !token) {
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
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
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
    if (!user?.email || !token) {
      setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
      return;
    }

    try {
      const response = await fetch("http://localhost:3030/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
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

  const logout = async () => {
    if (token) {
      try {
        await fetch('http://localhost:3030/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setCart([]);
  };

  return (
    <UserContext.Provider value={{ user, setUser, token, setToken, logout }}>
      <CartContext.Provider value={{ cart, addToCart, removeFromCart, setCart }}>
        {children}
      </CartContext.Provider>
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
export const useCart = () => useContext(CartContext); 