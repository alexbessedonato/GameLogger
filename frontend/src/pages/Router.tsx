import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import GamePage from "./GamePage"; // The page to show individual game details
import TopGames from "../components/TopGames"; // Page that lists top games
import ProfilePage from "./ProfilePage";

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/games" element={<TopGames />} />
        <Route path="/games/:game_name" element={<GamePage />} />{" "}
        <Route path="/my-library/:username" element={<ProfilePage />} />{" "}
        {/* Dynamic route for game details */}
      </Routes>
    </Router>
  );
};

export default AppRouter;
