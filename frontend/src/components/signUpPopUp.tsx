import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";

interface SignUpFormInputs {
  username: string;
  email: string;
  password: string;
}

interface LoginPopUpProps {
  closePopup: () => void;
  onSignUpSuccess: (username: string) => void;
}

const SignUpPopUp: React.FC<LoginPopUpProps> = ({
  closePopup,
  onSignUpSuccess,
}) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignUpFormInputs>();

  const [serverError, setServerError] = useState("");

  const onSubmit: SubmitHandler<SignUpFormInputs> = async (data) => {
    setServerError(""); // Reset server error

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/signup`,
        data
      );

      const { username } = response.data;
      localStorage.setItem("username", username);
      onSignUpSuccess(username);
      closePopup();
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        const errMsg = error.response.data.error;

        if (errMsg.includes("email")) {
          setError("email", {
            type: "manual",
            message: errMsg,
          });
        } else {
          setServerError(errMsg || "Sign up failed. Try again.");
        }
      } else {
        setServerError("Network error. Please try again.");
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Sign Up
        </h2>

        {serverError && (
          <p className="text-red-500 text-sm text-center mb-4">{serverError}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              {...register("username", { required: "Username is required" })}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter your username"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^@]+@[^@]+\.[^@]+$/,
                  message: "Invalid email format",
                },
              })}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold w-full py-3 rounded-lg"
          >
            Sign Up
          </button>

          <button
            type="button"
            onClick={closePopup}
            className="text-sm text-center text-gray-500 hover:text-gray-700 mt-4 block w-full"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpPopUp;
