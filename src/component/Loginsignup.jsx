import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./Cartcontext";

const LoginSignup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser, setToken } = useUser();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("All fields are required");
      return;
    }
  
    setLoading(true);
    setError("");
  
    try {
      const normalizedEmail = username.trim().toLowerCase();
      console.log("Sending login request with payload:", {
        email: normalizedEmail,
        password,
      });

      const response = await fetch("https://full-fledged-ecommerce-website.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      console.log("Login Response:", data);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      navigate(`/${data.user.username}`);
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.message || "Something went wrong");
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
            placeholder="Email"
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