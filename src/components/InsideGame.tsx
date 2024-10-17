import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

interface GameDetails {
  name: string;
  summary: string;
  cover: { url: string };
  franchises?: { name: string }[];
  genres: { name: string }[];
  involved_companies: { company: { name: string } }[];
  platforms: { name: string }[];
  rating: number;
  ratingCount: number;
  screenshots: { url: string }[];
  storyline: string;
  totalRating: number;
  videos: { video_id: string }[];
  hypes: number;
  first_release_date: number; // Assuming this is a Unix timestamp
}

const InsideGame: React.FC = () => {
  const { game_name } = useParams<{ game_name: string }>();
  const [gameDetails, setGameDetails] = useState<GameDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGameDetails = async (gameName: string) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/game-details",
        {
          game_name: gameName,
        }
      );

      const gameData = response.data;

      // Replace t_thumb with t_1080p for better image quality
      const mappedData: GameDetails = {
        ...gameData,
        cover: {
          url: gameData.cover.url.replace("t_thumb", "t_1080p"), // Replace cover thumbnail
        },
        screenshots: gameData.screenshots.map((screenshot: any) => ({
          ...screenshot,
          url: screenshot.url.replace("t_thumb", "t_1080p"), // Replace screenshot thumbnails
        })),
      };

      setGameDetails(mappedData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching game details:", err);
      setError("Failed to fetch game details");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (game_name) {
      fetchGameDetails(game_name);
    }
  }, [game_name]);

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!gameDetails) {
    return <p className="text-center text-gray-500">No game details found</p>;
  }

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center text-center text-white">
      {/* Background with fade effect at top and bottom */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/pixelcut-export(1).jpeg')" }} // Reuse HeroSection background
      >
        {/* Adding gradient to blend top and bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-800 via-gray-800/80 to-gray-800"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="bg-gray-800 bg-opacity-90 text-white p-6 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold mb-6 text-center">
            {gameDetails.name}
          </h1>

          {/* Game Cover */}
          <div className="flex justify-center mb-6">
            <img
              src={`https:${gameDetails.cover.url}`} // Use the 1080p cover image
              alt={gameDetails.name}
              className="rounded-lg shadow-lg w-full max-w-md"
            />
          </div>

          {/* Game Information */}
          <div className="space-y-6">
            <p className="text-lg leading-relaxed text-gray-300">
              {gameDetails.summary}
            </p>
            <p className="text-lg leading-relaxed text-gray-300">
              {gameDetails.storyline}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Franchises */}
              {gameDetails.franchises && (
                <div>
                  <h2 className="text-2xl font-bold text-cyan-400 mb-2">
                    Franchises
                  </h2>
                  <p className="text-gray-400">
                    {gameDetails.franchises.map((f) => f.name).join(", ")}
                  </p>
                </div>
              )}

              {/* Genres */}
              <div>
                <h2 className="text-2xl font-bold text-cyan-400 mb-2">
                  Genres
                </h2>
                <p className="text-gray-400">
                  {gameDetails.genres.map((g) => g.name).join(", ")}
                </p>
              </div>

              {/* Platforms */}
              <div>
                <h2 className="text-2xl font-bold text-cyan-400 mb-2">
                  Platforms
                </h2>
                <p className="text-gray-400">
                  {gameDetails.platforms.map((p) => p.name).join(", ")}
                </p>
              </div>

              {/* Companies */}
              <div>
                <h2 className="text-2xl font-bold text-cyan-400 mb-2">
                  Involved Companies
                </h2>
                <p className="text-gray-400">
                  {gameDetails.involved_companies
                    .map((ic) => ic.company.name)
                    .join(", ")}
                </p>
              </div>
            </div>

            {/* Rating and Hypes */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h2 className="text-2xl font-bold text-cyan-400 mb-2">
                  Rating
                </h2>
                <p className="text-gray-400">
                  {gameDetails.rating}/100 ({gameDetails.ratingCount} ratings)
                </p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-cyan-400 mb-2">Hypes</h2>
                <p className="text-gray-400">{gameDetails.hypes}</p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-cyan-400 mb-2">
                First Release Date
              </h2>
              <p className="text-gray-400">
                {new Date(
                  gameDetails.first_release_date * 1000
                ).toLocaleDateString()}{" "}
                {/* Convert timestamp to date */}
              </p>
            </div>
          </div>

          {/* Screenshots */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">
              Screenshots
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {gameDetails.screenshots.map((screenshot, index) => (
                <img
                  key={index}
                  src={`https:${screenshot.url}`} // Use the 1080p screenshots
                  alt={`Screenshot ${index + 1}`}
                  className="rounded-lg shadow-lg"
                />
              ))}
            </div>
          </div>

          {/* Videos - Embedded YouTube videos */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gameDetails.videos.map((video, index) => (
                <iframe
                  key={index}
                  width="100%"
                  height="315"
                  src={`https://www.youtube.com/embed/${video.video_id}`}
                  title={`YouTube Video ${index + 1}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InsideGame;
