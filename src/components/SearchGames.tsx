import React, { useEffect, useState } from "react";
import axios from "axios";
import TopGames from "./TopGames";

interface Game {
  name: string;
  cover: string;
}

const SearchGames: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>(""); // Estado para la búsqueda
  const [searchInput, setSearchInput] = useState<string>(""); // Estado para el valor del input

  // Función para buscar juegos
  const fetchGames = async (query: string) => {
    try {
      const response = await axios.post("http://localhost:5000/api/games", {
        search: query,
      });
      setGames(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener los juegos:", error);
      setLoading(false);
    }
  };

  // Ejecutar la búsqueda al cargar el componente
  useEffect(() => {
    fetchGames(searchQuery);
  }, [searchQuery]);

  // Función para manejar el submit de la barra de búsqueda
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput); // Actualizar el estado con el término ingresado
  };

  if (loading) {
    return <p className="text-white text-center bg-gray-800"></p>;
  }

  return (
    <section className="p-10 bg-gray-800 text-white">
      <TopGames />

      <h2 className="text-white text-3xl font-bold text-center mb-10">
        Search for Games
      </h2>

      {/* Barra de búsqueda */}
      <form onSubmit={handleSearchSubmit} className="mb-8 text-center">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search for a game..."
          className="px-4 py-2 text-white rounded-md"
        />
        <button
          type="submit"
          className="ml-4 px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition duration-300"
        >
          Search
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
        {games.length > 0 ? (
          games.map((game, index) => (
            <div
              key={index}
              className="bg-gray-900 rounded-lg shadow-lg overflow-hidden relative flex justify-center items-center"
            >
              {/* Imagen del juego con gradiente */}
              <div className="relative w-full h-full">
                <img
                  src={
                    game.cover
                      ? game.cover.replace("t_thumb", "t_1080p")
                      : "https://via.placeholder.com/150"
                  }
                  alt={game.name}
                  className="object-contain w-full h-full"
                />
                {/* Gradiente en la parte inferior de la imagen */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
              </div>

              {/* Título y Descripción del juego */}
              <div className="absolute bottom-0 left-0 bg-gray-900 bg-opacity-75 p-2 w-full bg-gradient-to-t from-gray-900 to-transparent">
                <h3 className="text-lg font-bold text-cyan-400">{game.name}</h3>
              </div>
            </div>
          ))
        ) : (
          <p className="text-white text-center col-span-full">
            No games found.
          </p>
        )}
      </div>
    </section>
  );
};

export default SearchGames;
