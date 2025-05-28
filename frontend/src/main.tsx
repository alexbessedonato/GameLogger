import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // Aquí puedes usar tus propios estilos o Tailwind
import AppRouter from "./pages/Router"; // Importamos el Router

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);
