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
  status: string;
  startedOn?: string;
  finishedOn?: string;
}

const Library: React.FC = () => {
  const { username } = useParams<{ username: string }>(); // Extract username from URL
  const [searchTerm, setSearchTerm] = useState<string>(""); // Input value for game search
  const [suggestions, setSuggestions] = useState<Game[]>([]); // Suggested games from search
  const [selectedGames, setSelectedGames] = useState<GameDetails[]>([]);

  // Fetch saved games when the component mounts
  useEffect(() => {
    const fetchSavedGames = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/user-library",
          {
            params: { username }, // Pass the username to fetch the user's saved games
          }
        );

        const savedGames = response.data.map((game: any) => ({
          name: game.gameName,
          cover: { url: game.cover.replace("t_thumb", "t_1080p") }, // Use the 1080p version for frontend display
          summary: "", // If you have a summary field, include it here
          status: game.status,
          startedOn: game.startedOn || "",
          finishedOn: game.finishedOn || "",
        }));

        setSelectedGames(savedGames); // Update selected games with the fetched data
      } catch (error) {
        console.error("Error fetching saved games:", error);
      }
    };

    if (username) {
      fetchSavedGames(); // Fetch the user's games if username is available
    }
  }, [username]);

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
      const detailsResponse = await axios.post(
        "http://localhost:5000/api/game-details",
        { game_name: game.name }
      );
      const gameDetails = detailsResponse.data;

      const thumbCover = gameDetails.cover?.url || null; // Get the `t_thumb` version of the cover

      await axios.post("http://localhost:5000/api/user-games", {
        gameName: gameDetails.name,
        cover: thumbCover,
        username, // Add the username for tracking
        status: "Wishlisted",
      });

      setSelectedGames((prev) => [
        ...prev,
        {
          name: gameDetails.name,
          cover: gameDetails.cover
            ? { url: gameDetails.cover.url.replace("t_thumb", "t_1080p") }
            : undefined,
          summary: gameDetails.summary || "",
          status: "Wishlisted",
          startedOn: "",
          finishedOn: "",
        },
      ]);

      setSearchTerm("");
      setSuggestions([]);
    } catch (error) {
      console.error("Error adding game to user library:", error);
    }
  };

  // Handle status change
  const handleStatusChange = (index: number, newStatus: string) => {
    setSelectedGames((prev) => {
      const updatedGames = [...prev];
      updatedGames[index].status = newStatus;
      return updatedGames;
    });
  };

  // Handle date change for startedOn and finishedOn fields
  const handleDateChange = (
    index: number,
    dateType: "startedOn" | "finishedOn",
    value: string
  ) => {
    setSelectedGames((prev) => {
      const updatedGames = [...prev];
      updatedGames[index][dateType] = value;
      return updatedGames;
    });
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

        {/* Display selected games */}
        {selectedGames.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {selectedGames.map((game, index) => (
              <div
                key={index}
                className="relative group bg-gray-800 rounded-lg shadow-md overflow-hidden"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-70"></div>
                  <h3 className="absolute bottom-2 left-0 right-0 text-md font-bold text-cyan-400 text-center z-10 group-hover:-translate-y-60 transition-transform duration-300 ease-in-out">
                    {game.name}
                  </h3>
                </div>

                {/* Hidden content on hover */}
                <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gray-900 bg-opacity-90 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
                  <div className="space-y-2">
                    <label className="block">
                      <span className="text-gray-300">Status:</span>
                      <select
                        className="block w-full p-2 mt-1 rounded bg-gray-700 text-white"
                        value={game.status}
                        onChange={(e) =>
                          handleStatusChange(index, e.target.value)
                        }
                      >
                        <option value="Wishlisted">Wishlisted</option>
                        <option value="Playing">Playing</option>
                        <option value="Completed">Completed</option>
                        <option value="100%ed">100%ed</option>
                      </select>
                    </label>
                  </div>

                  {/* Date fields based on game status */}
                  {game.status === "Playing" && (
                    <div className="mt-2">
                      <label className="block">
                        <span className="text-gray-300">Started On:</span>
                        <input
                          type="date"
                          className="block w-full p-2 mt-1 rounded bg-gray-700 text-white"
                          value={game.startedOn || ""}
                          onChange={(e) =>
                            handleDateChange(index, "startedOn", e.target.value)
                          }
                        />
                      </label>
                    </div>
                  )}
                  {(game.status === "Completed" ||
                    game.status === "100%ed") && (
                    <div className="mt-2 space-y-4">
                      <label className="block">
                        <span className="text-gray-300">Started On:</span>
                        <input
                          type="date"
                          className="block w-full p-2 mt-1 rounded bg-gray-700 text-white"
                          value={game.startedOn || ""}
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
                          value={game.finishedOn || ""}
                          onChange={(e) =>
                            handleDateChange(
                              index,
                              "finishedOn",
                              e.target.value
                            )
                          }
                        />
                      </label>
                    </div>
                  )}
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
