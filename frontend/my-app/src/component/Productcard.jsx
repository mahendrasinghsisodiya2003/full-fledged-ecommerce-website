import React from "react";

const Productcard = ({ product, onClick }) => {
  return (
    <div
      className="bg-white shadow-xl rounded-2xl p-4 w-full max-w-[250px] cursor-pointer" // ✅ Use w-full for flexible width
      onClick={onClick}
    >
      {/* Product Image */}
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-40 object-cover rounded-lg"
      />

      {/* Product Details */}
      <div className="mt-3">
        <h2 className="text-lg font-semibold">{product.title}</h2>
        <p className="text-gray-500 text-sm">
          {product.description.split(" ").slice(0, 15).join(" ")}...
        </p>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xl font-bold text-green-600">${product.price}</span>
        </div>
      </div>
    </div>
  );
};

export default Productcard;