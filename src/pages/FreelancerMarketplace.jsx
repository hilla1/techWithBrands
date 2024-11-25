import HomeLayout from '../components/HomePage/HomeLayout';
import React, { useState } from 'react';
import GigCard from '../../src/components/HomePage/Gigs/GigCard'; 
import { gigsData } from '../../src/assets/data/gigs'; 

const FreelancerMarketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOption, setSortOption] = useState('Price: Low to High');

  // Filter and sort gigs based on user input
  const filteredGigs = gigsData
    .filter(gig =>
      gig.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gig.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(gig => selectedCategory === 'All' || gig.category === selectedCategory)
    .sort((a, b) => {
      if (sortOption === 'Price: Low to High') {
        return a.price - b.price;
      } else if (sortOption === 'Price: High to Low') {
        return b.price - a.price;
      } else if (sortOption === 'Rating: High to Low') {
        return b.rating - a.rating;
      } else {
        return a.rating - b.rating;
      }
    });

  return (
    <HomeLayout roles={['admin']}>
    {/* Pass UserProfile as a child to RightSection */}
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6 text-[var(--primary-color)]">Freelancer Marketplace</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search gigs..."
          className="border p-2 w-full rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <select
          className="border p-2 rounded-lg"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          <option value="Design">Design</option>
          <option value="SEO">SEO</option>
          <option value="Photography">Photography</option>
          <option value="Video">Video</option>
          <option value="Development">Development</option>
          {/* Add more categories as needed */}
        </select>

        <select
          className="border p-2 rounded-lg"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="Price: Low to High">Price: Low to High</option>
          <option value="Price: High to Low">Price: High to Low</option>
          <option value="Rating: High to Low">Rating: High to Low</option>
          <option value="Rating: Low to High">Rating: Low to High</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredGigs.map((gig, index) => (
          <GigCard
            key={index}
            images={gig.images}
            avatar={gig.avatar}
            name={gig.name}
            rating={gig.rating}
            description={gig.description}
            price={gig.price}
          />
        ))}
      </div>
    </div>
    
 </HomeLayout>
  );
};

export default FreelancerMarketplace;
