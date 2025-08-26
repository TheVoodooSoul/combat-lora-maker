'use client';

import { useState } from 'react';
import Link from 'next/link';

// Extended product list
const allLoras = [
  // Medieval Combat
  { id: 1, name: "Epic Sword Combat V2", category: "Medieval", price: 14.99, rating: 4.8, downloads: 324, description: "Realistic sword fighting animations and poses" },
  { id: 2, name: "Knight Battle Stances", category: "Medieval", price: 12.99, rating: 4.6, downloads: 215, description: "Authentic medieval knight combat positions" },
  { id: 3, name: "Dual Wielding Master", category: "Medieval", price: 16.99, rating: 4.9, downloads: 402, description: "Complex dual sword techniques and flourishes" },
  
  // Martial Arts
  { id: 4, name: "Martial Arts Master", category: "Martial Arts", price: 19.99, rating: 4.9, downloads: 567, description: "Professional kung-fu and MMA combat poses" },
  { id: 5, name: "Karate Kid Collection", category: "Martial Arts", price: 9.99, rating: 4.5, downloads: 189, description: "Classic karate stances and kata movements" },
  { id: 6, name: "MMA Ground Game", category: "Martial Arts", price: 22.99, rating: 4.7, downloads: 334, description: "Grappling, submissions, and ground combat" },
  
  // Modern Combat
  { id: 7, name: "Gunfight Dynamics", category: "Modern", price: 12.99, rating: 4.7, downloads: 445, description: "Tactical shooting stances and action sequences" },
  { id: 8, name: "Special Forces Pack", category: "Modern", price: 24.99, rating: 5.0, downloads: 678, description: "Elite military combat and breach tactics" },
  { id: 9, name: "Street Fighter Realism", category: "Modern", price: 11.99, rating: 4.4, downloads: 256, description: "Urban combat and street fight scenarios" },
  
  // Fantasy/Sci-Fi
  { id: 10, name: "Superhero Action Pack", category: "Fantasy", price: 24.99, rating: 5.0, downloads: 892, description: "Dynamic flying and power poses" },
  { id: 11, name: "Laser Sword Duels", category: "Sci-Fi", price: 18.99, rating: 4.8, downloads: 523, description: "Futuristic energy weapon combat styles" },
  { id: 12, name: "Magic Combat Spells", category: "Fantasy", price: 21.99, rating: 4.9, downloads: 467, description: "Spell casting and magical combat animations" },
];

const categories = ["All", "Medieval", "Modern", "Sci-Fi", "Fantasy", "Martial Arts"];
const sortOptions = ["Popular", "Price: Low to High", "Price: High to Low", "Newest", "Rating"];

export default function CatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Popular");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter and sort products
  let filteredProducts = allLoras;
  
  if (selectedCategory !== "All") {
    filteredProducts = filteredProducts.filter(p => p.category === selectedCategory);
  }
  
  if (searchTerm) {
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Sort products
  filteredProducts = [...filteredProducts].sort((a, b) => {
    switch(sortBy) {
      case "Price: Low to High": return a.price - b.price;
      case "Price: High to Low": return b.price - a.price;
      case "Rating": return b.rating - a.rating;
      case "Popular": return b.downloads - a.downloads;
      default: return 0;
    }
  });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                CombatLoRA
              </Link>
              <div className="hidden md:flex space-x-6">
                <Link href="/catalog" className="text-orange-400">Catalog</Link>
                <Link href="/categories" className="hover:text-orange-400 transition">Categories</Link>
                <Link href="/about" className="hover:text-orange-400 transition">About</Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 hover:bg-gray-800 rounded-lg transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="absolute -top-1 -right-1 bg-orange-500 text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">LoRA Catalog</h1>
          <p className="text-gray-400">Browse our complete collection of combat and action LoRA models</p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search LoRAs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:border-orange-500 focus:outline-none"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:border-orange-500 focus:outline-none"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:border-orange-500 focus:outline-none"
          >
            {sortOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* Results count */}
        <div className="mb-4 text-gray-400">
          Showing {filteredProducts.length} results
        </div>

        {/* Product Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((lora) => (
            <div key={lora.id} className="bg-gray-900 rounded-xl overflow-hidden hover:transform hover:scale-105 transition duration-300">
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-700 relative">
                <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-xs">
                  {lora.category}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{lora.name}</h3>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{lora.description}</p>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm">{lora.rating}</span>
                    <span className="text-gray-500 text-sm">({lora.downloads})</span>
                  </div>
                  <span className="text-xl font-bold text-orange-400">${lora.price}</span>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg hover:from-red-600 hover:to-orange-600 transition">
                    Add to Cart
                  </button>
                  <Link href={`/product/${lora.id}`} className="py-2 px-3 border border-gray-700 rounded-lg hover:bg-gray-800 transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
