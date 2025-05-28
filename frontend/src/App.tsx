import React from "react";
import AppRouter from "./pages/Router";
import Navbar from "./components/Navbar";

const App: React.FC = () => {
  return (
    <div className="bg-gray-800">
      <Navbar />
      <AppRouter />
    </div>
  );
};

export default App;
