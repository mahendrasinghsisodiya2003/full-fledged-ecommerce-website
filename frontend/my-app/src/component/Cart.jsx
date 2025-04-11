import React from "react";
import { useCart } from "./Cartcontext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart, removeFromCart } = useCart();
  const navigate = useNavigate();

  // Calculate total price of items
  const totalPrice = (cart || []).reduce((total, item) => total + item.price * item.quantity, 0);
  return (
    <div className="max-w-4xl mx-auto my-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">Shopping Cart 🛒</h2>

      {cart.length === 0 ? (
        <div className="text-center">
          <p>Your cart is empty.</p>
          <button
            onClick={() => navigate("/all")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <ul className="space-y-4">
            {cart.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-4 border-b pb-4 last:border-b-0"
              >
                {/* Product Image */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-20 w-20 rounded-lg object-cover cursor-pointer"
                  onClick={() => navigate(`/all/${item.id}`, { state: { product: item } })}
                />

                {/* Product Details */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-gray-600">${item.price.toFixed(2)}</p>
                  <p className="text-gray-600">Quantity: {item.quantity}</p>
                </div>

                {/* Remove Item Button */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700 transition"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          {/* Total Price */}
          <div className="mt-6 text-center">
            <h3 className="text-lg font-semibold">Total: ${totalPrice.toFixed(2)}</h3>
          </div>

          {/* Buy Now Button */}
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate("/checkout", {
                state: { total: totalPrice },
              })}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
            >
              Buy Now
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;