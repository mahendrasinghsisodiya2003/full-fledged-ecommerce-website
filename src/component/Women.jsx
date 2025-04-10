import React, { useState, useEffect, useRef } from "react";
import Productcard from "./Productcard";
import { useNavigate } from "react-router-dom";

const Women = () => {
  const [products, setProducts] = useState([]);
  const isFetched = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isFetched.current) {
      fetch("https://full-fledged-ecommerce-website.onrender.com/women") // Update the API endpoint for women's products
        .then((response) => response.json())
        .then((data) => {
          setProducts(data);
          isFetched.current = true;
        })
        .catch((error) => console.error("Error fetching data:", error));
    }
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold">Women's Products</h1>
      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {products.map((product) => (
          <Productcard
            key={product.id}
            product={product}
            onClick={() => navigate(`/women/${product.id}`, { state: { product } })}
          />
        ))}
      </div>
    </div>
  );
};

export default Women;