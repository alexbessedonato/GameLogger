import React from "react";
import Card from "../components/Card";

const FeaturedGames = () => {
  const cardsData = [
    {
      title: "The Legend of Zelda: Breath of the Wild",
      description:
        "Explore the vast open world of Hyrule in this critically acclaimed adventure.",
      image: "https://images.igdb.com/igdb/image/upload/t_thumb/co1r2z.jpg",
    },
    {
      title: "The Witcher 3: Wild Hunt",
      description:
        "An epic tale of monster hunting and dark magic in an open world setting.",
      image: "https://images.igdb.com/igdb/image/upload/t_thumb/co1v1t.jpg",
    },
    {
      title: "Cyberpunk 2077",
      description:
        "Explore the futuristic open world of Night City in this RPG from CD Projekt Red.",
      image: "https://images.igdb.com/igdb/image/upload/t_thumb/co1v2t.jpg",
    },
  ];
  return (
    <section className="p-10 bg-gray-100">
      <h2 className="text-black text-3xl font-bold text-center mb-8">
        Featured Games
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {cardsData.map((card, index) => (
          <Card
            key={index}
            title={card.title}
            description={card.description}
            image={card.image}
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturedGames;
