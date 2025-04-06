import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginSignup = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("All fields are required");
      return;
    }
  
    setLoading(true);
    setError("");
  
    try {
      // Ensure the username is the full email address
      const normalizedEmail = username.trim().toLowerCase();
      console.log("Sending login request with payload:", {
        email: normalizedEmail,
        password,
      }); // Log the request payload
  
      const response = await axios.post("http://localhost:3030/login", {
        email: normalizedEmail, // Send the full email address
        password,
      });
      console.log("Login Response:", response.data); // Log the response
  
      // ✅ Login successful → Store token & Update user state
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setUser(response.data.user); // Update user state in App.jsx
      navigate(`/${response.data.user.username}`); // Navigate to user-specific page
    } catch (err) {
      console.error("Login Error:", err.response?.data); // Log the error
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-96">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Login
        </h2>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
        <input
  type="text"
  placeholder="Email" // Update placeholder to "Email"
  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
/>
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center">
          Don't have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer hover:underline"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </span>
        </p>

        <div className="mt-4 text-center">
          <button
            className="text-gray-600 hover:text-gray-800"
            onClick={() => navigate("/")}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;