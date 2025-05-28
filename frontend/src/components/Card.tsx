import React from "react";

interface CardProps {
  title: string;
  description: string;
  image: string;
}

const Card: React.FC<CardProps> = ({ title, description, image }) => {
  return (
    <div className="bg-dark-blue rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:scale-105">
      <img src={image} alt={title} className="rounded-t-lg" />
      <div className="p-4">
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-gray-700">{description}</p>
      </div>
    </div>
  );
};

export default Card;
