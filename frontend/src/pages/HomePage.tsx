import React from "react";
import HeroSection from "../components/HeroSection";
import SeachGames from "../components/SearchGames";
import Navbar from "../components/Navbar";

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
