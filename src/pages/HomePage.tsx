import React from "react";
import HeroSection from "../components/HeroSection";
import Navbar from "../components/Navbar";
import SeachGames from "../components/SearchGames";

const HomePage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <SeachGames />
    </div>
  );
};

export default HomePage;
