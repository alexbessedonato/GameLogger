import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import GamePage from "../pages/GamePage"; // The page to show individual game details
import TopGames from "../components/TopGames"; // Page that lists top games

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/games" element={<TopGames />} />
        <Route path="/games/:game_name" element={<GamePage />} />{" "}
        {/* Dynamic route for game details */}
      </Routes>
    </Router>
  );
};

export default AppRouter;
