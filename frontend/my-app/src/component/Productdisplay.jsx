import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Productdisplay = () => {
  const { category, id } = useParams();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    let apiUrl = `https://full-fledged-ecommerce-website.onrender.com/${category}`;
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const selectedProduct = data.find((item) => item.id.toString() === id);
        setProduct(selectedProduct);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
        setLoading(false);
      });
  }, [category, id]);

  const addToCart = (product) => {
    const newCart = [...cart];
    const existingItem = newCart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      newCart.push({ ...product, quantity: 1 });
    }

    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const removeFromCart = (productId) => {
    const newCart = cart.filter((item) => item.id !== productId);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found.</p>;

  const isInCart = cart.some((item) => item.id === product.id);

  return (
    <div className="flex gap-10 mx-10 my-5">
      {/* Left Side: Image */}
      <div className="flex-1">
        <img
          src={product.image}
          alt={product.title}
          className="w-full max-h-[400px] object-contain"
        />
      </div>

      {/* Right Side: Details */}
      <div className="flex-1 space-y-4">
        <h1 className="text-2xl font-bold">{product.title}</h1>
        <p className="text-gray-700">{product.description}</p>
        <p className="font-semibold text-lg">Price: ${product.price}</p>

        {/* Add/Remove Cart Button */}
        <button
          className={`px-4 py-2 rounded-md text-white transition-all duration-300 ${
            isInCart ? "bg-red-500 hover:bg-red-700" : "bg-blue-500 hover:bg-blue-700"
          }`}
          onClick={() => {
            isInCart ? removeFromCart(product.id) : addToCart(product);
          }}
        >
          {isInCart ? "Remove from Cart" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default Productdisplay;