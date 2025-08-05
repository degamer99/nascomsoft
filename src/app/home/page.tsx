'use client'
import Image from "next/image"
import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';

// Mock data for the products to display
const mockProducts = [
  { id: 1, name: 'Arduino Uno R3', price: 'NGN 11,000', imageUrl: 'https://placehold.co/150x100/E0E0E0/white?text=Arduino' },
  { id: 2, name: 'C02 - Cable', price: 'NGN 25', imageUrl: 'https://placehold.co/150x100/E0E0E0/white?text=Cable' },
  { id: 3, name: 'Raspberry Pi 4', price: 'NGN 35,000', imageUrl: 'https://placehold.co/150x100/E0E0E0/white?text=Raspberry' },
  { id: 4, name: 'ESP32 Dev Board', price: 'NGN 8,500', imageUrl: 'https://placehold.co/150x100/E0E0E0/white?text=ESP32' },
];

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate a network request with a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2-second delay to show the skeleton UI
    return () => clearTimeout(timer);
  }, []);

  return (
      <div className="w-full bg-white p-4">
      {/* <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-4"> */}
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          {/* Hamburger Icon */}
          {/* <svg */}
          {/*   xmlns="http://www.w3.org/2000/svg" */}
          {/*   className="h-6 w-6 text-gray-800" */}
          {/*   fill="none" */}
          {/*   viewBox="0 0 24 24" */}
          {/*   stroke="currentColor" */}
          {/* > */}
          {/*   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /> */}
          {/* </svg> */}

          {/* Logo */}
          <div className="flex items-center gap-1">
            {/* Logo SVG - a simple diamond shape */}

            <Image
              src="/nascomsoft_logo.jpeg"
              alt="NascomSoft Logo"
              width={50}
              height={50}
            />
            {/* <svg */}
            {/*   xmlns="http://www.w3.org/2000/svg" */}
            {/*   className="h-6 w-6 text-teal-500 mr-2" */}
            {/*   fill="none" */}
            {/*   viewBox="0 0 24 24" */}
            {/*   stroke="currentColor" */}
            {/* > */}
            {/*   <path d="M12 2L2 12l10 10 10-10L12 2z" /> */}
            {/* </svg> */}
            <span className="font-bold text-lg text-gray-800">NascomSoft Embedded</span>
          </div>

          {/* User Profile Image */}
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 grid place-items-center">
            {isLoading ? (
              <div className="w-full h-full bg-gray-200 animate-pulse"></div>
            ) : (
              <User />
            )}
          </div>
        </div>

        {/* User Greeting and Search Section */}
        <div className="mb-6">
          <p className="text-gray-500 font-medium mb-1">Hi, </p>
          <h1 className="text-3xl font-bold text-gray-800">What are you looking for today?</h1>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search component"
            className="w-full pl-10 pr-4 py-4 bg-gray-100 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          {/* Search Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-2 mt-4 mb-6">
          {['Component', 'Kits', 'Dev Boards', 'Connectors'].map((tab, index) => (
            <button
              key={index}
              className={`flex-shrink-0 px-4 py-2 rounded-full font-medium transition-colors ${
                index === 0
                  ? 'bg-teal-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Hero Product Card */}
        <div className="relative bg-white rounded-2xl shadow-md p-4 mb-6 flex items-center justify-between overflow-hidden">
          <div className="flex flex-col z-10">
            <h2 className="text-4xl font-bold text-gray-800">Arduino Uno R3</h2>
            <button className="text-teal-500 flex items-center mt-2 font-medium">
              Shop now
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="">
            {isLoading ? (
              <div className="w-full h-full bg-gray-200 animate-pulse rounded-full"></div>
            ) : (
              <Image src={"/arduino_uno.png"} alt={"Arduino Uno R3"} height={200} width={200} className="w-full h-full object-contain" />
            )}
          </div>
        </div>

        {/* Featured Products Section */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">Featured Products</h2>
          <button className="text-teal-500 font-medium text-sm">See All</button>
        </div>

        {/* Product Grid - horizontal scroll */}
        <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4">
          {isLoading ? (
            // Skeleton UI for loading state
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex-shrink-0 w-40 bg-gray-100 rounded-lg shadow-sm overflow-hidden animate-pulse">
                <div className="h-28 bg-gray-200"></div>
                <div className="p-3">
                  <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))
          ) : (
            // Actual products after loading
            mockProducts.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-40 bg-gray-100 rounded-lg shadow-sm overflow-hidden">
                <div className="h-28 flex items-center justify-center p-2">
                  <Image src={product.imageUrl} alt={product.name} className="max-w-full max-h-full object-contain" width={200} height={200} />
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-gray-700">{product.name}</p>
                  <p className="text-base font-bold text-gray-900 mt-1">{product.price}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
  );
};

export default Home;

