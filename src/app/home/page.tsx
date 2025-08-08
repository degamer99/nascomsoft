'use client'
import Image from "next/image"
import React, { useState, useEffect } from 'react';
import { User, ShoppingCart} from 'lucide-react';
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {useCartStore, Product as ProductType} from "@/store/cartStore"
import { Button } from "@/components/ui/button"
import SearchProducts from "@/components/searchProducts"

/// Mock data for the products to display
const mockProducts = [
  { id: 1, name: 'Arduino Uno R3', price: 'NGN 11,000', imageUrl: 'https://placehold.co/150x100/E0E0E0/white?text=Arduino' },
  { id: 2, name: 'C02 - Cable', price: 'NGN 25', imageUrl: 'https://placehold.co/150x100/E0E0E0/white?text=Cable' },
  { id: 3, name: 'Raspberry Pi 4', price: 'NGN 35,000', imageUrl: 'https://placehold.co/150x100/E0E0E0/white?text=Raspberry' },
  { id: 4, name: 'ESP32 Dev Board', price: 'NGN 8,500', imageUrl: 'https://placehold.co/150x100/E0E0E0/white?text=ESP32' },
];

// 1. Define props interface:
interface ProductTypeProps {
  product: ProductType;
}

// ProductCard component to display a single product
const ProductCard:  React.FC<ProductTypeProps> = ({ product }) => {
  const { addToCart, updateQuantity, items, removeFromCart } = useCartStore();
  const cartItem = items.find(item => item.id === product.id);

  const handleAdd = () => {
    addToCart(product);
  };

  const handleRemove = () => {
    if (cartItem && cartItem.quantity > 1) {
      updateQuantity(product.id, cartItem.quantity - 1);
    } else {
      removeFromCart(product.id);
    }
  };

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-xl cursor-pointer">
      {/* Product Image */}
      <div className="p-4 bg-gray-100 flex items-center justify-center">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-40 object-contain"
        />
      </div>
      
      {/* Product Details */}
      <div className="flex-grow p-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-lg font-bold text-teal-600">
          {product.price}
        </p>
        <p className="text-sm text-gray-500 mt-1">Available: {product.quantity}</p>
      </div>

      {/* Cart Actions */}
      <div className="p-4 pt-0 flex justify-between items-center">
        {cartItem && cartItem.quantity > 0 ? (
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleRemove}>-</Button>
            <span className="text-lg font-semibold">{cartItem.quantity}</span>
            <Button onClick={handleAdd}>+</Button>
          </div>
        ) : (
          <Button className="w-full" onClick={handleAdd}>Add to cart</Button>
        )}
      </div>
    </div>
  );
};


