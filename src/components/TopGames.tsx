import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface TopGames {
  name: string;
  cover: string;
  rating: number;
}

const TopGames: React.FC = () => {
  const [topGames, setTopGames] = useState<TopGames[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTopGames = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/top-rated-games",
          {}
        );
        setTopGames(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching top games:", error);
        setLoading(false);
      }
    };

    fetchTopGames();
  }, []);

  if (loading) {
    return (
      <p className="text-white text-center bg-gray-800">Loading Top games...</p>
    );
  }

  return (
    <div className="text-white text-3xl font-bold mb-14">
      <h2 className="text-white text-3xl font-bold text-center mb-10">
        Top Games
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mt-10">
        {topGames.length > 0 ? (
          topGames.map((game, index) => (
            <Link
              key={index}
              to={`/games/${encodeURIComponent(game.name)}`} // Use game name in the URL
              className="bg-gray-900 rounded-lg shadow-lg overflow-hidden relative flex justify-center items-center"
            >
              <div className="relative w-full">
                <img
                  src={
                    game.cover
                      ? game.cover.replace("t_thumb", "t_1080p")
                      : "https://via.placeholder.com/150"
                  }
                  alt={game.name}
                  className="object-contain w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
              </div>
              <div className="absolute bottom-0 left-0 bg-gray-900 bg-opacity-35 p-2 w-full bg-gradient-to-t from-gray-900 to-transparent">
                <h3 className="text-lg font-bold text-cyan-400">{game.name}</h3>
                <h2 className="text-white text-xl font-bold">
                  {game.rating ? `${game.rating}/100` : "No rating available"}
                </h2>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-white text-center col-span-full">
            No games found.
          </p>
        )}
      </div>
    </div>
  );
};

export default TopGames;
