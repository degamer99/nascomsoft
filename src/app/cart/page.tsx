'use client'
import Image from "next/image"
import React, { useState, useEffect } from 'react';

// 1) Define a CartItem interface
interface CartItem {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

// 2) Strongly-typed mock data
const mockCartItems: CartItem[] = [
  {
    id: 1,
    name: "ESP 82",
    price: 8650,
    imageUrl: "https://placehold.co/80x80/E0E0E0/white?text=ESP82",
    quantity: 1,
  },
  {
    id: 2,
    name: "CO2 - Cable",
    price: 7800,
    imageUrl: "https://placehold.co/80x80/E0E0E0/white?text=Cable",
    quantity: 1,
  },
];



const App = () => {
 // 3) useState with explicit generics and initial state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Simulate a network request with a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setCartItems(mockCartItems);
      setIsLoading(false);
    }, 2000); // 2-second delay to show the skeleton UI
    return () => clearTimeout(timer);
  }, []);

  // Calculate total items and total price
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Function to format the price in NGN
  const formatPrice = (price: number) => `NGN ${price.toLocaleString()}`;

  // Handle quantity change (placeholder logic)
  const handleQuantityChange = (itemId: number, change: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  // Handle item removal (placeholder logic)
  const handleRemoveItem = (itemId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans flex flex-col items-center">
      <div className="w-full max-w-sm bg-white shadow-xl p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          {/* Back Button */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-800"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>

          <h1 className="text-xl font-bold text-gray-800">Shopping Cart</h1>

          {/* Delete All Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-800"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>

        {/* Cart Items List */}
        <div className="mb-6">
          {isLoading ? (
            // Skeleton UI for loading state
            Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="flex items-center bg-gray-100 rounded-xl shadow-sm p-3 mb-4 animate-pulse">
                <div className="w-20 h-20 bg-gray-200 rounded-lg mr-4"></div>
                <div className="flex-1">
                  <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                  <div className="flex items-center mt-4">
                    <div className="h-8 w-8 bg-gray-200 rounded-full mr-2"></div>
                    <div className="h-6 w-6 bg-gray-200 rounded-md"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded-full ml-2"></div>
                  </div>
                </div>
                <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
              </div>
            ))
          ) : (
            // Actual cart items after loading
            cartItems.map((item) => (
              <div key={item.id} className="flex items-center bg-white rounded-xl shadow-md p-3 mb-4">
                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center p-2 mr-4">
                  <Image src={item.imageUrl} alt={item.name} className="max-w-full max-h-full object-contain" width={200} height={200} />
                </div>
                <div className="flex-1">
                  <p className="text-base font-medium text-gray-700">{item.name}</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">{formatPrice(item.price)}</p>
                  <div className="flex items-center mt-2">
                    <button
                      onClick={() => handleQuantityChange(item.id, -1)}
                      className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                    </button>
                    <span className="mx-3 text-lg font-medium text-gray-800">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, 1)}
                      className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    </button>
                  </div>
                </div>
                {/* Delete Item Icon */}
                <button onClick={() => handleRemoveItem(item.id)} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary and Checkout Button */}
        <div className="bg-white p-4">
          <div className="flex justify-between items-center text-lg font-medium mb-4">
            <span className="text-gray-500">Total {totalItems} Items</span>
            <span className="text-gray-900">{formatPrice(totalPrice)}</span>
          </div>
          <button className="w-full bg-teal-500 text-white py-3 rounded-full flex items-center justify-center font-bold text-lg shadow-lg hover:bg-teal-600 transition-colors">
            Proceed to Checkout
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
