import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUserCircle, FaBars } from "react-icons/fa";
import { useUser } from "./Cartcontext";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useUser();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="bg-zinc-400 h-20 flex items-center justify-between w-full px-4 top-0 left-0 right-0 z-50">
      <div className="flex items-center">
        <Link to="/">
          <img
            src="/alliedclublogo.jpeg"
            alt="Company Logo"
            className="cursor-pointer rounded-full h-16 w-16 object-cover"
          />
        </Link>
      </div>

      <ul className="hidden sm:flex gap-8 text-xl transition-all duration-300 ease-in-out mx-auto">
        <li className={`cursor-pointer font-medium ${location.pathname === "/" ? "text-blue-600 font-bold" : ""}`}>
          <Link to="/">Home</Link>
        </li>
        <li className={`cursor-pointer font-medium ${location.pathname === "/all" ? "text-blue-600 font-bold" : ""}`}>
          <Link to="/all">All</Link>
        </li>
        <li className={`cursor-pointer font-medium ${location.pathname === "/men" ? "text-blue-600 font-bold" : ""}`}>
          <Link to="/men">Men</Link>
        </li>
        <li className={`cursor-pointer font-medium ${location.pathname === "/women" ? "text-blue-600 font-bold" : ""}`}>
          <Link to="/women">Women</Link>
        </li>
      </ul>

      <div className="flex items-center gap-4">
        <div className="sm:hidden">
          <FaBars
            className="text-3xl cursor-pointer"
            onClick={() => setNavOpen(!navOpen)}
          />
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="relative">
              <FaUserCircle className="text-3xl cursor-pointer" onClick={() => setMenuOpen(!menuOpen)} />
              {menuOpen && (
                <div className="absolute top-12 right-0 bg-white p-4 rounded-lg shadow-lg">
                  <p className="text-sm mb-2">{user.username}</p>
                  <button 
                    className="text-sm text-blue-500 hover:underline"
                    onClick={() => navigate('/cart')}
                  >
                    Cart
                  </button>
                  <button 
                    className="text-sm text-red-500 hover:underline mt-2"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              className="w-24 h-12 rounded-[75px] border-2 active:bg-zinc-400 border-black p-2"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
          )}

          <i className="fa fa-shopping-cart text-3xl cursor-pointer" onClick={() => navigate('/cart')}></i>
        </div>
      </div>

      {navOpen && (
        <div className="sm:hidden absolute top-20 left-0 w-full bg-zinc-400 z-50">
          <ul className="flex flex-col items-center gap-4 py-4">
            <li className={`cursor-pointer font-medium ${location.pathname === "/" ? "text-blue-600 font-bold" : ""}`}>
              <Link to="/" onClick={() => setNavOpen(false)}>Home</Link>
            </li>
            <li className={`cursor-pointer font-medium ${location.pathname === "/all" ? "text-blue-600 font-bold" : ""}`}>
              <Link to="/all" onClick={() => setNavOpen(false)}>All</Link>
            </li>
            <li className={`cursor-pointer font-medium ${location.pathname === "/men" ? "text-blue-600 font-bold" : ""}`}>
              <Link to="/men" onClick={() => setNavOpen(false)}>Men</Link>
            </li>
            <li className={`cursor-pointer font-medium ${location.pathname === "/women" ? "text-blue-600 font-bold" : ""}`}>
              <Link to="/women" onClick={() => setNavOpen(false)}>Women</Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Header;