import React, { useState, useEffect, useRef } from "react";
import Productcard from "./Productcard";
import { useNavigate } from "react-router-dom";

const Men = () => {
  const [products, setProducts] = useState([]);
  const isFetched = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isFetched.current) {
      fetch("https://full-fledged-ecommerce-website.onrender.com/men") // Update the API endpoint for men's products
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
      <h1 className="text-2xl font-bold">Men's Products</h1>
      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {products.map((product) => (
          <Productcard
            key={product.id}
            product={product}
            onClick={() => navigate(`/men/${product.id}`, { state: { product } })}
          />
        ))}
      </div>
    </div>
  );
};

export default Men;