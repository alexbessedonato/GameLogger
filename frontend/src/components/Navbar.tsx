import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import LoginPopUp from "./loginPopUp"; // Import the login pop-up component
import SignUpPopUp from "./signUpPopUp"; // Import the sign-up pop-up component

const Navbar: React.FC = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  const navigate = useNavigate(); // useNavigate for redirection

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

  const openSignUp = () => setIsSignUpOpen(true);
  const closeSignUp = () => setIsSignUpOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    setUsername(null);
    navigate("/"); // Redirect to home page after logout
  };

  const handleLibraryClick = () => {
    if (username) {
      navigate(`/my-library/${username}`); // Pass the username as a parameter
    }
  };

  return (
    <nav className="bg-gray-800 p-3 w-full shadow-sm sticky top-0 z-50">
      <div className="relative w-full flex items-center">
        <div className="flex-1 flex flex-col items-start">
          <img
            src="/images/Original-sobre-transparente(1).png"
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
          {/* <li>
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
          </li> */}
          <li>
            {/* Conditionally render the link or handle click event */}
            {isLoggedIn ? (
              <button
                onClick={handleLibraryClick}
                className="block px-2 py-1 bg-gray-800 text-white text-lg rounded-md hover:text-white hover:bg-gray-600 transition duration-300"
              >
                My Library
              </button>
            ) : (
              <span className="block px-2 py-1 bg-gray-800 text-gray-400 text-lg rounded-md cursor-not-allowed">
                My Library
              </span>
            )}
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
              <button
                className="bg-cyan-600 text-white px-4 py-1 rounded-md hover:bg-cyan-700 transition duration-300"
                onClick={openSignUp}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>

      <div className="pb-2"></div>
      <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-b from-gray-800 to-transparent"></div>

      {/* Login and Signup Pop-ups */}
      {isLoginOpen && (
        <LoginPopUp
          closePopup={closeLogin}
          onLoginSuccess={(username: string) => {
            setIsLoggedIn(true);
            setUsername(username);
          }}
        />
      )}

      {isSignUpOpen && (
        <SignUpPopUp
          closePopup={closeSignUp}
          onSignUpSuccess={(username: string) => {
            setIsSignedUp(true);
            setUsername(username);
          }}
        />
      )}
    </nav>
  );
};

export default Navbar;
