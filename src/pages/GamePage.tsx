import React from "react";
import InsideGame from "../components/InsideGame";
import Navbar from "../components/Navbar";

const GamePage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <InsideGame />
    </div>
  );
};

export default GamePage;
