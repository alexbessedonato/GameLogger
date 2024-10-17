import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // Import useParams to get username from URL

interface Game {
  id: number;
  name: string;
  cover?: { url: string }; // Cover URL might be optional
}

interface GameDetails {
  name: string;
  cover?: { url: string };
  summary: string;
}

const Library: React.FC = () => {
  const { username } = useParams<{ username: string }>(); // Extract username from URL
  const [searchTerm, setSearchTerm] = useState<string>(""); // Input value for game search
  const [suggestions, setSuggestions] = useState<Game[]>([]); // Suggested games from search
  const [selectedGames, setSelectedGames] = useState<GameDetails[]>([]);

  // Fetch game suggestions from backend based on search term
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.trim() === "") {
        setSuggestions([]); // Clear suggestions if input is empty
        return;
      }

      try {
        const response = await axios.post("http://localhost:5000/api/games", {
          search: searchTerm,
        });
        setSuggestions(response.data); // Update suggestions with API data
      } catch (error) {
        console.error("Error fetching game suggestions:", error);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchSuggestions();
    }, 300); // Debounce for 300ms

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Handle game selection from search results
  const handleSelectGame = async (game: Game) => {
    try {
      // Step 1: Get full game details, including the cover URL, by sending the game name to the backend
      const detailsResponse = await axios.post(
        "http://localhost:5000/api/game-details",
        { game_name: game.name }
      );
      const gameDetails = detailsResponse.data; // This contains the game details, including the cover URL

      // Step 2: Send the game data (including the `t_thumb` cover URL) to the backend to save to the user library
      const thumbCover = gameDetails.cover?.url || null; // Get the `t_thumb` version of the cover

      await axios.post("http://localhost:5000/api/user-games", {
        gameName: gameDetails.name,
        cover: thumbCover, // Use the t_thumb version for the database
        username, // Add the username for tracking
      });

      // Step 3: Add the game to the selected games in the frontend (for UI display)
      setSelectedGames((prev) => [
        ...prev,
        {
          name: gameDetails.name,
          cover: gameDetails.cover
            ? { url: gameDetails.cover.url.replace("t_thumb", "t_1080p") }
            : undefined, // Use the high-res cover for frontend display
          summary: gameDetails.summary || "",
        },
      ]);

      // Clear search term and suggestions after selection
      setSearchTerm("");
      setSuggestions([]);
    } catch (error) {
      console.error("Error adding game to user library:", error);
    }
  };

  return (
    <section className="relative min-h-screen text-white">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/pixelcut-export(1).jpeg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-gray-800 via-gray-800/80 to-gray-800"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-8">
          <input
            type="text"
            className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-white border-solid border-2 border-gray-600"
            placeholder="Search for a game..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {suggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-gray-800 shadow-lg rounded-lg mt-2 max-h-64 overflow-y-auto text-white">
              {suggestions.map((game) => (
                <li
                  key={game.id}
                  className="p-2 hover:bg-gray-600 cursor-pointer mt-4"
                  onClick={() => handleSelectGame(game)}
                >
                  {game.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Display selected games (UI purpose) */}
        {selectedGames.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {selectedGames.map((game, index) => (
              <div
                key={index}
                className="relative bg-gray-800 rounded-lg shadow-md overflow-hidden"
              >
                <div className="relative w-full h-auto">
                  <img
                    src={
                      game.cover
                        ? `https:${game.cover.url}`
                        : "https://via.placeholder.com/150"
                    }
                    alt={game.name}
                    className="w-full h-auto object-cover"
                  />
                  <h3 className="absolute bottom-2 left-0 right-0 text-md font-bold text-cyan-400 text-center z-10">
                    {game.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Library;
