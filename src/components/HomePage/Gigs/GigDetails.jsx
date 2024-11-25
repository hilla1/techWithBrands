import React from 'react';
import Slider from 'react-slick';
import { PrevArrow, NextArrow } from './SliderArrows';
import GigReviews from './GigReviews'; // Adjust path if necessary

// JSON Data (Move this to a separate file if needed)
const gigData = {
  title: "Web Development Gig",
  avatar: {
    src: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDF8fGF2YXRhcnxlbnwwfHx8fDE2Mjk3Nzc4NzI&ixlib=rb-1.2.1&q=80&w=400",
    alt: "Avatar"
  },
  name: "Jane Doe",
  rating: 4.9, // Change this to a number
  slides: [
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDEwfHx3ZWJzaXRlfGVufDB8fHx8MTYyOTc3Nzc4NzI&ixlib=rb-1.2.1&q=80&w=1080",
    "https://images.unsplash.com/photo-1599566150163-29194dcaad36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDF8fGF2YXRhcnxlbnwwfHx8fDE2Mjk3Nzc4NzI&ixlib=rb-1.2.1&q=80&w=400",
    "https://images.unsplash.com/photo-1506748686214e9df14f7b5c2f48b1b8a2f54e8e3e5c1d74d0e2b4f5e0b3f2a2b6b4f0b5f9b4d7e0a9c4d8f7e9f9c5d0c2e7f5a8c2b7c3e8a8d5b8b5a7a9e1f6f4f5e6f0a8c9c2f8f8d9c2e2b4e4f8b6a8b9c5a2b8c5d7e7b5e9c5a9b",
    "https://images.unsplash.com/photo-1564518094-907b0e2b9b3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDJ8fGF2YXRhcnxlbnwwfHx8fDE2Mjk3Nzc4NzI&ixlib=rb-1.2.1&q=80&w=1080"
  ],
  reviews: [
    {
      text: "Jane is an exceptional web developer! She brought our vision to life with incredible attention to detail.",
      author: {
        name: "Happy Client",
        avatar: "https://images.unsplash.com/photo-1587614382447-5f5d123d5cb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwyMDU2NzR8MHwxfGF2YXRhcnx8fHx8fDE2Mjk4NzcyNjQ&ixlib=rb-1.2.1&q=80&w=400",
        rating: 5
      },
      dateCreated: "2024-08-25T12:00:00Z" 
    },
    {
      text: "A fantastic experience working with Jane. Her skills and professionalism are unmatched!",
      author: {
        name: "Satisfied Customer",
        avatar: "https://images.unsplash.com/photo-1601459349556-832bdfc303a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwyMDU2NzR8MHwxfGF2YXRhcnx8fHx8fDE2Mjk4NzcyNjQ&ixlib=rb-1.2.1&q=80&w=400",
        rating: 4
      },
      dateCreated: "2024-08-22T12:00:00Z" 
    },
    {
      text: "Highly recommend Jane for any web development needs. Her work exceeded our expectations.",
      author: {
        name: "Valued Client",
        avatar: "https://images.unsplash.com/photo-1518051197068-dae38e8ff5b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwyMDU2NzR8MHwxfGF2YXRhcnx8fHx8fDE2Mjk4NzcyNjQ&ixlib=rb-1.2.1&q=80&w=400",
        rating: 4.5
      },
      dateCreated: "2024-08-15T12:00:00Z" 
    },
    {
      text: "Jane's attention to detail and dedication to the project were outstanding.",
      author: {
        name: "Long-term Client",
        avatar: "https://images.unsplash.com/photo-1517203370174-0fa0465b8c43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwyMDU2NzR8MHwxfGF2YXRhcnx8fHx8fDE2Mjk4NzcyNjQ&ixlib=rb-1.2.1&q=80&w=400",
        rating: 5
      },
      dateCreated: "2024-08-10T12:00:00Z" 
    }
  ],
  about: [
    "Jane Doe is a seasoned web developer with over 8 years of experience in building dynamic and responsive websites. She specializes in front-end development with a keen eye for design and user experience.",
    "Jane has worked with various clients, ranging from startups to established businesses, helping them create a strong online presence. Her portfolio showcases a diverse range of projects, from e-commerce platforms to corporate websites."
  ]
};

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

const GigDetails = () => {
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
    <div className="md:w-2/3 pr-4 flex flex-col">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-4 text-[var(--primary-color)]">{gigData.title}</h1>

      {/* Avatar and Name */}
      <div className="flex items-center mb-4">
        <img
          src={gigData.avatar.src}
          alt={gigData.avatar.alt}
          className="w-16 h-16 rounded-full mr-4"
        />
        <div>
          <p className="text-xl font-semibold text-primary">{gigData.name}</p>
          <div className="flex items-center">
            {getStarRating(gigData.rating)}
          </div>
        </div>
      </div>

      {/* Slideshow for Pictures */}
      <div className="mb-8 group">
        <Slider {...settings}>
          {gigData.slides.map((src, index) => (
            <div className="relative group" key={index}>
              <img
                src={src}
                alt={`Project Slide ${index + 1}`}
                className="w-full h-48 object-cover rounded-md transition-transform duration-300 ease-in-out group-hover:scale-105"
              />
            </div>
          ))}
        </Slider>
      </div>

      {/* GigReviews Component */}
      <GigReviews reviews={gigData.reviews} />

      {/* About Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2 text-[var(--primary-color)]">About</h2>
        {gigData.about.map((paragraph, index) => (
          <p className="text-gray-700" key={index}>
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
};

export default GigDetails;
