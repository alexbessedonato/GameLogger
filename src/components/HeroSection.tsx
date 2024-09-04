import React from "react";

const HeroSection: React.FC = () => {
  return (
    <section className="bg-gray-900 text-white h-screen flex flex-col justify-center items-center text-center">
      <h2 className="text-4xl font-bold mb-4 animate-bounce">
        Welcome to GameLogger!
      </h2>
      <p className="text-lg mb-6 max-w-xl">
        Track, log, and discover your favorite games. Create your personal
        library and share your progress with others.
      </p>
      <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105">
        Get Started
      </button>
    </section>
  );
};

export default HeroSection;
