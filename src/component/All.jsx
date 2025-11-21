import React, { useState, useEffect, useRef } from "react";
import Productcard from "./Productcard";
import { useNavigate } from "react-router-dom";

const All = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const isFetched = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isFetched.current) {
      fetch("https://full-fledged-ecommerce-website.onrender.com/all")
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          // Ensure data is an array
          setProducts(Array.isArray(data) ? data : []);
          isFetched.current = true;
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setError(error.message);
          setProducts([]);
        })
        .finally(() => setLoading(false));
    }
  }, []);

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Error: {error}</div>;

  return (
    <div>
      <h1 className="text-2xl text-center font-bold">All Products</h1>
      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {products.map((product) => (
          <Productcard
            key={product.id}
            product={product}
            onClick={() => navigate(`/all/${product.id}`, { state: { product } })}
          />
        ))}
      </div>
    </div>
  );
};

export default All;