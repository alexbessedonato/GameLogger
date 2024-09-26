import React from "react";
import HeroSection from "../components/HeroSection";
import Navbar from "../components/Navbar";
import FeaturedGames from "../components/FeaturedGames";

const HomePage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <FeaturedGames />
    </div>
  );
};

export default HomePage;
