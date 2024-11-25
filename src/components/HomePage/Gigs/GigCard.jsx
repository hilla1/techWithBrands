// src/components/GigCard.jsx
import React from 'react';
import Slider from 'react-slick';
import { PrevArrow, NextArrow } from '../../reusable/SliderArrows'; 

// Function to convert numeric rating to star symbols and return both stars and numeric rating
const getStarRating = (rating) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - Math.ceil(rating);

  return (
    <div className="flex items-center">
      <span className="text-yellow-500">
        {'⭐'.repeat(fullStars)}
        {halfStar && '⭐️'}
        {'☆'.repeat(emptyStars)}
      </span>
      <span className="ml-2 text-sm text-gray-700">{rating.toFixed(1)}</span>
    </div>
  );
};

const GigCard = ({ images, avatar, name, rating, description, price }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="relative group">
        <Slider {...settings}>
          {images.map((image, index) => (
            <div key={index} className="overflow-hidden">
              <img
                src={image}
                alt={`Gig image ${index + 1}`}
                className="w-full h-48 object-cover transform transition-transform duration-300 hover:scale-110"
              />
            </div>
          ))}
        </Slider>
      </div>
      <div className="p-4">
        <div className="flex items-center mb-2">
          <img
            src={avatar}
            alt={name}
            className="w-10 h-10 rounded-full mr-2"
          />
          <div>
            <h3 className="text-lg font-semibold">{name}</h3>
            <div className="flex items-center">
              {getStarRating(rating)}
            </div>
          </div>
        </div>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="text-orange-500 font-bold">
          Starting from ${price}
        </div>
      </div>
    </div>
  );
};

export default GigCard;