// Mock data for the products to display
const mockProducts_Later = [
  { name: "Accessories",
    items: [ 
      {id: 1,name: "20w hot glue stick",reviews: "(0)",price: "₦270.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 2,name: "Male-male jumper wire (single)",reviews: "(0)",price: "₦100.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 3,name: "Male-female jumper wire (single)",reviews: "(0)",price: "₦100.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 4,name: "Male-female jumper wire (set)",reviews: "(0)",price: "₦1,500.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 5,name: "Hot glue sticks-60w",reviews: "(0)",price: "₦400.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 6,name: "Neodymium super magnet 8x5mm",reviews: "(0)",price: "₦350.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 7,name: "Female-female jumper wire (single)",reviews: "(0)",price: "₦100.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 8,name: "Female-female jumper wire (set)",reviews: "(0)",price: "₦1,400.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 9,name: "Tact switch 12*12*6",reviews: "(0)",price: "₦100.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9}
    ]
  },
  { name: "Modules",
    items: [ 
      {id: 2,name: "HC-SR04 UltraSonic Sensor",reviews: "(0)",price: "₦2,500.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 4,name: "Blue LCD 1602",reviews: "(0)",price: "₦3,000.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 6,name: "PIR motion sensor",reviews: "(0)",price: "₦2,000.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 8,name: "Relay module 1 channel",reviews: "(0)",price: "₦1,400.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 10,name: "LM2596 Buck DC-DC power module",reviews: "(0)",price: "₦2,000.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 12,name: "sim800L GSM module",reviews: "(0)",price: "₦8,800.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 14,name: "DHT11 Temperature and humidity sensor",reviews: "(0)",price: "₦1,700.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 16,name: "L298N Dual H Bridge DC Stepper Motor Driver",reviews: "(0)",price: "₦5,500.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 18,name: "HC-05 bluetooth Module",reviews: "(0)",price: "₦6,000.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
    ]
  },
  { name: "Board",
    items: [ 
      {id: 11,name: "Breadboard MB102",reviews: "(0)",price: "₦2,000.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 13,name: "Arduino uno r3 with cable",reviews: "(0)",price: "₦14,000.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 15,name: "Hub360 Arduino starter kit with SMD UNO",reviews: "Rated 4.00 out of 5",price: "(1)",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 17,name: "TP4056 18650 1A lipo Battery Charger with Protection module",reviews: "(0)",price: "₦500.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 19,name: "vero board small size stripped",reviews: "(0)",price: "₦500.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 21,name: "400 hole mini breadboard",reviews: "(0)",price: "₦1,200.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 23,name: "vero board big size stripped",reviews: "(0)",price: "₦1,000.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 25,name: "vero board big size dotted",reviews: "(0)",price: "₦900.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 27,name: "Arduino UNO R3 SMD with cable",reviews: "(0)",price: "₦8,000.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
    ]
  },
  { name: "Resistors",
    items: [ 
      {id: 20,name: "10KΩ 1/4W resistor",reviews: "(0)",price: "₦20.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 22,name: "1KΩ 1/4W resistor",reviews: "(0)",price: "₦15.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 24,name: "220Ω 1/4W resistor",reviews: "(0)",price: "₦15.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 26,name: "100Ω 1/4W resistors",reviews: "(0)",price: "₦10.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 28,name: "330Ω 1/4W resistor",reviews: "(0)",price: "₦10.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 30,name: "4.7KΩ 1/4W resistor",reviews: "(0)",price: "₦10.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 32,name: "100KΩ 1/4W resistor",reviews: "(0)",price: "₦10.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 34,name: "Photoresistor LDR",reviews: "(0)",price: "₦100.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 36,name: "470Ω 1/4W resistor",reviews: "(0)",price: "₦10.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
    ]
  },
  { name: "IC’s",
    items: [ 
      {id: 29,name: "L7805CV",reviews: "(0)",price: "₦300.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 31,name: "IC socket 28 pins",reviews: "(0)",price: "₦100.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 33,name: "NE555 Timer",reviews: "(0)",price: "₦150.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 35,name: "Hub360 Arduino starter kit with SMD UNO",reviews: "Rated 4.00 out of 5",price: "(1)",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 37,name: "L293 Motor driver IC",reviews: "(0)",price: "₦550.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 39,name: "ic socket 16 pin",reviews: "(0)",price: "₦90.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 41,name: "74HC595 Shift Register",reviews: "(0)",price: "₦250.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 43,name: "Atmega 328P-PU with bootloader",reviews: "(0)",price: "₦6,500.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 45,name: "Atmega 328P-PU",reviews: "(0)",price: "₦6,200.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
    ]
  },
  { name: "Sensors",
    items: [ 
      {id: 38,name: "RC522 13.56MHz RFID card",reviews: "(0)",price: "₦300.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 40,name: "Photoresistor LDR",reviews: "(0)",price: "₦100.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 42,name: "HC-SR04 UltraSonic Sensor",reviews: "(0)",price: "₦2,500.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 44,name: "IR proximity sensor",reviews: "(0)",price: "₦850.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 46,name: "125KHZ RFID Card",reviews: "(0)",price: "₦300.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 48,name: "Hub360 Arduino starter kit with SMD UNO",reviews: "Rated 4.00 out of 5",price: "(1)",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 50,name: "PIR motion sensor",reviews: "(0)",price: "₦2,000.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 52,name: "Piezoelectric Transducer 27mm",reviews: "(0)",price: "₦200.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 54,name: "IR LED transmitter",reviews: "(0)",price: "₦70.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
    ]
  },
  { name: "Others",
    items: [ 
      {id: 48,name: "PIR motion sensor",reviews: "(0)",price: "₦2,000.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 50,name: "Big LDR",reviews: "(0)",price: "₦800.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 52,name: "NTC-MF52AT 10k Thermistor",reviews: "(0)",price: "₦100.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 54,name: "Soil moisture sensor",reviews: "(0)",price: "₦1,800.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 56,name: "NRF24L01 RF Transceiver",reviews: "(0)",price: "₦1,700.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 58,name: "NTC 10D-9 thermistor",reviews: "(0)",price: "₦100.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 60,name: "HX711 Weighing sensor",reviews: "(0)",price: "₦1,500.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 62,name: "50kg load cell",reviews: "(0)",price: "₦1,300.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 64,name: "HYSRF05 5pin Ultrasonic sensor",reviews: "(0)",price: "₦4,300.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
    ],
  },
];

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
// Find the "Accessories" category and get its items
  const accessoriesCategory = mockProducts_Later.find(category => category.name === "Accessories");
  const accessoriesItems = accessoriesCategory ? accessoriesCategory.items : [];

const ModulesItems = mockProducts_Later.find(c => c.name === "Modules")?.items ?? [];
const BoardItems = mockProducts_Later.find(c => c.name === "Board")?.items ?? [];
const ResistorsItems = mockProducts_Later.find(c => c.name === "Resistors")?.items ?? [];
const OthersItems = mockProducts_Later.find(c => c.name === "Others")?.items ?? [];
  
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
        <div className=" flex flex-row gap-4">
          {/* Shopping Cart Icon */}
          <Link href="/cart">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 grid place-items-center">
              {isLoading ? (
                <div className="w-full h-full bg-gray-200 animate-pulse"></div>
              ) : (
                <ShoppingCart />
              )}
            </div>
          </Link>


          {/* User Profile Image */}
          <Link href="/profile">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 grid place-items-center">
              {isLoading ? (
                <div className="w-full h-full bg-gray-200 animate-pulse"></div>
              ) : (
                <User />
              )}
            </div>
          </Link>
        </div>

        </div>

        {/* User Greeting and Search Section */}
        <div className="mb-6">
          <p className="text-gray-500 font-medium mb-1">Hi, </p>
          <h1 className="text-3xl font-bold text-gray-800">What are you looking for today?</h1>
        </div>

        {/* Search Bar */}
     <SearchProducts />  

        {/* Hero Product Card */}
        <div className="relative bg-white rounded-2xl shadow-md p-4 mb-6 flex items-center justify-between overflow-hidden">
          <div className="flex flex-col gap-4 z-10">
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
<Tabs defaultValue="Accessories" className="">
  <TabsList className="">
    <TabsTrigger value="Accessories">Accessories</TabsTrigger>
    <TabsTrigger value="Modules">Modules</TabsTrigger>
    {/* <TabsTrigger value="Board">Board</TabsTrigger> */}
    <TabsTrigger value="Resistors">Resistors</TabsTrigger>
    <TabsTrigger value="Others">Others</TabsTrigger>
  </TabsList>
  <TabsContent value="Accessories">
  {/* The responsive product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {accessoriesItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
</TabsContent>
  <TabsContent value="Modules">
  {/* The responsive product grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {ModulesItems.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  </TabsContent>
  <TabsContent value="Board">
  {/* The responsive product grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {BoardItems.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  </TabsContent>
  <TabsContent value="Resistors">
  {/* The responsive product grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {ResistorsItems.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  </TabsContent>
  <TabsContent value="Others">
  {/* The responsive product grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {OthersItems.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  </TabsContent>
</Tabs>

        {/* <div className="flex items-center justify-between mb-4"> */}
        {/*   <h2 className="text-lg font-bold text-gray-800">Featured Products</h2> */}
        {/*   <button className="text-teal-500 font-medium text-sm">See All</button> */}
        {/* </div> */}

        {/* Product Grid - horizontal scroll */}
        {/* <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4"> */}
        {/*   {isLoading ? ( */}
        {/*     // Skeleton UI for loading state */}
        {/*     Array.from({ length: 4 }).map((_, index) => ( */}
        {/*       <div key={index} className="flex-shrink-0 w-40 bg-gray-100 rounded-lg shadow-sm overflow-hidden animate-pulse"> */}
        {/*         <div className="h-28 bg-gray-200"></div> */}
        {/*         <div className="p-3"> */}
        {/*           <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div> */}
        {/*           <div className="h-4 w-1/2 bg-gray-200 rounded"></div> */}
        {/*         </div> */}
        {/*       </div> */}
        {/*     )) */}
        {/*   ) : ( */}
        {/*     // Actual products after loading */}
        {/*     mockProducts.map((product) => ( */}
        {/*       <div key={product.id} className="flex-shrink-0 w-40 bg-gray-100 rounded-lg shadow-sm overflow-hidden"> */}
        {/*         <div className="h-28 flex items-center justify-center p-2"> */}
        {/*           <Image src={product.imageUrl} alt={product.name} className="max-w-full max-h-full object-contain" width={200} height={200} /> */}
        {/*         </div> */}
        {/*         <div className="p-3"> */}
        {/*           <p className="text-sm font-medium text-gray-700">{product.name}</p> */}
        {/*           <p className="text-base font-bold text-gray-900 mt-1">{product.price}</p> */}
        {/*         </div> */}
        {/*       </div> */}
        {/*     )) */}
        {/*   )} */}
        {/* </div> */}
      </div>
  );
};

export default Home;

