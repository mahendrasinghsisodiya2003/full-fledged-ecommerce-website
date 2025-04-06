import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

// Load your Stripe publishable key
const stripePromise = loadStripe("pk_test_XXXXXXXXXXXXXXXXXXXXXXXX"); // Replace with your Stripe publishable key

const CheckoutForm = ({ total }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    try {
      // Create a payment intent on the backend using Axios
      const response = await axios.post("/create-payment-intent", {
        amount: total * 100, // Convert total to cents
      });

      const { clientSecret } = response.data;

      // Confirm the payment on the frontend
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (stripeError) {
        setError(stripeError.message);
        setSuccess(false);
      } else {
        setError(null);
        setSuccess(true);
        console.log("Payment successful:", paymentIntent);
      }
    } catch (error) {
      setError("An error occurred while processing your payment.");
      console.error("Payment error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <CardElement className="p-4 border rounded-lg" />
      <button
        type="submit"
        disabled={!stripe}
        className="mt-4 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
      >
        Pay ${total.toFixed(2)}
      </button>
      {error && <p className="mt-4 text-red-500">{error}</p>}
      {success && <p className="mt-4 text-green-500">Payment successful!</p>}
    </form>
  );
};

const Buy = () => {
  const location = useLocation();
  const { total } = location.state || { total: 0 }; // Default to 0 if no state is passed

  // Ensure total is a number
  const parsedTotal = typeof total === "number" ? total : parseFloat(total);

  return (
    <div className="max-w-4xl mx-auto my-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">Checkout</h2>
      <p className="text-lg text-center">Total Amount: ${parsedTotal.toFixed(2)}</p>
      <Elements stripe={stripePromise}>
        <CheckoutForm total={parsedTotal} />
      </Elements>
    </div>
  );
};

export default Buy;