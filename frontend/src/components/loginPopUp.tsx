import React, { useState, useEffect } from "react";
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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const [serverError, setServerError] = useState("");

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setServerError("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        data
      );

      const { token, username } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("username", username);

      onLoginSuccess(username);
      closePopup();
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        const responseData = error.response.data;

        console.log("❌ Axios error response:", responseData);

        const errMsg =
          typeof responseData === "string"
            ? responseData
            : responseData?.error || responseData?.message;

        if (
          typeof errMsg === "string" &&
          errMsg.toLowerCase().includes("invalid email or password")
        ) {
          setServerError("Email o contraseña incorrectos.");
        } else {
          setServerError(errMsg || "Error al iniciar sesión.");
        }
      } else {
        setServerError("Error de red. Inténtalo más tarde.");
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 relative">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Log In
        </h2>

        {serverError && (
          <p className="text-red-500 text-sm text-center mb-4">{serverError}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Email requerido",
                pattern: {
                  value: /^[^@]+@[^@]+\.[^@]+$/,
                  message: "Formato de email no válido",
                },
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              {...register("password", {
                required: "Contraseña requerida",
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600"
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
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md w-full"
          >
            Log In
          </button>

          <button
            type="button"
            onClick={closePopup}
            className="text-sm text-gray-500 hover:text-gray-700 mt-4 w-full"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPopUp;
