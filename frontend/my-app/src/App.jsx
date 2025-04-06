import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./component/Header";
import Shop from "./component/Shop";
import Men from "./component/Men";
import Women from "./component/Women";
import Cart from "./component/Cart";
import All from "./component/All";
import LoginSignup from "./component/Loginsignup";
import Signup from "./component/Signup";
import Productdisplay from "./component/Productdisplay";
import { AppProvider } from "./component/Cartcontext";
import Userpage from "./component/Userpage";
import { useEffect, useState } from "react";
import Protectedroute from "./component/Protectedroute";
import Buy from "./component/Buy";

function App() {
  const [user, setUser] = useState(null); // Move user state inside App

  // ✅ Correct useEffect usage
  useEffect(() => {
    const userData = localStorage.getItem("user");
  
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user"); // Clear corrupted data
      }
    }
  }, []);

  return (
    <AppProvider>
      <Header user={user} setUser={setUser} />
      <Routes>
        {/* Redirect to /username if logged in, else show Shop */}
        <Route
          path="/"
          element={
            user ? (
              <Navigate to={`/${user.username}`} replace />
            ) : (
              <Shop />
            )
          }
        />
        {/* User-specific route */}
        <Route path="/login" element={<LoginSignup setUser={setUser} />} />
        <Route path="/signup" element={<Signup setUser={setUser} />} />
        <Route element={<Protectedroute user={user} />}>
          <Route path="/:username" element={<Userpage user={user} />} />
          <Route path="/all" element={<All />} />
          <Route path="/checkout" element={<Buy/>} />
          <Route path="/men" element={<Men />} />
          <Route path="/women" element={<Women />} />
          <Route path="/cart" element={<Cart />} />
          <Route path=":category/:id" element={<Productdisplay />} />
        </Route>
      </Routes>
    </AppProvider>
  );
}

export default App;