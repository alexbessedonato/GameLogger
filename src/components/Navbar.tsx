import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoginPopUp from "./loginPopUp"; // Import the LoginPopUp component

const Navbar: React.FC = () => {
  // State to control the visibility of the LoginPopUp
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const openLogin = () => setIsLoginOpen(true); // Function to open the login pop-up
  const closeLogin = () => setIsLoginOpen(false); // Function to close the login pop-up

  return (
    <nav className="bg-gray-800 p-3 w-full shadow-sm sticky top-0 z-50">
      <div className="relative w-full flex items-center">
        {/* Left side with the GameLogger logo */}
        <div className="flex-1 flex flex-col items-start">
          <img
            src="/images/Original sobre transparente(1).png"
            alt="GameLogger"
            className="h-auto max-h-12 md:max-h-12 lg:max-h-12 object-contain ml-6"
          />
        </div>

        {/* Centered Navbar Links */}
        <ul className="flex space-x-4">
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

        {/* Buttons moved to the right */}
        <div className="flex-1 flex justify-end space-x-4">
          <button
            className="bg-cyan-600 text-white px-4 py-1 rounded-md hover:bg-cyan-700 transition duration-300"
            onClick={openLogin} // Show Login pop-up when clicked
          >
            Log In
          </button>
          <button className="bg-cyan-600 text-white px-4 py-1 rounded-md hover:bg-cyan-700 transition duration-300">
            Sign Up
          </button>
        </div>
      </div>

      {/* Padding to prevent content from overlapping the gradient */}
      <div className="pb-2"></div>

      {/* Gradient for fade effect at the bottom */}
      <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-b from-gray-800 to-transparent"></div>

      {/* Render LoginPopUp if isLoginOpen is true */}
      {isLoginOpen && <LoginPopUp closePopup={closeLogin} />}
    </nav>
  );
};

export default Navbar;
