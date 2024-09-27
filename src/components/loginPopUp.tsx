import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";

interface LoginPopUpProps {
  closePopup: () => void; // Prop to close the pop-up
}

interface LoginFormInputs {
  email: string;
  password: string;
}

const LoginPopUp: React.FC<LoginPopUpProps> = ({ closePopup }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const [loginError, setLoginError] = useState<string | null>(null);

  // Handle form submission
  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/auth/login",
        data
      );

      // If successful, store token in local storage or cookie
      localStorage.setItem("authToken", response.data.token);

      // Close the pop-up on successful login
      closePopup();
    } catch (err) {
      console.error("Login error: ", err);
      setLoginError("Invalid email or password"); // Display error message
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        {loginError && <p className="text-red-500 text-center">{loginError}</p>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-white">
              Email
            </label>
            <input
              type="email"
              id="email"
              className={`w-full bg-grey-800 text-white p-2 border rounded ${
                errors.email ? "border-red-500" : ""
              }`}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-white">
              Password
            </label>
            <input
              type="password"
              id="password"
              className={`w-full p-2 border rounded ${
                errors.password ? "border-red-500" : ""
              }`}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="bg-cyan-500 text-white w-full p-2 rounded hover:bg-cyan-600 transition duration-300"
          >
            Login
          </button>

          <button
            type="button"
            className="w-full p-2 mt-4 bg-gray-300 text-black rounded hover:bg-gray-400 transition duration-300"
            onClick={closePopup} // Close the pop-up
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPopUp;
