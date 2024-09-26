import React from "react";

const HeroSection: React.FC = () => {
  return (
    <section className="relative h-screen flex flex-col justify-center items-center text-center text-white">
      {/* Background with fade effect at top and bottom */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/pixelcut-export(1).jpeg')" }}
      >
        {/* Adding gradient to blend top and bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-800 via-gray-800/80 to-gray-800"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <img
          src="/images/Original-sobre-transparente.png"
          alt="GameLogger"
          className="mx-auto h-auto max-h-48 md:max-h-64 lg:max-h-80 object-contain mb-12 -mt-28"
        />
        <h2 className="text-4xl font-bold mb-4 mt-12">
          Welcome to GameLogger!
        </h2>
        <p className="text-lg mb-6 max-w-xl">
          Track, log, and discover your favorite games. Create your personal
          library and share your progress with others.
        </p>
        <button className="bg-cyan-600 hover:bg-blue-600 text-white px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105">
          Get Started
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
