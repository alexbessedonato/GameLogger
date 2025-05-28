import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";

interface LoginFormInputs {
  email: string;
  password: string;
}

interface LoginPopUpProps {
  closePopup: () => void;
  onLoginSuccess: (username: string) => void;
}

const LoginPopUp: React.FC<LoginPopUpProps> = ({
  closePopup,
  onLoginSuccess,
}) => {
  const { register, handleSubmit } = useForm<LoginFormInputs>();

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/auth/login",
        data
      );
      const { token, username } = response.data;

      // Save token and username in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);

      // Update Navbar state with username
      onLoginSuccess(username);

      // Close popup after successful login
      closePopup();
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Log In
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              {...register("email", { required: true })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent transition-colors duration-300"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              {...register("password", { required: true })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent transition-colors duration-300"
              placeholder="Enter your password"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-600 transition duration-300 w-full"
            >
              Log In
            </button>
          </div>
          <div className="flex justify-center mt-4">
            <button
              onClick={closePopup}
              className="text-sm text-white hover:text-gray-400 transition duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPopUp;
