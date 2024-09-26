import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LoginPopUp from "./loginPopUp"; // Import the login pop-up component

const Navbar: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");

    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
  }, []);

  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    setUsername(null);
  };

  return (
    <nav className="bg-gray-800 p-3 w-full shadow-sm sticky top-0 z-50">
      <div className="relative w-full flex items-center">
        <div className="flex-1 flex flex-col items-start">
          <img
            src="/images/Original sobre transparente(1).png"
            alt="GameLogger"
            className="h-auto max-h-12 md:max-h-12 lg:max-h-12 object-contain ml-6"
          />
        </div>

        <ul className="flex space-x-4 ml-12">
          <li>
            <Link
              to="/"
              className="block px-2 py-1 bg-gray-800 text-white text-lg rounded-md hover:text-white hover:bg-gray-600 transition duration-300"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/profile"
              className="block px-2 py-1 bg-gray-800 text-white text-lg rounded-md hover:text-white hover:bg-gray-600 transition duration-300"
            >
              Profile
            </Link>
          </li>
          <li>
            <Link
              to="/top-games"
              className="block px-2 py-1 bg-gray-800 text-white text-lg rounded-md hover:text-white hover:bg-gray-600 transition duration-300"
            >
              Top Games
            </Link>
          </li>
          <li>
            <Link
              to="/my-library"
              className="block px-2 py-1 bg-gray-800 text-white text-lg rounded-md hover:text-white hover:bg-gray-600 transition duration-300"
            >
              My Library
            </Link>
          </li>
        </ul>

        <div className="flex-1 flex justify-end space-x-4 mr-6">
          {isLoggedIn ? (
            <>
              <span className="text-white text-lg font-bold px-4 py-1">
                Welcome, {username}
              </span>
              <button
                onClick={handleLogout}
                className="bg-cyan-600 text-white px-4 py-1 rounded-md hover:bg-cyan-700 transition duration-300 mr-12"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="bg-cyan-600 text-white px-4 py-1 rounded-md hover:bg-cyan-700 transition duration-300"
                onClick={openLogin}
              >
                Log In
              </button>
              <button className="bg-cyan-600 text-white px-4 py-1 rounded-md hover:bg-cyan-700 transition duration-300">
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>

      <div className="pb-2"></div>
      <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-b from-gray-800 to-transparent"></div>

      {isLoginOpen && (
        <LoginPopUp
          closePopup={closeLogin}
          onLoginSuccess={(username: string) => {
            setIsLoggedIn(true);
            setUsername(username);
          }}
        />
      )}
    </nav>
  );
};

export default Navbar;
