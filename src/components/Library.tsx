import React, { useState, useEffect } from "react";
import axios from "axios";

interface Game {
  id: number;
  name: string;
  cover?: { url: string };
}

interface GameDetails {
  name: string;
  cover?: { url: string };
  summary: string;
}

const Library: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>(""); // Input value
  const [suggestions, setSuggestions] = useState<Game[]>([]); // Suggested games
  const [selectedGames, setSelectedGames] = useState<
    {
      details: GameDetails;
      status: string;
      startedOn: string;
      finishedOn: string;
    }[]
  >([]); // Selected games with status, dates, etc.

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

        setSuggestions(response.data); // Update the suggestions with API data
      } catch (error) {
        console.error("Error fetching game suggestions:", error);
      }
    };

    // Fetch suggestions after a delay to avoid too many API calls
    const timeoutId = setTimeout(() => {
      fetchSuggestions();
    }, 300); // Debounce for 300ms

    // Cleanup the timeout on component unmount or on new input
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleSelectGame = async (game: Game) => {
    try {
      // Fetch game details from the backend
      const response = await axios.post(
        "http://localhost:5000/api/game-details",
        {
          game_name: game.name,
        }
      );

      const gameDetails = response.data;

      setSelectedGames((prev) => [
        ...prev,
        {
          details: gameDetails,
          status: "Wishlisted", // Default status
          startedOn: "",
          finishedOn: "",
        },
      ]);

      setSearchTerm("");
      setSuggestions([]);
    } catch (error) {
      console.error("Error fetching game details:", error);
    }
  };

  // Handle status change immutably
  const handleStatusChange = (index: number, newStatus: string) => {
    setSelectedGames((prev) => {
      const updatedGames = [...prev];
      updatedGames[index] = {
        ...updatedGames[index],
        status: newStatus,
      };
      return updatedGames;
    });
  };

  // Handle date changes immutably
  const handleDateChange = (index: number, dateType: string, value: string) => {
    setSelectedGames((prev) => {
      const updatedGames = [...prev];
      updatedGames[index] = {
        ...updatedGames[index],
        [dateType]: value,
      };
      return updatedGames;
    });
  };

  // Function to render games by status
  const renderGamesByStatus = (status: string) => {
    return selectedGames
      .filter((game) => game.status === status)
      .map((game, index) => (
        <div
          key={index}
          className="relative group bg-gray-800 rounded-lg shadow-md overflow-hidden"
        >
          {/* Game Cover with Gradient Overlay */}
          <div className="relative w-full h-auto">
            <img
              src={
                game.details.cover
                  ? `https:${game.details.cover.url.replace(
                      "t_thumb",
                      "t_1080p"
                    )}` // Replace thumb with 1080p for better quality
                  : "https://via.placeholder.com/150"
              }
              alt={game.details.name}
              className="w-full h-auto object-cover"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-75"></div>

            {/* Game Name */}
            <h3 className="absolute bottom-2 left-0 right-0 text-md font-bold text-cyan-400 text-center z-10 group-hover:-translate-y-60 transition-transform duration-300 ease-in-out">
              {game.details.name}
            </h3>
          </div>

          {/* Hidden Content (Visible on Hover) */}
          <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gray-900 bg-opacity-90 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
            {/* Status Toggle */}
            <div className="space-y-2">
              <label className="block">
                <span className="text-gray-300">Status:</span>
                <select
                  className="block w-full p-2 mt-1 rounded bg-gray-700 text-white"
                  value={game.status}
                  onChange={(e) => handleStatusChange(index, e.target.value)}
                >
                  <option value="Wishlisted">Wishlisted</option>
                  <option value="Playing">Playing</option>
                  <option value="Completed">Completed</option>
                  <option value="100%ed">100%ed</option>
                </select>
              </label>
            </div>

            {/* Date Fields */}
            {game.status === "Playing" && (
              <div className="mt-2">
                <label className="block">
                  <span className="text-gray-300">Started On:</span>
                  <input
                    type="date"
                    className="block w-full p-2 mt-1 rounded bg-gray-700 text-white"
                    value={game.startedOn}
                    onChange={(e) =>
                      handleDateChange(index, "startedOn", e.target.value)
                    }
                  />
                </label>
              </div>
            )}

            {(game.status === "Completed" || game.status === "100%ed") && (
              <div className="mt-2 space-y-4">
                <label className="block">
                  <span className="text-gray-300">Started On:</span>
                  <input
                    type="date"
                    className="block w-full p-2 mt-1 rounded bg-gray-700 text-white"
                    value={game.startedOn}
                    onChange={(e) =>
                      handleDateChange(index, "startedOn", e.target.value)
                    }
                  />
                </label>

                <label className="block">
                  <span className="text-gray-300">Finished On:</span>
                  <input
                    type="date"
                    className="block w-full p-2 mt-1 rounded bg-gray-700 text-white"
                    value={game.finishedOn}
                    onChange={(e) =>
                      handleDateChange(index, "finishedOn", e.target.value)
                    }
                  />
                </label>
              </div>
            )}
          </div>
        </div>
      ));
  };

  // Helper function to conditionally render sections if there are games in that status
  const renderSection = (status: string, title: string) => {
    const games = selectedGames.filter((game) => game.status === status);
    if (games.length > 0) {
      return (
        <div className="mt-6">
          <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {renderGamesByStatus(status)}
          </div>
        </div>
      );
    }
    return null; // Return null if no games are in this status
  };

  return (
    <section className="relative min-h-screen text-white">
      {/* Background with fade effect */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/pixelcut-export(1).jpeg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-gray-800 via-gray-800/80 to-gray-800"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Search Bar at the top */}
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

        {/* Sections */}
        {renderSection("Playing", "Playing")}
        {renderSection("100%ed", "100%ed")}
        {renderSection("Completed", "Completed")}
        {renderSection("Wishlisted", "Wishlisted")}
      </div>
    </section>
  );
};

export default Library;
