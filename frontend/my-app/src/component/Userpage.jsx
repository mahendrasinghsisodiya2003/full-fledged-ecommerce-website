import React from 'react';
import image from '../assets/herofirstimg.jpg';
import { Link } from 'react-router-dom';

const Userpage = ({ user }) => {
  return (
    <div className='flex w-full min-h-screen bg-gradient-to-r from-purple-50 to-pink-50'>
      {/* Left Section */}
      <div className="flex flex-1 flex-col justify-center pl-4 md:pl-12 lg:pl-20">
        {/* Responsive Heading */}
        <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-gray-900 mb-6 lg:mb-8'>
          Welcome, {user?.username}!
        </h1>
        <div className='flex flex-col space-y-4 lg:space-y-6'>
          {/* Responsive Subheading */}
          <h2 className='text-2xl sm:text-3xl lg:text-4xl font-thin text-gray-700'>
            Discover the Latest Trends
          </h2>
          {/* Waving Hand Image */}
          <img
            className='w-32 h-32 sm:w-40 sm:h-40 mx-4'
            src="https://em-content.zobj.net/source/noto-emoji-animations/344/waving-hand_1f44b.gif"
            alt='waving-hand'
          />
        </div>
        {/* Start Shopping Button */}
        <Link to="/all">
          <button className="mt-8 sm:mt-10 lg:mt-12 h-14 sm:h-16 w-48 sm:w-56 bg-blue-600 hover:bg-blue-700 text-white text-lg sm:text-xl font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center">
            Start shopping
            <i className="fa-solid fa-arrow-right ml-3"></i>
          </button>
        </Link>
      </div>

      {/* Right Section */}
      <div className="flex flex-1 items-center justify-center pr-4 md:pr-12 lg:pr-20">
        <img
          className='w-full max-w-xs sm:max-w-md lg:max-w-2xl rounded-3xl shadow-2xl'
          src={image}
          alt='hero_img'
        />
      </div>
    </div>
  );
};

export default Userpage;