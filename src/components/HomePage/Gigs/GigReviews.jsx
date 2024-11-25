import React from 'react';
import Slider from 'react-slick';
import { PrevArrow, NextArrow } from './SliderArrows'; // Adjust path if necessary

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
      <span className="ml-2 text-lg text-gray-700">{rating.toFixed(1)}</span>
    </div>
  );
};

// Function to calculate how many days ago the review was written
const calculateDaysAgo = (dateString) => {
  const reviewDate = new Date(dateString);
  const currentDate = new Date();
  const differenceInTime = currentDate - reviewDate;
  return Math.floor(differenceInTime / (1000 * 3600 * 24));
};

const GigReviews = ({ reviews }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  };

  return (
    <>
      {/* Descriptive Title for Reviews */}
      <h2 className="text-2xl font-bold mb-4 text-[var(--primary-color)]">Client Reviews</h2>

      {/* Slideshow for Reviews */}
      <div className="mb-8 group">
        <Slider {...settings}>
          {reviews.map((review, index) => (
            <div className="p-4 bg-gray-100 rounded-md flex flex-col" key={index}>
              <div className="flex items-center mb-2">
                <img
                  src={review.author.avatar}
                  alt={review.author.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div className="flex flex-col">
                  <p className="font-semibold">{review.author.name}</p>
                  <div>{getStarRating(review.author.rating)}</div>
                </div>
              </div>
              <p className="mb-2">{review.text}</p>
              <p className="text-sm text-gray-500">
                {calculateDaysAgo(review.dateCreated)} days ago
              </p>
            </div>
          ))}
        </Slider>
      </div>
    </>
  );
};

export default GigReviews;
