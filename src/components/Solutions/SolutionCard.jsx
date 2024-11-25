import React from 'react';
import Slider from 'react-slick';
import { PrevArrow, NextArrow } from '../reusable/SliderArrows';

const SolutionCard = ({ images, title, description, cta, onSelect, onEdit, isSelected }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  const handleDoubleClick = (e) => {
    // Prevent selection if clicking on slider navigation or if focused
    if (!e.target.closest('.slick-arrow') && !e.target.closest('button')) {
      onSelect();
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden relative">
      <div className="relative group" onDoubleClick={handleDoubleClick}>
        {isSelected && (
          <div className="absolute top-2 right-2 z-10 w-6 h-6 flex items-center justify-center bg-white rounded-full border-2 border-green-500">
            <span className="text-green-500">✔</span>
          </div>
        )}
        {images.length > 1 ? (
          <Slider {...settings}>
            {images.map((image, index) => (
              <div key={index} className="overflow-hidden">
                <img
                  src={image}
                  alt={`Solution image ${index + 1}`}
                  className="w-full h-48 object-cover transform transition-transform duration-300 hover:scale-110"
                />
              </div>
            ))}
          </Slider>
        ) : (
          images.length === 1 && (
            <div className="overflow-hidden">
              <img
                src={images[0]}
                alt={`Solution image 1`}
                className="w-full h-48 object-cover transform transition-transform duration-300 hover:scale-110"
              />
            </div>
          )
        )}
      </div>
      <div className="p-4 flex flex-col items-center">
        <h3 className="text-lg font-semibold mb-2 text-center">{title}</h3>
        <p className="text-gray-600 mb-4 text-center line-clamp-2">{description}</p>
        {isSelected ? (
          <button
            onClick={onEdit}
            className="inline-block px-4 py-2 bg-blue-900 text-white font-bold rounded hover:bg-[#F89F2D] text-center"
          >
            Edit
          </button>
        ) : (
          cta && (
            <a
              href={cta.href}
              className="inline-block px-4 py-2 bg-[#F89F2D] text-white font-bold rounded hover:bg-[#e6c69d] text-center"
            >
              {cta.text || 'Learn More'}
            </a>
          )
        )}
      </div>
    </div>
  );
};

export default SolutionCard;
